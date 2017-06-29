---
path: /post/fix-wordpress-permalink-not-working/
title: WordPressのパーマリンクでハマった
date: 2012-07-29T19:19:25+00:00
dsq_thread_id:
  - "3177355622"
---
こんにちは。  
さくらVPS（CentOS）に自力でwordpressを導入して、

パーマリンクの設定をいじったらページがNot Foundになった時の対処法です。

<!--more-->

[Ubuntu Server 10.04でWordpressのパーマリンク設定が効かない \| inashiro's blog](http://www.inashiro.com/2011/02/09/ubuntu-server-10-04%E3%81%A7wordpress%E3%81%AE%E3%83%91%E3%83%BC%E3%83%9E%E3%83%AA%E3%83%B3%E3%82%AF%E8%A8%AD%E5%AE%9A%E3%81%8C%E5%8A%B9%E3%81%8B%E3%81%AA%E3%81%84/)

こちらの記事を参考に作業しました。

どうやらhttpd.confで、AllowOverrideがNoneになっているのが問題らしい。

見てみると、確かになってた。

<blockquote class="molokai">
  <p>
    <span class="red">AllowOverride None</span>を<br /> <span class="red">AllowOverride All</span>に書き換えて、保存。
  </p>
</blockquote>

そして、

<blockquote class="molokai">
  <p>
    $ sudo service httpd restart
  </p>
</blockquote>

でapacheを再起動する。

<blockquote class="molokai">
  <p>
    httpd を停止中:                                            [  <span class="green">OK</span>  ]<br /> httpd を起動中:                                            [  <span class="green">OK</span>  ]
  </p>
</blockquote>

これで設定が適応されました。

やっと個別記事を見ることが出来るようになりました・・・笑

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>