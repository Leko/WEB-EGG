---
path: /post/create-site-with-github-pages-and-jekyll/
title: Githubページを作ってjekyll+Markdownで更新する方法
date: 2013-03-06T17:23:06+00:00
twitter_id:
  - "309659394369536002"
image: /images/2013/03/20130227_githubpages.jpg
categories:
  - やってみた
tags:
  - Github
  - jekyll
  - Markdown
---

js のライブラリや、ドキュメントのページを見ていると、  
よく**~~~.github.com**というアドレスを目にします。

このアドレスは何なんだろう。  
Github に認められしものの証なのだろうか。と調べてみたところ、  
Github がホスティングしてくれるサービス[Github Pages](http://pages.github.com/)という物でした。

手軽に始められるし、Markdown が使えてテンプレートも使えるという代物だったので  
使えるようにするまでの手順をまとめました。

<!--more-->

## 目標

今回の記事の目標は、  
「**Github ページを作成し、Markdown で更新する**」ことです。  
Markdown については、過去に書いた記事

> [プラグインを使わずに Markdown で Wordpress のブログを更新する（基礎編）](/post/write-post-with-markdown-without-plugin-beginner/)

を御覧ください。では早速始めます。

## 必要なもの

- Github アカウント
- gem

これだけです。  
Github への登録は、あらかじめ済ませておいて下さい。

なお、今回使用している gem のバージョンは**1.8.24**です。

## 手順

- Github ページ用のリポジトリを作る
- jekyll をインストール
- \_config.yml を編集
- default.html を編集
- index.md を編集
- プレビューしてみる
- Github にプッシュする

## Github ページを作る

Github ページは、リポジトリを作るだけで作成出来ます。

まず、<span class="removed_link" title="https://github.com/new">こちら</span>からリポジトリの作成画面へ行きます。

![preview - newrepo](/images/2013/02/db43eed4475be1f11013fbb3551bc634.png)

ここで、Repository name を、**USER*NAME.github.com***とします。  
この名前のリポジトリを作成すると、  
自動的に**http://USERNAME.github.com**にアクセスできるようになります。

USER_NAME の部分は、自分の Github の ID を入力して下さい。  
例えば私の場合は ID が**Leko**なので、**leko.github.com**を名前にします。  
大文字・小文字の区別はされないようです。  
ID に大文字が混じっている人も小文字で作りましょう。

Repository name を入力したら、適当な説明を入れて、push します。

リポジトリを作成したら、index.html を作成して、**完成！**  
と行きたいところですが、今回はテンプレートと Markdown を利用することが目標なので  
とりあえず index は作らずに、先へ行きましょう。

## jekyll をインストールする

テンプレート＋ Markdown を利用するためには、jekyll というライブラリを使います。

ターミナルを開いて、

```shell
$ cd ~
$ gem install jekyll
```

を実行します。インストール完了です。

## 必要なファイルを作成する

次に、先ほど作った USER_NAME.github.com フォルダへ移動します。 特に何もしていなければ、リポジトリは空のはずですので、

```
USER_NAME.github.com/
    - README.md
    - index.md
    - _config.yml
    - _layouts/
        - default.html
```

上記の構成でファイルを追加します。

ざっと説明すると、  
README.md は、Github でこのリポジトリを誰かが見つけた時の説明文  
index.md が、公開される html の元となるページ  
\_cofig.yml が、jekyll を使うための設定ファイル  
\_layouts/はテンプレート用のフォルダ  
default.html が、テンプレートファイルです。

このファイルをそれぞれ編集していきます。

## config.yml を編集する

config.yml は上でも言いましたが、jekyll で使うための設定ファイルです。  
これを適当なエディタで開き、

```yaml
auto: true
server: true
markdown: kramdown
```

と入力して保存します。  
設定について詳しく知りたい方は、[設定一覧](https://github.com/mojombo/jekyll/wiki/Configuration)を御覧ください。

## default.html を編集する

次に、\_layouts の中の**default.html**を編集します。  
これがテンプレートとなる HTML ファイルで、head タグの中身などは全部こちらへ書きます。 default.html を適当なエディタで開き、

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<title>Lekohub</title>
<!-- cssとかjsもここで読み込み -->
<link rel="stylesheet" href="css/common.css">
<script src="js/top.js"></script>
<div class="container"> {{ content }} </div>
```

と入力して、保存します。  
このファイルがページの枠組みとなって、  
`{{ content }}`の部分に、ページの中身が入ります。

ちなみに、色々とタグが省略されていますが、これで W3C が認める正常な HTML です。  
詳しくは、過去に書いた記事

> [「HTML のタグは一部省略可能」表示速度はどちらが早いのか調べてみた](/post/omit-close-tag-in-html/)

を御覧ください。

## index.md を編集する

最後に、index.md を編集します。 ここ部分は、default.html で`{{ content }}`と書いた部分にあたります。

index.md を適当なエディタで開き、Markdown 形式で入力します。

```
---
layout: default
---

# leko.github.com

とりあえず作ってみたGithubページ
----------------------------------------

ほげほげ
```

と入力して、保存。

ここで重要なのが、**layout: default**と上下の**—**です。  
`layout: default`と書くことで、先ほど書いた default.html が  
テンプレートとして読み込まれます。

## プレビューしてみる

では実際にプレビューしてみましょう。

再びターミナルを開いて、

```shell
$ cd (USER_NAME.github.comリポジトリへのパス)
$ jekyll
```

と入力します。すると、

```shell
Configuration from /Users/***/leko.github.com/_config.yml Auto-regenerating enabled: /Users/***/leko.github.com -> /Users/***/leko.github.com/_site [2013-02-26 22:38:59] regeneration: 7 files changed [2013-02-26 22:39:00] INFO WEBrick 1.3.1 [2013-02-26 22:39:00] INFO ruby 1.9.2 (2012-04-20) [x86_64-darwin11.4.2] [2013-02-26 22:39:00] INFO WEBrick::HTTPServer#start: pid=70965 port=4000
```

というのが表示されると思うので、  
ブラウザを開き、**http://localhost:4000**にアクセスします。

![preview - jekyll](/images/2013/02/ae0a03f273ee685b1d86a7361380b46b.png)

と表示されていれば完了です。  
Markdown がきちんと HTML に変換されているのがわかると思います。

## Github にプッシュする

今の状態で、**http://USER_NAME.github.com**にアクセスしても、  
まだ何も表示されないと思います。

今まで行った変更は、Github にプッシュすることで適用されます。

Github にプッシュしたら、もう一度**http://USER_NAME.github.com**にアクセスしてみて下さい。  
先ほど確認したページと同じように表示されていれば完了です。

たったこれだけの手順で、  
テンプレート＋ Markdown を使ったページ作成が出来ました。
