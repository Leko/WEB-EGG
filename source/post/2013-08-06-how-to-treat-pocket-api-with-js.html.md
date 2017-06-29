---
path: /post/how-to-treat-pocket-api-with-js/
title: PocketのAPIをNodejsから扱う方法
date: 2013-08-06T23:41:15+00:00
twitter_id:
  - "364759464995340290"
image: /images/2013/08/b1125334129640eff3849005df488c531.png
categories:
  - やってみた
tags:
  - Nodejs
  - Pocket
---
こんにちは。
  
最近は湿度が高いですね。くせ毛持ちにはつらい毎日です。

今回は、
  
「あとで読む」サービスのPocketのAPIを扱えるようにして、
  
TwitterとかからPocketを操作できるものを作ろうと思い立ったので、調べてみました。

あと、Nodejsの記事が少ないなーと思ったので、
  
少しでも情報源を増やそうと思い、今回は**Nodejs**で実装していきます。

あくまで個人用の用途を想定しているので、
  
どっかの誰かに認証して使ってもらうサービスで使う場合は、今回の記事の対象外となります。

<!--more-->

Pocketのアプリを登録
----------------------------------------

まず、PocketのAPIを利用するには、Pocketにアプリケーションを登録しないといけません。
  
というわけで早速登録していきます。

  1. [Pocketのデベロッパーサイト](http://getpocket.com/developer/) に行く
  2. いつも使っているPocketのIDでログインする
  3. 左側のメニューの`APPS`>`Create a New App`を選択

すると、このような画面になると思うので、画像の説明の通り入力していきます。

<img src="/images/2013/08/Create-a-New-App1.png" alt="Create a New App" title="Create a New App.png" width="600" />

日本語に対応していないようで、日本語でアプリ名を入れたら文字化けしました。
  
なので、動作に影響はないと思うけど、半角英数のみで打っておいたほうが無難だと思います。

パーミッションは、自分用なので全部要求するようにしちゃいましょう。
  
**パーミッションは後で足りなくなっても、編集できません**。

アプリケーションを登録したら、
  
左側のメニューの`APPS`>`My Apps`に行き、今作ったアプリを選択します。

すると、上記のような感じに詳細情報が表示されます。 まず、パーミッションを確認します。
  
`Add`・`Modify`・`Retrieve`の３つが表示されていればOKです。

次に、`URL`を設定します。
  
このURLは、出来れば自分のページ（存在するページならどこでも）のURLを指定して下さい。
  
ここで設定したURLは、後々の説明で**リダイレクトURL**と出てきます。
  
メモっておいて下さい。

最後に、アクセストークンを取得するために必要な、
  
**CONSUMEY KEY**というのもメモっておいて下さい。

Pocketからアクセストークンを取得する
----------------------------------------

**APIを利用するには、今メモったCONSUMER KEYと、アクセストークンが必要です。**
  
アクセストークンを取得するためには、CONSUMER KEYが必要です。
  
では、早速取得していきます。

もしサービスにするなら、ごにょごにょとプログラムを書かないと行けないのですが、
  
今回は個人用なので、もっと簡単な方法でアクセストークンを入手します。

各種HTTPメソッドやURLパラメータをGUIから設定して送信できる
  
[Fetcher](https://itunes.apple.com/jp/app/fetcher/id440113616?mt=12)というアプリを使用していきます。

ちなみに、アクセストークンの取得についての公式ドキュメント(英語)はこちらです。
  
すでにアプリケーションを登録してCONSUMER KEYを取得済みなので、公式を参考に進める場合はStep2からになります。

> [Pocket Developer Program: Pocket Authentication API: Documentation](http://getpocket.com/developer/docs/authentication)

### 1. リクエストトークンを取得

まず、アプリの認証をするための**リクエストトークン**というものを取得します。

アクセスすべきURLは、``です。
  
使うHTTPメソッドは`POST`、必要なパラメータは、

  * consumer_key 
      * アプリを登録した際に設定したCONSUMER KEY
  * redirect_uri 
      * アプリを登録した際に設定したリダイレクトURL(パラメータはur**i**なので注意)

の２つです。

あと、ヘッダーに
  
`Content-Type=application/x-www-form-urlencoded`を指定してあげます。
  
これらを合わせると、

<img src="/images/2013/08/8223fde78c3ee79b98e79042f1607e04.png" alt="リクエストトークンを取得" title="リクエストトークンを取得.png" width="600" />

こんな感じになると思います。
  
Fetchを押してみると、以下の様なレスポンスが帰ってくると思います。

```
HTTP/1.1 200 OK ———————————REQUEST————————————– Content-Type = application/x-www-form-urlencoded Accept-Encoding = gzip Content-Length = 77 User-Agent = Fetcher 1.4 (Macintosh; Mac OS X 10.8.4; ja_US) ———————————RESPONSE———————————— Server = Apache/2.2.23 (Amazon) Status = 200 OK Content-Type = application/x-www-form-urlencoded X-Powered-By = PHP/5.3.20 X-Source = Pocket P3P = policyref=”/w3c/p3p.xml”, CP=”ALL CURa ADMa DEVa OUR IND UNI COM NAV INT STA PRE” Date = Tue, 06 Aug 2013 11:23:38 GMT Content-Length = 35 Cache-Control = private Connection = keep-alive code=XXXXXXXXXXXXXXXXXXX
```

一番下の行の、code=XXXXXXXXXXXXの部分を使います。
  
XXXXXXXX…としていますが、実際には英語と数字とハイフン混じりの文字列になっていると思います。
  
**このXXXXXXX…の部分が、リクエストトークンです**。

### 2. Pocketの認証画面へ移動

今取得したリクエストトークンを使って、アプリの認証画面へ移動します。

今回はFetcherではなくブラウザを使います。
  
ブラウザのアドレスバーに、 https://getpocket.com/auth/authorize?request_token=

**YOUR\_REQUEST\_TOKEN**&redirect_uri=**YOUR\_REDIRECT\_URI** 

と入力して下さい。 **YOUR\_REQUEST\_TOKEN**のところには、先ほど取得したリクエストトークンを、
  
**YOUR\_REDIRECT\_URI**のところには、先ほど設定したリダイレクトURLを入れます。

<img src="/images/2013/08/f91ab41bde5ae5e886c1a19bbcfd53ca.png" alt="こんな画面" title="こんな画面.png" width="600" />

上記のURLにブラウザからアクセスすると、こんな画面になるので、
  
`Authorize`をクリックします。

これで認証完了です。

### 3. アクセストークンを取得

やっとアクセストークンです。

認証が完了したら、
  
**先ほどのリクエストトークンと、CONSUMER KEYを利用して、アクセストークンを取得**します。

アクセスするURLは ``
  
HTTPメソッドは`POST`
  
パラメータは、

  * consumer_key 
      * アプリケーションのCONSUMER KEY
  * code 
      * 先ほど取得したリクエストトークン

これをFetcherに入れるとこんなかんじになります。

<img src="/images/2013/08/access_token.png" alt="Access token" title="access_token.png" width="600" />

上記内容でFetchボタンを押すと、

`access_token=XXXXXXXXXXXXXXXXXXXXXX&username=...`

というレスポンスが帰ってきていると思います。 この`access_token=`以降のXXXの部分をメモっておいて下さい。

これで、必要な処理は完了です。

PocketAPIを試してみる
----------------------------------------

APIの仕様についてはドキュメントを見ればわかるので、とりあえず使うだけ使ってみます。

APIの公式ドキュメントはこちら。

> [Pocket Developer Program: Pocket API Documentation](http://getpocket.com/developer/docs/overview)

自分がPocketに**保存した最新１件の記事を取得して、
  
その記事のタイトルとURLを表示**してみましょう。

ソースはこんな感じになると思います。

```javascript
(function(global, undefined) { “use strict”; var https = require(“https”), endpoint = “https://getpocket.com/v3/get”, param = “”; param += “consumer_key=YOUR_CONSUMER_KEY”; param += “&access_token=YOUR_ACCESS_TOKEN”; param += “&sort=newest”; param += “&count=1”; https.get(endpoint + “?” + serialize(param), function(res) { var response = “”; // データを受信したら res.on(“data”, function(buff) { response += buff.toString(); }); // データの受信が完了したら res.on(“end”, function() { var json = JSON.parse(response), p; for (p in json.list) { var item = json.list[p], title = item.resolved_title, url = item.resolved_url; console.log(title + “n” + url + “n”); } }); }); }(this)); 
```

これを実行してみると、こんな表示がされると思います。

<img src="/images/2013/08/aa4012ad6bc2891b4a3bdc99d8ae9c41.png" alt="Pocketから取得した結果" title="Pocketから取得した結果.png" width="548" />

Nodejsでの通信は割と**お手軽ではない**のですが、上記のように書いて通信出来ます。

APIクライアントの実装
----------------------------------------

上の例でとりあえずの通信は出来るのですが、上のままだとかなり使いにくいと思います。

ということで、PocketのAPIクライアントを書いてみました。

> [nodejs-pocket.js](https://gist.github.com/Leko/6164739)

アクセストークンは何らかの手段で取得済みという前提**（アクセストークンを取得する周りの処理は一切なし）**
  
の実装なので汎用性はあまりないと思いますが、

自分のPocketのデータを操作したい場合などに、ご活用いただけたらなーと思います。

使い方は、
  
上記のnodejs-pocket.jsをダウンロードした上で、下記のように使ってもらえます。 requireのパスは適宜変えて下さい。

```javascript
var Pocket = require(“./nodejs-pocket.js”), pocket = new Pocket({ consumer_key: “あなたのconsumer_key”, access_token: “あなたのaccess_token” }); // Pocketから取得 var opt = { sort: “newest”, count: 10 }; pocket.get(opt, function(json) { // 記事の配列 }); // Pocketされている記事の情報変更 var opt = { actions: [ { “action”: “favorite”, “item_id”: 99999999 } ] }; pocket.modify(opt, function(json) { // 送信したアクションを行った結果 }); // Pocketに記事を追加 var opt = { url: “http://leko.jp”, title: “うぇぶえっぐ”, tags: “web,egg” }; pocket.add(opt, function(json) { // 記事をPocketに追加した結果 }); 
```

APIは、APIクライアント系のgem(Rubyだけど)によくある形に合わせてみたつもりですが、
  
改善点がございましたら、Gistの方にコメントいただけると嬉しいです。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>