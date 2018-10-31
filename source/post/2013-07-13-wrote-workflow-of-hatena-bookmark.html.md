---
path: /post/wrote-workflow-of-hatena-bookmark/
title: 自分のはてブを検索できるAlfred Workflowを作った
date: 2013-07-13T22:02:59+00:00
twitter_id:
  - "356039204268019712"
image: /images/2013/07/201307131-604x270.jpg
categories:
  - 効率化
tags:
  - Alfred Workflows
  - PHP
  - はてなブックマーク
---

こんにちは。  
暑いですね。溶けて消えそうです。

最近、はてなブックマークの記事を、  
Pocket とか Evernote に送信せずに、ブックマークして放置  
ということが増えてきて、はてブが地味に溜まって来ました。

クライアントアプリも無いし、web は使いにくい（けどいい記事は集まる）ので、 手軽に検索できる物を作ってしまおうと、 **Alfred から自分のはてブの記事を検索できる Workflow**を作りました。

<!--more-->

## できること

名前は、**はてブ for Alfred**です。まんまです。 Alfred から自分のはてブした記事のタイトル検索ができます。

Alfred の Workflow の作り方については、先日書いた記事をご参照下さい。

> [Alfred2 の Worflows を自作して作業を効率化する \| WEB EGG](/post/improve-your-work-with-alfred/)

Workflow はこんな感じになっています。  
hatebu_set と hatebu というキーワードを設定しています。

![スクリーンショッ](/images/2013/07/dea9ecf6dfc71804e344c8c5c25187b3.png)

### ユーザ ID 登録

まず、前準備として**自分のはてブの ID を登録**します。  
ID を登録するには、`hatebu_set 登録したいユーザ名`と入力します。

![スクリーンショッ](/images/2013/07/064af0b3aec3668fe2e74fdc395dc2b4.png)

ユーザ ID の保存に成功すると通知センターから通知が来ると思います。

![スクリーンショッ](/images/2013/07/48d803ab954a226d7fd052ef1ee6a89d.png)

> tips  
> ユーザ ID さえ分かれば認証とか要らずに GET で rss を取得できるので、  
> 自分の ID じゃなくても登録できます。

### タイトル検索

ユーザ ID の登録が済んだら、検索できます。

記事検索をするには、 `hatena 検索したいワード`と入力します。

![スクリーンショッ](/images/2013/07/99b725f88bc6114fa54b393b4175d15c.png)

**大文字小文字は区別せずに検索**しています。

検索 Word に一致する記事があれば、リストで表示してくれます。  
読みたい記事を選択して Enter を押すと、該当記事のページへ飛べます。

記事の内容まで検索を書けているとものすごい時間がかかってしまうので、  
**記事のタイトルのみが検索対象**であることをご注意下さい。

## 注意点

致命的な弱点なのですが、  
この Worflow は**キャッシュ処理をしていません**。

検索 Word が打たれる度に、全ブックマークを取得してきて検索するので、 **ブックマーク数が多い or 回線が重いと、ものすごく応答速度が下がります**。

ヘビーユーザの方はご注意下さい。

## ソースコード

ソースコードは Gist に公開しています。  
今回も php で書いています。

地味に長いのでブログでは割愛します。

[Gist](https://gist.github.com/Leko/5990658)

## ダウンロード

Workflow のダウンロードはこちらからどうぞ！  
ダウンロードしてダブルクリックすればインポートできると思います。

[Dropbox &bull; はてぶ for Alfred.alfredworkflow](https://www.dropbox.com/s/0fmikugbmpndyvy/hatebu_for_alfred.alfredworkflow?dl=0)
