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
[画像をくっつけるツール](http://img-concater.herokuapp.com)という js で簡単な画像処理を行う SPA を作った時に、

URL を指定して画像を読み込んで結合する、という要件があり、  
この要件と canvas 周りでハマったので対象方法を残します。

<!--more-->

## 何が起きたか、なぜ起きるか

1. URL を img タグの src 属性にセット
2. 画像の読込が完了したら canvas に描画
3. canvas.toDataURL()で data uri に変換

という流れで処理をしようと目論んでいたのですが、3 でエラーが起きました。  
`Unable to get image data from canvas because the canvas has been tainted by cross-origin data.`

> [CORS Enabled Image](https://developer.mozilla.org/ja/docs/Web/HTML/CORS_enabled_image)

上記の記事に解説がありますが、外部ドメインのデータによって canvas が汚染されている、というエラーでした。

> [S3 上の画像を CORS を利用して Canvas で使う](http://tech-sketch.jp/2013/05/s3corscanvas.html)

上記の記事のように、画像サーバで CORS をわざわざ有効にしてくれるパターンはごく稀で、大体の場合この制限に引っかります。

## どう対処するか

- 返ってくるのは js ではなく画像のバイナリなので jsonp は使えない
- img タグに入れても外部 URL ならこの制限に引っかかる

ということで、自分のサーバをプロキシとして扱い、

- js から Url を送信
- サーバ(Go)でその URL の画像を取得しバイナリをレスポンス
- js でバイナリを画像に変換

として、自分のサーバから返されたバイナリなので制限を突破する、という作戦で行きます。

もちろんセキュリティ上の制限を無理やり超えるので、ブラウザの脆弱性を突かれる可能性があります。ご留意の上ご使用下さい。  
以下に具体的な手段を載せます。

> 今回の場合、セッションを持っておらず、URL パラメータに対しても反応しないので、悪意のある URL を誰かに踏ませることは出来ないので自分で悪意のある入力をして自分に攻撃をすることしかできない。iframe 埋め込みもさせないので、他人の PC へ攻撃はできない。という仮定で作っています。  
> もしレスポンスを受け取って echo するだけの処理に脆弱性があるならサーバ側がやられます。が仮にやられてもデータを保持しておらず、ソースコードは公開しているし、怖いのは改竄くらいですが、定期的にコンテナの破棄+git で管理されたソースでのコンテナ再構築 + 再起動がかかるので、まぁ大丈夫だろうという推定で動いています。

## 生 XHR を使用する or jQuery にオプションを足す

バイナリのレスポンスを受け取るには、XHR の responseType に`arraybuffer`を使用する必要があります。  
出ないと文字化けした良く分からないテキスト、がレスポンスになってしまいます。

なお Ajax のライブラリ(jQuery や[superagent](https://github.com/visionmedia/superagent)あたり)を使用している場合注意が必要です。

> [バイナリファイルを Ajax で取得する際に注意する点](http://qiita.com/tom_konda/items/484955b8332e0305ebc4)

なおソース読んでみた結果、superagent で arraybugfer の指定は現状使用できないです。

## 画像 URL を Go に投げ画像を取得しバイナリをレスポンス

Go で実装してますが、サーバ側は何の言語でも同じです。URL に対応する画像の中身を取得し、バイナリのレスポンスを吐きます。

## js でバイナリを受け取って Blob 化

responseType: arraybuffer で受け取ったレスポンスをバイナリに変換します。

```javascript
xhr.onreadystatechange = function() {
  // 判定略
  var buff = xhr.response;
  var blob = new Blob([buff], { type: ... });
}
```

引数は Arraybuffer の配列なのでご注意下さい。  
配列になっているのは複数の ArrayBuffer を指定できるためだそうです。

## Blob を img タグの src に指定する

[window.URL.createObjectURL()](https://developer.mozilla.org/ja/docs/Web/API/URL/createObjectURL)を使用して、バイナリを src 属性に指定可能な形式に変換します。  
この URL はいつでも使えるパーマリンクではなく、そのページを開いている間のみ有効なものなので、リロードすると使えなくなります。

## drawImage

Image オブジェクトに自分のサーバから返されたバイナリ(画像)がセットされたので、あとは普通に canvas で扱うだけです。

> [drawImage() メソッド – Canvas リファレンス – HTML5.JP](http://www.html5.jp/canvas/ref/method/drawImage.html)

CORS 制限を回避したので、canvas 内で加工した画像を書き出すことができるようになっています。
