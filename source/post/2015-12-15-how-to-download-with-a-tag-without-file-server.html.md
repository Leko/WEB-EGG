---
path: /post/how-to-download-with-a-tag-without-file-server/
title: aタグのdownload属性でサーバを介さずにファイルダウンロードする
date: 2015-12-15T18:00:32+00:00
dsq_thread_id:
  - "4347620759"
categories:
  - 問題を解決した
tags:
  - HTML5 Canvas
---

この記事は[HTML5 Advent calendar](http://qiita.com/advent-calendar/2015/html5)の 16 日目の記事です。

HTML5 から a タグに download という属性が指定可能になったようです。  
この属性が指定された a タグは、href 属性の値をブラウザで開くのではなく、リンク先をファイルとしてダウンロードします。

今まで canvas で画像を生成した画像など、js で生成したファイルをユーザに保存させるには`window.open`に data url を渡して新窓で表示させ、ユーザに右クリ等で保存してもらう方法しか知らなかったのですが、  
a タグの`download`属性がまさにやりたいことドンピシャだったので備忘録を残します。

<!--more-->

## デモ

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Using_the_download_attribute_to_save_a_canvas_as_a_PNG)にまさにドンピシャな[デモ](http://jsfiddle.net/codepo8/V6ufG/2/)があったので、自作デモは割愛します。  
canvas で生成した画像を新窓ではなくファイルダウンロードさせるデモです。

**このとき、サーバに対して一切リクエストを飛ばしていないことがポイントです**

## よいこと

- わざわざバイナリを echo するだけのサーバを立てなくて良い
- 上記の構築や管理・メンテの手間がなくなる
- js だけで完結するのでコードのまとまりが良くなる

あたりが個人的に良いと思うところです。

## js から a タグを生成し、ファイル名を指定してダウンロード

```javascript
function download(uri, filename) {
  filename = filename || "file";

  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;
  link.click();
}

download("data://text/html,Hello world!!", "dummy.html");
```

のように、location.href などと大差ないくらいの手軽さでサッと書けるのが魅力だと思います。  
これでフロントエンドだけで完結するアプリケーションがより作りやすくなりました。

## ブラウザ互換

[Can I use](http://caniuse.com/#search=download)によると、IE と Safari(Mac、iOS）は最新版でも動きません。  
Chrome、Firefox 限定のアプリケーションなどでは使用できそうです。  
あと機種に依りそうですが、Android のブラウザでは動作するようです。
