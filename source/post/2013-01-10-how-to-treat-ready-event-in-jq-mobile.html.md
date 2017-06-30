---
path: /post/how-to-treat-ready-event-in-jq-mobile/
title: 'jQueryMobileでは$(function(){});ではなくpageinitとpageshowを使い分けるべき'
date: 2013-01-10T00:00:00+00:00
meaningless:
  - 'yes'
dsq_thread_id:
  - "3131683030"
image: /images/2013/01/20130110_eye1.jpg
categories:
  - 問題を解決した
tags:
  - jQuery
  - jQuery mobile
---

こんにちは。 jQueryMobileの1.2でwebアプリの開発を行なっているときに、 独自のJavaScriptを書く必要があったので、jQueryのように 

```javascript
$(function() {
  // write your program here.
})
```

 

という風に書けばいいのかと思ったら、見事にハマったので対応策をメモします。

<!--more-->

jQueryMobileのページ初期化について
----------------------------------------

ページ初期化以外の説明についてはこのエントリでは省略します。

> 重要：$(document).ready()ではなく pageinit() を使う
> 
> jQueryを学んで最初に覚えることは、コードを $(document).ready() に記述することでしょう。  
> DOMが読み込まれ使用可能になると、この関数は真っ先に呼ばれます。しかしながらjQuery Mobileにおいては、Ajaxによって各ページが読み込まれてコンテンツがDOMに追加されます。  
> そのため、DOMの ready ハンドラはサイトの最初のページを開いた時にしか呼ばれません。  
> 新しいページが読み込まれた際に毎回実行したい場合、その処理は pageinit イベントにバインドしてください。
> 
> <span class="removed_link" title="http://dev.screw-axis.com/doc/jquery_mobile/api/events/">イベント | jQuery Mobile 1.1.0 日本語リファレンス</span>

とあるように、jQueryMobileでは$(function(){});ではなく、 **pageinit**というハンドラで制御します。

pageinitのサンプル
----------------------------------------

pageinitを使ったコードはこのようになります。 なお、jQueryのバージョンは1.8.2となっています。 

```javascript
$(document).on('pageinit', '#selector', function() {
  //ここに処理を記述
});
```

 

#selectorの部分は、**data-role="page"**に対応するidです。適宜変更して下さい。

これで行けるぜやったー！と思っていたら、もう一つ罠が潜んでいました。 pageinitの中で、 ページが表示されるたびAjaxでリクエストを飛ばし、最新のデータを取得する という処理を書いていたのですが、**２回目以降の表示でAjaxが動いていません。** pageinitについて調べてみると、 pageinitは私の意図どおりの挙動をしていないことが分かりました。pageshow"> 

## pageinitとpageshowイベント<figure> 

<q>ページ表示時に発火するpageshowイベントやページのイニシャライズで1回だけ発生するpageinitイベントなど、ページ関連のイベントをうまく使ってください。 </q> <figcaption> <cite><a href="http://d.hatena.ne.jp/pikotea/20120405/1333631161" target="_blank">そろそろjQuery Mobileでajaxを無効にしてるやつに一言いっておくか – へっぽこプログラマーの日記</a></cite> </figcaption> </figure> 

こちらの記事にあるように、 pageinitイベントはページが最初に表示された時（＝１回目）しか発生しません。 ページが表示されるたびに実行したいスクリプトは、pageshowイベントを捕まえれば良いようです。 **イベント名で気づけよ・・・！** 集中を切らしていました。早速修正します

pageinitとpageshowを使い分ける
----------------------------------------

pageinitとpageshowを使い分けたサンプルが以下となります。 

```javascript
$(document).on('pageshow', '#selector', function() {
  //ページが表示されるたびに実行する
});
$(document).on('pageinit', '#selector', function() {
  //ページが初めて読み込まれたとき１回だけ実行する
});
```

 

例えば、 pageinitはスライドショーなどで使うHTMLの挿入（１回だけ必要）などに使い、 pageshowはGoogleAnalyticsの読み込みや、要素の座標等の調整（表示のたびに必要）などと使い分けることができるかな、と思います。 これで、目的の動作を達成できました。 初歩的なハマり方ですみません。。。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>