---
title: Node.jsでHTTP over QUIC(HTTP/3)のサーバを実装する
date: '2020-10-25T08:19:35.194Z'
featuredImage: ./2020-10-26-21-50-02.png
tags:
  - JavaScript
  - Node.js
  - HTTP/3
  - QUIC
---

2020/10/20にNode.js v15がリリースされました :tada:  
色々新機能や破壊的変更が加わっているので、詳しくは公式のリリースノート等をご参照ください。

> &mdash; [Node.js v15.0.0 is here!. This blog was written by Bethany… | by Node.js | Oct, 2020 | Medium](https://medium.com/@nodejs/node-js-v15-0-0-is-here-deb00750f278)

また、Node.jsのコラボレータによる日本語のわかりやすい記事もあるのであわせてご覧ください。

- [Node.js v15 の主な変更点 - 別にしんどくないブログ](https://shisama.hatenablog.com/entry/2020/10/21/004612)  
- [10月20日にメジャーアップデートとしてリリースされたNode.js v15の紹介 | watilde's blog](https://blog.watilde.com/2020/10/20/node-js-v15/)  
- [npm v7の主な変更点まとめ | watilde's blog](https://blog.watilde.com/2020/10/14/npm-v7%E3%81%AE%E4%B8%BB%E3%81%AA%E5%A4%89%E6%9B%B4%E7%82%B9%E3%81%BE%E3%81%A8%E3%82%81/)  

まとめは以上にして本題です。本記事はv15の変更点まとめを目的とした記事ではなく、**v15にて新しく追加されたQUICを用いてシンプルなHTTP/3サーバを実装してHTTP over QUIC(HTTP/3)の使用感を掴む**ことを目的としています。この記事を読み終えると以下のものが手に入ります。

- Node.js v15にてQUICを使用できる開発環境
- ファイルをホスティングするシンプルなHTTP/3サーバの実装
- cURLで動作確認する方法

まずQUICおよびHTTP/3について軽くおさらいし、QUICモジュールを利用する環境構築を構築、HTTP/3サーバのデモコードと簡単な説明をして、最後にcURLを用いて動作確認します。仕様の詳細にはあまり触れずに実装するために必要な情報にフォーカスしたいと思います。

## まえおき

当記事ではNode.jsのv15.0.1を前提にコードを書いています。またQUICは登場したばかりで現在のStability indexは[Stability: 1 - Experimental
](https://nodejs.org/dist/latest-v15.x/docs/api/documentation.html#documentation_stability_index)、しかもHTTP over QUICについてはUndocumentedです。  
おそらくQUICをラップしたHTTP/3用の高レベルのAPIが今後登場するでしょうし、後方互換のない破壊的変更が予告なく加わる可能性もあります。ここで得た知識は陳腐化する前提でエッジなAPIをシュッと試したい方は読み進めてもらえればと思います。

なお、当記事ではこれらを前提に書いています。  

- Node.jsを手元でビルドしたことがある（経験がない方は[ビルドガイド](https://github.com/nodejs/node/blob/master/BUILDING.md)からビルドしてみてください）
- Node.jsでHTTP/1.1のHTTPサーバを実装したことがある

## QUIC、HTTP over QUIC（HTTP/3）とは？

真面目に解説するとボリュームがありすぎるので参考になったリンクを掲載します。概論をおさえておくと以後の理解がスムーズになると思います。  

- [日本語 - HTTP/3 explained](https://http3-explained.haxx.se/ja)
  - curl作者Daniel StenbergによるHTTP/3の解説を日本語に翻訳したもの。概要を掴むのにとてもいい
- [【図解】HTTP/3 (HTTP over QUIC) の仕組み〜UDPのメリット,各バージョンの違い(v1.0/v1.1/v2/v3)〜 | SEの道標](https://milestone-of-se.nesuke.com/l7protocol/http/http3-over-quic/)
  - 各バージョンが抱えていた問題点をQUICおよびHTTP/3がどう解決しているのかについて詳しく書いてあります
- [HTTP over QUICと、その名称について (HTTP3について) *2019年9月更新 - ASnoKaze blog](https://asnokaze.hatenablog.com/entry/2018/11/06/025016)
  - 言わずと知れたyukiさんによる日本語での解説。詳しく正確に書いてある

少なくとも注意したいことは、**QUIC＝HTTP/3ではないということです。QUICを利用した新しいHTTPの仕様がHTTP/3です。**QUICはHTTP以外のプロトコルでも使用できるよう設計されています。  
また、**Node.jsのQUICにおいても同様です。**QUICを扱う＝HTTP/3を扱うではありません。Node.jsで提供されたQUIC APIはQUICそのものを扱う低レイヤのAPIです。そのためQUICを用いてHTTP/3サーバを実装するというイメージを持っておいてください。ここを混同するとドキュメントの読み方やトラブルシューティング時に混乱します。

## 既存のHTTP/3のサイトを試す

実装を始める前に、既存のHTTP/3のサイトで動作確認の手法を確認します。ユーザエージェントがHTTP/3に対応しているかどうかはこちらのサイトから確認できます。  

https://http3.is

現時点ではHTTP/3のブラウザの対応状況は今ひとつです。iOS Safariでフラグつきでサポートされている、Google Chromeにてサポートされているとの情報を得ましたが、私の環境ではどちらも動作しませんでした。

https://caniuse.com/?search=quic

ブラウザでの動作確認はできないのでcURLを利用します。cURLでHTTP/3を利用するにはcURLをソースコードからビルドする必要があります。[cURL公式のDockerイメージ](https://hub.docker.com/r/curlimages/curl)にもHTTP/3に対応したタグはありませんでした。今回はHTTP/3対応したcURLのDockerイメージを配布されている[curlのHTTP/3通信をDocker上で使ってみる - Qiita](https://qiita.com/inductor/items/8d1bc0e95b71e814dbcf)を利用させてもらいます。試しに先ほど紹介した [http3.is](https://http3.is) に対してリクエストを送った結果の抜粋がこちらです。

```
$ docker run -it --rm ymuski/curl-http3 curl -v https://http3.is --http3
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
      Your browser does not support the video tag, but it does support HTTP/3!
...
* Connection #0 to host http3.is left intact
```

HTTP/3で通信されているのがわかります。HTTP/3に対応してる旨のHTMLが返ってきました。
次にサーバを実装し、このcurlコマンドで動作確認をします。

## Node.jsをビルドする

QUICを用いた開発をするためには環境構築が必要です。QUICはまだExperimentalな機能のため**フラグをつけてNodeをビルドし直す**必要があります。よくあるExperimentalな機能とは違い`--experimental-...`などのフラグをnodeコマンドに渡しても動作しません。また執筆時点（2020/10/22）ではQUICに対応したDockerイメージもありません。
手元でビルドするのは少しハードルが高いかもしれませんが、やることは単にフラグをつけていつも通りNode.jsをビルドするだけです。

```
$ cd /path/to/nodejs/node
$ ./configure --experimental-quic
$ make -j4 # コア数を指定すると早くなります
$ ./node -p -e "require('net').createQuicSocket"
[Function: createQuicSocket] # <-- 表示されたらOK
$ node -p -e "require('net').createQuicSocket"
undefined # <-- グローバルなnodeだとundefinedになる
```

`require('net').createQuicSocket`が存在していれば成功です。**以後、`./node`と書いてある場合はいまビルドしたNode.jsを実行するという意味を持ちます。**グローバルにインストールされているnodeコマンドを起動しないようご注意ください。

## 自己証明書の作成
QUICを使用するにはlocalhostであっても証明書が必須です。適当に自己証明書を作成しておきます。

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

## サーバを実装する

環境構築が終わったので本題です。さっそくサーバを実装します。

### 要件定義

今回は静的なファイルを配信するサーバを実装します。このように起動できるhttp3-serve.jsを実装します。  

```
PORT=8888 PUBLIC_ROOT=$PWD ./node http3-serve.js
```

パラメータは２つです。設定値はすべて環境変数で与えます。

- PORT: ポート番号
- PUBLIC_ROOT: 静的ファイルを配信するルートファイル
  - ファイルが存在すればそれを200で返す。`content-length`と`content-type`ヘッダも返す
  - リクエストされたパスが存在しなければ404を返す
  - リクエストされたパスがファイル以外（ex. ディレクトリ）だったら403を返す

### 実装
いよいよ実装です。先にコードの全容を載せます。
このjsはES Modules形式で記述しています。package.jsonに`"type": "module"`フィールドが設定されている前提で読んでください。

`// [数字] ...`と書いてあるところを順に触れていきます。  

```js
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { createQuicSocket } from 'net'
import { lookup } from 'mime-types'

const { PORT, DOCUMENT_ROOT } = process.env

const key = await fs.readFileSync('./.certs/server.key')
const cert = await fs.readFileSync('./.certs/server.crt')

// [1] QUICソケットの初期化
const server = createQuicSocket({
  endpoint: { port: PORT },
  server: { key, cert, alpn: 'h3-29' },
})

server.on('session', async (session) => {
  // [2] session, streamイベント
  session.on('stream', (stream) => {
    // [3] リクエストヘッダを受け取る
    stream.on('initialHeaders', (rawHeaders) => {
      const headers = new Map(rawHeaders)
      const url = new URL(headers.get(':path'), 'https://localhost')
      const requestPath = path.join(DOCUMENT_ROOT, url.pathname)
      fsPromises
        .stat(requestPath)
        .then((stats) => {
          if (!stats.isFile()) {
            // [4] レスポンスヘッダを返す
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
          // [5] レスポンスボディを返す
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

#### [1] QUICソケットの初期化

```js
// [1] QUICソケットの初期化
const server = createQuicSocket({
  endpoint: { port: PORT },
  server: { key, cert, alpn: 'h3-29' },
})
```

特に`server.alpn`が重要です。単にQUICを扱うなら任意の値が指定可能ですが、HTTP/3のサーバを立てたいのであれば値を`h3-29`にする必要があります。

> ALPN identifiers that are known to Node.js (such as the ALPN identifier for HTTP/3) will alter how the QuicSession and QuicStream objects operate internally, but the QUIC implementation for Node.js has been designed to allow any ALPN to be specified and used.
>
> &mdash; [QuicSession and ALPN | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html#quic_quicsession_and_alpn)

createQuicSocketに指定可能な全てのオプションは公式ドキュメントをご確認ください。

> &mdash; [createQuicSocket | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html#quic_net_createquicsocket_options)

#### [2] `session`, `stream`イベント

```js
server.on('session', async (session) => {
  // [2] session, streamイベント
  session.on('stream', (stream) => {
```

HTTP/3では１セッションで複数のリクエストをやり取りするためまずはセッションを確立します。セッションが開始されたときに`session`イベントが呼び出されます。コールバックの引数は[QuicSession](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html#quic_class_quicsession_extends_eventemitter)のインスタンスです。  
QuicSessionが確立した後にクライアントがストリームを作成した時に`stream`イベントが呼び出されます。コールバックの引数は[QuicStream](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html#quic_class_quicstream_extends_stream_duplex)のインスタンスです。基本的に１リクエストにつき１回このイベントが呼び出されます。

QuicSessionは以下の４つの状態のいずれかをとります。このうち`Initial`に相当するのが`session`イベントです。`Ready`に相当するのが次に紹介する`stream`イベントです。

> - Initial - Entered as soon as the QuicSession is created
> - Handshake - Entered as soon as the TLS 1.3 handshake between the client and server begins. The handshake is always initiated by the client
> - Ready - Entered as soon as the TLS 1.3 handshake completes. Once the QuicSession enters the Ready state, it may be used to exchange application data using QuicStream instances
> - Closed - Entered as soon as the QuicSession connection has been terminated
>
> &mdash; [Client and server QuicSessions | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html#quic_client_and_server_quicsessions)

QuicStreamはstream.Duplexを継承しているので、リクエストボディはこの値からstreamとして読み込めます。

#### [3] リクエストヘッダを受け取る

```js
// [3] リクエストヘッダを受け取る
stream.on('initialHeaders', (rawHeaders) => {
```

QuicSessionが確立した後にクライアントがストリームを作成し、リクエストヘッダが届いた時に呼び出されます。rawHeadersにはこのような値が格納されています。

```js
[
  [ ':method', 'GET' ],
  [ ':path', '/hoge' ],
  [ ':scheme', 'https' ],
  [ ':authority', 'host.docker.internal:8080' ],
  [ 'user-agent', 'curl/7.73.0-DEV' ],
  [ 'accept', '*/*' ]
]
```

`:`からヘッダは擬似ヘッダ（[Pseudo-Header Fields](https://tools.ietf.org/html/draft-ietf-quic-http-29#section-4.1.1.1)）と呼ぶそうです。特に利用するであろう擬似ヘッダは`:method`と`:path`です。名前から察する通りで`:method`はHTTPメソッド、`:path`はリクエストされたパス（クエリ文字列含む）が格納されています。リクエストボディが不要であればこの時点でリクエストを処理できます。

他にもヘッダに関するイベントがありますが、使い分けは以下の通りです。リクエストヘッダを受け取るには`initialHeaders`イベントを購読すれば良さそうです。

> - Informational Headers: Any response headers transmitted within a block of headers using a 1xx status code
> - Initial Headers: HTTP request or response headers
> - Trailing Headers: A block of headers that follow the body of a request or response
> - Push Promise Headers: A block of headers included in a promised push stream
> 
> &mdash; [QuicStream headers | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html#quic_quicstream_headers)

#### [4] レスポンスヘッダを返す
```js
// [4] レスポンスヘッダを返す
stream.submitInitialHeaders({
  ':status': '403',
})
stream.end()
```

`stream`イベントで受け取ったQuicStreamに対して`submitInitialHeaders`メソッドをコールすることでレスポンスヘッダを返せます。  
HTTPステータスコードは`:status`という擬似ヘッダでセットします。

ボディを返さずにレスポンスを終了する場合は`end`でストリームを閉じます。

#### [5] レスポンスボディを返す

```js
// [5] レスポンスボディを返す
fs.createReadStream(requestPath).pipe(stream)
```

QuicStreamはストリームです。リクエストボディの読み取りとレスポンスボディの書き込み両方に対応するためにstream.Duplexを継承しています。  
ファイルの内容をレスポンスしたければReadableなストリームを作りパイプするだけです。ストリームではない文字列を書き込む場合は`stream.write('...')`などを使用できます。この辺はストリームの基礎的な話なので詳しくは割愛します。  

駆け足ですが解説は以上です。次に作ったサーバの動作確認をします。

### 動作確認

最後に起動したサーバの動作確認をします。サーバが正常に起動すると以下のような出力になると思います。

```
$ PORT=8080 DOCUMENT_ROOT=$PWD ./node http3-serve.js 
The socket is listening on :8080
(node:10968) ExperimentalWarning: The QUIC protocol is experimental and not yet supported for production use
(Use `node --trace-warnings ...` to show where the warning was created)
```

curlコマンドを利用していくつかリクエストを飛ばしてみます。`host.docker.internal`はホスト側のlocalhostを参照するDockerの特殊なホスト名です。Linuxの方は適宜読み替えてください。

#### 正常系
まずは正常系です。ファイルが存在しているので200が返されます。

```
$ echo 'Hello world' > hello.txt # サーバを起動したディレクトリで適当なファイルを作る
$ docker run -it --rm ymuski/curl-http3 curl -v 'https://host.docker.internal:8080/hello.txt' --http3
*   Trying 192.168.65.2:8080...
* Sent QUIC client Initial, ALPN: h3-29,h3-28,h3-27
* Connected to host.docker.internal (192.168.65.2) port 8080 (#0)
* h3 [:method: GET]
* h3 [:path: /hello.txt]
* h3 [:scheme: https]
* h3 [:authority: host.docker.internal:8080]
* h3 [user-agent: curl/7.73.0-DEV]
* h3 [accept: */*]
* Using HTTP/3 Stream ID: 0 (easy handle 0x562874d14a40)
> GET /hello.txt HTTP/3
> Host: host.docker.internal:8080
> user-agent: curl/7.73.0-DEV
> accept: */*
>
< HTTP/3 200
< content-length: 12
< content-type: text/plain
<
Hello world
* Connection #0 to host host.docker.internal left intact
```

#### 異常系（404）
ファイルが存在しないパスにリクエストします。404が返されます。

```
$ docker run -it --rm ymuski/curl-http3 curl -v 'https://host.docker.internal:8080/xxx' --http3
*   Trying 192.168.65.2:8080...
* Sent QUIC client Initial, ALPN: h3-29,h3-28,h3-27
* Connected to host.docker.internal (192.168.65.2) port 8080 (#0)
* h3 [:method: GET]
* h3 [:path: /xxx]
* h3 [:scheme: https]
* h3 [:authority: host.docker.internal:8080]
* h3 [user-agent: curl/7.73.0-DEV]
* h3 [accept: */*]
* Using HTTP/3 Stream ID: 0 (easy handle 0x56541c3d9a30)
> GET /xxx HTTP/3
> Host: host.docker.internal:8080
> user-agent: curl/7.73.0-DEV
> accept: */*
>
< HTTP/3 404
* Connection #0 to host host.docker.internal left intact
```

#### 異常系２（403）
最後にリクエストしたパスがファイルではない場合のテストです。403が返されます。

```
$ mkdir dir # サーバを起動したディレクトリでディレクトリを作成する
$ docker run -it --rm ymuski/curl-http3 curl -v 'https://host.docker.internal:8080/dir' --http3
*   Trying 192.168.65.2:8080...
* Sent QUIC client Initial, ALPN: h3-29,h3-28,h3-27
* Connected to host.docker.internal (192.168.65.2) port 8080 (#0)
* h3 [:method: GET]
* h3 [:path: /dir]
* h3 [:scheme: https]
* h3 [:authority: host.docker.internal:8080]
* h3 [user-agent: curl/7.73.0-DEV]
* h3 [accept: */*]
* Using HTTP/3 Stream ID: 0 (easy handle 0x562fe362ba30)
> GET /dir HTTP/3
> Host: host.docker.internal:8080
> user-agent: curl/7.73.0-DEV
> accept: */*
>
< HTTP/3 403
* Connection #0 to host host.docker.internal left intact
```

## さいごに

本記事の内容は本当に最低限の処理しかないので、あとはドキュメントやソースコード、QUIC、HTTP/3の仕様書を読みながらいろいろ試してみてください。Node.jsの内部実装の話や、0-RTT・Server pushなどのHTTP/3の他の機能を試す記事も書けたら書こうと思います。ただ、冒頭にも書いた通り現時点ではまだUndocumentedなAPIなので、単に利用者として深く使い込むのは時期尚早だと思います。

Node.jsのコミュニティはオープンで誰でも開発・議論に参加できます。例えばドキュメントの誤字脱字やAPIに対するフィードバック、仕様と実装が乖離しているなどの何かしらの問題を見つけたらチャンスと思ってコントリビュートしてもらえればと思います。興味のある方は[nodejs/node](https://github.com/nodejs/node)リポジトリからぜひ参加してみてください。

## 参考情報

これらの一次情報が参考になりました。

- [QUIC | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html)
  - 公式ドキュメント
- [test/parallel/test-quic-http3-client-server.js](https://github.com/nodejs/node/blob/7657f62b1810b94acbe7db68089b608213b34749/test/parallel/test-quic-http3-client-server.js)
  - nodejs/nodeの中にあるテストコード

これらの二次情報も参考になりました。

- [A QUIC Update for Node.js](https://www.nearform.com/blog/a-quic-update-for-node-js/)
  - Node.jsにQUICを実装したJames Snellによる紹介記事、ただし記事内のAPIが古い
