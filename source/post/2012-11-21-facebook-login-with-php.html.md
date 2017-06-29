---
path: /post/facebook-login-with-php/
title: phpで「facebookでログイン」を実装するまで
date: 2012-11-21T02:17:32+00:00
dsq_thread_id:
  - "3131957041"
image: /images/2012/11/20121121_facebook_login11-604x240.jpg
categories:
  - 問題を解決した
tags:
  - Facebook
  - PHP
---
こんにちは。  
先日、友達がシステムの実装を行なっている時に、

「phpでfacebookでログインを実装したいけど詰まった」と言っていまして、

そんな難しいものでもないだろうと思ったら、そのとおり簡単だったのですが

調べる事も結構ありましたので、

備忘録として、ここに残しておきます。

<!--more-->

facebook-php-sdkを用意
----------------------------------------

有難いことに、facebook公式がsdkを公開してくれています。

これがあるのと無いのでは天と地との差があります。

さくっと手に入れてしまいましょう。

リンクはこちら。<a href="https://github.com/facebook/facebook-php-sdk" target="_blank">https://github.com/facebook/facebook-php-sdk</a>

上記のリンクをクリックして、「ZIP」をクリック。

ダウンロードが始まるので、適当なディレクトリに解凍して、

「src」フォルダとその中身を、facebookでログインを使いたいphpファイルと同じ場所へ置いて下さい。

これでOKです。次に行きましょう。 

アプリケーションを作成
----------------------------------------

facebookでログインをするには、ユーザ情報を得る元となるアプリケーションが必要になります。

Twitterでも同様ですね。では早速作っていきます。

ですが、アプリケーションの作成については多くの資料があり、

まんまコピペで出来たので参考にさせて頂いたリンクをご紹介します。あとはぐぐれ。

  * PHP で「Login with Facebook」を実装する基本的な方法まとめ – 頭ん中  
    <a href="http://www.msng.info/archives/2012/10/facebook-login-with-php.php" target="_blank">http://www.msng.info/archives/2012/10/facebook-login-with-php.php</a>  アプリケーションの作成は手順はやや多いですが、

上記のサイト様を見ればすぐに分かると思います。

アプリケーションが作成できたら、次へ進みましょう。 
  

処理の流れ
----------------------------------------

facebook-php-sdkのソースを見れば、

丁寧に書かれているので、分かると思うのですが、それじゃ備忘録にならないので書きます。笑

ソース読むのに抵抗がある。

という方もいると思うので、手順を噛み砕きます。

必要なファイル構成

まずこれを整えます。同じディレクトリに、srcとindex.phpを置きます。こんな感じ。

/
    
+- src（facebook-php-sdkのsrcです）
    
+- index.php

今回は、この構成で実装します。たったこれだけです。

説明の前に、実際に動くサンプルを作りましたので、そちらを参考にしてみて下さい。

ログインをして、ユーザ情報を表示するだけのサンプルです。

[「facebookでログイン」動作サンプル](http://closet.leko.jp/2012/facebook_login/)

サンプルを見ればなんとなく分かると思います。

ログイン時には、

**index.php -> facebook -> アプリで設定したURLへリダイレクト(ログイン完了)**

という順番になります。ログアウトするときは、

**index.php -> facebook -> 指定したURLへリダイレクト -> セッションをリセット -> ログアウト完了**

と、少々手順が増えます。

このような処理を実際に書いていきます。

ただ、サンプルは無駄なものが多めに入っているので、最低限必要な機能だけを書いていきます。 

いざ実装。
----------------------------------------

さて、お待ちかねの実装です。

まずいじるファイルは「index.php」です。  
index.phpを開いて下記の内容を記入。

**※<?php

の?の手前にスペースが空いていますが、削除して下さい。** 

```php
<?php

// facebookSDKを読み込み
require_once("src/facebook.php");

// アプリの情報を$configに格納
$config = array(
  'appId' => "登録したアプリのID",
  'secret' => "取得したアプリのsecret"
);

$facebook = new Facebook($config);
$user = $facebook->getUser(); 
```

まずはこれだけ。

これで、もしindex.phpにアクセスしたユーザーがアプリにログインしていれば、

$userにはユーザIDが入っています。

ログインしている場合と、していない場合で処理を分けたいので、

index.phpに下記を追加して下さい。 

```php

// もしユーザがログインしていたら
if ( $user ) {
	// ログアウトURLを生成
	$logoutUrl = $facebook->getLogoutUrl();
	// ユーザ情報を取得
	$user_info = $facebook->getUser();
	// ログアウト用のリンクを出力
	echo "[ログアウト](".$logoutUrl.")";
	// ユーザ情報を出力
	print\_r($user\_info);
} else {
	// ログインURLを生成
	$loginUrl = $facebook->getLoginUrl();
	echo "[facebookでログイン！](".$loginUrl.")";
}
```

実にシンプルですが、これで完了です。

作成したindex.phpをサーバにアップロードして、アクセスしてみて下さい。

いかがでしょうか。

リファレンス通りにやった（言い訳）のですが、動かないなど何かしらの不具合が御座いましたら、

コメントにてご一報よろしくお願い致します。

ちなみに私はログアウトが上手く動かなかったため、上記のgetLogoutUrl()ではなく、

自前でログアウト用のURLと、多少の処理を付け加えました。

それについては、また別の記事として書きます。
  

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>