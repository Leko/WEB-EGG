---
title: リバースプロキシを実装して覚えるNode.jsにおけるHTTP over QUIC
date: '2020-10-22T08:19:35.194Z'
tags:
  - JavaScript
  - Node.js
  - HTTP/3
  - QUIC
---

少し出遅れましたが、Node.js v15がリリースされました :tada:  
色々新機能や破壊的変更が加わっております。ただし本記事はv15による変更点のまとめを目的とした記事ではありません。v15については公式のリリースノート等をご参照ください。

> &mdash; [Node.js v15.0.0 is here!. This blog was written by Bethany… | by Node.js | Oct, 2020 | Medium](https://medium.com/@nodejs/node-js-v15-0-0-is-here-deb00750f278)

また、他のコラボレータによる日本語でわかりやすい記事もあるのであわせてご覧ください。

- [Node.js v15 の主な変更点 - 別にしんどくないブログ](https://shisama.hatenablog.com/entry/2020/10/21/004612)  
- [10月20日にメジャーアップデートとしてリリースされたNode.js v15の紹介 | watilde's blog](https://blog.watilde.com/2020/10/20/node-js-v15/)  
- [npm v7の主な変更点まとめ | watilde's blog](https://blog.watilde.com/2020/10/14/npm-v7%E3%81%AE%E4%B8%BB%E3%81%AA%E5%A4%89%E6%9B%B4%E7%82%B9%E3%81%BE%E3%81%A8%E3%82%81/)  

まとめは以上にして本題です。本記事ではv15にて新しく追加されたQUICとHTTP over QUIC（HTTP/3）について、小さなリバースプロキシサーバを実装することで実践的な理解を得ることを目的としています。  
この記事が「QUIC、名前は聞いたことあるし気にはなってるんだけどどこから始めれば...」みたいな方の助けになれば幸いです。

アプリケーションサーバの前段にNginxやその他SaaSなどのリバースプロキシが配置されており、そのリバースプロキシとクライアントがHTTP/2やHTTP/3でやりとりし、リバースプロキシとアプリケーションサーバはHTTP/1.1平文で通信するという構成が多いのではないかと思います。gRPCなどを使っている場合はHTTP/2をアプリケーションサーバでも利用することがあると思いますが、経験があるかないかは本記事の問題ではありません。経験がなかったとしても（HTTPに関する事前知識があること前提で）触って感覚を覚えてみましょうという記事になります。

まずはQUICおよびHTTP/3について軽く触れてから、QUICモジュールを利用する環境構築、HTTP3の動作確認方法などを交えつつ具体的な実装に入っていきたいと思います。

## まえおき

Node.jsのQUICはv15で登場したばかりで、現在のステータスはExperimentalです。当記事ではv15.0.0で使う前提でコードを書いています。  
もしこの記事の内容が古くなり動かなかったらTwitter（[@L\_e\_k\_o](https://twitter.com/L_e_k_o)）等で教えてもらえると助かります。

また、当記事ではこれらを前提に対象を設定しています。

- Node.jsを手元でビルドしたことがある（経験がない方は[ビルドガイド](https://github.com/nodejs/node/blob/master/BUILDING.md)からビルドしてみてください）
- Node.jsでHTTP/1.1のHTTPサーバを実装したことがある
- Nginxをリバースプロキシとして使ったことがある
- 仕様の詳細な解説や厳密な理解などは求めておらず、とりあえずHTTP/3のサーバを実装して試したい

## QUIC、HTTP over QUIC（HTTP/3）とは？

真面目に解説するとそれだけで一本の記事になるボリュームなので、あくまで参考になったリンクをまとめるだけにします。  

- [HTTP over QUICと、その名称について (HTTP3について) *2019年9月更新 - ASnoKaze blog](https://asnokaze.hatenablog.com/entry/2018/11/06/025016)
  - 言わずと知れたyukiさんによる日本語での解説
- [日本語 - HTTP/3 explained](https://http3-explained.haxx.se/ja)
  - curl作者Daniel StenbergによるHTTP/3の解説を日本語に翻訳したもの
- [Hypertext Transfer Protocol Version 3 (HTTP/3)](https://tools.ietf.org/id/draft-ietf-quic-http-23.html)
  - 本家

仕様を理解するのではなく単に利用するだけであればそこまで深い知識は必要になりません。HTTP/1.1とHTTP/3はセマンティクスは同じであり、構文（と内部実装）は異なっています。そのため基本的な概念がわかればあとは脳内にあるHTTP/1~2で覚えたこととマッピングしていくように理解できると思います。

一つ重要なことは、**QUIC＝HTTP/3ではありません。あくまでQUICを利用した新しいHTTPの仕様がHTTP/3**です。
QUIC自体はHTTP以外のプロトコルでも使用できるよう設計されています。ここを混同するとドキュメントの読み方やググる時にかなり混乱するので、少なくともそこを抑えておくと理解がスムーズだと思います。

## HTTP/3に対応しているHTTPクライアント

現時点ではブラウザの対応状況は今ひとつです。iOS Safariで部分的にサポートされていたり、Google Chromeにてサポートされてるとの情報を得ましたが、少なくとも私の環境ではどちらも動作しませんでした。

https://caniuse.com/?search=quic

お使いのブラウザがHTTP/3に対応しているか否かはこちらから確認できます。

https://http3.is/


**TODO:** docker run -it --rm ymuski/curl-http3 curl -v https://host.docker.internal:1234 --http3 -X GET

1. > &mdash; [curlのHTTP/3通信をDocker上で使ってみる - Qiita](https://qiita.com/inductor/items/8d1bc0e95b71e814dbcf)

## QUICを使うためにNode.jsをビルドする

冒頭でも書いたようにQUICはまだExperimentalな機能のため、QUICを動作させるために必要なコードが標準のビルドから外されています。そのため、フラグをつけてNodeをビルドし直す必要があります。他のExperimentalな機能と違い`--experimental-...`ってフラグを渡すだけでは動作しません。また、執筆時点（2020/10/22）ではQUICに対応したDockerイメージもありません。この時点でだいぶハードルが高くなりますが、やることは単にフラグつけていつも通りNode.jsをビルドするだけです。

```
$ cd /path/to/nodejs/node
$ ./configure --experimental-quic
$ make -j8
$ ./node -p -e "require('net').createQuicSocket"
[Function: createQuicSocket] <-- 表示されたらOK
$ node -p -e "require('net').createQuicSocket"
undefined <-- グローバルなnodeだとundefined
```

エラーが出なければ完了です。早速サンプルコードを試してみましょう。**以後、`./node`と書いてある場合はローカルでビルドしたNode.jsを実行するという意味です。グローバルにインストールされているQUIC対応してないnodeコマンドを起動しないようご注意ください**

## QUICを試す

では早速Node.jsのQUICを試してみましょう。[公式ドキュメントのサンプルコード](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html#quic_example)を実行してみます。
実行する前に、`getTLSKeySomehow`と`getTLSCertSomehow`を書き換える必要があります。このコードですね。

```js
const key = getTLSKeySomehow();
const cert = getTLSCertSomehow();
```

証明書が必要なので自己証明書を作ります。

```
mkdir .certs
cd .certs
openssl genrsa 2024 > server.key
openssl req -new -key server.key -subj "/C=JP" > server.csr
openssl x509 -req -days 3650 -signkey server.key < server.csr > server.crt
cd -
```

作った証明書を読み込むように書き換えた結果がこちらです。

```js
const key = fs.readFileSync('./.certs/server.key')
const cert = fs.readFileSync('./.certs/server.crt')
```

ビルドしたNode.jsで実行できたらビルドは成功です。
もし以下のようなエラーが出る場合、そもそもビルドに失敗しているか、ビルドしたnodeではなくグローバルにインストールされているnodeを参照している可能性があります。

```
```

## リバースプロキシを実装する

### 完成品
TODO: GitHubのリンク

### 要件定義

### 設定ファイル

### アプリケーションサーバをHTTP/1.1で実装する

### HTTP/3のリバースプロキシを実装する

### 動作確認

## さいごに

QUICはTCPの仕様的な限界を突破しWebの速度をさらに速くする可能性を秘めています。  
業務で自前でHTTP/3サーバを実装するケースは多くないかもしれませんが、参考になれば幸いです。  

Node.jsのコミュニティはオープンで誰でも開発・議論に参加できます。  
もしドキュメントの誤字脱字やAPIに対するフィードバック、仕様と実装が乖離しているなどの何かしらの問題を見つけたらチャンスと思ってIssueを作ってもらえればと思います。興味のある方は[nodejs/node](https://github.com/nodejs/node)リポジトリからぜひ参加してみてください。

## 参考情報

これらの一次情報が参考になりました。

- [QUIC | Node.js v15.0.1 Documentation](https://nodejs.org/dist/latest-v15.x/docs/api/quic.html) （公式ドキュメント）
- [test/parallel/test-quic-http3-client-server.js](https://github.com/nodejs/node/blob/7657f62b1810b94acbe7db68089b608213b34749/test/parallel/test-quic-http3-client-server.js) （nodejs/nodeの中にあるテストコード）

また、二次情報ですがこれらの記事も参考になりました。

- [A QUIC Update for Node.js](https://www.nearform.com/blog/a-quic-update-for-node-js/) （Node.jsにQUICを実装した本人による記事、ただし記事内のAPIが古い）
- [Try QUIC in Node.js on Docker - DEV](https://dev.to/nwtgck/try-quic-in-node-js-on-docker-l8c)

