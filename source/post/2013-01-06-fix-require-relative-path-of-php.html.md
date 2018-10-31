---
path: /post/fix-require-relative-path-of-php/
title: phpでrequire_onceするときに相対パスでハマった
date: 2013-01-06T00:00:00+00:00
dsq_thread_id:
  - "3131679045"
image: /images/2013/01/20130106_eye1.jpg
categories:
  - 問題を解決した
tags:
  - PHP
---

<q>photo by <a href="http://www.flickr.com/photos/masahiko/" target="_blank">masahiko</a></q>

こんにちは。 php でクラスベースの開発をしているときに、 require_once で相対パスを使って読み込むときにハマったのでメモ。

<!--more-->

## エラーが起こるケース

例えばこういうディレクトリ構造で、

```
/
    - A.php
    - D.php
    - Class/
        - B.php
        - C.php
```

C.php を require した B.php を、A.php が require するときに、B.php で

```php
<?php

require_once("C.php");
```

と書くと B.php の require_once は失敗します。 B.php と C.php は同じ階層にあるから読み込まれるはずなのに。 id="practive">

## php の規則

調べてみるとすぐに見つかりました。<figure>

<q>PHP では、「実行したファイルのあるディレクトリが常に実行時のカレントディレクトリになる」っていう規則があるためエラーとなってしまうのです。 この問題は、実行ファイルのディレクトリではなく、参照しているファイルのディレクトリを基にパスを取得することで回避できます。</q> <figcaption> <cite><a href="http://www.hoge256.net/2007/08/61.html" target="_blank">PHP の include, require で相対パスを指定して読み込む場合のメモ – hoge256 ブログ</a></cite> </figcaption> </figure>

とあるように、A.php を実行しているので、 B.php の require_once("C.php")は A.php と同階層の C.php を探してエラーになるようです。 これを回避するには、**dirname(**FILE**)**を使います。section id="solved">

## dirname(**FILE**)

dirname(**FILE**)は、自分自身へのパスを返します。 B.php で用いた場合には、"/Class"という文字列が返ります。 **パスの最後に/は付かないので、要注意。** これを使って、

```php
<?php

require_once(dirname(__FILE__)."/C.php"); //C.phpを読み込む
require_once(dirname(__FILE__)."/../D.php"); //D.phpを読み込む
```

と書くことで、実行されるファイルやカレントディレクトリを気にすること無く 相対パスで require をすることが出来ます。
