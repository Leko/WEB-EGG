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
jsのライブラリや、ドキュメンテーションのページを見ていると、  
よく**~~~.github.com**というアドレスを目にします。

このアドレスは何なんだろう。  
Githubに認められしものの証なのだろうか。と調べてみたところ、  
Githubがホスティングしてくれるサービス[Github Pages](http://pages.github.com/)という物でした。

手軽に始められるし、Markdownが使えてテンプレートも使えるという代物だったので  
使えるようにするまでの手順をまとめました。

<!--more-->

目標
----------------------------------------

今回の記事の目標は、  
「**Githubページを作成し、Markdownで更新する**」ことです。  
Markdownについては、過去に書いた記事

> [プラグインを使わずにMarkdownでWordpressのブログを更新する（基礎編）](/post/write-post-with-markdown-without-plugin-beginner/)

を御覧ください。では早速始めます。

必要なもの
----------------------------------------

* Githubアカウント
* gem

これだけです。  
Githubへの登録は、あらかじめ済ませておいて下さい。

なお、今回使用しているgemのバージョンは**1.8.24**です。

手順
----------------------------------------

* Githubページ用のリポジトリを作る
* jekyllをインストール
* _config.ymlを編集
* default.htmlを編集
* index.mdを編集
* プレビューしてみる
* Githubにプッシュする

Githubページを作る
----------------------------------------

Githubページは、リポジトリを作るだけで作成出来ます。

まず、<span class="removed_link" title="https://github.com/new">こちら</span>からリポジトリの作成画面へ行きます。

![preview - newrepo](/images/2013/02/db43eed4475be1f11013fbb3551bc634.png)

ここで、Repository nameを、**USER_NAME.github.com_**とします。  
この名前のリポジトリを作成すると、  
自動的に**http://USERNAME.github.com**にアクセスできるようになります。

USER_NAMEの部分は、自分のGithubのIDを入力して下さい。  
例えば私の場合はIDが**Leko**なので、**leko.github.com**を名前にします。  
大文字・小文字の区別はされないようです。  
IDに大文字が混じっている人も小文字で作りましょう。

Repository nameを入力したら、適当な説明を入れて、pushします。

リポジトリを作成したら、index.htmlを作成して、**完成！**  
と行きたいところですが、今回はテンプレートとMarkdownを利用することが目標なので  
とりあえずindexは作らずに、先へ行きましょう。

jekyllをインストールする
----------------------------------------

テンプレート＋Markdownを利用するためには、jekyllというライブラリを使います。

ターミナルを開いて、

```shell
$ cd ~
$ gem install jekyll
```

を実行します。インストール完了です。

必要なファイルを作成する
----------------------------------------

次に、先ほど作ったUSER_NAME.github.comフォルダへ移動します。 特に何もしていなければ、リポジトリは空のはずですので、

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
README.mdは、Githubでこのリポジトリを誰かが見つけた時の説明文  
index.mdが、公開されるhtmlの元となるページ  
_cofig.ymlが、jekyllを使うための設定ファイル  
_layouts/はテンプレート用のフォルダ  
default.htmlが、テンプレートファイルです。

このファイルをそれぞれ編集していきます。

config.ymlを編集する
----------------------------------------

config.ymlは上でも言いましたが、jekyllで使うための設定ファイルです。  
これを適当なエディタで開き、

```yaml
auto: true
server: true
markdown: kramdown
```

と入力して保存します。  
設定について詳しく知りたい方は、[設定一覧](https://github.com/mojombo/jekyll/wiki/Configuration)を御覧ください。

default.htmlを編集する
----------------------------------------

次に、_layoutsの中の**default.html**を編集します。  
これがテンプレートとなるHTMLファイルで、headタグの中身などは全部こちらへ書きます。 default.htmlを適当なエディタで開き、

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

ちなみに、色々とタグが省略されていますが、これでW3Cが認める正常なHTMLです。  
詳しくは、過去に書いた記事

> [「HTMLのタグは一部省略可能」表示速度はどちらが早いのか調べてみた](/post/omit-close-tag-in-html/)

を御覧ください。

index.mdを編集する
----------------------------------------

最後に、index.mdを編集します。 ここ部分は、default.htmlで`{{ content }}`と書いた部分にあたります。

index.mdを適当なエディタで開き、Markdown形式で入力します。

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
`layout: default`と書くことで、先ほど書いたdefault.htmlが  
テンプレートとして読み込まれます。

プレビューしてみる
----------------------------------------

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
MarkdownがきちんとHTMLに変換されているのがわかると思います。

Githubにプッシュする
----------------------------------------

今の状態で、**http://USER_NAME.github.com**にアクセスしても、  
まだ何も表示されないと思います。

今まで行った変更は、Githubにプッシュすることで適用されます。

Githubにプッシュしたら、もう一度**http://USER_NAME.github.com**にアクセスしてみて下さい。  
先ほど確認したページと同じように表示されていれば完了です。

たったこれだけの手順で、  
テンプレート＋Markdownを使ったページ作成が出来ました。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>