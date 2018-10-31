---
path: /post/eyecatch-with-wordpress/
title: WordPressの投稿一覧にアイキャッチ画像を表示させたいときのメモ
date: 2012-11-21T14:32:37+00:00
dsq_thread_id:
  - "3139535666"
image: /images/2012/11/20121121_eye1-604x240.jpg
categories:
  - 問題を解決した
---

こんにちは。  
このブログは Wordpress のデフォルトテーマの１つである「Twenty Eleven」を少しだけ改変して使っているのですが、  
このテーマで投稿を作成するとき、`アイキャッチ画像を設定`という項目があると思います。  
しかし、この項目を設定しても、デフォルトのままではアイキャッチ画像は表示されません。  
せっかく設定できる項目があるので、表示させてみます。

<!--more-->

と、その前に、

## アイキャッチ画像とは何か

アイキャッチ画像とは、  
記事のサムネイルと考えて貰えればいいと思います。  
ライフハッカー様や他の大手ブログ様などの、記事の先頭にある画像のことです。  
例えばこんなかんじです。

<p class="link_box">
  自分が死んだ時、大切な人にメッセージを届けてくれるサービス「Proof of Life」 : ライフハッカー［日本版］<br /> <a href="http://www.lifehacker.jp/2012/11/proof_of_life.html">http://www.lifehacker.jp/2012/11/proof_of_life.html</a>
</p>

## どこをいじれば良いの？

wordpress で表示されている項目は、  
**wp-content > themes > 自分が指定したテーマ**  
で管理されています。  
今回はテーマ Twenty Eleven を使っているので、  
**wp-content > themes > twentyeleven**  
の中身をいじることになります。

## １，アイキャッチ画像を使うための準備をする

まずは、  
**wp-content > themes > twentyeleven > functions.php**  
を見てみます。110 行目あたりに、以下の様な行があると思います。

```php
// This theme uses Featured Images (also known as post thumbnails) for per-post/per-page Custom Header images
add_theme_support( 'post-thumbnails' );
```

`add_theme_support( 'post-thumbnails' );`  
が指定されていると、アイキャッチ画像が有効になるようです。  
しかし、テーマ Twenty Eleven は最初からこの指定が入っているので、  
いじるところはありません。見るだけです！

## ２，アイキャッチ画像を実際に表示させる

さて、これで準備は整いました。  
次は、このアイキャッチ画像を表示させるために、  
**wp-content > themes > twentyeleven > content.php**  
をいじります。  
content.php は、投稿一覧の、１記事分にあたるものだと思って下さい。  
この中の、下記の行を探して下さい。

```php
<div class="entry-content">
<?php

 the_content( __( 'Continue reading <span class="meta-nav">&rarr;', 'twentyeleven' ) ); ?>
<?php

 wp_link_pages( array( 'before' => '
  <div class="page-link">
    <span>' . __( 'Pages:', 'twentyeleven' ) . '</span>', 'after' => '
  </div>' ) ); ?>
</div>

<!-- .entry-content -->
```

この部分が、記事の内容に当たります。  
ここの先頭に、アイキャッチ画像を表示するための関数、  
the_post_thumbnail() を記述します。

```php
<div class="entry-content">
<?php

 the_post_thumbnail(); //これを追加 ?>
<?php

 the_content( __( 'Continue reading <span class="meta-nav">&rarr;', 'twentyeleven' ) ); ?>
<?php

 wp_link_pages( array( 'before' => '
  <div class="page-link">
    <span>' . __( 'Pages:', 'twentyeleven' ) . '</span>', 'after' => '
  </div>' ) ); ?>
</div>

<!-- .entry-content -->
```

これで作業完了です！  
適当にアイキャッチ画像を指定した投稿を作成して、  
実際に表示させてみます。

![表示確認](/images/2012/11/20121121_screen_shot.png)

如何でしょうか！  
アイキャッチ画像は、上記の手順で表示させられるので、  
オリジナルのテーマを作るときなどの、参考になれば幸いです。
