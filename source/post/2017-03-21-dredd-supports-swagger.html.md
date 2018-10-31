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

> [API ドキュメントで API サーバをテストする \| WEB EGG](/post/how-to-test-api-server-with-api-spec/)

という記事を書いたときに紹介した[Dredd](https://github.com/apiaryio/dredd)ですが、  
いつのまにか自社サービスの Apiary だけでなく Swagger(OpenAPI v2)にも対応していたそうです。

ついでにロゴも洗練されてかっこよくなってます。

自分で書いた過去記事の末尾でも軽く触れていますが、  
OpenAPI initiative も未だ活動続いてますし、「乗るしか無い、このビッグウェーブに」といったところなんでしょうか。  
なんにせよ Apiary にロックインすることなく、Swagger で記述した仕様書がテストできるようになったというのは嬉しいことなので早速試してみました。

<!--more-->

## Dredd をインストール

README のとおりです。

```
npm install -g dredd
```

## Swagger のデモ仕様書を作成

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

ちなみに OpenAPI v3([OpenAPI.next ブランチ](https://github.com/OAI/OpenAPI-Specification/tree/OpenAPI.next))には対応してないのか調べてみたのですが、してないようでした。  
まぁまだスキーマ定義もサンプル仕様も存在しないし仕方ないと思います。

## デモアプリ作成

同じくドキュメントからパクります。

```javascript
var app = require("express")();

app.get("/", function(req, res) {
  res.json({ message: "Hello World!" });
});

app.listen(3000);
```

ごく簡単な echo サーバです。

## いざ Dredd 実行

ドキュメント

```
$ dredd swagger.yml localhost:3000
info: Beginning Dredd testing...
pass: GET / duration: 56ms
complete: 1 passing, 0 failing, 0 errors, 0 skipped, 1 total
complete: Tests took 64ms
```

はい、いい感じです。さすが Dredd。

## AWS API Gateway のデモ API を使ってみる

もうちょい実用向けのサンプルも欲しいところです。  
Swagger といえば、[AWS API Gateway](https://aws.amazon.com/jp/api-gateway/)でしょう。  
API Gateway はデフォルトで[Swagger の Petstore](http://petstore.swagger.io/)というサンプル仕様書を作成してくれます。  
ということで、これもテストしてみます。

1. AWS のコンソールで API Gateway を有効化
2. Petstore API がデフォルトで入力されてるのでそのままインポート
3. 作った API をデプロイ
4. Swagger の仕様書をエクスポート

で API のエンドポイントと swagger の仕様書を入手して、試してみます。  
エクスポートした仕様書は YAML 形式で`swagger.yml`というファイル名で保存しました。

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
PetStore の仕様書自体に問題があるようです。

これを治すのは本筋じゃない感じがしたので、一旦ここまでで止めておきます。  
API Gateway と Lambda をベースにしたサーバレスな API サーバとかも、簡単に受け入れテストできるようになるので、便利だと思います。  
Dredd が Apiary(API Blueprint)ではなく Swagger に対応したことは大きな意味を持つと思います。

尻切れトンボですみません。
