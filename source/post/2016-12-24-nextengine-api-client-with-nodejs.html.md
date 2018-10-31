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
この記事は[Hamee Advent Calendar 2016](http://qiita.com/advent-calendar/2016/hamee)の 25 日目の記事です。

Hamee カレンダーの大トリを努めます。れこです。  
今回は敬虔たる[ネクストエンジン](http://next-engine.net/)(以下 NE と略します)開発者の皆様へクリスマスプレゼントです。  
NE の Nodejs 版 API クライアントを作成したので紹介させていただきたいと思います。

<!--more-->

## はじめに

作ったものはこちらです。  
インストール方法、詳しい使い方などもこのリポジトリを参照してください。

> [Leko/node-nextengine: Nextengine API for Nodejs](https://github.com/Leko/node-nextengine)

このクライアント、 **非公式** です。  
何度でも書きます。 **非公式** です。  
とある案件で Nodejs 使ったのですが、NE API のクライアントが無かったので勝手にドッグフーディングしつつ作って公開したという感じです。

感覚的には GoogleAnalytics チームが公開している非公式プロダクト[autotrack](https://github.com/googleanalytics/autotrack)なんかと近いかな、と思っています。  
メンテナンスは私個人として行っていきますので、何かあれば PR や Issue にお願いします。

## 解消しようとした問題たち

NE API を利用していて、既存の SDK たちを見ていて思った問題点がこれら

- プログラム中に v1 という文字が入るのがキモい
- SQL っぽいクエリパラメータが扱いにくい
- 非同期アップロードが扱いにくい
- アクセストークンの取扱いが面倒
- 認可処理も癖があるので passport の Strategy も作って隠蔽したい

## プログラム中に v1 という文字が入るのがキモい

[NE API のリクエスト URL 一覧](http://api.next-e.jp/request_url.php)を見るとわかると思いますが、  
`/api_v1_receiveorder_base/count`のような感じでパスの途中に`v1`と思い切りバージョン番号が入っています。  
もしアプデかかったらどうするんだろう。一括置換でもするのだろうか。と不安があります。

例えば ChatWork のように`https://api.chatwork.com/v1`と、先頭に入ってくれていればまだ救いようがあるのですが、パスの途中は辛い。  
同じく非公式の[NE API Ruby 版 SDK](https://github.com/infinity-octaver/ne_api)はおそらく同じことを感じたのか回避されています。

ということでパスを隠蔽してコード内にバージョン番号が混じらないようにしました。

```javascript
const Nextengine = require("next-engine");
const { ReceiveOrder } = require("next-engine/Entity");

const client = new Nextengine({
  clientId: "XXXXXXXXXX",
  clientSecret: "XXXXXXXXXX",
  accessToken: "XXXXXXXXXX",
  refreshToken: "XXXXXXXXXX"
});
client
  .query(ReceiveOrder)
  .count()
  .then(count => console.log(count));
```

ゴリ押しですが、コード内にパスがハードコートされていて、バージョンアップが来たときに追従できないよりはマシだと思っています。  
これで仮にパスが変わってもライブラリ内部で吸収が可能です。

## SQL っぽいクエリパラメータが扱いにくい

[NE API の比較演算子一覧](http://api.next-e.jp/operator_compare.php)を見てもらえばわかると思いますが、  
割と柔軟に検索条件が組めるようになっています。  
ただし形式が SQL っぽい感じのフォーマットを矯正されるので結構扱いにくいと感じています。

SQL っぽいものが書けるのであれば、パラメータを頑張って作るのではなく、クエリビルダっぽい DSL で書けたら良いのでは。  
と思って作ってみました。

```javascript
const { Goods } = require("next-engine/Entity");
client
  .query(Goods)
  .where("goods_id", "abc")
  .limit(500)
  .offset(350)
  .get()
  .then(results => console.log(results));
```

まだ機能は少ない（`where`, `limit`, `offset`くらい）ですが、もしメソッドを足すとしたら[knex](http://knexjs.org/)というクエリビルダのライブラリの API に寄せていこうと思っています。

## 非同期アップロードが扱いにくい

1. アップロード API 叩く、キュー ID が帰ってくる
2. キュー ID を使ってキュー監視 API 叩く
3. キューが成功/失敗相当のステータスになっていればになっていれば処理完了

という操作が何箇所かあるのですが、扱いにくい。  
ですが js には Promise という非同期処理を抽象化する機構が用意されているので、

```javascript
const zlib = require("zlib");
const promisify = require("es6-promisify");
const stringify = promisify(require("csv-stringify"));
const deflate = promisify(zlib.deflate);
const { UploadQueue } = require("next-engine/Entity");

input = [["syohin_code", "jan_code"], ["abc", "1234567890"]];
stringify(input)
  .then(csv => deflate(csv))
  .then(gz => client.uploadAndWaitFor({ data_type: "gz", data: gz }))
  .then(() => console.log("Imported!"));
```

のように、`uploadAndWaitFor`というメソッドを用意して「アップロードして（ポーリングしながら結果を）待つ」処理を非同期化してみました。  
これ使うと楽ではあるのですが、プロセスを長いこと握ることになるので、ワーカージョブやバッチでしか使用を推奨できません。

それ以外の場合は`upload`メソッドと`waitFor`メソッドをそれぞれ別個に使用し、アップロードとキューの監視を別プロセスに分けるようにも作れます。

## アクセストークンの取扱いが面倒

NE API では、レスポンスに常にアクセストークンが含まれており、 **これが不定期に勝手に更新されます。**  
よく意味がわからないかもしれませんが、要はよくある OAuth2 風に

1. API を叩いたら「アクセストークンの期限が切れたよ」的なエラーが返ってくる
2. リフレッシュトークンを使ってアクセストークンをリフレッシュする API を叩く
3. 返ってきた認可情報で処理を継続する

という形式ではなく、「いつ変わるかわならないアクセストークンを API リクエスト１回ごとに考慮する」必要があります。  
こればかりは要件や実装によって保持・更新する方法が変わると思うので抽象化できませんでした。

とりあえず、`new Nextengine`したインスタンスは`accessToken`, `refreshToken`プロパティ経由で最新のアクセストークン・リフレッシュトークンを入手できます。

```javascript
const { Goods } = require("next-engine/Entity");
client
  .query(Goods)
  .where("goods_id", "abc")
  .limit(500)
  .offset(350)
  .get()
  .then(results => console.log(results));
```

もしくは、内部で使用している Connection クラスを拡張することでも対応可能です。

```javascript
const Nextengine = require("next-engine");
const Connection = require("next-engine/lib/Connection");

class MyConnection extends Connection {
  handleResponse(res) {
    super(res).then(json => json); // 何か拡張する
  }
}

class MyNextengine extends Nextengine {
  getConnection(accessToken, refreshToken) {
    return new MyConnection(accessToken, refreshToken);
  }
}
```

他にも PROXY 噛ませたりと共通で行いたい処理などがあれば上記方法で拡張可能です。

ちなみに HTTP クライアントは[node-fetch](https://github.com/bitinn/node-fetch)を(isomorphic-fetch 経由で)使用しています。  
最悪、上記方法で無理やり差し替えも可能です。

例えば、`NextEngine.on('refresh', ({ accessToken, refreshToken }) => ...)`みたいな API 設計も可能かなーと思ったんですが、  
イベントベースにするとトリッキーさが増してしまうのであえて作らないという方向に倒しました。

## 認可処理も癖があるので passport の Strategy も作って隠蔽したい

[ネクストエンジン API の認証について](http://api.next-e.jp/auth.php)のページに認証フローが書かれているのですが、  
何度見したか覚えてないとすら感じる不思議なフローです。

この認証フローをアプリごとにスクラッチするのは骨が折れるので、  
Nodejs アプリの認証レイヤを抽象化する[Passport](http://passportjs.org/)というライブラリに対応したストラテジーを作成しました。

> [Leko/passport-nextengine: Nextengine authentication strategy for Passport and Node.js](https://github.com/Leko/passport-nextengine)

これで認証方法の特殊さを気にすることなく、OAuth2 のストラテジー（Github とか）の感覚で扱えるようになります。

## まとめ

そもそもなんで作ったのかという話ですが、  
「Nodejs の公式 SDK 出てないから Node で作る選択肢がない」をぶち壊そうとしたというのが根幹にあります。  
その次に私自身が(Node)js が好きだから手に馴染んでいる言語で書けるように作っておいたという感じです。

ライブラリは機能はもちろんですが、ガワの設計が何より大事だと思っているので、自分が使いたい API クライアントを作りました。  
一度ベースを作ってしまえば必要に応じてリトライの考慮入れたりなんだりと強化していけるので、今後に期待していただければと思います。

繰り返しますが、 **非公式です** 。  
何かあればリポジトリの Issue にお願いします。もしくは PR ください！

## さいごに

ネクストエンジンには Developer Network (略して DevNet）という開発者向けコミュニティサイトがあります。  
ここには 開発ガイド 、 API リファレンス 、チュートリアルなど開発の役に立つ情報が盛りだくさんです。  
また開発者同士でディスカッションする コミュニティ もあります。  
わからないことがあれば こちら に質問を投稿してください。

ネクストエンジン Developer Networkwork  
<https://developer.next-engine.com/>
