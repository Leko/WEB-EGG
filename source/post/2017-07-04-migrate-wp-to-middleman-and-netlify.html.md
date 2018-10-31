---
path: /post/migrate-wp-to-middleman-and-netlify/
title: Wordpressで運用していたブログをMiddleman+Netlifyに変更した
date: 2017-07-04T11:30:02+00:00
image: /images/2017/07/eyecatch-migrate-wp-to-middleman-and-netlify.png
tags:
  - Wordpress
  - AWS
  - Middleman
  - Netlify
---

こんにちは。  
「サイトのデザインが変わった」と感じていただいた方がもし居たらありがとうございます。

2012 年からずっとさくら VPS + Wordpress で運用していたブログを Middleman + Netlify に置き換えたので、経緯や方法について残しておきます。

<!--more-->

## 背景

### そもそもなぜさくら+Wordpress だったのか

もう 5 年前のことなので記憶はあやふやですが。  
当時の私はサーバサイド（PHP もシェルも Web サーバも含め）の理解が弱く、練習のために自前でサーバ立てて WP 入れて運用を始めたんだと思います。

ただ、かれこれ５年記事を書いていて思うのが、

- レビューの仕組みが辛い
- Markdown パーサがたまに不安定な挙動をしたり、未だ安心感がない
- Git 管理できない（現在の開発方法では）
- 見た目いじるのにいちいち Wordpress のお作法に引きずられる
- WP のこと自体を覚えても今更金にならなくなってきた
- 昨今のフロント事情について行くときに PHP が邪魔
- プラグインの中身にタッチできないので、HTML やアセットの細かい制御しにくい
- 記事のネタを管理する場所がなく、TODO リスト作っても管理が面倒

などの背景があり、思い切って静的サイトに移し替えようと思いました

## リニューアルで取り入れたいこと

- HTTPS
- HTTP/2
- Github 運用
- フロント周りの融通を効かせたい
- Bootstrap4
- BEM
- ゼロベースで自分でデザイン

が主でした。  
他にも AMP やら PWA や sw-precache など、フロントで試してみたい事は色々ありましたが、最低限上記は必須としました。

ちなみにこのブログのソースはこちらから見れます。  
[Leko/WEB-EGG](https://github.com/Leko/WEB-EGG)

## 想定するメリット

- 表示が早くなる
- 記事を読みやすくできる
- サーバの運用レス（WP アップグレードしたらブログ落ちるなどが発生しなくなる）
- Github を中心に自動化・効率化を入れて行ける
- 画像の最適化など、事前ビルドできないと難しいことを簡単にやれる

## 想定するデメリットと対処法法

### ブログ自体を作成するコスト

もともと使い慣れている Middleman を使用すれば大した手間もハマりもなく行けるであろうと予想  
ほかにも Jekyll や Gatsby などの静的サイトジェネレータも調べてみましたが、結局慣れてる Middleman にしました

### 記事を作成するコスト

素の Markdown を使い慣れたテキストエディタで書けるので全く問題なし。  
メタ情報も frontmatter に突っ込めばいいだけなので問題なし。ただ、タグのサジェストがないとタグ名が表記揺れしそうで若干怖い

### 予約投稿（cron 相当）が失われる？

Netlify には特定の URL からビルドをトリガーしたり、API が提供されていたりするので、  
それを Heroku scheduler や Travis の cron で叩けば回避できる

Travis は最小で 1 回/1d しかビルドできない、Heroku scheduler なら 1 回/1h でビルドできるので、予約投稿に十分な細かさを持っていると判断

### サイト内検索を実装するコスト

記事データを JSON 化して、[lunr.js](https://lunrjs.com/)か[Elasticlunr.js](http://elasticlunr.com/)を使って自前で実装するか、  
React native や Middleman の公式サイトでも使われる[Algolia](https://www.algolia.com/)や[DocSearch](https://community.algolia.com/docsearch/)など、回避手段は色々ありそうなので、然程コストかけずに対応できそう。

### 今まで使っていた Wordpress のプラグイン相当の機能の実現

取捨選択した上で Middleman のプラグインで代替手段を探した。  
クリティカルなのはクリティカルなのは静的なシンタックスハイライトでしたが、それもプラグイン見つけてうまく馴染んだので問題なかった

## Gatsby vs Jekyll vs Middleman

静的サイトジェネレータの選定のメモを残しておきます

| #                  | Middleman | Jekyll | Gatsby |
| ------------------ | --------- | ------ | ------ |
| 言語               | Ruby      | Ruby   | Node   |
| 慣れ               | ○         | △      | ×      |
| ツールとしての好み | ○         | △      | ×      |
| カスタマイズ性     | ○         | ○      | △      |
| プラグインの豊富さ | ○         | ○      | △      |
| 情報量             | △         | ○      | ×      |

個人的にはこんな感じでした。  
Gatsby という React の SSR を利用した静的サイトジェネレータ、コンセプトやコードはかなり面白くて最初はこれを採用しようと思ったのですが、

- ページネーションを自前で実装する必要がある
- v1 への過渡期でドキュメント及び情報がほぼゼロ。ソースを読んで理解を進めて行くほどの時間は取れない。時期尚早すぎる
- v1 に移行されたとしても Markdown パーサ周りがいまいち（remark のプラグインが素では使えず Gatsby 用にラップしないとダメ）
- v1 からは GraphQL 使用する前提、まだ枯れてないミドルウェアに密に結合したツールは怖い
- 静的にレンダリングされる HTML と動的にフロントで動く js の区別がつきにくい

などの問題があり、使い慣れている Middleman を採用しました。  
ただ、Middleman も Rails の変化からか v4 から大きく仕様やコードの構造が変わっており、数年前に使ったことあるだけの知識では結局どハマりしました。

その辺の過程はまた別の記事に書き留めていきます。

## Heroku vs Github pages vs S3 vs Netlify

- 問題が起きない限りは 24h365d 稼働している想定
- ブログのソースは Github に public で公開（オープンソースのボーナス狙い）
- 独自に取得したサブドメインを指定する
- サブドメの DNS は移譲していいが、権威 DNS はさくらから移行しない

| #                        | Heroku+nginx | Github pages | AWS S3+CloudFront+Route53+ACM | Netlify |
| ------------------------ | ------------ | ------------ | ----------------------------- | ------- |
| HTTPS                    | ✔︎           | ✔︎           |                               | ✔       |
| HTTP/2                   | ✔            |              | ✔                             | ✔       |
| 料金                     | $7/月        | 0            | 従量制                        | 0       |
| 慣れ                     | ○            | △            | ×                             | ×       |
| 設定の簡単・確実さ       | ○            | ○            | ×                             | ○       |
| Web サーバの設定の柔軟さ | △            | ×            | ○                             | ○       |
| 情報量                   | △            | ○            | ○                             | ×       |

という感じで、結果 Netlify に挑戦することにしました。

AWS の ACM の署名がメールでしか行えず、権威 DNS を Route53 に移譲すれば SES で受信するという選択肢があるそうなのですが、  
サブドメインだけ移譲するパターンでうまく受信ができず、諦めました。

Google Cloud Storage も頭によぎったが、結論として S3 を選外にしたので割愛します

設定が AWS 慣れてない私には難しく、かつ ACM（のドメイン署名）が突破できないので諦めました...。  
権威 DNS を Route53 に移行しないと SES でメール受信すらできないので、署名不可能

## WP で書いた記事を全てエクスポートする

[Jekyll Exporter](https://ja.wordpress.org/plugins/jekyll-exporter/)というプラグインを利用し、全ての記事を Frontmatter 付き Markdown に変換しました。  
新旧さまざまな書き方が混在しており、それらの統一もしたことなかったので、もちろんエクスポートしたままでうまく行くわけもなく、正規表現でゴリゴリと一括置換かけていきました。

## Bootstrap4 を入れる

Sass を使い、必要なパーツだけを部分的に`@import`して行くようにしました。  
ブログリニューアル時点で使ったのは、これらのファイルです。

```scss
@import "./variables"; // ここでBootstrapの変数を拡張する

@import "bootstrap-grid"; // 全部入りより最小限入ったもの
@import "bootstrap/variables"; // Bootstrap内で使用する設定値の読み込み。上書きしたければここに変数が書かれている
@import "bootstrap/mixins"; // Bootstrap内で使用するMixinの読み込み
@import "bootstrap/custom"; // なんか要る
@import "bootstrap/utilities/flex"; // FlexBox系のユーティリティを使用するなら必要
@import "bootstrap/utilities/spacing"; // 余白系のユーティリティを使用するなら必要
@import "bootstrap/buttons"; // ボタン
@import "bootstrap/forms"; // フォーム。navbarで使用
@import "bootstrap/nav"; // navbarのために必要
@import "bootstrap/navbar"; // ページ上部に使用
@import "bootstrap/breadcrumb"; // パンくず。メインコンテンツの手前に配置
@import "bootstrap/input-group"; // inputの隣にアイコン置いたりするなら必要
```

## 今まで使っていた Wordpress のプラグイン相当の機能の実現

### [Google XML Sitemap](https://ja.wordpress.org/plugins/google-sitemap-generator/)

[Aupajo/middleman-search_engine_sitemap](https://github.com/Aupajo/middleman-search_engine_sitemap)を使えば良さそう。問題なし

### [WP Social Bookmarking Light](https://ja.wordpress.org/plugins/wp-social-bookmarking-light/)

それぞれ HTML パーツ持って来ればいいだけなので特に問題なし

### [Comet Cache](https://wordpress.org/plugins/comet-cache/)

静的ファイルなのでクエリ時間はもともと削減されている。  
静的ファイルについては Netlify がよしなに配信してくれるので、あまり気にしなくても基本いい感じにキャッシュが効いてくれる

### [Crayon Syntax Highlighter](https://wordpress.org/plugins/crayon-syntax-highlighter/)

Ruby の[Rouge](https://github.com/jneen/rouge)を使って、HTML 作成時にハイライト済みの HTML にして描画時のパフォーマンスを上げる作戦  
むしろ上位互換なので問題なし

## あとがき

雑記的な感じになっておりますが、最低限公開できるだけのリニューアルは終わったかなと思います。  
まだまだ治したいところ、追加したい機能、最適化したいアセットなどがモリモリですが、焦らずしっくりと進めていきます。

もしこのブログ（記事の内容も含めて）に何か問題があれば、リポジトリの Issue を立てていただければと思います。  
また、書こうとしている記事のネタも Issue で管理しているので、暇つぶしがてらチラッと眺めてみていただけると幸いです。

これからも Web EGG をよろしくおねがいいたします。
