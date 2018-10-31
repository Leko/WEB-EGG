---
path: /post/benchmark-of-clearstatcache-in-php/
title: PHPのclearstatcacheのベンチマークを取ってみた。むしろ遅かった。
date: 2016-10-11T11:00:39+00:00
dsq_thread_id:
  - "5213236800"
categories:
  - やってみた
tags:
  - PHP
---

こんにちは。今回は PHP ネタです。

PHP には[clearstatcache](http://php.net/manual/ja/function.clearstatcache.php)という関数があります。

> PHP はパフォーマンス向上のために それらの関数の戻り値をキャッシュします。しかし、ケースによっては、 キャッシュされた情報を消去したい場合もあるでしょう。 例えば、一つのスクリプト上で同じファイルが何度もチェックされ、 そのファイルが変更されたり削除されたりする可能性がある場合、 ステータスキャッシュを消去しなければならないと感じるでしょう。 このようなケースでは、clearstatcache()を使用することで ファイルの情報に関して PHP が持っているキャッシュをクリアできます。  
> &mdash; [PHP: clearstatcache – Manual](http://php.net/manual/ja/function.clearstatcache.php)

この機能はドキュメント見る限り割と古くから導入されてるそうですが、PHP 5.1 でバグってました。  
それは後述するとして、 **このバグを引き換えに得られる性能** はどんなもんなのさ？ を計測してみました。

<!--more-->

## はじめに

`clearstatcache`によるバグは確認した限りでは PHP 5.1 にて発生しました。  
PHP 5.5, 5.6 においては修正されて予期したとおりの挙動になっていました。  
5.2, 5.3, 5.4 では確認をしていないため、その間のいつバグが治ったのかは未確認です。

## clearstatcache 周りで起きるバグとは

```php
<?php

$file = 'なんか存在するファイル';

file_exists($file); // true, 当然の結果
unlink($file);

file_exists($file); // true, ！？
```

<p>
  古いPHPでこのコードを動かすとコメントのとおりになります。<br />
  ユニットテストで意図的にファイルを消すようなテストを書いていたら思い切りハマりました。<br />
  諸々調べてみると<a href="http://php.net/manual/ja/function.clearstatcache.php">clearstatcache</a>という関数に行き着きました。
</p>

<p>
  まずはclearstatcacheのドキュメントを読んでみます。<br />
  ※まず前提として、 <strong>明言されてない仕様</strong> が隠されています。
</p>

<blockquote>
  <p>
    PHP は存在しないファイルについての情報はキャッシュしないことにも 注意してください。もし存在しないファイルに対して file_exists() をコールする場合、ファイルを作成するまで この関数は FALSE を返します。もしファイルを作成した場合、 たとえファイルを削除したとしても TRUE を返します。 しかし、unlink() はキャッシュを自動的にクリアします。<br />
      &mdash; <a href="http://php.net/manual/ja/function.clearstatcache.php">PHP: clearstatcache - Manual</a>
  </p>  
</blockquote>

<p>
  "たとえファイルを削除したとしても TRUE を返します"って変だと思わないんですかね・・・<br />
  ファイルを削除した場合キャッシュを開放とか内部実装してくれよ・・・意味わからん・・・<br />
  細かいバージョンまではわかりませんが、古いPHPにおいてはこの機能のせいでバグっています。
</p>

<p>
  しかし、PHP5.5以上で確認してみると、rmdirでもキャッシュが消えてました。<br />
  環境依存なのかバージョン依存なのか、詳しく追えていません。
</p>

## ベンチマークを取ってみる

<p>
  期待通りの挙動を犠牲にしてまで手に入れたパフォーマンスとはどんなもんなのか。いざ実測。<br />
  ベンチマークに使用したコードはこんな感じです。
</p>

<p>
  <code>call_with_cache</code>, <code>call_nocache</code>が比較処理です。<br />
  違いは毎回<code>clearstatcache</code>してから処理を呼ぶか、clearstatcacheしないか。
</p>

<p>
  先述の通りファイルが存在しない場合はキャッシュされないそうなので、テストケースから除外。<br />
  確実に存在するファイルパスである自分自身を参照しています。
</p>

<p>
  テスト対象はPHPのドキュメントを信じました。
</p>

<blockquote>
  <p>
    影響を受ける関数を以下に示します。 stat(), lstat(), file_exists(), is_writable(), is_readable(), is_executable(), is_file(), is_dir(), is_link(), filectime(), fileatime(), filemtime(), fileinode(), filegroup(), fileowner(), filesize(), filetype(), および fileperms().<br />
      &mdash; <a href="http://php.net/manual/ja/function.clearstatcache.php">PHP: clearstatcache - Manual</a>
  </p>  
</blockquote>

<p>
  この機能に影響するiniの設定は以下のとおりです。
</p>

```
$ php -i | grep realpath_cache_
realpath_cache_size => 16K => 16K
realpath_cache_ttl => 120 => 120
```

<p>
  で、肝心のベンチマーク結果は以下のとおりです。
</p>

![benchmark](https://docs.google.com/spreadsheets/d/1UU0mM1_OVmC-vajpICnqMV0ygtcyXKqmqZiHxAo6IyQ/pubchart?oid=362709528&format=image)

<p>
  <strong>全般的にclearstatcacheしたほうが早い</strong> というわけのわからない結果になりました。<br />
  だったらこの機能いらないじゃん！なんだそれ！！
</p>

<p>
  試しにiniの設定を書き換えリアルパスキャッシュを無効化したり、逆に<code>realpath_cache_size</code>を16Kから16Mに増やして実行してみたところ、誤差の範囲内の違いしか出ませんでした。<br />
  <strong>なんだそれ！！！</strong>
</p>

## まとめ

<p>
  私の環境でベンチマーク取った限りでは、完全に無駄というかむしろ邪魔な機能という結果になりました。<br />
  どんな歴史的経緯があるのかまでは調べてませんが、なぜこんな機能作ったんだろう。
</p>

<p>
  古いPHPではバグってるし、新しいPHPでも性能に寄与してないし。<br />
  久々に予想を覆す、ベンチマーク取ってよかったと感じる計測でした。
</p>
