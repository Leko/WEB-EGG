/* eslint-env node */
const path = require('path')
const fetch = require(`isomorphic-fetch`)
const micromatch = require(`micromatch`)
const visit = require(`unist-util-visit-parents`)
const Bottleneck = require(`bottleneck`)
const parseGitHubUrl = require('git-url-parse')

const defaultOptions = {
  whitelist: [],
  // http://prismjs.com
  extMap: {
    // https://github.com/github/linguist/blob/master/lib/linguist/languages.yml#L1522
    '.gn': 'python',
    '.gni': 'python',

    '.rs': 'rust',
    '.yml': 'yaml',
    '.jsx': 'js',
    '.tsx': 'ts',
  },
}

const cache = new Map()
const limiter = new Bottleneck({
  // Allow 5000 requests per hour
  // https://developer.github.com/v3/rate_limit/
  reservoir: 5000,
  reservoirRefreshAmount: 5000,
  reservoirRefreshInterval: 1000 * 60 * 60,
})

function fetchCode(githubUrl, token) {
  const cacheKey = githubUrl.toString()
  if (cache.has(cacheKey)) {
    return Promise.resolve(cache.get(cacheKey))
  }

  const { owner, name, filepath } = githubUrl
  return limiter.wrap(() =>
    fetch(
      `https://api.github.com/repos/${owner}/${name}/contents/${filepath}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/json',
        },
      }
    )
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          throw new Error(data.message)
        }
        if (data.sha !== githubUrl.commit) {
          console.warn(
            `sha mismatch detected: ${githubUrl.toString()}\nWe highly recommended to specify static sha, not a dynamic refenrence(branch or tag)`
          )
        }

        const code =
          data.encoding === 'base64'
            ? Buffer.from(data.content, 'base64').toString('utf8')
            : data.content
        cache.set(cacheKey, code)
        return code
      })
  )()
}

function trimCodeByRange(code, range) {
  return (
    code
      .split('\n')
      .slice(range.from - 1, range.to)
      .join('\n') + '\n'
  )
}

function parseLineRange(githubUrl) {
  const rangeRegExp = /^L(\d+)\-L(\d+)$/
  const lineRegExp = /^L(\d+)$/
  if (rangeRegExp.test(githubUrl.hash)) {
    const [, lineFrom, lineTo] = githubUrl.hash.match(rangeRegExp)
    return {
      from: parseInt(lineFrom, 10),
      to: parseInt(lineTo, 10),
    }
  } else if (lineRegExp.test(githubUrl.hash)) {
    const [, lineFrom] = githubUrl.hash.match(lineRegExp)
    return {
      from: parseInt(lineFrom, 10),
      to: parseInt(lineFrom, 10),
    }
  } else {
    return null
  }
}

const replacer = ({ extMap, token, codeFetcher }) => async ({
  url,
  githubUrl,
  node,
  ancestors,
}) => {
  const ext = path.extname(githubUrl.filepath)
  const range = parseLineRange(githubUrl)
  if (!range) {
    return
  }

  const code = await codeFetcher(githubUrl, token)
  if (!code) {
    return
  }

  const snippet = trimCodeByRange(code, range)
  const parent = ancestors[ancestors.length - 1]
  const insertIndex = parent.children.indexOf(node)

  node.type = 'code'
  node.lang = `${extMap[ext] || ext.slice(1)}{numberLines:${range.from}}`
  node.meta = null
  node.value = snippet

  const { owner, name, filepath, commit } = githubUrl
  const html = `
<div class="gprgh-container">
  <div class="gprgh-filename-container">
    <a class="gprgh-filename" href="${url}">${name}/${filepath}</a>
  </div>
  <span class="gprgh-meta">
    Lines ${range.from}${
    range.from !== range.to ? ` to ${range.to}` : ''
  } in <a class="gprgh-meta-sha" href="https://github.com/${owner}/${name}/commit/${commit}">${commit.slice(
    0,
    7
  )}</a>
  </span>
</div>

`
  parent.children.splice(insertIndex, 0, {
    type: 'html',
    value: html,
  })
}

const attacher = ({ markdownAST }, pluginOptions = {}) => {
  const { extMap, whitelist, token } = {
    ...defaultOptions,
    ...pluginOptions,
  }
  const textLinks = []

  visit(markdownAST, `link`, (node, ancestors) => {
    if (node.url !== node.children[0].value) {
      // Not a text link
      return
    }
    textLinks.push({ url: node.url, node, ancestors })
  })

  const nodesToFetch = textLinks
    .map(({ url, ...other }) => ({
      ...other,
      url,
      githubUrl: parseGitHubUrl(url),
    }))
    .filter(({ githubUrl }) => {
      if (
        githubUrl.filepathtype !== 'blob' ||
        !githubUrl.filepath ||
        !githubUrl.hash ||
        !githubUrl.commit ||
        !githubUrl.name ||
        !githubUrl.owner
      ) {
        return false
      }

      return micromatch.some(`${githubUrl.owner}/${githubUrl.name}`, whitelist)
    })

  return Promise.all(
    Array.from(
      nodesToFetch,
      replacer({ extMap, token, codeFetcher: fetchCode })
    )
  )
}

attacher.replacer = replacer
attacher.fetchCode = fetchCode
attacher.trimCodeByRange = trimCodeByRange
attacher.parseLineRange = parseLineRange

module.exports = attacher
