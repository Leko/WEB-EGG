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
[Rubygems へのデプロイを CircleCI で自動化してみた \| WEB EGG](/post/automate-deploy-to-rubygems-with-circleci/)に引き続き npm のデプロイも自動化してみました。  
gem のときとは微妙に差異があるので、あらためて備忘録として残しておきます。

<!--more-->

## 作ったもの

こちらのリポジトリです。circle.yml にデプロイ周りのことが書かれています。

> [GitHub – Leko/roulette-cli: Simple roulette game](https://github.com/Leko/roulette-cli)

## 基本的な npm のデプロイ手順

```shell
npm login # アカウント情報を入力
npm publish
```

で現在のプロジェクトを npm へデプロイできます。

> [Using npm login on CircleCI – CircleCI](https://circleci.com/docs/npm-login/)

このドキュメントを参考に、login で与える認可情報は環境変数で保持すれば OK でした。

## もう少しリッチな npm のデプロイ方法

[Rubygems へのデプロイを CircleCI で自動化してみた \| WEB EGG](/post/automate-deploy-to-rubygems-with-circleci/)のときは gem が自動でやってくれのたですが、  
npm ではタグを切ったり CHANGELOG 書いたりを自前で行う必要があります。

> [Git tag と GitHub Releases と CHANGELOG.md の自動化について \| Web Scratch](http://efcl.info/2014/07/20/git-tag-to-release-github/)

こちらの記事を参考にしようと思ったのですが、やり過ぎ感が漂っており要件には合わなかったので、  
ラップしている元の[standard-version](https://github.com/conventional-changelog/standard-version)というライブラリを使用してみました。  
このライブラリを使用すると、

- CHANGELOG の自動生成
- バージョン用の Git のタグを切る
- (バージョン番号の設定) ※今回は無効化します。バージョン番号は自分で決める方針で

が自動で行われます。

## CircleCI に user key を追加する

CircleCI と連携したままのだと、read only なデプロイキーが使用されています。 なのでリポジトリから pull はできるのですが、タグの追加や push ができない。

この手順については[Rubygems へのデプロイを CircleCI で自動化してみた \| WEB EGG](/post/automate-deploy-to-rubygems-with-circleci/)に書いてあるので、そちらをご参照ください。

## 試す

CircleCI の表示は

![スクリーンショッ](/images/2017/01/b782c30ff31333c2cea5152a250c73b0.png)

npm のパッケージは

![スクリーンショッ](/images/2017/01/b203346692a299a373192edf35b2a426.png)

いい感じです。

## まとめ

この記事の内容を試している時に「そういえば前に似たようなことやったな」と思い自分の過去の記事を調べることがありました。  
そのとおりにやっていけば基本的に上手く行ったので、記事を残すことは重要だなとあらためて感じました。

ベースとなる知識があらかじめ備わっているとその派生系を覚えるのも楽ですしね。
