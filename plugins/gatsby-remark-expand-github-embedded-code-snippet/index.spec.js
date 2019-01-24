/* eslint-env node, jest */
const attacher = require('./index')
const { replacer, trimCodeByRange, parseLineRange } = require('./index')
const parseGitHubUrl = require('git-url-parse')
const remark = require('remark')
const visit = require(`unist-util-visit-parents`)

jest.mock('isomorphic-fetch')

describe('parseLineRange', () => {
  it('can parse single line specifier', () => {
    const range = parseLineRange({ hash: 'L1' })
    expect(range).toEqual({
      from: 1,
      to: 1,
    })
  })
  it('can parse line range range speicfier', () => {
    const range = parseLineRange({ hash: 'L3-L123' })
    expect(range).toEqual({
      from: 3,
      to: 123,
    })
  })
  it('should return null when parse failed', () => {
    const range = parseLineRange({ hash: 'L1' })
    expect(range).toEqual({
      from: 1,
      to: 1,
    })
  })
})

describe('trimCodeByRange', () => {
  const code = `#!/usr/bin/env node
const path = require('path')
const fs = require('fs')

const absHoge = path.resolve('./hoge')
fs.writeFileSync(absHoge, 'aaa', 'utf8')
`
  const lines = code.split('\n')

  it('should trim single line', () => {
    expect(trimCodeByRange(code, { from: 2, to: 2 })).toBe(
      lines.slice(1, 2).join('\n')
    )
  })
  it('should trim multiple lines', () => {
    expect(trimCodeByRange(code, { from: 2, to: 4 })).toBe(
      lines.slice(1, 4).join('\n')
    )
  })
  it('should trim includes start of code', () => {
    expect(trimCodeByRange(code, { from: 1, to: 4 })).toBe(
      lines.slice(0, 4).join('\n')
    )
  })
  it('should trim includes end of code', () => {
    expect(trimCodeByRange(code, { from: 4, to: 6 })).toBe(
      lines.slice(3, 6).join('\n')
    )
  })
})

describe('replacer', () => {
  const url = 'https://github.com/Leko/WEB-EGG/blob/master/.travis.yml#L3-L4'
  const code = `console.log('Hello, world!!')

// Line 3
// Line 4
// Line 5
`
  const expectedCode = `// Line 3
// Line 4
`

  let node = null
  let ancestors = null
  beforeEach(() => {
    const ast = remark.parse(url)
    visit(ast, `link`, (n, a) => {
      node = n
      ancestors = a
    })
  })

  it('replaces textlink as code block', async () => {
    const codeFetcher = async () => code
    const replace = replacer({ codeFetcher, extMap: {} })
    await replace({
      url,
      githubUrl: parseGitHubUrl(url),
      node,
      ancestors,
    })

    expect(node.type).toBe('code')
    expect(node.value).toBe(expectedCode)
  })
  it('prepend html before code', async () => {
    const codeFetcher = async () => code
    const replace = replacer({ codeFetcher, extMap: { '.yml': 'yaml' } })
    await replace({
      url,
      githubUrl: parseGitHubUrl(url),
      node,
      ancestors,
    })

    expect(node.type).toBe('code')
    expect(node.value).toBe(expectedCode)
  })
})
