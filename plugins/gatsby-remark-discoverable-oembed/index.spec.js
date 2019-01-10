/* eslint-env node, jest */
const fetch = require('isomorphic-fetch')
const { setScale, discoverOEmbed, fetchOEmbed } = require('./index')

describe('setScale', () => {
  it('sets nothing when maxWidth and maxHeight are undefined', () => {
    const url = setScale('https://example.com/?format=json', {})
    expect(url).toBe('https://example.com/?format=json')
  })
  it('sets maxwidth when maxWidth is numeric', () => {
    const url = setScale('https://example.com/?format=json', { maxWidth: 340 })
    expect(url).toBe('https://example.com/?format=json&maxwidth=340')
  })
  it('sets maxheight when maxHeight is numeric', () => {
    const url = setScale('https://example.com/?format=json', { maxHeight: 340 })
    expect(url).toBe('https://example.com/?format=json&maxheight=340')
  })
  it('sets maxwidth when maxWidth is numeric', () => {
    const url = setScale('https://example.com/?format=json', {
      maxWidth: 460,
      maxHeight: 380,
    })
    expect(url).toBe(
      'https://example.com/?format=json&maxwidth=460&maxheight=380'
    )
  })
})
describe('discoverOEmbed', () => {
  it('can discover unlisted provider', async () => {
    const oEmbed = await fetch('https://npmcharts.com/compare/iltorb,brotli')
      .then(res => res.text())
      .then(html => discoverOEmbed(html, {}))
    expect(oEmbed.provider_name).toBe('npmcharts')
  })
})
describe('fetchOEmbed', () => {
  it('can fetch unlisted provider', async () => {
    const oEmbed = await fetchOEmbed(
      'https://npmcharts.com/compare/iltorb,brotli',
      {}
    )
    expect(oEmbed.provider_name).toBe('npmcharts')
  })
})
