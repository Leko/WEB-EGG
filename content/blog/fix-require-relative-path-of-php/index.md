---
path: /post/fix-require-relative-path-of-php/
title: phpでrequire_onceするときに相対パスでハマった
date: 2013-01-06T00:00:00+00:00
dsq_thread_id:
  - "3131679045"
featuredImage: ./featured-image.jpg
categories:
  - 問題を解決した
tags:
  - PHP
---
<q>photo by <a href="http://www.flickr.com/photos/masahiko/" target="_blank">masahiko</a></q>

こんにちは。 phpでクラスベースの開発をしているときに、 require_onceで相対パスを使って読み込むときにハマったのでメモ。

<!--more-->

エラーが起こるケース
----------------------------------------

例えばこういうディレクトリ構造で、

```
/
    - A.php
    - D.php
    - Class/
        - B.php
        - C.php
```

C.phpをrequireしたB.phpを、A.phpがrequireするときに、B.phpで 

```php
<?php

require_once("C.php");
```


と書くとB.phpのrequire_onceは失敗します。 B.phpとC.phpは同じ階層にあるから読み込まれるはずなのに。 id="practive"> 

phpの規則
----------------------------------------

調べてみるとすぐに見つかりました。<figure>

<q>PHPでは、「実行したファイルのあるディレクトリが常に実行時のカレントディレクトリになる」っていう規則があるためエラーとなってしまうのです。 この問題は、実行ファイルのディレクトリではなく、参照しているファイルのディレクトリを基にパスを取得することで回避できます。</q> <figcaption> <cite><a href="http://www.hoge256.net/2007/08/61.html" target="_blank">PHP の include, require で相対パスを指定して読み込む場合のメモ – hoge256ブログ</a></cite> </figcaption> </figure> 

とあるように、A.phpを実行しているので、 B.phpのrequire_once("C.php")はA.phpと同階層のC.phpを探してエラーになるようです。 これを回避するには、**dirname(__FILE__)**を使います。section id="solved"> 

dirname(__FILE__)
----------------------------------------

dirname(__FILE__)は、自分自身へのパスを返します。 B.phpで用いた場合には、"/Class"という文字列が返ります。 **パスの最後に/は付かないので、要注意。** これを使って、 

```php
<?php

require_once(dirname(__FILE__)."/C.php"); //C.phpを読み込む 
require_once(dirname(__FILE__)."/../D.php"); //D.phpを読み込む
```


と書くことで、実行されるファイルやカレントディレクトリを気にすること無く 相対パスでrequireをすることが出来ます。 
