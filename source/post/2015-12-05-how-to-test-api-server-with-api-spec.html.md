---
path: /post/how-to-test-api-server-with-api-spec/
title: APIドキュメントでAPIサーバをテストする
date: 2015-12-05T23:55:57+00:00
meaningless:
  - 'yes'
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
この記事は[Web API Advent calendar](http://qiita.com/advent-calendar/2015/web_api)と[Hamee Advent Calendar 2015](http://qiita.com/advent-calendar/2015/hamee)の6日目です。

SPAやハイブリットアプリを仕事でも趣味で作っているので、APIサーバを実装する機会が増えています。  
手軽にしっかりしたドキュメントを書けて、かつ実装とドキュメントの整合性を保つのってコスト高いな…。と悩んでいます。

Web APIのドキュメントといえば、[Swagger](http://swagger.io/)や[JSON-Schema](http://json-schema.org/)あたりが有名かと思います。  
例えば[QiitaのAPIv2](https://qiita.com/api/v2/docs)はJSON-Schemaを使用して書かれています。

今回はそれらとは違う[API Blueprint](https://apiblueprint.org/)というツールを使用してAPIドキュメントを作成し、そのAPIドキュメントを自動テストとして実行できる[Dredd](https://github.com/apiaryio/dredd)というツールを使用し、  
**APIドキュメントを書いたら、APIサーバのテストもできる** 方法を残します。

ついでにAPI Blueprint形式のドキュメントをホスティングしてくれる[Apiary](https://apiary.io/)とGithubを連携し、masterにマージされたら公開されているAPIドキュメントも最新になるというのもやってみます。

<!--more-->

まえおき
----------------------------------------

今回作成したデモは [Leko/godemo](https://github.com/Leko/godemo) にて公開しています。  
今回作成したAPIドキュメントは [こちら](http://docs.godemo.apiary.io/#)にて公開してます。

## API BlueprintでAPIドキュメントを書く

今回はデモとしてTODOアプリ用のAPIを作ってみます。

  * GET /api/todos 
      * 自分のTODO一覧を取得する
      * completedパラメータを与えるとその状態のTODOのみ取得する。指定がなければどちらも取得する
  * POST /api/todos 
      * TODOを作成する

という2つの機能を持つAPIサーバのドキュメントを書きます。

詳しい記述方法については[API Blueprintの仕様](https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md)を御覧ください。  
だいたい[こんな感じ](https://github.com/Leko/godemo/blob/master/apiary.apib)になるかと思います

書いたら、プロジェクト直下に`apiary.apib`というファイル名で保存しておきます。  
ファイルの内容はMarkdownですが、API Blueprintというフォーマットで記述しているため拡張子は`apib`です。

APIサーバを実装する
----------------------------------------

[Goに入門してRedis+PostgresなアプリをHerokuにデプロイするまで](/post/introduction-of-golang/) で作成した[Leko/godemo](https://github.com/Leko/godemo)リポジトリに書き足します

今回はGoの話ではないですし、先ほどの仕様の通りに作っただけなのでさっくり済ませます。

Apiaryに公開する
----------------------------------------

[Apiary](https://apiary.io/)は、API Blueprintで書かれたAPIドキュメントをもとに

  * ドキュメントページ(HTML)
  * ↑のホスティング
  * 各APIを試せるplayground
  * 各APIを試せるサンプルソース
  * 実装がなくても仕様があれば動くモックサーバ

などなどをまるっと生成してくれるサービスです。

オレオレドキュメントで作成・管理はかなり手間が大きいと思います。  
playgroundをいちいち作ったり、サンプルコードで複数言語に対応したり、見やすいドキュメントにしたり、書き手として一貫したドキュメントにすること、など実装のコストもメンテナンスのコストも高くつきます。

そんなつらみをApiaryが助けてくれます。  
保守コストを抑えつつ、見る人にとってより使いやすい、読みやすいドキュメントを作るための手段の一つだと思います。

APIドキュメントでAPIサーバをテストする
----------------------------------------

早速テストしてみます。テストにはApiaryが提供するdreddというツールを使用します。  
導入の注意点として、**Dredd周りのツールがNode4や5に対応しておらず、dreddを入れるためにはnode0.10系が必要になります。** 古い…。

> [Error compiling on Mac OS X 10.10.5 #287](https://github.com/apiaryio/dredd/issues/287)
    
> [Support for node v4.X #292](https://github.com/apiaryio/dredd/issues/292)

```shell
npm i -g dredd
```

テストの環境のセットアップは、ApiaryのTestsタブに記述されています。

  

![Scree](/images/2015/12/Screen-Shot-2015-12-06-at-12.03.57-AM.png)



Goのサーバを起動しておき、書かれているとおりにコマンドを実行します。

```shell
dredd init # 省略,対話CLIがあります
dredd
```

  

![APIドキュメントでAPIサーバをテストする](/images/2015/11/Screen-Shot-2015-12-06-at-1.25.59-AM.png)



↑こんな感じになります。  
さらに、 **Apiaryの言うとおりにdredd initしておくと、そのテストの通知結果が集約される** ようになっています。

  

![APIドキュメントでAPIサーバをテストする](/images/2015/11/Screen-Shot-2015-12-06-at-1.27.02-AM.png)



立てておいたGoのサーバに対してHTTPリクエストが飛び、どんなレスポンスが返ってきたかをテストしてくれます。  
これで実装が変わっても、ドキュメントが変わってもコマンド一つで整合性を確認できます。

リクエストと対応するレスポンスのパターンを書けば書くほどテストケースが増えるので、  
**ドキュメントをしっかり書くことがテストのクオリティ向上、ひいてはプロダクトの質向上に繋がる** ところが、ドキュメントを書くモチベに繋がるなと感じます。

Githubと連携する
----------------------------------------

反映漏れや食い違いを起こさないために、  
APIドキュメントをGitで管理して、GithubのmasterにpushされたらApiaryのドキュメントに自動反映されるようにします。

Apiaryのアカウント設定を開き、Githubのアカウントと紐付けます。   

![APIドキュメントでAPIサーバをテストする](/images/2015/12/Screen-Shot-2015-12-05-at-2.51.19-PM.png)



Apiaryのドキュメントの設定を開き、Githubと連携させる設定をしておきます   

![Scree](/images/2015/11/Screen-Shot-2015-12-06-at-1.05.14-AM.png)



Githubのリポジトリの設定を開き、Apiaryを選択します。   

![APIドキュメントでAPIサーバをテストする](/images/2015/12/Screen-Shot-2015-12-05-at-2.52.55-PM.png)



domainのところには、Apiaryのドメインを設定します。写真の太字の箇所が入力すべき値です。   

![Scree](/images/2015/12/Screen-Shot-2015-12-05-at-2.53.30-PM.png)



まとめ
----------------------------------------

API Blueprintはまだ発展途上で、[Authorizationに対応して欲しい](https://github.com/apiaryio/api-blueprint/issues/11)とかissueが上がっています。  
他にもRate limitのテストなども、そもそもApi blueprintの仕様にその辺が存在しないので、別途テストを書くしかないと思います。

など細かな問題が色々残っていますが、効率よく質良くAPIサーバとAPIドキュメントをメンテナンスしていくいい方法だと思いました。

> [RESTful APIの記述標準化を目指す「Open API Initiative」をマイクロソフト、Google、IBMらが立ち上げ。Swaggerをベースに － Publickey](http://www.publickey1.jp/blog/15/open_api_initiative.html)

最後に。↑の記事の通り、先月くらいに[Open API Initiative](https://openapis.org/)という団体が結成したようです。  
名だたる企業たちがコアメンバーに入っているので、活動を追って行きたいと思います。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>