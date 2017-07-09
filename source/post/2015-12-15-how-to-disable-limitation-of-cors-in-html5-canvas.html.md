---
path: /post/how-to-disable-limitation-of-cors-in-html5-canvas/
title: canvasのCORS制限を突破する
date: 2015-12-15T15:09:16+00:00
dsq_thread_id:
  - "4404948257"
categories:
  - 問題を解決した
tags:
  - HTML5 Canvas
  - JavaScript
  - security
---
こんにちは。  
[画像をくっつけるツール](http://img-concater.herokuapp.com)というjsで簡単な画像処理を行うSPAを作った時に、

URLを指定して画像を読み込んで結合する、という要件があり、  
この要件とcanvas周りでハマったので対象方法を残します。

<!--more-->

何が起きたか、なぜ起きるか
----------------------------------------

  1. URLをimgタグのsrc属性にセット
  2. 画像の読込が完了したらcanvasに描画
  3. canvas.toDataURL()でdata uriに変換

という流れで処理をしようと目論んでいたのですが、3でエラーが起きました。  
`Unable to get image data from canvas because the canvas has been tainted by
cross-origin data.`

> [CORS Enabled Image](https://developer.mozilla.org/ja/docs/Web/HTML/CORS_enabled_image)

上記の記事に解説がありますが、外部ドメインのデータによってcanvasが汚染されている、というエラーでした。

> [S3上の画像をCORSを利用してCanvasで使う](http://tech-sketch.jp/2013/05/s3corscanvas.html)

上記の記事のように、画像サーバでCORSをわざわざ有効にしてくれるパターンはごく稀で、大体の場合この制限に引っかります。

どう対処するか
----------------------------------------

  * 返ってくるのはjsではなく画像のバイナリなのでjsonpは使えない
  * imgタグに入れても外部URLならこの制限に引っかかる

ということで、自分のサーバをプロキシとして扱い、

  * jsからUrlを送信 
  * サーバ(Go)でそのURLの画像を取得しバイナリをレスポンス 
  * jsでバイナリを画像に変換 

として、自分のサーバから返されたバイナリなので制限を突破する、という作戦で行きます。

もちろんセキュリティ上の制限を無理やり超えるので、ブラウザの脆弱性を突かれる可能性があります。ご留意の上ご使用下さい。  
以下に具体的な手段を載せます。

> 今回の場合、セッションを持っておらず、URLパラメータに対しても反応しないので、悪意のあるURLを誰かに踏ませることは出来ないので自分で悪意のある入力をして自分に攻撃をすることしかできない。iframe埋め込みもさせないので、他人のPCへ攻撃はできない。という仮定で作っています。  
> もしレスポンスを受け取ってechoするだけの処理に脆弱性があるならサーバ側がやられます。が仮にやられてもデータを保持しておらず、ソースコードは公開しているし、怖いのは改竄くらいですが、定期的にコンテナの破棄+gitで管理されたソースでのコンテナ再構築 + 再起動がかかるので、まぁ大丈夫だろうという推定で動いています。

## 生XHRを使用する or jQueryにオプションを足す

バイナリのレスポンスを受け取るには、XHRのresponseTypeに`arraybuffer`を使用する必要があります。  
出ないと文字化けした良く分からないテキスト、がレスポンスになってしまいます。

なおAjaxのライブラリ(jQueryや[superagent](https://github.com/visionmedia/superagent)あたり)を使用している場合注意が必要です。

> [バイナリファイルをAjaxで取得する際に注意する点](http://qiita.com/tom_konda/items/484955b8332e0305ebc4)

なおソース読んでみた結果、superagentでarraybugferの指定は現状使用できないです。

画像URLをGoに投げ画像を取得しバイナリをレスポンス
----------------------------------------

Goで実装してますが、サーバ側は何の言語でも同じです。URLに対応する画像の中身を取得し、バイナリのレスポンスを吐きます。

jsでバイナリを受け取ってBlob化
----------------------------------------

responseType: arraybufferで受け取ったレスポンスをバイナリに変換します。

```javascript
xhr.onreadystatechange = function() {
  // 判定略
  var buff = xhr.response;
  var blob = new Blob([buff], { type: ... });
}
```

引数はArraybufferの配列なのでご注意下さい。  
配列になっているのは複数のArrayBufferを指定できるためだそうです。

Blobをimgタグのsrcに指定する
----------------------------------------

[window.URL.createObjectURL()](https://developer.mozilla.org/ja/docs/Web/API/URL/createObjectURL)を使用して、バイナリをsrc属性に指定可能な形式に変換します。  
このURLはいつでも使えるパーマリンクではなく、そのページを開いている間のみ有効なものなので、リロードすると使えなくなります。

drawImage
----------------------------------------

Imageオブジェクトに自分のサーバから返されたバイナリ(画像)がセットされたので、あとは普通にcanvasで扱うだけです。

> [drawImage() メソッド – Canvasリファレンス – HTML5.JP](http://www.html5.jp/canvas/ref/method/drawImage.html)

CORS制限を回避したので、canvas内で加工した画像を書き出すことができるようになっています。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>