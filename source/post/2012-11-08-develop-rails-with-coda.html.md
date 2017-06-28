---
path: /post/develop-rails-with-coda/
title: CodaでRuby on Railsが使えるようになるまで
date: 2012-11-08T17:36:03+00:00
dsq_thread_id:
  - "3134969724"
categories:
  - 問題を解決した
tags:
  - Coda
  - Ruby
  - Ruby on Rails
---
目的のRuby on Railsのバージョンは3.2.8。

それにともなって周辺環境の準備に色々と手間取ったので備忘録を。

&nbsp;

雑然とした覚書です。

あとでしっかりと補足します。



<!--more-->

 目標：Ruby on Rails3.2.xをサーバーにインストールしてCodaでコーディングするまで

/\* &#8212;&#8212;&#8212;- Ruby編 &#8212;&#8212;&#8212;- \*/ Ruby 1.9.2をインストール Ruby on Railsインストールメモ on さくらのVPS | Ruby on RailsをVPSで動かす

/\* &#8212;&#8212;&#8212;&#8212;&#8212;&#8212; gem,rails編 &#8212;&#8212;&#8212;&#8212;&#8212;&#8212; \*/ rails 3.2をインストール

/\* &#8212;&#8212;&#8212;&#8212;&#8212;&#8212; エラー潰し編 &#8212;&#8212;&#8212;&#8212;&#8212;&#8212; \*/ Invalid gemspec in [/usr/lib/ruby/gems/1.9.1/specifications/mail-2.4.4.gemspec]: invalid date format in specification: &#8220;2012-03-14 00:00:00.000000000Z&#8221; Invalid gemspec in [/usr/lib/ruby/gems/1.9.1/specifications/jquery-rails-2.1.3.gemspec]: invalid date format in specification: &#8220;2012-09-24 00:00:00.000000000Z&#8221; Invalid gemspec in [/usr/lib/ruby/gems/1.9.1/specifications/sass-rails-3.2.5.gemspec]: invalid date format in specification: &#8220;2012-03-19 00:00:00.000000000Z&#8221; みたいなエラーが出る

-> gemのインストール時に invalid date format in specification でエラー &#8211; TitaniumMobile勉強記 http://h5y1m141.hatenablog.com/entry/20110812/p1

gemをupdateしたい

-> gem update がうまくいかないときのメモ &#8211; メンチカツ http://hsuzuki.hatenablog.com/entry/2012/01/30/110702

RailsのがインストールされてWEBRickの起動まで Ruby1.9.3 + Rails3.2.3 プロジェクト作成からWEBrickの起動まで。 &#8211; コレグレーデギネード http://d.hatena.ne.jp/namtcerid/20120508/1336445530

rake DB:migrateをしようとすると 「uninitialized constant Rake::DSL」のエラーが出る

rake DB:migrateをしようとすると 「/usr/lib/ruby/1.9.1/rake.rb:2482:in \`const_missing&#8217;」 ってエラーが出る

-> rails3 で scaffold やってみる « foot mark http://footmark.wordpress.com/2011/01/24/rails3-%e3%81%a7-scaffold-%e3%82%84%e3%81%a3%e3%81%a6%e3%81%bf%e3%82%8b/

/\* &#8212;&#8212;&#8212;- Coda編 &#8212;&#8212;&#8212;- \*/ Coda2の設定+プラグインの準備をする

-> Coda2を入れたらまず行っている設定 | 1bit::memo http://1bit.mobi/20120525091346.html

/Users/\___/Libraryが表示されない

-> Lionではユーザディレクトリのライブラリーが表示されない &#8211; 自分のためのメモ帳Mac http://blog.livedoor.jp/present_favorites/archives/51721905.html

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>