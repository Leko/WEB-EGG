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
<q>photo by <a href="http://www.flickr.com/photos/masahiko/" target="_blank">masahiko</a></q><section id="intro"> 

こんにちは。 phpでクラスベースの開発をしているときに、 require_onceで相対パスを使って読み込むときにハマったのでメモ。

</section> 



<!--more-->

<section id="sample"> 

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
 <?php require_once(&#8220;C.php&#8221;); 
```

 

と書くとB.phpのrequire_onceは失敗します。 B.phpとC.phpは同じ階層にあるから読み込まれるはずなのに。</section> <section id="practive"> 

phpの規則
----------------------------------------


調べてみるとすぐに見つかりました。<figure>

<q>PHPでは、「実行したファイルのあるディレクトリが常に実行時のカレントディレクトリになる」っていう規則があるためエラーとなってしまうのです。 この問題は、実行ファイルのディレクトリではなく、参照しているファイルのディレクトリを基にパスを取得することで回避することができます。</q> <figcaption> <cite><a href="http://www.hoge256.net/2007/08/61.html" target="_blank">PHP の include, require で相対パスを指定して読み込む場合のメモ &#8211; hoge256ブログ</a></cite> </figcaption> </figure> 

とあるように、A.phpを実行しているので、 B.phpのrequire_once(&#8220;C.php&#8221;)はA.phpと同階層のC.phpを探してエラーになるようです。 これを回避するには、**dirname(\_\_FILE\_\_)**を使います。</section> <section id="solved"> 

dirname(\_\_FILE\_\_)
----------------------------------------


dirname(\_\_FILE\_\_)は、自分自身へのパスを返します。 B.phpで用いた場合には、&#8221;/Class&#8221;という文字列が返ります。 **パスの最後に/は付かないので、要注意。** これを使って、 

```php
 <?php require\_once(dirname(\\_\_FILE\_\_).&#8221;/C.php&#8221;); //C.phpを読み込む require\_once(dirname(\\_\_FILE\_\_).&#8221;/../D.php&#8221;); //D.phpを読み込む 
```

 

と書くことで、実行されるファイルやカレントディレクトリを気にすること無く 相対パスでrequireをすることが出来ます。 </section> 

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>