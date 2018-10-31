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
某合宿キャンプの選考にて FizzBuzz が出題されたそうなので、  
CSS と、CSS メタ言語の Sass でやってみました。

<!--more-->

## FizzBuzz とは

FizzBuzz とは、プログラマーの小手調べだったり、お遊びだったりします。

> <q>1 から 100 までの数をプリントするプログラムを書け。<br /> ただし 3 の倍数のときは数の代わりに「Fizz」と、5 の倍数のときは「Buzz」とプリントし、3 と 5 両方の倍数の場合には「FizzBuzz」とプリントすること。 <a href="http://d.hatena.ne.jp/keyword/Fizz%2DBuzz%CC%E4%C2%EA">Fizz-Buzz 問題とは – はてなキーワード</a></q>

## CSS の FizzBuzz

### サンプル

実行結果は[こちら](http://closet.leko.jp/2013/fizzbuzz/css.html)から見れます。

### コード

### コードの説明

普通に CSS を書くより汎用性があるかなと判断して mixin 化してあります。  
フォントサイズを引数にとることができ、デフォルトは 18px です。

CSS 版では、CSS3 の nth-child という擬似クラスを利用しています。

`nth-child(3n)`と書くことで、  
はじめに登場する要素から数えて３つおきにスタイルを適用します。 n を付けることがポイントです。

これさえ分かれば、  
3n、5n、15n と書けば良いように思えますが、冗長だと思います。

15 の倍数は必ず 3 と 5 の倍数なので、  
3n に`:before`、5n に`:after`を使うことで、 15n の時に Fizz と Buzz を合体させることができます。

僕の FizzBuzz は、CSS3 でないと実現出来ません。

有限数ならハードコーディングすれば CSS2 でも行けますが、  
無限長の FizzBuzz が CSS2 でも実現可能ならぜひ教えてください。

## Sass の FizzBuzz

### サンプル

実行結果は[こちら](http://closet.leko.jp/2013/fizzbuzz/sass.html)から見ることができます。

### コード

### コードの説明

こちらはループや条件分岐などの制御構造が扱えるので、  
$cont という空文字列を定義して結果を次々に入れていくだけです。

`$i % 3 == 0`や、`$i % 5 == 0`  
とベーシックな方法でやってもいいのですが、 Sass におけるリストを使ってみたかったのでそちらでやってみました。

**Sass のリストは添字が 1 から始まる**ことさえ気をつけていれば、 1~15 までの FizzBuzz を用意して、あとはループを回すだけです。

## 剰余算を使わない Sass の FizzBuzz

CSS での FizzBuzz はそもそも演算を行なっていないので除外します。  
Sass のほうで、先ほどの例ですと剰余算を使ってしまっていますね。

配列で FizzBuzz を回す概念が出来ていれば、 剰余算はただの簡易化に過ぎないのですが、  
コード内に％があるのは負けです。

冗長だけど、剰余算を使わない FizzBuzz も Sass で書いてみました。 あまりスマートではないですが、、書けました。

### コード

## まとめ

如何でしたでしょうか？ CSS でも以外とやれるもんだなぁと思いました。

nth-child をあまり有効活用できていないので、  
これからはもっと使えそうなタイミングを探してみようと思います。

Sass の@\*\*はもはやプログラミング言語のそれ並なので、  
mixin も、より効率よく、シンプルに書けそうです。

## 関連リンク

[Sass control directives: @if, @for, @each and @while – Intermediate](http://thesassway.com/intermediate/if-for-each-while#while)
