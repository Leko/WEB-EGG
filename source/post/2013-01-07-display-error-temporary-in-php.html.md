---
path: /post/display-error-temporary-in-php/
title: PHPで一時的にエラーを表示する方法
date: 2013-01-07T00:00:00+00:00
dsq_thread_id:
  - "3139251658"
image: /images/2013/01/20130107_eyecatch1.jpg
categories:
  - 問題を解決した
tags:
  - PHP
---

こんにちは。 私はさくらVPS2Gプランで開発をしているのですが、 デフォルトだとphp_iniファイルでdisplay_errorsがOFFになっているようです。 セキュリティ的にこちらのほうが好ましいのですが、 エラー潰しをしている時に何も出力してくれないのは、時間効率があまり良くありません。 一時的で良いのでエラー出せないかな？ ローカルで動作させてからアップロードしろよ、という話なのですが、 今回はphpの関数ini_setを用いて一時的にエラーを出力する方法を残します。

<!--more-->

ini_set
----------------------------------------

> string ini_set ( string $varname , string $newvalue )  
> 指定した設定オプションの値を設定します。  
> 設定オプションは、スクリプトの実行中は新しい値を保持し、スクリプト終了時に元の値へ戻されます。
> 
> <a href="http://php.net/manual/ja/function.ini-set.php" target="_blank">PHP: ini_set – Manual</a>

と公式リファレンスにあるので、これで変更してみましょう。

エラーを出力しない場合のサンプル
----------------------------------------

まずは動かないサンプルを書きます。 

```php
<?php

require_once("XXX.php"); //存在しないファイル ?>;
```

 

これをブラウザで表示しようとすると、下の画像のような画面になります。 <img src="/images/2013/01/20130107_faild.png" alt="20130107 faild" title="20130107_faild.png" height="250" />

エラーを出力するサンプル
----------------------------------------

このスクリプトの何処にエラーが出てるのかを出力してみます。 

```php
<?php

ini_set('display_errors', 1);
require_once("XXX.php"); //存在しないファイル ?>;
```

 

ini_setの１行を追加してブラウザを開いてみます。 すると、下の画像のようにエラーが出力されます！ 
<img src="/images/2013/01/20130107_success.png" alt="20130107 success" title="20130107_success.png" width="553" height="129" /> ※注意 ただし、Parse error（多くの場合文法ミス）だとプログラム自体が実行できないので、 ini_setも当然実行されず。。 実行前エラーは表示することができません。 そこは目勘を鍛えて発見しましょう。 

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>