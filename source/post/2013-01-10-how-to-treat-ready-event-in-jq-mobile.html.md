---
path: /post/how-to-treat-ready-event-in-jq-mobile/
title: "jQueryMobileでは$(function(){});ではなくpageinitとpageshowを使い分けるべき"
date: 2013-01-10T00:00:00+00:00
meaningless:
  - "yes"
dsq_thread_id:
  - "3131683030"
image: /images/2013/01/20130110_eye1.jpg
categories:
  - 問題を解決した
tags:
  - jQuery
  - jQuery mobile
---

こんにちは。 jQueryMobile の 1.2 で web アプリの開発を行なっているときに、 独自の JavaScript を書く必要があったので、jQuery のように

```javascript
$(function() {
  // write your program here.
});
```

という風に書けばいいのかと思ったら、見事にハマったので対応策をメモします。

<!--more-->

## jQueryMobile のページ初期化について

ページ初期化以外の説明についてはこのエントリでは省略します。

> 重要：$(document).ready()ではなく pageinit() を使う
>
> jQuery を学んで最初に覚えることは、コードを $(document).ready() に記述することでしょう。  
> DOM が読み込まれ使用可能になると、この関数は真っ先に呼ばれます。しかしながら jQuery Mobile においては、Ajax によって各ページが読み込まれてコンテンツが DOM に追加されます。  
> そのため、DOM の ready ハンドラはサイトの最初のページを開いた時にしか呼ばれません。  
> 新しいページが読み込まれた際に毎回実行したい場合、その処理は pageinit イベントにバインドしてください。
>
> <span class="removed_link" title="http://dev.screw-axis.com/doc/jquery_mobile/api/events/">イベント | jQuery Mobile 1.1.0 日本語リファレンス</span>

とあるように、jQueryMobile では$(function(){});ではなく、 **pageinit**というハンドラで制御します。

## pageinit のサンプル

pageinit を使ったコードはこのようになります。 なお、jQuery のバージョンは 1.8.2 となっています。

```javascript
$(document).on("pageinit", "#selector", function() {
  //ここに処理を記述
});
```

#selector の部分は、**data-role="page"**に対応する id です。適宜変更して下さい。

これで行けるぜやったー！ と思っていたら、もう一つ罠が潜んでいました。 pageinit の中で、 ページが表示されるたび Ajax でリクエストを飛ばし、最新のデータを取得する という処理を書いていたのですが、**２回目以降の表示で Ajax が動いていません。** pageinit について調べてみると、 pageinit は私の意図どおりの挙動をしていないことが分かりました。pageshow">

## pageinit と pageshow イベント<figure>

<q>ページ表示時に発火する pageshow イベントやページのイニシャライズで 1 回だけ発生する pageinit イベントなど、ページ関連のイベントをうまく使ってください。 </q> <figcaption> <cite><a href="http://d.hatena.ne.jp/pikotea/20120405/1333631161" target="_blank">そろそろ jQuery Mobile で ajax を無効にしてるやつに一言いっておくか – へっぽこプログラマーの日記</a></cite> </figcaption> </figure>

こちらの記事にあるように、 pageinit イベントはページが最初に表示された時（＝１回目）しか発生しません。 ページが表示されるたびに実行したいスクリプトは、pageshow イベントを捕まえれば良いようです。 **イベント名で気づけよ…！** 集中を切らしていました。早速修正します

## pageinit と pageshow を使い分ける

pageinit と pageshow を使い分けたサンプルが以下となります。

```javascript
$(document).on("pageshow", "#selector", function() {
  //ページが表示されるたびに実行する
});
$(document).on("pageinit", "#selector", function() {
  //ページが初めて読み込まれたとき１回だけ実行する
});
```

例えば、 pageinit はスライドショーなどで使う HTML の挿入（１回だけ必要）などに使い、 pageshow は GoogleAnalytics の読み込みや、要素の座標等の調整（表示のたびに必要）などと使い分けることができるかな、と思います。 これで、目的の動作を達成できました。 初歩的なハマり方ですみません。。。
