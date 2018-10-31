---
path: /post/write-post-with-markdown-without-plugin-production/
title: AlfredにURLを貼り付けるとMarkdownのリンク形式にしてくれるWorkflowを作った
date: 2013-07-18T12:10:37+00:00
twitter_id:
  - "357699200990969857"
image: /images/2013/07/999a361dce77d9ba56a22b5eabc0143b1.png
categories:
  - 効率化
tags:
  - Alfred Workflows
  - PHP
---

こんにちは。先日、

> [プラグインを使わずに Markdown で Wordpress のブログを更新する（実践編） \| WEB EGG](/post/update-post/)

という記事を書いたのですが、**Markdown での記事作成がより捗る**ように  
Alfred にリンクさせたいページの URL を貼り付けるだけで、  
`[ページタイトル](リンクURL)`という形式でコピーが出来る Workflow  
**Markdown Link Generator**を作りました。

<!--more-->

## Markdown Link Generator の使い方

使い方は至って単純です。

Alfred に、リンクしたいページの URL を貼り付けるだけです。  
書式は、`md ページのURL`となります。

![スクリーンショッ](/images/2013/07/999a361dce77d9ba56a22b5eabc0143b.png)

ページの URL を貼り付けると、  
**ページのタイトルを取得して表示してくれる**ので、  
その後 Enter キーを押すと、クリップボードに Markdown の形式でコピーされてます。

分かりやすいように、  
**クリップボードにコピーされたら Growl 通知**を出すようにしています。

![スクリーンショッ](/images/2013/07/451adea10337f85b408c62469c9ba858.png)

コピーされたものを貼り付けるとこんな感じになります。

`[プラグインを使わずにMarkdownでWordpressのブログを更新する（基礎編） \| WEB EGG](/post/write-post-with-markdown-without-plugin-beginner/)`

記事を書くにあたって参考にしたページがあった時に、  
**そのページのタイトルと、URL を持ってくるのが結構面倒**で、  
自分で作ったものの中でも、かなり有り難みのあるものになっています。

## ソースコード

今回も PHP で実装しています。  
とは言っても、入力された URL の HTML を取得してきて、  
title タグにマッチする箇所を抜き出すだけです。

## ダウンロード

ダウンロードは<span class="removed_link" title="http://d.pr/f/7dQi">こちら</span>からどうぞ！ ダウンロードしたファイルをダブルクリックすればインポート出来ると思います。

> <span class="removed_link" title="http://d.pr/f/7dQi">Droplr &bull; Markdown Link Generator.alfredworkflow</span>

## こちらも併せてどうぞ

> [プラグインを使わずに Markdown で Wordpress のブログを更新する（基礎編） \| WEB EGG](/post/write-post-with-markdown-without-plugin-beginner/)
>
> [プラグインを使わずに Markdown で WordPress のブログを更新する（実践編） \| WEB EGG](/post/update-post/)
