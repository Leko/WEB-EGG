---
path: /post/updated-renew-blog-design/
title: ブログのデザインをリニューアルしました
date: 2013-12-03T01:25:02+00:00
featuredImage: ./featured-image.jpg
categories:
  - お知らせ
tags:
  - Git
  - Wordpress
---

久々の更新です。  
突然ですが、ブログのデザインをリニューアルしました。

とは行っても自作ではなく、  
新しく追加された新テーマ`Twenty Thirteen`をちょこっと改造したものになっています。

リニューアルついでに、導入したプラグインやアプリについて書き留めていきます。

<!--more-->

## リニューアルの目標

1. ローカル側で Markdown 形式で記事を管理する
2. ローカルにテスト環境を構築
3. WordPress プロジェクトを Git 管理する
4. ローカルから`git push`するだけでデプロイ

とローカル管理＋ Markdown 周りを強化しました。

## ローカル側で Markdown 形式で記事を管理する

基本的に当ブログは技術系のことを書いているので、  
コードの書きやすさと、記事の保守性が第一です。

記事を Markdown 管理する際に求めたものは、

1. プラグインを使ってもいいのでローカル上では管理画面上では Markdown 形式で書ける
2. [Fenced Code Blocks](https://help.github.com/articles/github-flavored-markdown#fenced-code-blocks)(` ```{言語名} `)でシンタックスハイライトがかけられる
3. パースによるパフォーマンス低下が起きた時のために HTML にも変換可能

の 3 点です。

ここまで手の届くプラグインなんてあるのかな、と探した所、  
上記を見事に叶えてくれるプラグインがありました。

[WordPress › Markdown on Save Improved &laquo; WordPress Plugins](http://wordpress.org/plugins/markdown-on-save-improved/)

上記を満たしていて、なおかつこのプラグイン何が有難いかというと、  
シンタックスハイライトは`Crayon Syntax Highlighter`**依存になっていること**です。

記事のコードを見やすく表現するためにちょうど使っているプラグインなので、  
そのまま流用・手書きと両立できるのが非常に嬉しい。

即導入して、今のところいい感じにつかえています。

## ローカルにテスト環境を構築

お恥ずかしながら、  
今まで Wordpress をローカルに構築してテスト環境が構築できていませんでした。

データベースの連携がどうしても面倒で、  
インポート・エクスポートを使おうとしても一部エラーなどが起きるので信頼出来ないしで放置していました。

しかし、wordpress に使っている DB の、`wp_options`テーブルの 2 件のレコード

| option_name | option_value     |
| ----------- | ---------------- |
| home        | http://localhost |
| siteurl     | http://localhost |

となっている箇所をリモート用(leko.jp)に書き換えるだけで動作することが判明したので、  
ローカル DB→ リモート DB の連携は意外と可能だと分かったのでローカル環境を構築しました。

> 2013/12/03 追記  
> と思っていたのですが画像のパス周りで多大なバグが発生していました。  
> 2013/12/02 近辺にアクセスされた方にはご不便をおかけいたしました。。。

## WordPress プロジェクトを Git 管理する

普通に Wordpress をダウンロードしてきて、全体をプロジェクト管理しています。  
テーマファイルと、Git でホスティングされているプラグインをサブモジュール化します。

今回は、テーマの改造にあたって、親（Twenty Thirteen）の子テーマとしてテーマを作ります。

```shell
cd /path/to/wordpress/
git init
git commit -am "initial commit"
cp wp-content/themes/twentythirteen ../YOUR_THEME

cd ../YOUR_THEME
git init
git commit -am "initial commit"
echo
echo "<?php

// extend parent themen" > wp-content/themes/YOUR_THEME/functions.php
git commit -am "functions.phpを空に"
hub create
git push -u origin master

cd ../wordpress
git submodule add [theme_repo_url] wp-content/themes/YOUR_THEME
git commit -am "テーマをサブモジュール化"
```

これで最低限の設定が完了です。  
あとは style.css などを編集して適宜書いてください。

プラグインを追加するときは、`wp-content/plugins`の中に add するだけです。

## ローカルから Git push するだけでデプロイ

いちいち ssh でログインして Git pull するのは面倒です。

ローカルから master ブランチに Git push するだけで、リモート側で git pull を自動的にかける  
という風にしたいです。

<span class="removed_link" title="http://blog.catatsuy.org/a/142">Git を使ってホームページを更新する | catatsuy の Blog</span>

リモートにログインして、bare リポジトリを作成  
その bare リポジトリ内の`post-recieve`を作成してコマンドを書きます

```shell
$ cd path/to/create/repo
$ mkdir wp
$ cd wp
$ git init --bare
$ cp hooks/post-update-sample hooks/post-update
$ vim hooks/post-recieve
```

```shell
(cd /path/to/docroot/repo && git --git-dir=. pull)
```

ドキュメントルートするディレクトリで ↑ のリポジトリを clone する  
Apache 側の設定とかは適宜やっといてください。

```shell
$ cd ~
$ git clone /path/to/bare/repo wp
```

ローカル側でリモートを指定

```shell
$ git remote add ssh://hoge@foo.jp/~/path/to/bare/repo
$ git push origin master
```

これでリモートに内容が反映されれば OK です。

ということで、Markdown で快適かつ簡潔に記事管理ができて、 テスト環境を作ったことで本番環境にいきなりバグを持っていくこともなくなりました。

今後とも、よろしくお願いします。
