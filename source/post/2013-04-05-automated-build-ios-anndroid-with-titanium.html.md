---
path: /post/automated-build-ios-anndroid-with-titanium/
title: titanium-cliとGruntを使って、コマンドラインからiOS・Androidアプリのビルドを自動化する方法(前編)
date: 2013-04-05T01:07:33+00:00
twitter_id:
  - "319843716883955712"
dsq_thread_id:
  - "3138705057"
image: /images/2013/04/20130405_titanium-cli1-604x244.jpg
categories:
  - 問題を解決した
tags:
  - Android
  - iOS
  - JavaScript
  - Titanium studio
---

こんにちは。れこです。  
最近は、友人と[いちれこプロジェクト](https://www.facebook.com/IchiLeko)という活動をしていまして、  
まだ詳細は非公開ですが、iOS と Android 両方に対応したアプリを作っています。

双方のプラットフォーム用の言語や、独自仕様を覚えるのは面倒なので、

**Java や Objective-C を書かなくても  
Android も iOS でも動くアプリを作れないかなぁ。**

と、探したらありました。

夢を叶えてくれたのが「Titanium-cli」です。  
JavaScript で記述して、Android や iOS 向けにビルドが出来るツールです。

<!--more-->

GUI の開発環境「Titanium Studio」でも良いのですが、  
Eclipse ライクな開発環境が苦手（嫌い）なので CLI のほうを使って、  
環境の準備からアプリのビルドまで行いたいと思います。

さらに、  
Titanium では JavaScript が使えるので、楽な CoffeeScript で書こうと思いつき、  
そしたら**保存時に CoffeeScript の自動コンパイル＋アプリの自動ビルドもしたいなぁ。**

と思ったので、 **Grunt**という諸々自動化ツールについての手順をまとめてメモします。

## 事前に必要なもの

iOS アプリの開発をするため、Mac は必須です。  
他には、お好みのテキストエディタなどをご用意下さい。  
なお、今回の記事は、

- **MacBook Air 11 インチ**
- **OS 　：Mac OS X 10.8.3 Moutain Lion**
- **CPU：Intel Core i7 1.8GHz**
- **メモリ：4GB**

の PC で試しています。

前編では Titanium-cli の環境整備から、アプリのビルドまでを、  
後編では Grunt を導入して自動化を行なっていきます。

## 1.Titanium Studio をインストールする

まずは、Titanium-cli の GUI 版「Titanium Studio」をインストールします。  
こちらの方が AndroidSDK の設定が楽なので、設定をするために使います。

まず、Titanium シリーズを公開している[Appcelerator](http://www.appcelerator.com/)を開きます。

![Appcelerator](/images/2013/04/appcelerator1.png)

次に、[Download Titanium for Free]をクリックして、会員登録をします。  
この会員情報は後々使うので、忘れないようにしておいて下さい。

会員登録が完了すると、以下のような画面に行くと思います。

![Downloa](/images/2013/04/download_tstudio.png)

このページの、[Download Titanium Studio]をクリックして、  
「osx」を選択して Titanium Studio をダウンロードします。

Titanium Studio を起動したら、  
メニュー →Titanium Studio→ 環境設定を開きます。  
[Titanium]を選択して、Android SDK の保存場所を設定します。

![Settin](/images/2013/04/setting-android-sdk.png)

今回の記事では、  
**/Developers/android-sdk/**  
に設置することにします。

## 2.iOS,Android の SDK を入手する

iOS の SDK は、Xcode のからインストールして下さい。 インストールが完了すると、**iOS の SDK は**Titanium が自動的に認識してくれます。

Android の SDK は自分でパスを指定してあげないといけません。 先ほどの設定で指定した、**/Developers/android-sdk/**の中に、 Android の SDK を入れてあげます。

Titanium Studio のダッシュボードに行き、 **Configure Native SDKs**の、[AndroidSDK]をクリックします。

すると、Android の SDK をインストールするマネージャーが起動します。

![Androi](/images/2013/04/android-sdk-list.png)

とりあえず最新版と、Tools、**API8**、**API7**をインストールすれば OK かと思います。

API8 は Titanium Studio には必須で、  
API7 が無いとエミュレータの起動でエラーが出てたので、API7 もインストールします。  
その他は、対象にする OS によって適宜インストールしてください。

これで SDK の設定は完了です。  
ダッシュボードに戻って、Get started を見て下さい。

![スクリーンショッ](/images/2013/04/6771558919b40e75d25738805045577f.png)

上記のように、 AndroidSDK のアイコンから「？」が消えていたら、読み込みに成功しています。

## 3.Node.js をインストールする

Titanium-cli を使うには、**npm**というパッケージ管理システムが必要です。  
そして、npm は**Nodejs**をインストールすると自動的に使えるようになります。

なので、Nodejs をインストールします。  
**brew**コマンドでインストールするのが手っ取り早いかと思います。

ターミナルを立ち上げ、以下の内容を入力して下さい。

```
$ cd ~
$ brew update && brew install node
```

brew のインストールについては、ググってください。

> [[Mac] Mountain Lion へパッケージ管理「Homebrew」をインストールする手順のメモ | Tools 4 Hack](http://tools4hack.santalab.me/howto-mountainlion-install-homebrew.html)

Nodejs のインストールが出来たら、動作確認のためバージョンを確認します。

```
$ node -v
v0.8.17
$ npm -v
1.2.0
```

バージョンが出てきたら、OK です。

## 4.titanium-cli をインストールする

Nodejs をインストールして npm が使えるようになったので、  
**titanium-cli**をグローバルインストールします。

```
$ sudo npm install -g titanium
```

インストールするときには、Titanium-cli ではなく、**titanium**です。 パスワードを聞かれたら Mac のパスワードを入力。

titanium のインストールしたら、一応バージョンを確認します。

```
$ titanium -v
3.0.24
```

バージョンが表示されたら OK です。

## 5.Titanium-cli の設定をする

Titanium-cli のインストールが完了したので、 次に環境設定を行います。とても簡単です。

ターミナルに、

```
$ titanium setup
```

と入力します。 いくつか設定項目があるので、指示通り入力します。

- **What is your name?** \* ユーザー名。半角アルファベットならなんでも OK です
- **What is your email address used for logging into the Appcelerator Network?** \* 先ほど Appcelerator に登録したメールアドレスを入力します
- **What would you like as your default locale?** \* 国を指定します。日本の方なら`ja`と入力
- **What Titanium SDK would you like to use by default? (3.0.2.GA)** \* Titanium SDK のバージョンを指定します。  
   `(3.0.2.GA)`と表示されていたら、そのまま Enter
- **Path to your workspace where your projects should be created** \* プロジェクトを作成するときのパスを指定する  
   `./`と入力しておけば OK かと
- **Path to the Android SDK** \* Android SDK のパスを指定する  
   先ほど Titanium Studio で設定した通り、`/Developers/android-sdk/`と入力

これらを記入して、`Configuration saved`と表示されれば、設定完了です。

## 6.プロジェクトを作成する

設定が完了したので、早速プロジェクトを作成します。

ターミナルに以下のように入力します

```
$ titanium create
```

またいくつか質問をされるので、埋めていきます。

- **Target platforms**
  - 対象のプラットフォームをカンマ区切りで入力  
    今回は ios と android 用のアプリを作りたいので、`android,ios`と入力
- **App ID**
  - アプリの ID を入力  
    これは、自分のドメインを逆順に書き、最後に`.アプリ名`を書くのが通例のようです。  
    私の場合、持っているドメインは`leko.jp`なので、  
    アプリ名を`myapp`とすると、App ID は`jp.leko.myapp`となります
- **Project name**
  - アプリの名前を入力  
    App ID で`myapp`としたので、そのまま`myapp`と入力

上記を入力すると、

```
[INFO]  Creating Titanium Mobile application project
[INFO]  Copying "android" platform resources
[INFO]  Copying "iphone" platform resources
[INFO]  Project 'myapp' created successfully in 76ms
```

とメッセージが出てきます。 これでプロジェクトが作成できました。

生成されるファイルはこんな感じになっていると思います。

```
- LICENSE
- README
- Resources/
    - KS_nav_ui.png
    - KS_nav_views.png
    - app.js
    - android
        - 省略
    - iphone
        - 省略
- manifest
- tiapp.xml
```

## 7.ビルドしてエミュレーターを起動する

次に、アプリをビルドして  
iOS のシミュレータ、Android のエミュレータで起動してみます。

プロジェクトを create した時点で、実は簡単なアプリが記述されています。 なので、何かプログラムを書く必要なく動作確認ができます。

まず、iOS のアプリ形式にビルドします。  
ターミナルに以下の内容を入力

```
$ titanium build -p ios
```

すると、以下のようにずらっとアプリの情報や進捗状況が表示されます。

```
Titanium Command-Line Interface, CLI version 3.0.24, Titanium SDK version 3.0.2.GA
Copyright (c) 2012-2013, Appcelerator, Inc.  All Rights Reserved.

Please report bugs to http://jira.appcelerator.org/

[INFO]  Build type: development
[INFO]  Building for target: simulator
[INFO]  Building using iOS SDK: 6.1
[INFO]  Building for iOS iPhone Simulator: 6.1
[INFO]  Building for device family: universal
[INFO]  Building for iOS 6.1; using 4.3 as minimum iOS version
[INFO]  Minimum iOS version: 4.3
[INFO]  Debugging disabled
[INFO]  Initiating prepare phase
[INFO]  Forcing rebuild: /Developer/myapp/build/iphone/build-manifest.json does not exist
[INFO]  Forcing rebuild: debugger.plist does not exist
[INFO]  No Titanium Modules required, continuing
[INFO]  Performing full rebuild
[INFO]  Copying Xcode iOS files
[INFO]  Creating Xcode project directory: /Developer/myapp/build/iphone/myapp.xcodeproj
[INFO]  Writing Xcode project data file: Titanium.xcodeproj/project.pbxproj
[INFO]  Writing Xcode project configuration: project.xcconfig
[INFO]  Writing Xcode module configuration: module.xcconfig
[INFO]  Creating symlinks for simulator build
[INFO]  Forcing rebuild: ApplicationDefaults.m has changed since last build
[INFO]  Writing properties to ApplicationDefaults.m
[INFO]  No module resources to copy
[INFO]  No CommonJS modules to copy
[INFO]  Invoking xcodebuild
[INFO]  Finished building the application in 24s 938ms
...
```

そのまましばらく待っていると、 iOS シミュレータが起動して、アプリが表示されると思います。

![Previe](/images/2013/04/preview_io.png)

次に、Android のアプリ形式にビルドします。 ターミナルの以下の内容を入力して下さい。

```
$ titanium build -p android
```

**Android のエミュレータは重い**ので、１〜２分くらいのんびり待ってみて下さい。

![Previe](/images/2013/04/preview_an.png)

iOS のシミュレータと同じように、  
Android のエミュレータが起動してアプリが表示されれば OK です。

## ビルドを自動化する

先述の**ビルドしてエミュレータを起動する**までの内容で、  
**手動での**アプリのビルドとエミュレータの起動は出来ます。

しかし、CoffeeScirpt を使ったり、  
ビルドを**自動化**したい方は、ぜひ後編(作成中)を御覧ください。

### 参考サイト

- [Titanium Mobile 入門 (全 28 回) – プログラミングならドットインストール](http://dotinstall.com/lessons/basic_titanium)
- [先取り "新" Titanium CLI \| old.imthinker.net](http://old.imthinker.net/2012/10/anticipate-new-titanium-cli/)
- [Titanium CLI のセットアップ・ビルドなど導入編 ::ハブろぐ](http://havelog.ayumusato.com/develop/others/e549-titanium_cli_install.html)
