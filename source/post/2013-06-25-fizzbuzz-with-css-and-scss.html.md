---
path: /post/fizzbuzz-with-css-and-scss/
title: CSSとSassでFizzBuzzしてみた
date: 2013-06-25T15:04:13+00:00
twitter_id:
  - "349410066178375680"
image: /images/2013/06/201306251.jpg
categories:
  - やってみた
tags:
  - CSS
  - fizzbuzz
  - SASS
---
完全にネタ記事です。
  
某合宿キャンプの選考にてFizzBuzzが出題されたそうなので、
  
CSSと、CSSメタ言語のSassでやってみました。

<!--more-->

FizzBuzzとは
----------------------------------------


FizzBuzzとは、プログラマーの小手調べだったり、お遊びだったりします。

> <q>1から100までの数をプリントするプログラムを書け。<br /> ただし3の倍数のときは数の代わりに「Fizz」と、5の倍数のときは「Buzz」とプリントし、3と5両方の倍数の場合には「FizzBuzz」とプリントすること。 <a href="http://d.hatena.ne.jp/keyword/Fizz%2DBuzz%CC%E4%C2%EA">Fizz-Buzz問題とは &#8211; はてなキーワード</a></q>
CSSのFizzBuzz
----------------------------------------


### サンプル

実行結果は[こちら](http://closet.leko.jp/2013/fizzbuzz/css.html)から見れます。

### コード

### コードの説明

普通にCSSを書くより汎用性があるかなと判断してmixin化してあります。
  
フォントサイズを引数にとることができ、デフォルトは18pxです。

CSS版では、CSS3のnth-childという擬似クラスを利用しています。

`nth-child(3n)`と書くことで、
  
はじめに登場する要素から数えて３つおきにスタイルを適用します。 nを付けることがポイントです。

これさえ分かれば、
  
3n、5n、15nと書けば良いように思えますが、冗長だと思います。

15の倍数は必ず3と5の倍数なので、
  
3nに`:before`、5nに`:after`を使うことで、 15nの時にFizzとBuzzを合体させることができます。

僕のFizzBuzzは、CSS3でないと実現出来ません。

有限数ならハードコーディングすればCSS2でも行けますが、
  
無限長のFizzBuzzがCSS2でも実現可能なら是非教えてください。

SassのFizzBuzz
----------------------------------------


### サンプル

実行結果は[こちら](http://closet.leko.jp/2013/fizzbuzz/sass.html)から見ることができます。

### コード

### コードの説明

こちらはループや条件分岐などの制御構造が扱えるので、
  
$contという空文字列を定義して結果を次々に入れていくだけです。

`$i % 3 == 0`や、`$i % 5 == 0`
  
とベーシックな方法でやってもいいのですが、 Sassにおけるリストを使ってみたかったのでそちらでやってみました。

**Sassのリストは添字が1から始まる**ことさえ気をつけていれば、 1~15までのFizzBuzzを用意して、あとはループを回すだけです。

剰余算を使わないSassのFizzBuzz
----------------------------------------


CSSでのFizzBuzzはそもそも演算を行なっていないので除外します。
  
Sassのほうで、先ほどの例ですと剰余算を使ってしまっていますね。

配列でFizzBuzzを回す概念が出来ていれば、 剰余算はただの簡易化に過ぎないのですが、
  
コード内に%があるのは負けです。

冗長だけど、剰余算を使わないFizzBuzzもSassで書いてみました。 あまりスマートではないですが、、書けました。

### コード

まとめ
----------------------------------------


如何でしたでしょうか？ CSSでも以外とやれるもんだなぁと思いました。

nth-childをあまり有効活用出来ていないので、
  
これからはもっと使えそうなタイミングを探してみようと思います。

Sassの@**はもはやプログラミング言語のそれ並なので、
  
mixinも、より効率よく、シンプルに書けそうです。

関連リンク
----------------------------------------


[Sass control directives: @if, @for, @each and @while &#8211; Intermediate](http://thesassway.com/intermediate/if-for-each-while#while)

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>