---
path: /post/how-to-test-api-server-with-api-spec/
title: APIドキュメントでAPIサーバをテストする
date: 2015-12-05T23:55:57+00:00
meaningless:
  - "yes"
dsq_thread_id:
  - "4309657236"
image: /images/2015/11/Screen-Shot-2015-12-05-at-11.56.30-PM.png
categories:
  - 効率化
tags:
  - API
  - API Blueprint
  - Dredd
  - Go
  - Nodejs
---

この記事は[Web API Advent calendar](http://qiita.com/advent-calendar/2015/web_api)と[Hamee Advent Calendar 2015](http://qiita.com/advent-calendar/2015/hamee)の 6 日目です。

SPA やハイブリットアプリを仕事でも趣味で作っているので、API サーバを実装する機会が増えています。  
手軽にしっかりしたドキュメントを書けて、かつ実装とドキュメントの整合性を保つのってコスト高いな…。と悩んでいます。

Web API のドキュメントといえば、[Swagger](http://swagger.io/)や[JSON-Schema](http://json-schema.org/)あたりが有名かと思います。  
例えば[Qiita の APIv2](https://qiita.com/api/v2/docs)は JSON-Schema を使用して書かれています。

今回はそれらとは違う[API Blueprint](https://apiblueprint.org/)というツールを使用して API ドキュメントを作成し、その API ドキュメントを自動テストとして実行できる[Dredd](https://github.com/apiaryio/dredd)というツールを使用し、  
**API ドキュメントを書いたら、API サーバのテストもできる** 方法を残します。

ついでに API Blueprint 形式のドキュメントをホスティングしてくれる[Apiary](https://apiary.io/)と Github を連携し、master にマージされたら公開されている API ドキュメントも最新になるというのもやってみます。

<!--more-->

## まえおき

今回作成したデモは [Leko/godemo](https://github.com/Leko/godemo) にて公開しています。  
今回作成した API ドキュメントは [こちら](http://docs.godemo.apiary.io/#)にて公開してます。

## API Blueprint で API ドキュメントを書く

今回はデモとして TODO アプリ用の API を作ってみます。

- GET /api/todos
  - 自分の TODO 一覧を取得する
  - completed パラメータを与えるとその状態の TODO のみ取得する。指定がなければどちらも取得する
- POST /api/todos
  - TODO を作成する

という 2 つの機能を持つ API サーバのドキュメントを書きます。

詳しい記述方法については[API Blueprint の仕様](https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md)を御覧ください。  
だいたい[こんな感じ](https://github.com/Leko/godemo/blob/master/apiary.apib)になるかと思います

書いたら、プロジェクト直下に`apiary.apib`というファイル名で保存しておきます。  
ファイルの内容は Markdown ですが、API Blueprint というフォーマットで記述しているため拡張子は`apib`です。

## API サーバを実装する

[Go に入門して Redis+Postgres なアプリを Heroku にデプロイするまで](/post/introduction-of-golang/) で作成した[Leko/godemo](https://github.com/Leko/godemo)リポジトリに書き足します

今回は Go の話ではないですし、先ほどの仕様の通りに作っただけなのでさっくり済ませます。

## Apiary に公開する

[Apiary](https://apiary.io/)は、API Blueprint で書かれた API ドキュメントをもとに

- ドキュメントページ(HTML)
- ↑ のホスティング
- 各 API を試せる playground
- 各 API を試せるサンプルソース
- 実装がなくても仕様があれば動くモックサーバ

などなどをまるっと生成してくれるサービスです。

オレオレドキュメントで作成・管理はかなり手間が大きいと思います。  
playground をいちいち作ったり、サンプルコードで複数言語に対応したり、見やすいドキュメントにしたり、書き手として一貫したドキュメントにすること、など実装のコストもメンテナンスのコストも高くつきます。

そんなつらみを Apiary が助けてくれます。  
保守コストを抑えつつ、見る人にとってより使いやすい、読みやすいドキュメントを作るための手段の一つだと思います。

## API ドキュメントで API サーバをテストする

早速テストしてみます。テストには Apiary が提供する dredd というツールを使用します。  
導入の注意点として、**Dredd 周りのツールが Node4 や 5 に対応しておらず、dredd を入れるためには node0.10 系が必要になります。** 古い…。

> [Error compiling on Mac OS X 10.10.5 #287](https://github.com/apiaryio/dredd/issues/287)  
> [Support for node v4.X #292](https://github.com/apiaryio/dredd/issues/292)

```shell
npm i -g dredd
```

テストの環境のセットアップは、Apiary の Tests タブに記述されています。

![Scree](/images/2015/12/Screen-Shot-2015-12-06-at-12.03.57-AM.png)

Go のサーバを起動しておき、書かれているとおりにコマンドを実行します。

```shell
dredd init # 省略,対話CLIがあります
dredd
```

![APIドキュメントでAPIサーバをテストする](/images/2015/11/Screen-Shot-2015-12-06-at-1.25.59-AM.png)

↑ こんな感じになります。  
さらに、 **Apiary の言うとおりに dredd init しておくと、そのテストの通知結果が集約される** ようになっています。

![APIドキュメントでAPIサーバをテストする](/images/2015/11/Screen-Shot-2015-12-06-at-1.27.02-AM.png)

立てておいた Go のサーバに対して HTTP リクエストが飛び、どんなレスポンスが返ってきたかをテストしてくれます。  
これで実装が変わっても、ドキュメントが変わってもコマンド一つで整合性を確認できます。

リクエストと対応するレスポンスのパターンを書けば書くほどテストケースが増えるので、  
**ドキュメントをしっかり書くことがテストのクオリティ向上、ひいてはプロダクトの質向上に繋がる** ところが、ドキュメントを書くモチベに繋がるなと感じます。

## Github と連携する

反映漏れや食い違いを起こさないために、  
API ドキュメントを Git で管理して、Github の master に push されたら Apiary のドキュメントに自動反映されるようにします。

Apiary のアカウント設定を開き、Github のアカウントと紐付けます。

![APIドキュメントでAPIサーバをテストする](/images/2015/12/Screen-Shot-2015-12-05-at-2.51.19-PM.png)

Apiary のドキュメントの設定を開き、Github と連携させる設定をしておきます

![Scree](/images/2015/11/Screen-Shot-2015-12-06-at-1.05.14-AM.png)

Github のリポジトリの設定を開き、Apiary を選択します。

![APIドキュメントでAPIサーバをテストする](/images/2015/12/Screen-Shot-2015-12-05-at-2.52.55-PM.png)

domain のところには、Apiary のドメインを設定します。写真の太字の箇所が入力すべき値です。

![Scree](/images/2015/12/Screen-Shot-2015-12-05-at-2.53.30-PM.png)

## まとめ

API Blueprint はまだ発展途上で、[Authorization に対応して欲しい](https://github.com/apiaryio/api-blueprint/issues/11)とか issue が上がっています。  
他にも Rate limit のテストなども、そもそも Api blueprint の仕様にその辺が存在しないので、別途テストを書くしかないと思います。

など細かな問題が色々残っていますが、効率よく質良く API サーバと API ドキュメントをメンテナンスしていくいい方法だと思いました。

> [RESTful API の記述標準化を目指す「Open API Initiative」をマイクロソフト、Google、IBM らが立ち上げ。Swagger をベースに － Publickey](http://www.publickey1.jp/blog/15/open_api_initiative.html)

最後に。↑ の記事の通り、先月くらいに[Open API Initiative](https://openapis.org/)という団体が結成したようです。  
名だたる企業たちがコアメンバーに入っているので、活動を追って行きたいと思います。
