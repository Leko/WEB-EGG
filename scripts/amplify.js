const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const sizeOf = require('image-size')
const amphtmlValidator = require('amphtml-validator')
const prettier = require('prettier')
const { load } = require('cheerio')
const { sync: glob } = require('glob')

const boilerplate = `<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>`
const htmlPaths = glob('./public/amp/post/*/index.html')

Promise.all([
  amphtmlValidator.getInstance(),
  prettier.resolveConfig('./public/xxx.html'),
]).then(async ([validator, prettierConfig]) => {
  for (let htmlPath of htmlPaths) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    const $ = load(html, {})
    $('script')
      .not('[type="application/ld+json"]')
      .not('[src^="https://cdn.ampproject.org"]')
      .remove()

    const styles = $('style')
      .map((_i, el) => $(el).html())
      .toArray()
      .join('\n')
    $('style').remove()
    // $('noscript').remove()
    $('head').append($(boilerplate))
    $('head').append($(`<style amp-custom>${styles}</style>`))

    for (let el of $('img').toArray()) {
      el.tagName = 'amp-img'
      $(el).attr('layout', 'responsive')

      let src = $(el).attr('src')
      if (!src) {
        return
      }
      if (src.startsWith('/')) {
        src = path.resolve(path.join(__dirname, '..', 'public', src))
      } else if (src.startsWith('data:')) {
        const data = src.split('base64,')[1]
        src = Buffer.from(data, 'base64')
      } else if (src.startsWith('http')) {
        src = await fetch(src).then(res => res.buffer())
      }
      const { width, height } = sizeOf(src)

      $(el).attr('width', width)
      $(el).attr('height', height)
    }

    $('iframe').each((_i, el) => {
      el.tagName = 'amp-iframe'
      $(el).attr('layout', 'responsive')
    })
    $('head').append(
      $(
        `<script async custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>`
      )
    )

    $('audio').each((_i, el) => {
      el.tagName = 'amp-audio'
    })
    $('head').append(
      $(
        `<script async custom-element="amp-audio" src="https://cdn.ampproject.org/v0/amp-audio-0.1.js"></script>`
      )
    )

    $('body').append(
      $(
        `<amp-install-serviceworker src="https://blog.leko.jp/sw.js" layout="nodisplay">></amp-install-serviceworker>`
      )
    )
    $('head').append(
      $(
        `<script async custom-element="amp-install-serviceworker" src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"></script>`
      )
    )

    $('body').prepend(
      $(
        `<amp-auto-ads type="adsense" data-ad-client="ca-pub-7627436148097691"></amp-auto-ads>`
      )
    )
    $('head').append(
      $(
        `<script async custom-element="amp-auto-ads" src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"></script>`
      )
    )

    $('html').attr('amp', '')

    const ampHTML = $.html().replace('amp=""', 'amp')

    const prettierAmpHTML = prettier.format(ampHTML, {
      ...prettierConfig,
      parser: 'html',
    })
    const lines = prettierAmpHTML.split('\n')
    const result = validator.validateString(prettierAmpHTML)
    if (result.status !== 'PASS') {
      console.error('\n\n\n', result.status, htmlPath)
      const errors = result.errors.map(error => {
        const { serverity, line, message, specUrl } = error
        const code = `${line}: ${lines[line - 1]}`
        return [serverity, code, message, specUrl].join('\n')
      })
      console.error(errors.join('\n\n'))
      continue
    }

    fs.writeFileSync(htmlPath, ampHTML, 'utf8')
    console.log(result.status, htmlPath)
  }
})
