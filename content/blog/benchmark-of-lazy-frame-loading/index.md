---
title: ChromeのBlink LazyLoadを有効にしたらページのロード時間が約10倍早くなった
date: '2019-01-12T08:25:21.166Z'
tags:
  - JavaScript
  - Google Chrome
---

Lazy load はよく知られた web サイトの高速化テクニックの１つですが、**自前で lazy load を実装したりライブラリを使う必要がなくなる**未来が実現しつつあります。  
Chrome のレンダリングエンジン[Blink](https://www.chromium.org/blink)が 画像や iframe の LazyLoad を試験的に実装しました。
[仕様](https://docs.google.com/document/d/1e8ZbVyUwgIkQMvJma3kKUDg8UUkLRRdANStqKuOIvHg)はこちらに詳しく書かれています。記事を公開した時点ではフラグを有効にすることで利用できるようになっていました。

Chrome Blink についての説明は多くの参考になる記事があるので、そちらを参照してください。

> &mdash; [ブラウザの機能として Chrome が Lazy Load をサポートするかも。SEO と相性が悪い Lazy Load が不要になるか？ | 海外 SEO 情報ブログ](https://www.suzukikenichi.com/blog/chrome-may-support-lazy-load-natively/)

> &mdash; [Chrome の新機能 Blink LazyLoad の要点と注意点 – PSYENCE:MEDIA](https://tech.recruit-mp.co.jp/front-end/post-17429/)

> &mdash; [img 要素と iframe 要素の lazyload 属性 - EagleLand](https://1000ch.net/posts/2018/lazyload-attributes.html)

当記事では「では実際にどれくらい速度改善されるのか？」を実験してみたので、その結果をまとめます。

## lazy frame loading を有効にする

`chrome://flags/#enable-lazy-frame-loading` から設定できます。この設定を有効にすると、**明示的に OFF にしない限り自動的に iframe の LazyLoad が有効**になります。

蛇足ですが画像については lazy image loading という別のフラグになっているのでご注意ください。

## 明示的に LazyLoad を off にする

`lazyload="off"`という属性を iframe に付与すると、LazyLoad が無効になり従来通りの挙動になります。ベンチマークついでに試してみましたが期待通りに動きました。

## ベンチマーク

ベンチマークに使用した記事はこちらです。

> &mdash; [Gatsby の記事に oEmbed 準拠のコンテンツを埋め込めるようにした | WEB EGG](https://blog.leko.jp/post/gatsby-remark-discoverable-oembed/)

上記の記事は iframe が４つ登場します。  
当ブログは iframe の LazyLoad を実装してないため記事の表示した時点から画面外にある iframe のロードが走ってしまいます。

計測方法は、

- 開発者ツールの Network タブから`Disable cache`を有効にしておく
- 対象の記事をリロードし Network タブに最下部に記載されている`Load`の時間（後述の画像参照）を比較
  - 20 回くらい試してみて中央値を取る

なお計測に利用した環境は以下のとおりです。

- OS: Chrome OS (Version 72.0.3626.49 (Official Build) dev (64-bit))
- Google Chrome バージョン: 同上
- テザリング（こちらの[サイト](https://fast.com/ja/)でスピードテストしてみたら`1.9Mbps`だった）

ネットワークがともなうベンチマークは回線やマシンの調子によって激しく差異が出るので、絶対値ではなくあくまでフラグの有無による相対値で比較をします。

## ベンチマーク結果

LazyLoad を無効のまま表示した結果がこちらです。
![](./disabled.png)

LazyLoad を有効にしたときの結果がこちらです。
![](./enabled.png)

上記の画像を表形式でまとめたものがこちらです。

| #                | default | Lazyload  |
| ---------------- | ------- | --------- |
| Requests         | 120     | 19        |
| transferred      | 2.6MB   | 259KB     |
| DOMContentLoaded | 691ms   | 610ms     |
| Load             | 11.05s  | **1.15s** |
| Finish           | 11.08s  | 1.16s     |

リクエストの本数は 1/6 まで減少し、**Load の時間は約 10 倍早くなりました**。  
フラグが無効のままでもファーストビューが表示されるまでの時間はそれほど違わないのですが、その後にずーっと通信中の表示が出ていました。
LazyLoad を有効にすると、ページを下にスクロールしていくと徐々に iframe の中身がロードされるようになります。テザリング程度の回線速度でも該当要素までスクロールしたときに描画は完了しており、表示が遅延してる感じもありませんでした。

## 当ブログでの対応

iframe は毎回登場するのもでもないので、（主要ブラウザが対応し切るまで何年かかるか分かりませんが）オレオレ LazyLoad は実装せず待つことにしました。
画像に関しては Gaysby プラグインを使ってると勝手に有効になっちゃうのでオレオレ LazyLoad を使うようにしています。

## さいごに

ぜひフラグを有効にして快適な表示を体験してみてください。  
利用者としては嬉しい限りですが、このフラグがデフォルトで有効になった日にはアクセス解析提供してる会社さんは大変そうな予感がします。

iframe といえばソーシャルボタンも多くが iframe で提供されています。表示が遅くなるので当ブログは付けてませんが、このあたりも劇的にパフォーマンス改善されるポイントになると思います。
