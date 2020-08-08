/* eslint-env node */
const fs = require('fs')
const path = require('path')
const fetch = require(`isomorphic-fetch`)
const micromatch = require(`micromatch`)
const visit = require(`unist-util-visit-parents`)
const Bottleneck = require(`bottleneck`)
const parseGitHubUrl = require('git-url-parse')

const defaultOptions = {
  whitelist: [],
  cachePath: path.join(
    process.cwd(),
    '.cache',
    'gatsby-remark-expand-github-embedded-code-snippet.json'
  ),
  // http://prismjs.com
  extMap: {
    // https://github.com/github/linguist/blob/master/lib/linguist/languages.yml#L1522
    '.gn': 'python',
    '.gni': 'python',

    '.cc': 'cpp',
    '.rs': 'rust',
    '.yml': 'yaml',
    '.jsx': 'js',
    '.ts': 'typescript',
    '.tsx': 'typescript',
  },
}

const limiter = new Bottleneck({
  // Allow 5000 requests per hour
  // https://developer.github.com/v3/rate_limit/
  reservoir: 5000,
  reservoirRefreshAmount: 5000,
  reservoirRefreshInterval: 1000 * 60 * 60,
})

function fetchCode(url, githubUrl, token) {
  const { owner, name, filepath, commit } = githubUrl
  return limiter.wrap(() =>
    fetch(
      `https://api.github.com/repos/${owner}/${name}/contents/${filepath}?ref=${commit}`,
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
        // cache.set(cacheKey, code)
        return code
      })
  )()
}

function trimCodeByRange(code, range) {
  return code
    .split('\n')
    .slice(range.from - 1, range.to)
    .join('\n')
}

function parseLineRange(githubUrl) {
  const rangeRegExp = /^L(\d+)-L(\d+)$/
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

const replacer = ({ extMap, cache, token, codeFetcher }) => async ({
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

  const cacheKey = [
    githubUrl.name,
    githubUrl.owner,
    githubUrl.filepath,
    range.from,
    range.to,
  ].join('/')
  const code = cache[cacheKey] || (await codeFetcher(url, githubUrl, token))
  if (!code) {
    return
  }

  const snippet = trimCodeByRange(code, range)
  cache[cacheKey] = snippet
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
  const { extMap, whitelist, token, cachePath } = {
    ...defaultOptions,
    ...pluginOptions,
  }

  if (!fs.existsSync(path.dirname(cachePath))) {
    fs.mkdirSync(path.dirname(cachePath), { recursive: true })
  }
  if (!fs.existsSync(cachePath)) {
    fs.writeFileSync(cachePath, JSON.stringify({}))
  }
  const cache = require(cachePath)
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
      replacer({ extMap, token, cache, codeFetcher: fetchCode })
    )
  )
    .catch(e => {
      console.warn(e.stack)
      throw e
    })
    .finally(() => {
      fs.writeFileSync(JSON.stringify(cache), cachePath)
    })
}

attacher.replacer = replacer
attacher.fetchCode = fetchCode
attacher.trimCodeByRange = trimCodeByRange
attacher.parseLineRange = parseLineRange

module.exports = attacher
