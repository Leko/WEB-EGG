---
title: Gatsbyの記事にoEmbed準拠のコンテンツを埋め込めるようにした
date: 2019-01-10T15:33:03.589Z
featuredImage: ./featured-image.png
tags:
  - JavaScript
  - Gatsby
  - oEmbed
  - AST
  - remark
---

（※↑ はただの記事用のサムネイル画像です）

記事の中に URL を書くだけで oEmbed 準拠のコンテンツを埋め込めるようにしました。  
oEmbed を聞いたことない方はまずデモを見てみてください。

oEmbed は結構身近なサービスたちも対応している便利で面白い仕様なのですが、あまり有名ではない（日本語の情報も少ない）ようです。  
記事に活用できそうな面白いものだったので、デモを交えつつ紹介します。

なおこの記事では oEmbed のデモと紹介をメインに記載します。ソースは公開してありますが Gatsby の remark プラグインの作り方解説的なのはこの記事では割愛します。

## oEmbed の埋め込みデモ

国内のサービスだと、はてなブログの記事が有名だと思います。  
記事の URL を markdown に書くと以下のような表示になります。  
（自分がはてなブログの記事をもってないので最近読んだ記事で失礼します）。

markdown（以後省略）:

```md
https://mizchi.hatenablog.com/entry/2018/10/23/221446
```

ビルド結果:
https://mizchi.hatenablog.com/entry/2018/10/23/221446

他に有名なものだと Speaker Deck なども oEmbed に対応しています。

https://speakerdeck.com/leko/node-dot-jsnicontributesite-keyue-decollaboratorninatuta

他には npm の DL 数の遷移を複数パッケージで比較できる npmcharts や、

https://npmcharts.com/compare/express,koa,nest,@adonisjs/framework,connect,@nestjs/core,fastify,hapi,loopback

Node.js のコードが実行できるプロトタイピングツール runkit などがあります。

https://runkit.com/leko/for-oembed-test

他には Twitter や Flickr、Instagram なども oEmbed に対応してるんですが、iframe 大量に埋め込んでも表示が遅くなるだけなので割愛します。

## Gatsby プラグイン: gatsby-remark-discoverable-oembed

って感じのことができる Gatsby プラグイン「gatsby-remark-discoverable-oembed」を作りました。

https://github.com/Leko/WEB-EGG/blob/master/plugins/gatsby-remark-discoverable-oembed/index.js

まだ納得できる使用感になってないので、とりあえずローカルプラグインとしてブログと同じリポジトリにおいてあります。  
何記事か書いてみて使用感をもんで、設定やパフォーマンスも問題ないと判断したら publish して Gatsby プラグインの仲間入りさせる予定です。

ざっくり中身を紹介すると、markdown の AST を探索してホワイトリストで許可したパターンにマッチする URL を抽出し、oEmbed の表示用データを入手し展開後の HTML を markdown に挿入するプラグインになっています。
このプラグインの作成に関しては Gatsby と remark の固有知識が多大に含まれるので、別途記事を書きます。

以降の内容は、oEmbed の紹介になります。

## oEmbed の仕組み

そもそも oEmbed とは、2008 年に Slack の中の人[Cal Henderson](https://github.com/iamcal)氏によって提案されたコンテンツ埋め込みのためのオープンな規格です。公式サイトはこちら。

> &mdash; [oEmbed](https://oembed.com/)

2008 年当時のお披露目の記事がこちら。

> &mdash; [Announcing OEmbed - An Open Standard for Embedded Content - Leah Culver's Blog](https://blog.leahculver.com/2008/05/announcing-oembed-an-open-standard-for-embedded-content.html)

Wordpress に oEmbed に関連するプラグインがあるらしく、日本では主に Wordpress 界隈の情報が多く見つかります。
ドキュメントは全部英語ですが短いのでサラッと読めると思います。

## oEmbed Discovery

仕様の中から抜粋して紹介したいのが、[Discovery](https://oembed.com/#section4)という仕様です。

```html
<link
  rel="alternate"
  type="application/json+oembed"
  href="http://flickr.com/services/oembed?url=http%3A%2F%2Fflickr.com%2Fphotos%2Fbees%2F2362225867%2F&format=json"
  title="Bacon Lollys oEmbed Profile"
/>
<link
  rel="alternate"
  type="text/xml+oembed"
  href="http://flickr.com/services/oembed?url=http%3A%2F%2Fflickr.com%2Fphotos%2Fbees%2F2362225867%2F&format=xml"
  title="Bacon Lollys oEmbed Profile"
/>
```

以下のような HTML をレスポンスに含めておくことで、oEmbed をサポートしていることを明示できます。  
HTML をパースし、書いてある URL に対してリクエストをすることで、埋め込み用のデータを入手できます。例えば上記の HTML の JSON の方の URL にリクエストするとこんな JSON が手に入ります。

```json
{
  "type": "photo",
  "flickr_type": "photo",
  "title": "Bacon Lollys",
  "author_name": "‮‭‬bees‬",
  "author_url": "https://www.flickr.com/photos/bees/",
  "width": "1024",
  "height": "768",
  "url": "https://farm4.staticflickr.com/3040/2362225867_4a87ab8baf_b.jpg",
  "web_page": "https://www.flickr.com/photos/bees/2362225867/",
  "thumbnail_url": "https://farm4.staticflickr.com/3040/2362225867_4a87ab8baf_q.jpg",
  "thumbnail_width": 150,
  "thumbnail_height": 150,
  "web_page_short_url": "https://flic.kr/p/4AK2sc",
  "license": "All Rights Reserved",
  "license_id": 0,
  "html": "<a data-flickr-embed=\"true\" href=\"https://www.flickr.com/photos/bees/2362225867/\" title=\"Bacon Lollys by ‮‭‬bees‬, on Flickr\"><img src=\"https://farm4.staticflickr.com/3040/2362225867_4a87ab8baf_b.jpg\" width=\"1024\" height=\"768\" alt=\"Bacon Lollys\"></a><script async src=\"https://embedr.flickr.com/assets/client-code.js\" charset=\"utf-8\"></script>",
  "version": "1.0",
  "cache_age": 3600,
  "provider_name": "Flickr",
  "provider_url": "https://www.flickr.com/"
}
```

本来的にはサービス提供者は oEmbed の仕様に沿った API を実装し[iamcal/oembed](https://github.com/iamcal/oembed)に PR を送り oEmbed API のメタ情報を登録しておき、埋め込みしたい oEmbed API 利用者側はそのメタ定義に応じてリクエストして埋め込み用のメタデータを得るという仕様です。しかしサービス提供者と provider のメンテナ（＝仕様策定者）が異なるため「Provider にメタデータの定義はないが oEmbed Discovery に対応したサービス」が存在します。  
先程のデモで言うとはてなブログと runkit、npmcharts がこれに該当します。  
Speaker Deck や Flickr などはメタデータの定義もあるし、HTML でも Discover できることを明示してあります。  
一方 Twitter や YouTube などはメタデータの定義だけ存在し、Discover することはできません。

Discover 用の HTML を追加するとレスポンスサイズが多少なり増えるので、1byte でも多く削りたいってレベルのパフォーマンスを追求すると Discover 用の HTML は削減対象になる得るのかなと思います。

## セキュリティ上の懸念

すべての URL を問答無用で埋め込むようにしてしまうと、埋め込んだ側のサイトに対してサービス提供者が（JavaScript でできることの限りだけど）任意のコードを実行できるようになってしまいます。

> &mdash; [3. Security considerations | oEmbed](https://oembed.com/#section4)

> &mdash; [What About oEmbed Discovery? | Embeds « WordPress Codex](https://codex.wordpress.org/Embeds#What_About_oEmbed_Discovery.3F)

oEmbed の利用者は、信頼できるサイトだけを明示的にホワイトリストで許可すると良いと思います。

## 活用例

- npm パッケージを比較検討した記事とか書くときに npmcharts が使えそう
- カンファレンス/勉強会のレポート記事書くときに SpeakerDeck の oEmbed が使えそう
- Node のコードを動かしてながら説明するような記事や、ライブラリについてサラッとデモしたときに runkit が使えそう

とかとか、oEmbed の埋め込みを活用できれば記事でできることの幅が広がりそうです。  
iframe が大量に読み込まれることでロードが重くなる問題に関しては遅延ロードなどを検討中です。。。

Gatsby のように自由度の高いビルドツールを使っているならこの記事のように自前で仕組みが作れます。  
Medium では記事や URL のプレビューに[Embedly](https://embed.ly)を介して oEmbed をりようしているようです。Embedly というサービスも oEmbed の仕様に対応しています。

oEmbed に対応した面白いサービスを見つけたらぜひ Twitter 等でご連絡いただければと思います。
