---
title: MiddlemanのビルドにWebpackを組み込む方法
date: 2017-08-15 10:30 JST
tags:
- Middleman
- webpack
- JavaScript
---

こんにちは。  
当ブログは[Middleman](https://middlemanapp.com/)にて運用しているのですが、検索機能や遅延ロードなどで実装したJavaScriptのビルドにはAsset pipelineなどは使わずに[webpack](https://webpack.github.io/)でビルドしています。  

> Rails5.1が今betaで出ていますね。中でも目玉はwebpacker.gemによるモダンなフロントエンド開発がRailsに導入されることでしょう。
> 今までのRailsのasset pipelineとは別に、yarnによって依存性を管理しwebpackで結合する独立したjsのビルドシステムがサポートされます。
> これによって、以下のような従来のasset pip
>
> &mdash; [Rails5.1から導入されるwebpacker.gemは本当にRailsのフロントエンド開発に福音をもたらすのか? - Qiita](http://qiita.com/yuroyoro/items/a29e39989f4469ef5e41)

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="ja"><p lang="ja" dir="ltr">つまりレールズはなんでもレールズの一部として歪な形で取り込むのをやめろ <a href="https://t.co/oRxC56jEWu">pic.twitter.com/oRxC56jEWu</a></p>&mdash; null (@yuroyoro) <a href="https://twitter.com/yuroyoro/status/831685757655883776">2017年2月15日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

私も同意で、Railsはあくまでサーバサイドアプリケーションで、今まで対してフロントに気を使ってこなかったのだから、中途半端に内部に組み込むのやめてくれ派です。  
MiddlemanはRailsのビュー層の部分だけ持ってきたようなものなので、当然同じ問題が発生します。

ということで、MiddlemanとWebpackが共存できる妥協点を探って、実際にこのブログに取り入れてみた結果を残します。

<!--more-->

完成品
-----------------------------------------
このブログのリポジトリに上げてあります

config.rbは[こちら](https://github.com/Leko/WEB-EGG/blob/master/config.rb#L114)、
package.jsonは[こちら](https://github.com/Leko/WEB-EGG/blob/master/package.json#L12)、
webpackの設定は[こちら](https://github.com/Leko/WEB-EGG/blob/master/webpack.config.js)から確認できます。

参考
-----------------------------------------

> &mdash; [Using Webpack with Middleman - rossta.net](https://rossta.net/blog/using-webpack-with-middleman.html)

探していたらちょうど目的に合う記事を見つけました。  
この記事の通り[external_pipeline](https://middlemanapp.com/jp/advanced/external-pipeline/)という拡張を利用します。

external_pipelineってなに
-----------------------------------------

> ここ数年で, コミュニティは Rails から離れ NPM のタスクランナー (gulp, Grunt) や依存管理 (Browserify, webpack), 公式ツール (EmberCLI, React Native) やトランスパイラ(ClojureScript, Elm) に焦点を 合わせるようになりました。
> Middleman はこれらすべてのソリューションや言語に対応することはできません。 そこで私たちはこれらのツールが Middleman の中で動作できるようにすることにしました。 この機能は external_pipeline (外部パイプライン) と呼ばれ, Middleman の 複数のサブプロセスで動作します。一時フォルダにコンテンツを出力し Middleman の サイトマップに取り込むことで実現しています。
>
> &mdash; [Middleman: 外部パイプライン](https://middlemanapp.com/jp/advanced/external-pipeline/)

webpack.gemのようなものではなく、きちんと棲み分けされたツールだと思います。  

ブログに適用
-----------------------------------------
この機能を利用したconfig.rbの記述はこんな感じです。

```
activate :external_pipeline, {
  name: :webpack,
  command: build? ?
    "NODE_ENV=production npm run build" :
    "NODE_ENV=develop npm run develop",
  source: ".tmp/dist",
  latency: 1
}
```

`build?`は`middleman build`した時だけtrueになります。  
普段ローカルで確認する時はいちいちゼロからビルドされると遅いのでwatchを入れてます。

ビルドしてみる
-----------------------------------------

`middleman build`してみた時のキャプチャです。

![middleman build](/images/2017/08/middleman-build.gif)

このように、middleman build時にwebpackのビルドが走り、実行完了を待ってから次の処理へ進む、という挙動になっています。  
ということで、Middlemanにwebpackを導入できました。

Middlemanでサイトを作っているものの、フロントの資源管理に悩まれている時はぜひ検討してみてください。
