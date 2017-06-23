---
path: /post/automate-deploy-to-npm-with-circleci/
title: npmへのデプロイをCircleCIで自動化してみた
date: 2017-01-04T10:50:22+00:00
dsq_thread_id:
  - "5431370183"
categories:
  - 効率化
tags:
  - CircleCI
  - Nodejs
  - npm
---
こんにちは。
  
[RubygemsへのデプロイをCircleCIで自動化してみた | WEB EGG](http://leko.jp/archives/871)に引き続きnpmのデプロイも自動化してみました。
  
gemのときとは微妙に差異があるので、改めて備忘録として残しておきます。

<!--more-->

作ったもの
----------------------------------------


こちらのリポジトリです。circle.ymlにデプロイ周りのことが書かれています。

> [GitHub &#8211; Leko/roulette-cli: Simple roulette game](https://github.com/Leko/roulette-cli){.broken_link}

基本的なnpmのデプロイ手順
----------------------------------------


```bash
npm login # アカウント情報を入力
npm publish

```


で現在のプロジェクトをnpmへデプロイできます。

> [Using npm login on CircleCI &#8211; CircleCI](https://circleci.com/docs/npm-login/)

このドキュメントを参考に、loginで与える認可情報は環境変数で保持すればOKでした。

もう少しリッチなnpmのデプロイ方法
----------------------------------------


[RubygemsへのデプロイをCircleCIで自動化してみた | WEB EGG](http://leko.jp/archives/871)のときはgemが自動でやってくれのたですが、
  
npmではタグを切ったりCHANGELOG書いたりを自前で行う必要があります。

> [Git tagとGitHub ReleasesとCHANGELOG.mdの自動化について | Web Scratch](http://efcl.info/2014/07/20/git-tag-to-release-github/)

こちらの記事を参考にしようと思ったのですが、やり過ぎ感が漂っており要件には合わなかったので、
  
ラップしている元の[standard-version](https://github.com/conventional-changelog/standard-version)というライブラリを使用してみました。
  
このライブラリを使用すると、

  * CHANGELOGの自動生成
  * バージョン用のgitのタグを切る
  * (バージョン番号の設定) ※今回は無効化します。バージョン番号は自分で決める方針で。

が自動で行われます。

## CircleCIにuser keyを追加する

CircleCIと連携したままのだと、read onlyなデプロイキーが使用されています。 なのでリポジトリからpullはできるのですが、タグの追加やpushができない。

この手順については[RubygemsへのデプロイをCircleCIで自動化してみた | WEB EGG](http://leko.jp/archives/871)に書いてあるので、そちらをご参照ください。

試す
----------------------------------------


CircleCIの表示は

<img src="http://leko.jp/images/2017/01/b782c30ff31333c2cea5152a250c73b0.png" alt="スクリーンショット 2017-01-03 21.09.59" width="872" height="662" class="alignnone size-full wp-image-929" />

npmのパッケージは

<img src="http://leko.jp/images/2017/01/b203346692a299a373192edf35b2a426.png" alt="スクリーンショット 2017-01-03 21.08.25" width="257" height="162" class="alignnone size-full wp-image-928" />

いい感じです。

まとめ
----------------------------------------


この記事の内容を試している時に「そういえば前に似たようなことやったな」と思い自分の過去の記事を調べることがありました。
  
そのとおりにやっていけば基本的に上手く行ったので、記事を残すことは重要だなと改めて感じました。

ベースとなる知識が予め備わっているとその派生系を覚えるのも楽ですしね。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>