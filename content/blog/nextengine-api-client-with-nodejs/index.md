---
path: /post/nextengine-api-client-with-nodejs/
title: ネクストエンジンAPIのNodejs版クライアント作った
date: 2016-12-24T23:50:33+00:00
dsq_thread_id:
  - "5389438748"
categories:
  - お知らせ
tags:
  - Nodejs
---
こんにちは。  
この記事は[Hamee Advent Calendar 2016](http://qiita.com/advent-calendar/2016/hamee)の25日目の記事です。

Hameeカレンダーの大トリを努めます。れこです。  
今回は敬虔たる[ネクストエンジン](http://next-engine.net/)(以下NEと略します)開発者の皆様へクリスマスプレゼントです。  
NEのNodejs版APIクライアントを作成したので紹介させていただきたいと思います。

<!--more-->

はじめに
----------------------------------------

作ったものはこちらです。  
インストール方法、詳しい使い方などもこのリポジトリを参照してください。

> [Leko/node-nextengine: Nextengine API for Nodejs](https://github.com/Leko/node-nextengine)

このクライアント、 **非公式** です。  
何度でも書きます。 **非公式** です。  
とある案件でNodejs使ったのですが、NE APIのクライアントが無かったので勝手にドッグフーディングしつつ作って公開したという感じです。

感覚的にはGoogleAnalyticsチームが公開している非公式プロダクト[autotrack](https://github.com/googleanalytics/autotrack)なんかと近いかな、と思っています。  
メンテナンスは私個人として行っていきますので、何かあればPRやIssueにお願いします。

解消しようとした問題たち
----------------------------------------

NE APIを利用していて、既存のSDKたちを見ていて思った問題点がこれら

  * プログラム中にv1という文字が入るのがキモい
  * SQLっぽいクエリパラメータが扱いにくい
  * 非同期アップロードが扱いにくい
  * アクセストークンの取扱いが面倒
  * 認可処理も癖があるのでpassportのStrategyも作って隠蔽したい

プログラム中にv1という文字が入るのがキモい
----------------------------------------

[NE APIのリクエストURL一覧](http://api.next-e.jp/request_url.php)を見るとわかると思いますが、  
`/api_v1_receiveorder_base/count`のような感じでパスの途中に`v1`と思い切りバージョン番号が入っています。  
もしアプデかかったらどうするんだろう。一括置換でもするのだろうか。と不安があります。

例えばChatWorkのように`https://api.chatwork.com/v1`と、先頭に入ってくれていればまだ救いようがあるのですが、パスの途中は辛い。  
同じく非公式の[NE API Ruby版SDK](https://github.com/infinity-octaver/ne_api)はおそらく同じことを感じたのか回避されています。

ということでパスを隠蔽してコード内にバージョン番号が混じらないようにしました。

```javascript
const Nextengine = require('next-engine')
const { ReceiveOrder } = require('next-engine/Entity')

const client = new Nextengine({
  clientId: 'XXXXXXXXXX',
  clientSecret: 'XXXXXXXXXX',
  accessToken: 'XXXXXXXXXX',
  refreshToken: 'XXXXXXXXXX'
})
client.query(ReceiveOrder).count()
  .then(count => console.log(count))
```

ゴリ押しですが、コード内にパスがハードコートされていて、バージョンアップが来たときに追従できないよりはマシだと思っています。  
これで仮にパスが変わってもライブラリ内部で吸収が可能です。

SQLっぽいクエリパラメータが扱いにくい
----------------------------------------

[NE APIの比較演算子一覧](http://api.next-e.jp/operator_compare.php)を見てもらえばわかると思いますが、  
割と柔軟に検索条件が組めるようになっています。  
ただし形式がSQLっぽい感じのフォーマットを矯正されるので結構扱いにくいと感じています。

SQLっぽいものが書けるのであれば、パラメータを頑張って作るのではなく、クエリビルダっぽいDSLで書けたら良いのでは。  
と思って作ってみました。

```javascript
const { Goods } = require('next-engine/Entity')
client.query(Goods)
  .where('goods_id', 'abc')
  .limit(500)
  .offset(350)
  .get()
  .then(results => console.log(results))
```

まだ機能は少ない（`where`, `limit`, `offset`くらい）ですが、もしメソッドを足すとしたら[knex](http://knexjs.org/)というクエリビルダのライブラリのAPIに寄せていこうと思っています。

非同期アップロードが扱いにくい
----------------------------------------

  1. アップロードAPI叩く、キューIDが帰ってくる
  2. キューIDを使ってキュー監視API叩く
  3. キューが成功/失敗相当のステータスになっていればになっていれば処理完了

という操作が何箇所かあるのですが、扱いにくい。  
ですがjsにはPromiseという非同期処理を抽象化する機構が用意されているので、

```javascript
const zlib = require('zlib')
const promisify = require('es6-promisify')
const stringify = promisify(require('csv-stringify'))
const deflate = promisify(zlib.deflate)
const { UploadQueue } = require('next-engine/Entity')

input = [
  ['syohin_code', 'jan_code'],
  [ 'abc', '1234567890' ]
]
stringify(input)
  .then(csv => deflate(csv))
  .then(gz => client.uploadAndWaitFor({ data_type: 'gz', data: gz }))
  .then(() => console.log('Imported!'))
```

のように、`uploadAndWaitFor`というメソッドを用意して「アップロードして（ポーリングしながら結果を）待つ」処理を非同期化してみました。  
これ使うと楽ではあるのですが、プロセスを長いこと握ることになるので、ワーカージョブやバッチでしか使用を推奨できません。

それ以外の場合は`upload`メソッドと`waitFor`メソッドをそれぞれ別個に使用し、アップロードとキューの監視を別プロセスに分けるようにも作れます。

アクセストークンの取扱いが面倒
----------------------------------------

NE APIでは、レスポンスに常にアクセストークンが含まれており、 **これが不定期に勝手に更新されます。**  
よく意味がわからないかもしれませんが、要はよくあるOAuth2風に

  1. APIを叩いたら「アクセストークンの期限が切れたよ」的なエラーが返ってくる
  2. リフレッシュトークンを使ってアクセストークンをリフレッシュするAPIを叩く
  3. 返ってきた認可情報で処理を継続する

という形式ではなく、「いつ変わるかわならないアクセストークンをAPIリクエスト１回ごとに考慮する」必要があります。  
こればかりは要件や実装によって保持・更新する方法が変わると思うので抽象化できませんでした。

とりあえず、`new Nextengine`したインスタンスは`accessToken`, `refreshToken`プロパティ経由で最新のアクセストークン・リフレッシュトークンを入手できます。

```javascript
const { Goods } = require('next-engine/Entity')
client.query(Goods)
  .where('goods_id', 'abc')
  .limit(500)
  .offset(350)
  .get()
  .then(results => console.log(results))
```

もしくは、内部で使用しているConnectionクラスを拡張することでも対応可能です。

```javascript
const Nextengine = require('next-engine')
const Connection = require('next-engine/lib/Connection')

class MyConnection extends Connection {
  handleResponse (res) {
    super(res)
      .then(json => json) // 何か拡張する
  }
}

class MyNextengine extends Nextengine {
  getConnection (accessToken, refreshToken) {
    return new MyConnection(accessToken, refreshToken)
  }
}
```

他にもPROXY噛ませたりと共通で行いたい処理などがあれば上記方法で拡張可能です。

ちなみにHTTPクライアントは[node-fetch](https://github.com/bitinn/node-fetch)を(isomorphic-fetch経由で)使用しています。  
最悪、上記方法で無理やり差し替えも可能です。

例えば、`NextEngine.on('refresh', ({ accessToken, refreshToken }) => ...)`みたいなAPI設計も可能かなーと思ったんですが、  
イベントベースにするとトリッキーさが増してしまうのであえて作らないという方向に倒しました。

認可処理も癖があるのでpassportのStrategyも作って隠蔽したい
----------------------------------------

[ネクストエンジンAPIの認証について](http://api.next-e.jp/auth.php)のページに認証フローが書かれているのですが、  
何度見したか覚えてないとすら感じる不思議なフローです。

この認証フローをアプリごとにスクラッチするのは骨が折れるので、  
Nodejsアプリの認証レイヤを抽象化する[Passport](http://passportjs.org/)というライブラリに対応したストラテジーを作成しました。

> [Leko/passport-nextengine: Nextengine authentication strategy for Passport and Node.js](https://github.com/Leko/passport-nextengine)

これで認証方法の特殊さを気にすることなく、OAuth2のストラテジー（Githubとか）の感覚で扱えるようになります。

まとめ
----------------------------------------

そもそもなんで作ったのかという話ですが、  
「Nodejsの公式SDK出てないからNodeで作る選択肢がない」をぶち壊そうとしたというのが根幹にあります。  
その次に私自身が(Node)jsが好きだから手に馴染んでいる言語で書けるように作っておいたという感じです。

ライブラリは機能はもちろんですが、ガワの設計が何より大事だと思っているので、自分が使いたいAPIクライアントを作りました。  
一度ベースを作ってしまえば必要に応じてリトライの考慮入れたりなんだりと強化していけるので、今後に期待していただければと思います。

繰り返しますが、 **非公式です** 。  
何かあればリポジトリのIssueにお願いします。もしくはPRください！

さいごに
----------------------------------------

ネクストエンジンには Developer Network (略してDevNet）という開発者向けコミュニティサイトがあります。  
ここには 開発ガイド 、 APIリファレンス 、チュートリアルなど開発の役に立つ情報が盛りだくさんです。  
また開発者同士でディスカッションする コミュニティ もあります。  
わからないことがあれば こちら に質問を投稿してください。

ネクストエンジン Developer Networkwork  
<https://developer.next-engine.com/>
