---
title: シンプルなHTTPサーバを実装して覚えるNode.jsにおけるHTTP over QUIC
date: '2020-10-25T08:19:35.194Z'
tags:
  - JavaScript
  - Node.js
  - HTTP/3
  - QUIC
---

少し出遅れましたが、Node.js v15がリリースされました :tada:  
色々新機能や破壊的変更が加わっておりますが、本記事はv15による変更点のまとめを目的とした記事ではないのでv15については公式のリリースノート等をご参照ください。

> &mdash; [Node.js v15.0.0 is here!. This blog was written by Bethany… | by Node.js | Oct, 2020 | Medium](https://medium.com/@nodejs/node-js-v15-0-0-is-here-deb00750f278)

Node.jsのコラボレータによる日本語のわかりやすい記事もあるのであわせてご覧ください。

- [Node.js v15 の主な変更点 - 別にしんどくないブログ](https://shisama.hatenablog.com/entry/2020/10/21/004612)  
- [10月20日にメジャーアップデートとしてリリースされたNode.js v15の紹介 | watilde's blog](https://blog.watilde.com/2020/10/20/node-js-v15/)  
- [npm v7の主な変更点まとめ | watilde's blog](https://blog.watilde.com/2020/10/14/npm-v7%E3%81%AE%E4%B8%BB%E3%81%AA%E5%A4%89%E6%9B%B4%E7%82%B9%E3%81%BE%E3%81%A8%E3%82%81/)  

まとめは以上にして本題です。**本記事ではv15にて新しく追加されたQUICとHTTP over QUIC（HTTP/3）について、簡単なサーバを実装することで実践的な理解を得る**ことを目的としています。  
この記事が「QUICやHTTP/3、名前は聞いたことあるし気にはなってるんだけどどこから始めれば...」と日々悩んでる方の助けになれば幸いです。この記事を読み終えた時点で、HTTP/3サーバを最低限実装でき、その後自分でコードを書き換えて試せるベース実装を手に入れる状態を目指します。  
まずはQUICおよびHTTP/3について軽く触れてから、QUICモジュールを利用する環境構築、HTTP3の動作確認などを交えつつ具体的な実装に入っていきたいと思います。なお仕様の解説や歴史の話をしだすと敷居が高くなるため、仕様の詳細には極力触れずに実装するために必要な知識にフォーカスしたいと思います。

## まえおき

当記事ではNode.jsのv15.0.1を前提にコードを書いています。また、Node.jsのQUICは登場したばかりで現在のStability indexはまだ[Stability: 1 - Experimental
](https://nodejs.org/dist/latest-v15.x/docs/api/documentation.html#documentation_stability_index)です。さらに、公式ドキュメントでQUIC and HTTP/3に触れているのですが**現在はTBDとだけ書いてあります。つまりUndocumentedなAPI**を当記事では扱います。後方互換のない破壊的変更が予告なく加わる可能性があります。本番環境での使用は当然推奨されていません。その前提で記事を読み進めてもらえればと思います。

> ## QUIC and HTTP/3
> HTTP/3 is an application layer protocol that uses QUIC as the transport.
> TBD
>
> &mdash; [QUIC and HTTP/3 | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html#quic_quic_and_http_3)

もしこの記事の内容が古くなり動かなかったらTwitter（[@L\_e\_k\_o](https://twitter.com/L_e_k_o)）等で教えてもらえると助かります。当記事ではこれらを前提に対象を設定しています。

- Node.jsを手元でビルドしたことがある（経験がない方は[ビルドガイド](https://github.com/nodejs/node/blob/master/BUILDING.md)からビルドしてみてください）
- Node.jsでHTTP/1.1のHTTPサーバを実装したことがある
- APIが全く安定してないことを承知の上でNode.jsのエッジなAPIを触りたい

## QUIC、HTTP over QUIC（HTTP/3）とは？

真面目に解説するとそれだけで一本の記事になるボリュームなので参考になったリンクをまとめるだけにします。  

- [日本語 - HTTP/3 explained](https://http3-explained.haxx.se/ja)
  - curl作者Daniel StenbergによるHTTP/3の解説を日本語に翻訳したもの。概要を掴むのにとてもいい
- [HTTP over QUICと、その名称について (HTTP3について) *2019年9月更新 - ASnoKaze blog](https://asnokaze.hatenablog.com/entry/2018/11/06/025016)
  - 言わずと知れたyukiさんによる日本語での解説。詳しく正確に書いてある

HTTP/1.1とHTTP/3はセマンティクスは同じであり、構文（と内部実装）は異なっています。そのため基本的な概念がわかればあとは脳内にあるHTTP/1~2の知識とマッピングしていけると思います。

一つだけ注意したいことは、**QUIC＝HTTP/3ではないということです。QUICを利用した新しいHTTPの仕様がHTTP/3でありイコールではありません。それはNode.jsで提供されたQUICにおいても同様です。**QUICはHTTP以外のプロトコルでも使用できるよう設計されています。また、Node.jsで提供されたQUIC APIはQUICそのものを扱う低レイヤのAPIです。そのためQUICを用いてHTTP/3サーバを実装するというイメージを持っておいてください。ここを混同するとドキュメントの読み方やトラブルシューティング時に混乱するので気をつけてください。

## QUICを使うためにNode.jsをビルドする

冒頭でも書いたようにQUICはまだExperimentalな機能のため、QUICを動作させるために必要なコードが標準のビルドから外されています。そのため、フラグをつけてNodeをビルドし直す必要があります。よくあるExperimentalな機能とは違い`--experimental-...`などのフラグを渡しても動作しません。また、執筆時点（2020/10/22）ではQUICに対応したDockerイメージもありません...
この時点でだいぶハードルが高くなりますが、やることは単にフラグつけていつも通りNode.jsをビルドするだけです。

```
$ cd /path/to/nodejs/node
$ ./configure --experimental-quic
$ make -j8
$ ./node -p -e "require('net').createQuicSocket"
[Function: createQuicSocket] <-- 表示されたらOK
$ node -p -e "require('net').createQuicSocket"
undefined <-- グローバルなnodeだとundefinedになる
```

同じ出力になれば完了です。早速サンプルコードを試してみましょう。**以後、`./node`と書いてある場合はローカルでビルドしたNode.jsを実行するという意味を持ちます。**グローバルにインストールされているQUIC対応してないnodeコマンドを起動しないようご注意ください。

## サーバを実装する

環境構築が終わったので本題です。さっそくサーバを実装しましょう。

### 要件定義

今回は静的なファイルを配信するサーバを実装します。このように起動できるhttp3-serve.jsを実装します。  

```
PORT=8888 PUBLIC_ROOT=$PWD ./node http3-serve.js
```

パラメータは２つです。本筋と関係のない処理や依存を増やしたくないため設定値はすべて環境変数から与えます。

- PORT: ポート番号
- PUBLIC_ROOT: 静的ファイルを配信するルートファイル
  - ファイルが存在すればそれを200で返す
  - リクエストされたパスがファイル以外（ex. ディレクトリ）だったら403を返す
  - リクエストされたパスが存在しなければ404を返す

### 自己証明書の作成
HTTP/3はHTTPSの通信が必須のためlocalhostであっても証明書が必要です。適当に証明書を作成して保存しておきます。

```
$ mkdir .certs
$ cd .certs
$ openssl genrsa 2024 > server.key
$ openssl req -new -key server.key -subj "/C=JP" > server.csr
$ openssl x509 -req -days 3650 -signkey server.key < server.csr > server.crt
$ cd -
$ ls .certs
server.crt      server.csr      server.key
```

### 実装
いよいよ実装です。先にコードの全容を載せます。
このjsはES Modules形式で記述しています。TypeScriptではありません。package.jsonに`"type": "module"`フィールドが設定されている前提で読んでください。

`// [数字] ...`と書いてあるところを順に触れていきます。

```js
// [1] このファイル外の設定について
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { createQuicSocket } from 'net'
import { lookup } from 'mime-types'

const { PORT, DOCUMENT_ROOT } = process.env

// [2] 証明書の読み込み
const key = await fs.readFileSync('./.certs/server.key')
const cert = await fs.readFileSync('./.certs/server.crt')

// [3] QUICソケットの初期化
const server = createQuicSocket({
  endpoint: { port: PORT },
  server: { key, cert, alpn: 'h3-29' },
})

// [4] sessionイベントを購読
server.on('session', async (session) => {
  // [5] streamイベントを購読
  session.on('stream', (stream) => {
    // [6] initialHeadersイベントでリクエストヘッダを受け取る
    stream.on('initialHeaders', (rawHeaders) => {
      // [7] ヘッダを扱いやすいよう整形
      const headers = new Map(rawHeaders)
      // [8] リクエストURLを扱いやすいよう変換
      const url = new URL(headers.get(':path'), 'https://localhost')
      const requestPath = path.join(DOCUMENT_ROOT, url.pathname)
      fsPromises
        .stat(requestPath)
        .then((stats) => {
          if (!stats.isFile()) {
            // [9] レスポンスヘッダを返す
            stream.submitInitialHeaders({
              ':status': '403',
            })
            stream.end()
            return
          }

          stream.submitInitialHeaders({
            ':status': '200',
            'content-length': stats.size,
            'content-type': lookup(requestPath) || 'application/octet-stream',
          })
          // [10] レスポンスボディを返す
          fs.createReadStream(requestPath).pipe(stream)
        })
        .catch((e) => {
          stream.submitInitialHeaders({
            ':status': '404',
          })
          stream.end()
        })
    })
  })
})

await server.listen()
console.log(`The socket is listening on :${PORT}`)
```

#### [1] このファイル外の設定について
Content-Typeヘッダを返すために[mime-types](https://www.npmjs.com/package/mime-types)というnpmパッケージを読み込んでいます。それ以外はすべてビルドインモジュールです。  
ES Modulesで書いてるためimport文が使用できます。

#### [2] 証明書の読み込み

```js
// [2] 証明書の読み込み
const key = await fs.readFileSync('./.certs/server.key')
const cert = await fs.readFileSync('./.certs/server.crt')
```

作成した自己証明書を読み込んでます。サーバを立てるにはserver.keyとserver.crtの２つが必要です。

#### [3] QUICソケットの初期化

```js
// [3] QUICソケットの初期化
const server = createQuicSocket({
  endpoint: { port: PORT },
  server: { key, cert, alpn: 'h3-29' },
})
```

重要な処理の１つです。各オプションについて解説します。  

- endpoint.port: バインドするポート番号
- server.key: \[2\]で読み込んだもの
- server.cert: \[2\]で読み込んだもの
- server.alpn: `h3-29`を指定することでHTTP/3のバージョン29を利用することを示す

特に`server.alpn`が重要で、このオプションには任意の値を指定できるのですが、一部の値（ex. `h3-29`）を指定した場合にQuicSessionやQuicStreamを内部的に扱う方法が変わります。  
createQuicSocket関数はQUICのためのAPIでありHTTP/3のためだけのAPIではないからです。

> QUIC uses the TLS 1.3 ALPN ("Application-Layer Protocol Negotiation") extension to identify the application level protocol that is using the QUIC connection. Every QuicSession instance has an ALPN identifier that must be specified in either the connect() or listen() options. ALPN identifiers that are known to Node.js (such as the ALPN identifier for HTTP/3) will alter how the QuicSession and QuicStream objects operate internally, but the QUIC implementation for Node.js has been designed to allow any ALPN to be specified and used.
>
> &mdash; [QuicSession and ALPN | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html#quic_quicsession_and_alpn)

最低限必要なオプションだけを説明しました。createQuicSocketに指定可能な全てのオプションは公式ドキュメントをご確認ください。

> &mdash; [createQuicSocket | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html#quic_net_createquicsocket_options)

#### [4] `session`イベントを購読

HTTP/3ではHTTP/1.1とは異なり複数のリクエストをやり取りするためのセッションを確立します。  
セッションを確立した後に具体的なリクエスト/レスポンスを繰り返し、セッションを終了します。そのためこのイベントが呼ばれた時点ではまだリクエストのハンドリングは開始していません。
コールバックに渡される引数は[QuicSession](TODO)です。

このQuicStreamは以下のような状態の変遷をとります。

TODO: ドキュメント

#### [5] `stream`イベントを購読

QuicSessionが確立した後にクライアントがストリームを作成した時に呼び出されます。
コールバックに渡される引数は[QuicStream](TODO)です。QuicStreamはDuplexストリームを実装しているためリクエストボディはこの値から読めます。

#### [6] `initialHeaders`イベントでリクエストヘッダを受け取る

```js
// [6] initialHeadersイベントでリクエストヘッダを受け取る
stream.on('initialHeaders', (rawHeaders) => {
```

QuicSessionが確立した後にクライアントがストリームを作成し、リクエストヘッダが届いた時に呼び出されます。このイベントが実質的なリクエストハンドラになります。
QuicStreamの`initialHeaders`イベントを購読することでリクエストヘッダを受け取れます。他にもXXX,YYYなどのイベントがありますが、HTTP/3サーバとして利用するには`initialHeaders`イベントだけ購読すればいいようです。

TODO:　ドキュメントの記述

ヘッダの中には、`:`から始まるXXXヘッダと呼ばれるものが混じっています。詳しくは仕様書を確認してください。今のところN種類しかないのでさほど苦労はないと思います。その中で特に利用するであろうXXXヘッダが`:method`と`:path`です。名前の通りで`:method`はHTTPメソッド、`:path`はリクエストされた`/`移行のパス（クエリ文字列含む）が格納されています。`rawHeaders`は`[['name1', 'value1'], ['name2', 'value2'], ...]`という形式になっており名前から値を引きにくいので値を整形します。

#### [7] ヘッダを扱いやすいよう整形

```js
stream.on('initialHeaders', (rawHeaders) => {
  // [7] ヘッダを扱いやすいよう整形
  const headers = new Map(rawHeaders)
```

Mapに適してる形式だったのでMapを利用しました。ただしこのやり方では同じ名前のヘッダが複数くるケースを想定していないため注意してください。

#### [8] リクエストURLを扱いやすいよう変換

```js
// [8] リクエストURLを扱いやすいよう変換
const url = new URL(headers.get(':path'), 'https://localhost')
const requestPath = path.join(DOCUMENT_ROOT, url.pathname)
```

リクエストヘッダの`:path`にはクエリ文字列も含まれているためそのままでは扱いにくいです。URLに変換してしまいましょう。
URLは絶対パスのみではパースができないため適当なbase（`https://localhost`）を第二引数に与えています。クエリパラメータにアクセスしたい場合は`url.searchParams.get('xxx')`のようにアクセスできます。

#### [9] レスポンスヘッダを返す
```js
// [9] レスポンスヘッダを返す
stream.submitInitialHeaders({
  ':status': '403',
})
stream.end()
```

`stream`イベントで受け取ったQuicStreamに対して`submitInitialHeaders`メソッドをコールすることでレスポンスヘッダを返せます。  
HTTPステータスコードは`:status`という名前でセットします。

何もボディを返さずにレスポンスを終了したい場合は続けて`end`メソッドをコールします。

#### [10] レスポンスボディを返す

```js
// [10] レスポンスボディを返す
fs.createReadStream(requestPath).pipe(stream)
```

QuicStreamはストリームです。リクエストボディの読み取りとレスポンスボディの書き込み両方に対応するためにstream.Duplexを実装しています。  
そのためファイルの内容をレスポンスしたければReadableなストリームを作りパイプしてあげればOKです。

もしストリームではない文字列を書き込む場合は`stream.write('...')`などを使用できます。この辺はストリームの基礎的な話なので詳しくは割愛します。

### 動作確認

最後に起動したサーバの動作確認をします。まず、サーバを起動すると以下のような出力になると思います。

```
$ PORT=8080 DOCUMENT_ROOT=$PWD ./node http3-serve.js 
The socket is listening on :8080
(node:10968) ExperimentalWarning: The QUIC protocol is experimental and not yet supported for production use
(Use `node --trace-warnings ...` to show where the warning was created)
```

#### HTTP/3に対応しているHTTPクライアント

現時点ではブラウザの対応状況は今ひとつです。iOS Safariで部分的にサポートされていたり、Google Chromeにてサポートされてるとの情報を得ましたが、少なくとも私の環境ではどちらも動作しませんでした。

https://caniuse.com/?search=quic

なお、ブラウザがHTTP/3に対応しているか否かはこちらから確認できます。

https://http3.is/

私の環境ではブラウザでの動作確認はできませんが、cURLがHTTP/3に対応していたので動作確認に利用しました。ただしcURLに関してもcurl自体をソースコードからビルドしなければならずややハードルが高いです。cURL公式のDockerイメージがあるのですが、HTTP/3に対応したタグはありませんでした。ということで今回は有志でHTTP/3対応したcURLのDockerイメージを配布してくれている[curlのHTTP/3通信をDocker上で使ってみる - Qiita](https://qiita.com/inductor/items/8d1bc0e95b71e814dbcf)を利用します。試しにhttp3.isに対してリクエストを送った結果の抜粋がこちらです。

```
$ docker run -it --rm ymuski/curl-http3 curl -v https://http3.is/ --http3
*   Trying 199.232.233.77:443...
* Sent QUIC client Initial, ALPN: h3-29,h3-28,h3-27
* Connected to http3.is (199.232.233.77) port 443 (#0)
* h3 [:method: GET]
* h3 [:path: /]
* h3 [:scheme: https]
* h3 [:authority: http3.is]
* h3 [user-agent: curl/7.73.0-DEV]
* h3 [accept: */*]
* Using HTTP/3 Stream ID: 0 (easy handle 0x55f88c209a20)
> GET / HTTP/3
> Host: http3.is
> user-agent: curl/7.73.0-DEV
> accept: */*
>
< HTTP/3 200
< content-length: 643
...
< via: 1.1 varnish
<

...
      <video playsinline autoplay muted loop width="500" height="500"><source src="/robot_http3_success_V3.mp4" type="video/mp4">
      Your browser does not support the video tag, but it does support HTTP/3!
      </video>
...
* Connection #0 to host http3.is left intact
```

HTTP/3で通信されてるのがログからわかります。また、ブラウザで開いた時とは返ってくるHTMLが違うのでOKそうです。

## さいごに

QUIC、HTTP/3を試せるようになったことで、エンバグしたりAPIの仕様に対して意見が出るかもしれません。Node.jsのコミュニティはオープンで誰でも開発・議論に参加できます。  
もしドキュメントの誤字脱字やAPIに対するフィードバック、仕様と実装が乖離しているなどの何かしらの問題を見つけたらチャンスと思ってIssueを作ってもらえればと思います。興味のある方は[nodejs/node](https://github.com/nodejs/node)リポジトリからぜひ参加してみてください。

業務で自前でHTTP/3サーバを実装するケースは多くないかもしれませんが、この記事がきっかけになれば幸いです。  
この記事ではほんのさわりの部分に触れたので、より突っ込んだ内容については追って記事を書けたらと思います。

## 参考情報

これらの一次情報が参考になりました。

- [QUIC | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html)
  - 公式ドキュメント
- [test/parallel/test-quic-http3-client-server.js](https://github.com/nodejs/node/blob/7657f62b1810b94acbe7db68089b608213b34749/test/parallel/test-quic-http3-client-server.js)
  - nodejs/nodeの中にあるテストコード

これらの二次情報も参考になりました。

- [A QUIC Update for Node.js](https://www.nearform.com/blog/a-quic-update-for-node-js/)
  - Node.jsにQUICを実装したJames Snellによる紹介記事、ただし記事内のAPIが古い
