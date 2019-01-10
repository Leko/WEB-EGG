const { promisify } = require(`util`)
const { parseString } = require(`xml2js`)
const fetch = require(`isomorphic-fetch`)
const micromatch = require(`micromatch`)
const cheerio = require(`cheerio`)
const visit = require(`unist-util-visit-parents`)
const Bottleneck = require(`bottleneck`)

const defaultOptions = {
  whitelist: [],
  notIn: [`blockquote`],
}

const parseXML = promisify(parseString)
const cache = new Map()
const limiter = new Bottleneck({
  // Allow 5000 requests per hour
  // https://developer.github.com/v3/rate_limit/
  reservoir: 5000,
  reservoirRefreshAmount: 5000,
  reservoirRefreshInterval: 1000 * 60 * 60,
})

function normalize(url) {
  return url
}

function setScale(urlStr, { maxWidth, maxHeight }) {
  const url = new URL(urlStr)
  if (typeof maxWidth !== `undefined`) {
    url.searchParams.set(`maxwidth`, maxWidth)
  }
  if (typeof maxHeight !== `undefined`) {
    url.searchParams.set(`maxheight`, maxHeight)
  }

  return url.toString()
}

function discoverOEmbed(html, { maxWidth, maxHeight }) {
  const $ = cheerio.load(html)
  const alternateXMLUrl = $(`link[type="text/xml+oembed"]`).attr(`href`)
  const alternateJsonUrl = $(`link[type="application/json+oembed"]`).attr(
    `href`
  )

  if (alternateJsonUrl) {
    return fetch(setScale(alternateJsonUrl, { maxWidth, maxHeight })).then(
      res => res.json()
    )
  } else if (alternateXMLUrl) {
    return fetch(setScale(alternateXMLUrl, { maxWidth, maxHeight }))
      .then(res => res.text())
      .then(xml => parseXML(xml, { trim: true, explicitArray: false }))
  } else {
    return null
  }
}

function fetchOEmbed(urlStr, { maxWidth, maxHeight }) {
  const cacheKey = normalize(urlStr)
  if (cache.has(cacheKey)) {
    return Promise.resolve(cache.get(cacheKey))
  }

  return limiter.wrap(() =>
    fetch(urlStr)
      .then(res => res.text())
      .then(html => discoverOEmbed(html, { maxWidth, maxHeight }))
  )()
}

const replacer = ({ maxWidth, maxHeight }) => async ({ url, node }) => {
  const oEmbed = await fetchOEmbed(url, { maxWidth, maxHeight })
  if (!oEmbed) {
    return
  }

  const {
    title,
    author_name,
    author_url,
    // provider_name,
    // provider_url,
    // cache_age,
    thumbnail_url,
    thumbnail_width,
    thumbnail_height,
  } = oEmbed

  switch (oEmbed.type) {
    case `link`: {
      node.type = `html`
      node.value = `<a href="${url}">
        <figure>
          <img src="${thumbnail_url}" width="${thumbnail_width}" height="${thumbnail_height}" title="${title}" />
          <figcaption>${title}</figcaption>
        </figure>
      </a>`
      break
    }
    case `photo`: {
      const { width, height } = oEmbed
      node.type = `html`
      node.value = `<a href="${url}">
        <figure>
          <img src="${
            oEmbed.url
          }" width="${width}" height="${height}" title="${title}" />
          <figcaption>${title}</figcaption>
        </figure>
      </a>`
      break
    }
    case `video`: {
      const { html } = oEmbed
      node.type = `html`
      node.value = html
      break
    }
    case `rich`: {
      const { html } = oEmbed
      node.type = `html`
      node.value = html
      break
    }
    default:
      throw new Error(`Unknown type: ${oEmbed.type}`)
  }
}

const attacher = ({ markdownAST }, pluginOptions = {}) => {
  const { notIn, whitelist, maxWidth, maxHeight } = {
    ...defaultOptions,
    ...pluginOptions,
  }
  const textLinks = []

  visit(markdownAST, `link`, (node, ancestors) => {
    if (node.url !== node.children[0].value) {
      // Not a text link
      return
    }
    if (ancestors.some(ancestor => notIn.includes(ancestor.type))) {
      // Matches filtered not types
      return
    }
    textLinks.push({ url: node.url, node })
  })

  const nodesToFetch = textLinks.filter(({ url }) =>
    micromatch.some(url, whitelist)
  )

  return Promise.all(
    Array.from(nodesToFetch, replacer({ maxWidth, maxHeight }))
  )
}

attacher.setScale = setScale
attacher.discoverOEmbed = discoverOEmbed
attacher.fetchOEmbed = fetchOEmbed
attacher.replacer = replacer

module.exports = attacher
