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
PocketとかEvernoteに送信せずに、ブックマークして放置  
ということが増えてきて、はてブが地味に溜まって来ました。

クライアントアプリも無いし、webは使いにくい（けどいい記事は集まる）ので、 手軽に検索できる物を作ってしまおうと、 **Alfredから自分のはてブの記事を検索できるWorkflow**を作りました。

<!--more-->

できること
----------------------------------------

名前は、**はてブ for Alfred**です。まんまです。 Alfredから自分のはてブした記事のタイトル検索ができます。

AlfredのWorkflowの作り方については、先日書いた記事をご参照下さい。

> [Alfred2のWorflowsを自作して作業を効率化する \| WEB EGG](/post/improve-your-work-with-alfred/)

Workflowはこんな感じになっています。  
hatebu_setとhatebuというキーワードを設定しています。

<img src="/images/2013/07/dea9ecf6dfc71804e344c8c5c25187b3.png" alt="スクリーンショット 2013 07 13 19 57 24" title="スクリーンショット 2013-07-13 19.57.24.png" border="0" width="600" height="280" />

### ユーザID登録

まず、前準備として**自分のはてブのIDを登録**します。  
IDを登録するには、`hatebu_set 登録したいユーザ名`と入力します。

<img src="/images/2013/07/064af0b3aec3668fe2e74fdc395dc2b4.png" alt="スクリーンショット 2013 07 13 21 42 20" title="スクリーンショット 2013-07-13 21.42.20.png" border="0" width="600" height="184" />

ユーザIDの保存に成功すると通知センターから通知が来ると思います。

<img src="/images/2013/07/48d803ab954a226d7fd052ef1ee6a89d.png" alt="スクリーンショット 2013 07 13 21 42 25" title="スクリーンショット 2013-07-13 21.42.25.png" border="0" width="347" height="110" />

> tips  
> ユーザIDさえ分かれば認証とか要らずにGETでrssを取得できるので、  
> 自分のIDじゃなくても登録できます。

### タイトル検索

ユーザIDの登録が済んだら、検索できます。

記事検索をするには、 `hatena 検索したいワード`と入力します。

<img src="/images/2013/07/99b725f88bc6114fa54b393b4175d15c.png" alt="スクリーンショット 2013 07 13 21 46 01" title="スクリーンショット 2013-07-13 21.46.01.png" border="0" width="600" height="244" />

**大文字小文字は区別せずに検索**しています。

検索ワードに一致する記事があれば、リストで表示してくれます。  
読みたい記事を選択してEnterを押すと、該当記事のページへ飛べます。

記事の内容まで検索を書けているとものすごい時間がかかってしまうので、  
**記事のタイトルのみが検索対象**であることをご注意下さい。

注意点
----------------------------------------

致命的な弱点なのですが、  
このWorflowは**キャッシュ処理をしていません**。

検索ワードが打たれる度に、全ブックマークを取得してきて検索するので、 **ブックマーク数が多い or 回線が重いと、ものすごく応答速度が下がります**。

ヘビーユーザの方はご注意下さい。

ソースコード
----------------------------------------

ソースコードはGistに公開しています。  
今回もphpで書いています。

地味に長いのでブログでは割愛します。

[Gist](https://gist.github.com/Leko/5990658)

ダウンロード
----------------------------------------

Workflowのダウンロードはこちらからどうぞ！  
ダウンロードしてダブルクリックすればインポートできると思います。

[Dropbox &bull; はてぶ for Alfred.alfredworkflow](https://www.dropbox.com/s/0fmikugbmpndyvy/hatebu_for_alfred.alfredworkflow?dl=0)

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>