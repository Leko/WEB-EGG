---
path: /post/try-clean-install-with-boxen/
title: Macの容量が埋まってしまったのでboxenとクリーンインストールをしてみた
date: 2013-08-04T21:28:57+00:00
twitter_id:
  - "364003733786472451"
dsq_thread_id:
  - "3131928921"
image: /images/2013/08/8edc4b2ac5826e677782f1fd6acaffd41.jpg
categories:
  - 効率化
  - 問題を解決した
tags:
  - Boxen
  - Mac
---
こんにちは。
  
２年ほど使っているMacBookAirの容量がほぼ埋まってしまって、
  
前から**消して消してカサ増し…**を繰り返していたのですが、
  
ついに消せるファイルが無くなってしまいました。

ということで、クリーンインストールすると共に、
  
Github社が提供している**boxen**というツールで、
  
開発環境をコマンド一発でセットアップしてみました。

なお、
  
この記事では、boxenについてあまり詳しく述べません。
  
あくまでboxenした結果をメインに取り扱いますのでご了承ください。

<!--more-->

必要なもの
----------------------------------------

  1. Mac
  2. 8G以上の容量があるUSBメモリ（フォーマットしても大丈夫なもの）
  3. Githubのアカウント

クリーンインストールする前のMac
----------------------------------------

まずは、クリーンインストールする前のMBAの状況です。

<img src="/images/2013/08/796519880.png" alt="796519880" title="796519880.png" width="588" />

**空き容量は1.77GB**と出ているのですが、 CPUをCore i7に増しているからなのか、重いアプリとかを立ち上げていると、
  
リソースを食って**容量が足りなくなったことになる**ようで、
  
「お使いのディスクはいっぱいです」とやたら警告してきます。

SSD内の分類もすべて「その他」。おかしくなっています。

というわけで、一度**SSDをフォーマットして、OSX Mountain Lionを入れ直し**ます。
  
その前に、何かあった時に備えて**必ずバックアップ**を取っておいてください。

クリーンインストールする
----------------------------------------

Mountain Lionは、「ネットワークインストール」という、
  
インストールメディアがなくてもインストール出来る方法があるのですが、

これがうまくいかなかったので、USBのインストールメディアを作っていきます。

### OS X Mountain Lionを入手

[App Store](https://itunes.apple.com/jp/app/os-x-mountain-lion/id537386512?mt=12)からMountain Lionのインストールアプリをダウンロードします。

ダウンロードしたら、そのまま触らずに次へ行きます。

### Lion DiskMaker

インストールメディアを作るには、
  
[Lion DiskMaker](http://liondiskmaker.com/)というアプリを使います。

これをインストールしたら、このような画面が表示されると思います。
  
Mountain Lionのインストールメディアを作りたいので**Mountain Lion**を選択。

<img src="/images/2013/08/ceb206c6e130a3595674ca2c9b4f4d29.png" alt="スクリーンショット 2013 08 04 20 22 53" title="スクリーンショット 2013-08-04 20.22.53.png" width="506" />

先ほどダウンロードしたMountain Lionのアプリが自動的に認識されるので、
  
そのまま指示に従ってUSBにインストールしてください。

### optionキーを押しながら再起動

上記の手順を済ましたら、準備完了です。 とりあえずMacをシャットダウンします。
  
そして、今作ったUSBメディアを挿して、optionキーを押しながら電源を入れます。

するとブート画面が出てくると思うので、**OSX Mountain Lion**を選択します。
  
その後出てくるメニューの中から、**ディスクユーティリティ**を選択します。

### フォーマットする

この画面のスクショの撮り方が分からないので、
  
説明では、インストール後のディスクユーティリティの画面で代用します。

左側に表示されている**Macintosh HD**を選択し、
  
右側の**消去**タブを選択します。

ここで、フォーマットを指定します。 僕は**Mac OS 拡張（ジャーナリング、暗号化）**を選択しました。
  
暗号化を使いたくない場合は、**Mac OS 拡張（ジャーナリング）**の方でいいと思います。

<img src="/images/2013/08/117ce1ca3bc4a2e2ba6b0a8fdb971c5f.png" alt="スクリーンショット 2013 08 04 20 35 12" title="スクリーンショット 2013-08-04 20.35.12.png" width="600" />

### OS X Mountain Lionを再インストール

消去が完了したら、ディスクユーティリティを終了します。

また先ほどのメニューが出てくると思うので、**OS X を再インストール**を選択します。 あとは、指示に従いながらインストールを進めてください。

こっから先を逐一説明していると長くなるので、詳しくはこちらを御覧ください。

> [OS X Mountain Lion（マウンテンライオン）をクリーンインストールする方法 \| 和洋風KAI](http://wayohoo.com/mac/tips/how-to-clean-install-os-x-mountain-lion.html)

上記の記事が完了してMacが使えるようになったらクリーンインストール完了です。

boxenとは
----------------------------------------

boxenとは、冒頭にも書きましたが、
  
Github社が公開しているMacのセットアップツールです。
  
概要についてはこちらの記事が詳しく書いているので見てみてください。

[Mac – Boxen使わなくても許されるのは2012年までだよね – Qiita [キータ]](http://qiita.com/yuku_t/items/c6f20de0e4f4c352046c)

何が出来るかというと、
  
「このアプリ入れます」「こんなツール入れます」と設定ファイルにあらかじめ書いておいて、
  
それを実行すると、**設定したアプリやツールなどが自動でインストールされる**といった具合です。

自動で、HomeberwやRuby、Nodejsなどはインストールされます。
  
導入に手間取るRuby周りもboxenが自動でやってくれるのがありがたい。

boxenに設定したもの
----------------------------------------

僕がboxenで指定したものは以下です。

### ブラウザ

Chrome、Chrome Canary、Firefox、opera

### App storeに無いアプリ

Evernote、Alfred、Wunderlist、iTerm2、Sublime Text2、Dropbox、Github for Mac、
  
BetterTouchTool、Eclipse、XtraFinder、Sequel Pro、Virtual Box、Team Viewer、
  
Screenhelo、Droplr、ImageOptim、Mou

### コマンドライン

Vagrant、heroku、imagemagic、java、phantomjs、jenkins、wget

### Homebrew産

tree、lua、luajit

### gem

compass、json、sass、twitter

### Nodejsモジュール

asciify、coffee-script、grunt-cli、mocha、titanium、typescript、yuidocjs

### その他

Android SDK、Google日本語入力、ログインシェルをzshに、OSXの設定諸々

結構色々と入れました。
  
これが揃ってれば僕の環境はほぼ100%再現できるので、これらを設定ファイルに指定しておきます。

設定ファイルの書き方などは、boxenのGithubのREADME(英語)や、
  
先ほどリンクしたboxen紹介記事などを御覧ください。

> (再)[Mac – Boxen使わなくても許されるのは2012年までだよね – Qiita [キータ]](http://qiita.com/yuku_t/items/c6f20de0e4f4c352046c)

boxenしてみる
----------------------------------------

設定ファイルを書いたら、それをクリーンインストールしたMacに適用します。
  
まずは、App storeからXcodeをインストールして、
  
設定にあるCommand Line Toolもインストールします。

Command Line Toolをインストールするとgccやgitがインストールされます。

そしたらターミナルから先ほど作ったboxenのリポジトリをcloneして実行します。 今回は、僕のboxenを使用する例を示します。

```
$ sudo mkdir -p /opt/boxen
$ sudo chown ${USER}:staff /opt/boxen
$ git clone  /opt/boxen/repo
$ cd /opt/boxen/repo
$ script/boxen
```

管理者パスワードを求められたり、Githubにログインするよう言われるので、
  
それを入力したらあとはboxenが完了するのを待つだけです。

上記の設定だと、回線によりますがだいたい1時間くらいで終わると思います。

boxenが完了したら、最後にひとつ書き加えます。

僕の場合はログインシェルをzshに書き換えているので、
  
.zshrcに

```
[ -f /opt/boxen/env.sh ] && source /opt/boxen/env.sh
[ -f /opt/boxen/nvm/nvm.sh ] && source /opt/boxen/nvm/nvm.sh
```

と書いて、`source ~/.zshrc`とコマンドを実行し、適用します。

これでboxenから入れたもののパスが全て通り、準備完了です。

あとは、App storeから買ったアプリをダウンロードしたり、
  
諸々細かい調整してください。

作業完了後のMBAのMac
----------------------------------------

お疲れ様でした。
  
さて、どれくらい容量がダイエットできているかというと、驚きでした。

<img src="/images/2013/08/8edc4b2ac5826e677782f1fd6acaffd4.png" alt="スクリーンショット 2013 08 04 14 12 23" title="スクリーンショット 2013-08-04 14.12.23.png" width="597" />

こんなに必要な容量が減るってどれだけゴミファイル溜まってたんでしょうね。。。
  
分類も、ぱっと見正常に表示されていると思います。
  

  
何はともあれ、これで開発環境を整えつつ、容量を大幅にダイエット出来ました。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>