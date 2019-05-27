/* eslint-env node */
const { promisify } = require(`util`)
const { parseString } = require(`xml2js`)
const fetch = require(`isomorphic-fetch`)
const micromatch = require(`micromatch`)
const cheerio = require(`cheerio`)
const visit = require(`unist-util-visit-parents`)
const Bottleneck = require(`bottleneck`)

const defaultOptions = {
  experimental_lazyload: false,
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

const replacer = ({ maxWidth, maxHeight, lazyload }) => async ({
  url,
  node,
}) => {
  const oEmbed = await fetchOEmbed(url, { maxWidth, maxHeight })
  if (!oEmbed) {
    return
  }

  switch (oEmbed.type) {
    case `link`: {
      console.error(`link type is not supported yet: ${url}`)
      break
    }
    case `photo`: {
      console.error(`photo type is not supported yet: ${url}`)
      break
    }
    case `video`: {
      console.error(`video type is not supported yet: ${url}`)
      break
    }
    case `rich`: {
      const { html } = oEmbed
      const $ = cheerio.load(html)
      if (lazyload) {
        $('iframe').attr('lazyload', 'on')
      }
      node.type = `html`
      node.value = $.html()
      break
    }
    default:
      console.warn(`Unknown type: ${oEmbed.type}(${url})\n${JSON.stringify(oEmbed, null, 2)}`)
  }
}

const attacher = ({ markdownAST }, pluginOptions = {}) => {
  const { experimental_lazyload, notIn, whitelist, maxWidth, maxHeight } = {
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
    Array.from(
      nodesToFetch,
      replacer({ maxWidth, maxHeight, lazyload: experimental_lazyload })
    )
  ).catch(e => {
    console.warn(e.stack)
    throw e
  })
}

attacher.setScale = setScale
attacher.discoverOEmbed = discoverOEmbed
attacher.fetchOEmbed = fetchOEmbed
attacher.replacer = replacer

module.exports = attacher
