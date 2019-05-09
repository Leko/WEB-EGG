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

    let styles = $('style')
      .map((_i, el) => $(el).html())
      .toArray()
      .join('\n')

    styles += `
    amp-social-share[type=hatena_bookmark] {
      width: 60px ;
      height: 44px ;
      font-family: Verdana ;
      background-color: #00A4DE ;
      font-weight: 700 ;
      color: #fff ;
      line-height: 44px ;
      text-align: center ;
      font-size: 28px ;
    }
    amp-social-share[type=pocket] {
      width: 60px ;
      height: 44px ;
      background-color: #EF3E55 ;
      background-image: url( 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#fff" d="M12.53 6.84l-3.76 3.61c-.213.204-.486.306-.76.306-.273 0-.547-.102-.76-.306L3.488 6.84c-.437-.418-.45-1.113-.032-1.55.42-.438 1.114-.452 1.55-.033l3.005 2.88 3.006-2.88c.436-.42 1.13-.405 1.55.032.42.436.405 1.13-.032 1.55zm3.388-5.028c-.207-.572-.755-.956-1.363-.956H1.45c-.6 0-1.144.376-1.357.936-.063.166-.095.34-.095.515v4.828l.055.96c.232 2.184 1.365 4.092 3.12 5.423.03.024.063.047.095.07l.02.015c.94.687 1.992 1.152 3.128 1.382.524.105 1.06.16 1.592.16.492 0 .986-.046 1.472-.136.058-.014.116-.024.175-.038.016-.002.033-.01.05-.018 1.088-.237 2.098-.69 3.004-1.352l.02-.014.095-.072c1.754-1.33 2.887-3.24 3.12-5.423l.054-.96V2.307c0-.167-.02-.333-.08-.495z"/></svg>' ) ;
      /* MIT License | https://icon.now.sh/ */
    }
    `

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
        `
        <amp-analytics type="gtag" data-credentials="include">
        <script type="application/json">
        {
          "vars" : {
            "gtag_id": "UA-34171537-1",
            "config" : {
              "UA-34171537-1": { "groups": "default" }
            }
          }
        }
        </script>
        </amp-analytics>
        `
      )
    )
    $('head').append(
      $(
        `<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>`
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

    const canonicalUrl = $('link[rel="canonical"]').attr('href')
    $('.after-post').before(`
      <div>
        <amp-social-share type="twitter"></amp-social-share>
        <amp-social-share type="hatena_bookmark" layout="container" data-share-endpoint="http://b.hatena.ne.jp/entry/${canonicalUrl}">B!</amp-social-share>
        <amp-social-share type="pocket" layout="container" data-share-endpoint="http://getpocket.com/edit?url=${canonicalUrl}"></amp-social-share>
        <amp-social-share type="facebook" data-param-app_id="1434873820060880"></amp-social-share>
        <amp-social-share type="system"></amp-social-share>
      </div>
    `)
    $('head').append(
      $(
        `<script async custom-element="amp-social-share" src="https://cdn.ampproject.org/v0/amp-social-share-0.1.js"></script>`
      )
    )

    // const ad1 = `
    // `
    // const ad2 = `
    // `
    // $('.after-post').after(ad2)

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
