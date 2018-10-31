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
２年ほど使っている MacBookAir の容量がほぼ埋まってしまって、  
前から**消して消してカサ増し…**を繰り返していたのですが、  
ついに消せるファイルが無くなってしまいました。

ということで、クリーンインストールすると共に、  
Github 社が提供している**boxen**というツールで、  
開発環境をコマンド一発でセットアップしてみました。

なお、  
この記事では、boxen についてあまり詳しく述べません。  
あくまで boxen した結果をメインに取り扱いますのでご了承ください。

<!--more-->

## 必要なもの

1. Mac
2. 8G 以上の容量がある USB メモリ（フォーマットしても大丈夫なもの）
3. Github のアカウント

## クリーンインストールする前の Mac

まずは、クリーンインストールする前の MBA の状況です。

![796519880](/images/2013/08/796519880.png)

**空き容量は 1.77GB**と出ているのですが、 CPU を Core i7 に増しているからなのか、重いアプリとかを立ち上げていると、  
リソースを食って**容量が足りなくなったことになる**ようで、  
「お使いのディスクはいっぱいです」とやたら警告してきます。

SSD 内の分類もすべて「その他」。おかしくなっています。

というわけで、一度**SSD をフォーマットして、OSX Mountain Lion を入れ直し**ます。  
その前に、何かあった時に備えて**必ずバックアップ**を取っておいてください。

## クリーンインストールする

Mountain Lion は、「ネットワークインストール」という、  
インストールメディアがなくてもインストール出来る方法があるのですが、

これがうまくいかなかったので、USB のインストールメディアを作っていきます。

### OS X Mountain Lion を入手

[App Store](https://itunes.apple.com/jp/app/os-x-mountain-lion/id537386512?mt=12)から Mountain Lion のインストールアプリをダウンロードします。

ダウンロードしたら、そのまま触らずに次へ行きます。

### Lion DiskMaker

インストールメディアを作るには、  
[Lion DiskMaker](http://liondiskmaker.com/)というアプリを使います。

これをインストールしたら、このような画面が表示されると思います。  
Mountain Lion のインストールメディアを作りたいので**Mountain Lion**を選択。

![スクリーンショッ](/images/2013/08/ceb206c6e130a3595674ca2c9b4f4d29.png)

先ほどダウンロードした Mountain Lion のアプリが自動的に認識されるので、  
そのまま指示に従って USB にインストールしてください。

### option キーを押しながら再起動

上記の手順を済ましたら、準備完了です。 とりあえず Mac をシャットダウンします。  
そして、今作った USB メディアを挿して、option キーを押しながら電源を入れます。

するとブート画面が出てくると思うので、**OSX Mountain Lion**を選択します。  
その後出てくるメニューの中から、**ディスクユーティリティ**を選択します。

### フォーマットする

この画面のスクショの撮り方が分からないので、  
説明では、インストール後のディスクユーティリティの画面で代用します。

左側に表示されている**Macintosh HD**を選択し、  
右側の**消去**タブを選択します。

ここで、フォーマットを指定します。 僕は**Mac OS 拡張（ジャーナリング、暗号化）**を選択しました。  
暗号化を使いたくない場合は、**Mac OS 拡張（ジャーナリング）**の方でいいと思います。

![スクリーンショッ](/images/2013/08/117ce1ca3bc4a2e2ba6b0a8fdb971c5f.png)

### OS X Mountain Lion を再インストール

消去が完了したら、ディスクユーティリティを終了します。

また先ほどのメニューが出てくると思うので、**OS X を再インストール**を選択します。 あとは、指示に従いながらインストールを進めてください。

こっから先を逐一説明していると長くなるので、詳しくはこちらを御覧ください。

> [OS X Mountain Lion（マウンテンライオン）をクリーンインストールする方法 \| 和洋風 KAI](http://wayohoo.com/mac/tips/how-to-clean-install-os-x-mountain-lion.html)

上記の記事が完了して Mac が使えるようになったらクリーンインストール完了です。

## boxen とは

boxen とは、冒頭にも書きましたが、  
Github 社が公開している Mac のセットアップツールです。  
概要についてはこちらの記事が詳しく書いているので見てみてください。

[Mac – Boxen 使わなくても許されるのは 2012 年までだよね – Qiita [キータ]](http://qiita.com/yuku_t/items/c6f20de0e4f4c352046c)

何が出来るかというと、  
「このアプリ入れます」「こんなツール入れます」と設定ファイルにあらかじめ書いておいて、  
それを実行すると、**設定したアプリやツールなどが自動でインストールされる**といった具合です。

自動で、Homeberw や Ruby、Nodejs などはインストールされます。  
導入に手間取る Ruby 周りも boxen が自動でやってくれるのがありがたい。

## boxen に設定したもの

僕が boxen で指定したものは以下です。

### ブラウザ

Chrome、Chrome Canary、Firefox、opera

### App store に無いアプリ

Evernote、Alfred、Wunderlist、iTerm2、Sublime Text2、Dropbox、Github for Mac、  
BetterTouchTool、Eclipse、XtraFinder、Sequel Pro、Virtual Box、Team Viewer、  
Screenhelo、Droplr、ImageOptim、Mou

### コマンドライン

Vagrant、heroku、imagemagic、java、phantomjs、Jenkins、wget

### Homebrew 産

tree、lua、luajit

### gem

compass、json、sass、Twitter

### Nodejs モジュール

asciify、coffee-script、grunt-cli、mocha、titanium、typescript、yuidocjs

### その他

Android SDK、Google 日本語入力、ログインシェルを zsh に、OSX の設定諸々

結構色々と入れました。  
これが揃ってれば僕の環境はほぼ 100％再現できるので、これらを設定ファイルに指定しておきます。

設定ファイルの書き方などは、boxen の Github の README(英語)や、  
先ほどリンクした boxen 紹介記事などを御覧ください。

> (再)[Mac – Boxen 使わなくても許されるのは 2012 年までだよね – Qiita [キータ]](http://qiita.com/yuku_t/items/c6f20de0e4f4c352046c)

## boxen してみる

設定ファイルを書いたら、それをクリーンインストールした Mac に適用します。  
まずは、App store から Xcode をインストールして、  
設定にある Command Line Tool もインストールします。

Command Line Tool をインストールすると gcc や Git がインストールされます。

そしたらターミナルから先ほど作った boxen のリポジトリを clone して実行します。 今回は、僕の boxen を使用する例を示します。

```shell
$ sudo mkdir -p /opt/boxen
$ sudo chown ${USER}:staff /opt/boxen
$ git clone  /opt/boxen/repo
$ cd /opt/boxen/repo
$ script/boxen
```

管理者パスワードを求められたり、Github にログインするよう言われるので、  
それを入力したらあとは boxen が完了するのを待つだけです。

上記の設定だと、回線によりますがだいたい 1 時間くらいで終わると思います。

boxen が完了したら、最後にひとつ書き加えます。

僕の場合はログインシェルを zsh に書き換えているので、  
.zshrc に

```shell
[ -f /opt/boxen/env.sh ] && source /opt/boxen/env.sh
[ -f /opt/boxen/nvm/nvm.sh ] && source /opt/boxen/nvm/nvm.sh
```

と書いて、`source ~/.zshrc`とコマンドを実行し、適用します。

これで boxen から入れたもののパスが全て通り、準備完了です。

あとは、App store から買ったアプリをダウンロードしたり、  
諸々細かい調整してください。

## 作業完了後の MBA の Mac

お疲れ様でした。  
さて、どれくらい容量がダイエットできているかというと、驚きでした。

![スクリーンショッ](/images/2013/08/8edc4b2ac5826e677782f1fd6acaffd4.png)

こんなに必要な容量が減るってどれだけゴミファイル溜まってたんでしょうね。。。  
分類も、ぱっと見正常に表示されていると思います。  
何はともあれ、これで開発環境を整えつつ、容量を大幅にダイエット出来ました。
