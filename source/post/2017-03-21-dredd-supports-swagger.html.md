---
path: /post/dredd-supports-swagger/
title: HTTP APIのテストツールDreddがSwaggerに対応していたので試してみた
date: 2017-03-21T14:01:09+00:00
dsq_thread_id:
  - "5650978087"
image: /images/2017/03/dredd.png
categories:
  - やってみた
tags:
  - API
  - AWS API Gateway
  - Dredd
  - OpenAPI
  - Swagger
---
以前に

> [APIドキュメントでAPIサーバをテストする \| WEB EGG](http://leko.jp/archives/800)

という記事を書いたときに紹介した[Dredd](https://github.com/apiaryio/dredd)ですが、
  
いつのまにか自社サービスのApiaryだけでなくSwagger(OpenAPI v2)にも対応していたそうです。

ついでにロゴも洗練されてかっこよくなってます。

自分で書いた過去記事の末尾でも軽く触れていますが、
  
OpenAPI initiativeも未だ活動続いてますし、「乗るしか無い、このビッグウェーブに」といったところなんでしょうか。
  
なんにせよApiaryにロックインすることなく、Swaggerで記述した仕様書がテストできるようになったというのは嬉しいことなので早速試してみました。

<!--more-->

Dreddをインストール
----------------------------------------


READMEのとおりです。


```
npm install -g dredd
```


Swaggerのデモ仕様書を作成
----------------------------------------


まずはミニマムで試してみたいので、ドキュメントにあるやつをそのままパクります。

```yaml
swagger: "2.0"
info:
  version: "1.0"
  title: Example API
  license:
    name: MIT
host: www.example.com
basePath: /
schemes:
  - http
paths:
  /:
    get:
      produces:
        - application/json; charset=utf-8
      responses:
        200:
          description: ""
          schema:
            type: object
            properties:
              message:
                type: string
            required:
              - message
```


ちなみにOpenAPI v3([OpenAPI.nextブランチ](https://github.com/OAI/OpenAPI-Specification/tree/OpenAPI.next))には対応してないのか調べてみたのですが、してないようでした。
  
まぁまだスキーマ定義もサンプル仕様も存在しないし仕方ないと思います。

デモアプリ作成
----------------------------------------


同じくドキュメントからパクります。

```javascript
var app = require('express')();

app.get('/', function(req, res) {
  res.json({message: 'Hello World!'});
})

app.listen(3000);
```


ごく簡単なechoサーバです。

いざDredd実行
----------------------------------------


ドキュメント


```
$ dredd swagger.yml localhost:3000
info: Beginning Dredd testing...
pass: GET / duration: 56ms
complete: 1 passing, 0 failing, 0 errors, 0 skipped, 1 total
complete: Tests took 64ms
```


はい、いい感じです。さすがDredd。

## AWS API GatewayのデモAPIを使ってみる

もうちょい実用向けのサンプルも欲しいところです。
  
Swaggerといえば、[AWS API Gateway](https://aws.amazon.com/jp/api-gateway/)でしょう。
  
API Gatewayはデフォルトで[SwaggerのPetstore](http://petstore.swagger.io/)というサンプル仕様書を作成してくれます。
  
ということで、これもテストしてみます。

  1. AWSのコンソールでAPI Gatewayを有効化
  2. Petstore APIがデフォルトで入力されてるのでそのままインポート
  3. 作ったAPIをデプロイ
  4. Swaggerの仕様書をエクスポート

でAPIのエンドポイントとswaggerの仕様書を入手して、試してみます。
  
エクスポートした仕様書はYAML形式で`swagger.yml`というファイル名で保存しました。

`{XXXXXXXXXXX}`, `{STAGE}`は自分で入力した内容になります。


```
$ dredd swagger.yml https://{XXXXXXXXXXX}.execute-api.ap-northeast-1.amazonaws.com/{STAGE}
error: Compilation error in file 'swagger.yml': Required URI parameter 'petId' has no example or default value. ( > /beta/pets/{petId} > GET)
error: Compilation error in file 'swagger.yml': Required URI parameter 'petId' has no example or default value. ( > /beta/pets/{petId} > OPTIONS)
warn: Compilation warning in file 'swagger.yml': Ambiguous URI parameter in template: /beta/pets/{petId}
No example value for required parameter in API description document: petId ( > /beta/pets/{petId} > GET)
warn: Compilation warning in file 'swagger.yml': Ambiguous URI parameter in template: /beta/pets/{petId}
No example value for required parameter in API description document: petId ( > /beta/pets/{petId} > OPTIONS)
error: Error when processing API description.
```


あら。エラーになってしまいました。
  
PetStoreの仕様書自体に問題があるようです。

これを治すのは本筋じゃない感じがしたので、一旦ここまでで止めておきます。
  
API GatewayとLambdaをベースにしたサーバレスなAPIサーバとかも、簡単に受け入れテストできるようになるので、便利だと思います。
  
DreddがApiary(API Blueprint)ではなくSwaggerに対応したことは大きな意味を持つと思います。

尻切れトンボですみません。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>