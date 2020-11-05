---
title: '[DEBUG] All elements'
date: '2000-01-01T00:00:00.000Z'
featuredImage: ../http-over-quic-on-nodejs15/2020-10-26-21-50-02.png
tags:
  - Debug
---

This is a article to detect visual regression.

この記事はビジュアルリグレッションを検知するためのテスト記事です。

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。

https://example.com

> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  
> &mdash; [Lorem Ipsum - All the facts - Lipsum generator](https://www.lipsum.com/)

> あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。  
> &mdash; [宮沢賢治 ポラーノの広場](https://www.aozora.gr.jp/cards/000081/files/1935_19925.html)

> https://example.com

This is [a link](https://example.com). **Strong text**, _italic text_, there're your choice.

これは[リンク](https://example.com)です。**つよいテキスト**、_ななめテキスト_、そんなのひとのかって。

> This is [a link](https://example.com). **Strong text**, _italic text_, there're your choice.

> これは[リンク](https://example.com)です。**つよいテキスト**、_ななめテキスト_、そんなのひとのかって。

text text text text text text text text text text text text text text text.

```js
import Promise from 'bluebird'
Promise.props({
  one: 1,
  two: 2,****
  three: Promise.resolve(3),
}).then(function({ one, two, three }) {
  console.log(one, two, three)
})
```

text text text text text text text text text text text text text text text.

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/snapshot.rs#L4-L14

text text text text text text text text text text text text text text text.

https://speakerdeck.com/leko/node-dot-jsnicontributesite-keyue-decollaboratorninatuta

text text text text text text text text text text text text text text text.

## heading 2 / 見出し 2

text for heading 2 / 見出し 2

### heading 3 / 見出し 3

text for heading 3 / 見出し 3

#### heading 4 / 見出し 4

text for heading 4 / 見出し 4

##### heading 5 / 見出し 5

text for heading 5 / 見出し 5

###### heading 6 / 見出し 6

text for heading 6 / 見出し 6

これらの一次情報が参考になりました。

- [QUIC | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html)
  - 公式ドキュメント
- [test/parallel/test-quic-http3-client-server.js](https://github.com/nodejs/node/blob/7657f62b1810b94acbe7db68089b608213b34749/test/parallel/test-quic-http3-client-server.js)
  - nodejs/node の中にあるテストコード

これらの二次情報も参考になりました。

- [A QUIC Update for Node.js](https://www.nearform.com/blog/a-quic-update-for-node-js/)
  - Node.js に QUIC を実装した James Snell による紹介記事、ただし記事内の API が古い
