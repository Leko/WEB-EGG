---
path: /post/examination-of-and-or-operator-in-php/
title: PHPのand,or演算子の使い道を考えてみる
date: 2014-08-12T14:08:36+00:00
twitter_id:
  - "499060239363100672"
dsq_thread_id:
  - "3135016894"
image: /images/2014/08/Screen-Shot-2014-07-28-at-11.58.08-PM.png
categories:
  - 考えてみた
tags:
  - PHP
---
突然ですが、**PHPの問題**です。

```php
<?php

$a = false and false;
$a = true and false;
$a = true and true;

$a = true or true;
$a = true or false;
$a = false or true;
$a = false or false;
```

<p>
  おなじみの<code>and</code>, <code>or</code>演算子の優先順位テストです。<br />
  それぞれの<code>$a</code>には何が代入されているでしょうか。
</p>

<!--more-->

答え
----------------------------------------

<p>
  答えは以下の通りです。
</p>

```php
$a = false and false => false
$a = true and false  => true
$a = true and true   => true
$a = true or true    => true
$a = true or false   => true
$a = false or true   => false
$a = false or false  => false
```

<p>
  <strong>だいぶ気持ち悪いですね。</strong>
</p>

<p>
  特に、
</p>

<ul>
  <li>
    <code>$a = true and false => true</code>
  </li>  
  <li>
    <code>$a = false or true  => false</code>
  </li>  
</ul>

<p>
  上記２つは初見殺しにも程が有ります。
</p>

<p>
  なぜこのような問題が起こるかというと、<br />
  <code>and</code>, <code>or</code>演算子は<code>=</code>よりも優先度が低いため、
</p>

```php
($a = true) and false;  // 後ろのfalseは評価されるだけで$aに影響しない
($a = false) or true;   // 後ろのtrueは評価されるだけで$aに影響しない
```

<p>
  評価される際には、このような式になっているためです。
</p>

<p>
  このように非常に難解な動きをする<code>and</code>, <code>or</code>演算子ですが、<br />
  論理式とは少し違う使い方を見つけたので、メモを残しておきます。
</p>

<!--more-->

面白い書き方
----------------------------------------

<p>
  and, orは論理演算子なので基本的にif文やwhile等の評価式の中に使用します。<br />
  しかし、評価式として使用しない使用方法があるようです。
</p>

```php
<?php

function p($str) { echo $str; }

true and p("true andn");
false and p("false andn");

true or p("true orn");
false or p("false orn");
```

<p>
  こんなコードを用意してみました。<br />
  このコードを実行すると何が出力されるでしょう。
</p>

```
true and
false or
```

<p>
  はい。どうでしょうか。
</p>

<ul>
  <li>
    andの手前の式がtrueと評価される場合には後ろの式が実行され、
  </li>  
  <li>
    orの手前の式がfalseと評価される場合には後ろの式が実行され、
  </li>  
  <li>
    それ意外の場合は後ろの式が実行されない
  </li>  
</ul>

<p>
  という書き方ができます。
</p>

<blockquote>
  <p>
    ※ ちなみにechoをそのまま書くと構文エラーになります<br />
      PHP Parse error:  syntax error, unexpected 'echo' (T_ECHO)
  </p>  
</blockquote>

実用例
----------------------------------------

<p>
  （実用的かどうか微妙な例ですが、）実際にある場面を例にあげます。
</p>

<p>
  構文の都合上、関数の引数のデフォルト値に指定できない値<br />
  例えばクロージャ(<code>function() {}</code>)などを初期化する際には、
</p>

```php
function hoge($fn = null) {
    if(is_null($fn)) $fn = function() {};

    return $fn;
}
```

<p>
  と書くことがあると思います。
  こんな時に、<code>and</code>を使うことで、初期化の式を少しだけシンプルに出来ます。
</p>

```php
function foo($fn = null) {
    is_null($fn) and $fn = function() {};

    return $fn;
}
```

<p>
  実際に試してみると、
</p>

```
var_dump(hoge());   // class Closure#1 (0) {}

var_dump(foo());    // class Closure#1 (0) {}
```

<p>
  <strong>初期化できています。</strong>
</p>

<p>
  ちなみに、<strong>意味が分かりづらいので個人的には嫌い</strong>ですが、
  更にタイプ量を削るなら、デフォルト値を<code>null</code>でなく<code>false</code>にしておき、
</p>

```php
function foo($fn = false) {
    $fn or $fn = function() {};

    return $fn;
}
```

<p>
  <code>or</code>を使ってこう書くこともできます。<br />
  結局トリッキーさは抜けませんが、慣れれば案外見やすい書き方かもしれません。
</p>

<p>
  トリッキーなので自分は使いませんが、こんな使い方もできるそうです。<br />
  というご紹介でした。
</p>

あとがき
----------------------------------------

<p>
  ちなみに<code>&&</code>と<code>||</code>でも同じことができます。<br />
  あれ、その書き方どこかで・・・
</p>

```javascript
function hoge(fn) {
    fn = fn || function() {};
}
```

<p>
  jsはちょっと違いましたね。
</p>

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">  
</div>