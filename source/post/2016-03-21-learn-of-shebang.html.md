---
path: /post/learn-of-shebang/
title: シバン(shebang)をやっと理解した
date: 2016-03-21T22:38:36+00:00
dsq_thread_id:
  - "4661178613"
categories:
  - やってみた
tags:
  - PHP
  - UNIX
---
こんにちは。  
composerで提供されているコマンドの中身を見ていたら

```
#!/usr/bin/env php
```

と書かれており、そのあとの行にはPHPのコードが。

```
$ ./shebang-php
```

のように、phpコマンドを使わずに直接PHPのコードが実行出来るようになっていました  
この仕組みは **シバン(shebang)** というらしいです

シバン自体はBashのスクリプトで似たようなものを何度も見たことがあったのですが、おまじない的に捉えており意味を深く考えていませんでした  
拡張子や実行コマンドに縛られず、何の言語で書いても良い実行可能なコードを作るのに適しているのでは？？  
と疑問が湧いたので、調べて理解したものを残しておきます

<!--more-->

シバンとは
----------------------------------------

冒頭でも書きましたが、`#!`で始まる行のことらしいです。

[シバン (Unix) – Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%90%E3%83%B3_(Unix))

/usr/bin/envってなに
----------------------------------------

各種インタプリタのパスは環境によって変わることがあるので、環境によらず汎用的に動くようにするには`#!/usr/bin/env {言語名}`と書くのが一般的なようです

> [いまさら聞けない、#! で始まる１行目の名前とenv指定時の挙動 – プログラマ 福重 伸太朗 ～基本へ帰ろう～](http://d.hatena.ne.jp/japanrock_pg/20100319/1268968887)

### 例：PHP

```php
#!/usr/bin/env php
<?php

echo "Hello, world!\n";
```

<h3>
  例：Ruby
</h3>

```ruby
#!/usr/bin/env ruby

puts "Hello, world!\n"
```

<h3>
  例：Nodejs
</h3>

```javascript
#!/usr/bin/env node --harmony_proxies

// Harmonyのオプションを有効にすることも出来る模様
console.log('Hello, world!')
```

コンパイル型の言語でも使えるの？
----------------------------------------

<p>
  これってコンパイル型の言語、例えば<code>Go</code>でも使えるのかな？<br />
  と調べてみたところ、ゴリ押しならやれそうでした。
</p>

```
//usr/bin/env go run $0 $@ ; exit
```

<blockquote>
  <p>
    <a href="http://qiita.com/ando-masaki/items/323c6b08e07ec4538c3d">Go言語でshebang</a>
  </p>  
</blockquote>

<p>
  単にgoコマンドを実行しているだけなので、滅茶苦茶遅いです。<br />
  GoのCLIツールは早いのが大きな魅力なのに、遅いんじゃ使い物になりません。。。
</p>

まとめ
----------------------------------------

<p>
  シバンは分かってしまえば簡単なんですが、なかなか覚えようと思うきっかけがないと思います<br />
  もしシバン知らない人がいらっしゃったら、シバン便利なので広めてあげて下さい
</p>

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">  
</div>