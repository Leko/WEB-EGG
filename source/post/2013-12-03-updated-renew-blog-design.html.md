---
path: /post/updated-renew-blog-design/
title: ブログのデザインをリニューアルしました
date: 2013-12-03T01:25:02+00:00
image: /images/2013/12/renewal.jpg
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

リニューアルの目標
----------------------------------------

  1. ローカル側でMarkdown形式で記事を管理する
  2. ローカルにテスト環境を構築
  3. WordPressプロジェクトをGit管理する
  4. ローカルから`git push`するだけでデプロイ

とローカル管理＋Markdown周りの強化を行いました。

ローカル側でMarkdown形式で記事を管理する
----------------------------------------

基本的に当ブログは技術系のことを書いているので、  
コードの書きやすさと、記事の保守性が第一です。

記事をMarkdown管理する際に求めたものは、

  1. プラグインを使ってもいいのでローカル上では管理画面上ではMarkdown形式で書ける
  2. [Fenced Code Blocks](https://help.github.com/articles/github-flavored-markdown#fenced-code-blocks)(```` ```{言語名} ````)でシンタックスハイライトがかけられる
  3. パースによるパフォーマンス低下が起きた時のためにHTMLにも変換可能

の3点です。

ここまで手の届くプラグインなんてあるのかな、と探した所、  
上記を見事に叶えてくれるプラグインがありました。

[WordPress › Markdown on Save Improved &laquo; WordPress Plugins](http://wordpress.org/plugins/markdown-on-save-improved/)

上記を満たしていて、なおかつこのプラグイン何が有難いかというと、  
シンタックスハイライトは`Crayon Syntax Highlighter`**依存になっていること**です。

記事のコードを見やすく表現するためにちょうど使っているプラグインなので、  
そのまま流用・手書きと両立できるのが非常に嬉しい。

即導入して、今のところいい感じにつかえています。

ローカルにテスト環境を構築
----------------------------------------

お恥ずかしながら、  
今までWordpressをローカルに構築してテスト環境が構築できていませんでした。

データベースの連携がどうしても面倒で、  
インポート・エクスポートを使おうとしても一部エラーなどが起きるので信頼出来ないしで放置していました。

しかし、wordpressに使っているDBの、`wp_options`テーブルの2件のレコード

| option_name | option_value     |
| ----------- | ---------------- |
| home        | http://localhost |
| siteurl     | http://localhost |

となっている箇所をリモート用(leko.jp)に書き換えるだけで動作することが判明したので、  
ローカルDB→リモートDBの連携は意外と可能だと分かったのでローカル環境を構築しました。

> 2013/12/03追記
    
> と思っていたのですが画像のパス周りで多大なバグが発生していました。
    
> 2013/12/02近辺にアクセスされた方にはご不便をおかけいたしました。。。

WordPressプロジェクトをGit管理する
----------------------------------------

普通にWordpressをダウンロードしてきて、全体をプロジェクト管理しています。  
テーマファイルと、Gitでホスティングされているプラグインをサブモジュール化します。

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
あとはstyle.cssなどを編集して適宜書いてください。

プラグインを追加するときは、`wp-content/plugins`の中にaddするだけです。

## ローカルから Git push するだけでデプロイ

いちいちsshでログインしてGit pullするのは面倒です。

ローカルからmasterブランチにGit pushするだけで、リモート側でgit pullを自動的にかける  
という風にしたいです。

<span class="removed_link" title="http://blog.catatsuy.org/a/142">Gitを使ってホームページを更新する | catatsuyのBlog</span>

リモートにログインして、bareリポジトリを作成  
そのbareリポジトリ内の`post-recieve`を作成してコマンドを書きます

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

ドキュメントルートするディレクトリで↑のリポジトリをcloneする  
Apache側の設定とかは適宜やっといてください。

```shell
$ cd ~
$ git clone /path/to/bare/repo wp
```

ローカル側でリモートを指定

```shell
$ git remote add ssh://hoge@foo.jp/~/path/to/bare/repo
$ git push origin master
```

これでリモートに内容が反映されればOKです。

ということで、Markdownで快適かつ簡潔に記事管理ができて、 テスト環境を作ったことで本番環境にいきなりバグを持っていくこともなくなりました。

今後とも、よろしくお願いします。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>