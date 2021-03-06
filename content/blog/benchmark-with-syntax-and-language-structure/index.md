---
path: /post/benchmark-with-syntax-and-language-structure/
title: 'php5.4から使える[]での配列初期化と、array()との速度比較'
date: 2014-07-28T22:56:24+00:00
categories:
  - やってみた
tags:
  - benchmark
  - PHP
---
こんにちは。 PHP 5.4から、`[]`による配列の初期化ができるようになりました。

最近の言語やC言語ですら使える[]構文が今までPHPでは使用できませんでした。  
従来、PHPで配列を生成するには`array()`という関数を使用しなければなりませんでした。

`[]`が使えるようになったので疑問に思ったのですが、`array()`は[関数](http://php.net/manual/ja/function.array.php)です。

関数であれば多少なり呼び出しのオーバーヘッドがあるはず。  
その**オーバーヘッドを考慮したら`array()`で配列を初期化するより`[]`と書いたほうが高速なのでは？**

という疑問が出たので検証します。

<!--more-->

書き方
----------------------------------------

念のために、`[]`で配列をどう記述するのかサンプルをお見せします。

```php
<?php

// ~5.3での書き方
$list = array(1, 2, 3);
count($list);   // 3

// 5.4~での書き方
$list = [1, 2, 3];
count($list);   // 3

// もちろん連想配列も混合もOK
$list = ['a' => 1, 'b' => 2, 'c', 'd'];

// 混ぜてもOK
$list = array([1], [2], [3]);
$list = [array(1), array(2), array(3)];
```

添字配列の生成
----------------------------------------

では早速検証に移ります。

まずは添字配列です。  
ベーシックな例から試してみます。

### テストコード

テストコードは以下の通りです。

ベンチマーク用のコードは[モダンなPHPでのベンチマークの取り方](http://d.hatena.ne.jp/do_aki/20100202/1265126448)様からお借りしました。

```php
<?php

run(100000, array(
    'bracket-idx' => function() {
        $list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    },
    'function-idx' => function() {
        $list = array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    }
));
```

### ベンチマーク結果

| title        | total      | %       |
| ------------ | ---------- | ------- |
| bracket-idx  | 0.4750 sec | 100.00% |
| function-idx | 0.4964 sec | 104.49% |

**思ったより同速**。

**え？ こんなもん？**と思って10回ほど試してみたのですが、一番差が大きかったのがこの結果でした。  
だいたい100~102％くらいで落ち着きます。

オーバーヘッドが多少なりあるのかなと思っていましたが、  
もはや構文のような役割を兼ねているarray関数は最適化がかかってたりするんでしょうか。

連想配列の生成
----------------------------------------

では連想配列ではどうなるのでしょう。

### テストコード

先ほどと同じベンチマーク関数を利用しています。

```php
run(100000, array(
    'bracket-assoc' => function() {
        $list = ['a' => 0, 'b' => 1, 'c' => 2, 'd' => 3, 'e' => 4];
    },
    'function-assoc' => function() {
        $list = array('a' => 0, 'b' => 1, 'c' => 2, 'd' => 3, 'e' => 4);
    }
));
```

### ベンチマーク結果

| title          | total      | %       |
| -------------- | ---------- | ------- |
| bracket-assoc  | 0.4458 sec | 100.00% |
| function-assoc | 0.4513 sec | 101.23% |

**同速**。**悲しいほどに同速。**  
もう企画倒れです。何の差も出ません。

こちらも**意図的に**悪い結果がお見せできるように数値を選んだのですがこれです。  
だいたい100~101％くらいの速度差で落ち着きました。

まとめ
----------------------------------------

**速度は誤差程度にしか変わりません**。  
そして、僅かな差ですが逆転することもあります。

どっちが早いとは言いがたい結果となりました。

ですが、せっかく計測したので、  
今後のナウいPHPの発展を願い、この記事を残しておきます。涙。

あとがき
----------------------------------------

他の言語からPHPをかじりに来た方や引っ越してきた方には嬉しい（<del>あって当たり前な</del>）構文だと思いますが、  
古くからののPHPerの方だと、読みづらいんでしょうか。

ちなみに私は特にPHP好きでも嫌いでもないですが、`[]`の方が見やすいです。
