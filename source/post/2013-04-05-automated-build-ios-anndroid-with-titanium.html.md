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
  - iOSアプリ
  - JavaScript
  - Titanium studio
---
こんにちは。れこです。  
最近は、友人と[いちれこプロジェクト](https://www.facebook.com/IchiLeko)という活動をしていまして、  
まだ詳細は非公開ですが、iOSとAndroid両方に対応したアプリを作っています。

双方のプラットフォーム用の言語や、独自仕様を覚えるのは面倒なので、

**JavaやObjective-Cを書かなくても  
AndroidもiOSでも動くアプリを作れないかなぁ。**

と、探したらありました。

夢を叶えてくれたのが「Titanium-cli」です。  
JavaScriptで記述して、AndroidやiOS向けにビルドが出来るツールです。

<!--more-->

GUIの開発環境「Titanium Studio」でも良いのですが、  
Eclipseライクな開発環境が苦手（嫌い）なのでCLIのほうを使って、  
環境の準備からアプリのビルドまで行いたいと思います。

さらに、  
TitaniumではJavaScriptが使えるので、楽なCoffeeScriptで書こうと思いつき、  
そしたら**保存時にCoffeeScriptの自動コンパイル＋アプリの自動ビルドもしたいなぁ。**

と思ったので、 **Grunt**という諸々自動化ツールについての手順をまとめてメモします。

事前に必要なもの
----------------------------------------

iOSアプリの開発をするため、Macは必須です。  
他には、お好みのテキストエディタなどをご用意下さい。  
なお、今回の記事は、

* **MacBook Air 11インチ**
* **OS　：Mac OS X 10.8.3 Moutain Lion**
* **CPU：Intel Core i7 1.8GHz**
* **メモリ：4GB**

のPCで試しています。

前編ではTitanium-cliの環境整備から、アプリのビルドまでを、  
後編ではGruntを導入して自動化を行なっていきます。

## 1.Titanium Studioをインストールする

まずは、Titanium-cliのGUI版「Titanium Studio」をインストールします。  
こちらの方がAndroidSDKの設定が楽なので、設定をするために使います。

まず、Titaniumシリーズを公開している[Appcelerator](http://www.appcelerator.com/)を開きます。

<img src="/images/2013/04/appcelerator1.png" alt="Appcelerator" title="appcelerator.png" border="0" width="600" height="374" />

次に、[Download Titanium for Free]をクリックして、会員登録をします。  
この会員情報は後々使うので、忘れないようにしておいて下さい。

会員登録が完了すると、以下のような画面に行くと思います。

<img src="/images/2013/04/download_tstudio.png" alt="Download tstudio" title="download_tstudio.png" border="0" width="600" height="296" />

このページの、[Download Titanium Studio]をクリックして、  
「osx」を選択してTitanium Studioをダウンロードします。

Titanium Studioを起動したら、  
メニュー→Titanium Studio→環境設定を開きます。  
[Titanium]を選択して、Android SDKの保存場所を設定します。

<img src="/images/2013/04/setting-android-sdk.png" alt="Setting android sdk" title="setting-android-sdk.png" border="0" width="600" height="109" />

今回の記事では、  
**/Developers/android-sdk/**  
に設置することにします。

2.iOS,AndroidのSDKを入手する
----------------------------------------

iOSのSDKは、Xcodeのからインストールして下さい。 インストールが完了すると、**iOSのSDKは**Titaniumが自動的に認識してくれます。

AndroidのSDKは自分でパスを指定してあげないといけません。 先ほどの設定で指定した、**/Developers/android-sdk/**の中に、 AndroidのSDKを入れてあげます。

Titanium Studioのダッシュボードに行き、 **Configure Native SDKs**の、[AndroidSDK]をクリックします。

すると、AndroidのSDKをインストールするマネージャーが起動します。

<img src="/images/2013/04/android-sdk-list.png" alt="Android sdk list" title="android-sdk-list.png" border="0" width="546" height="528" />

とりあえず最新版と、Tools、**API8**、**API7**をインストールすればOKかと思います。

API8はTitanium Studioには必須で、  
API7が無いとエミュレータの起動でエラーが出てたので、API7もインストールします。  
その他は、対象にするOSによって適宜インストールしてください。

これでSDKの設定は完了です。  
ダッシュボードに戻って、Get startedを見て下さい。

<img src="/images/2013/04/6771558919b40e75d25738805045577f.png" alt="スクリーンショット 2013 04 02 16 25 30" title="スクリーンショット 2013-04-02 16.25.30.png" border="0" width="355" height="147" />

上記のように、 AndroidSDKのアイコンから「？」が消えていたら、読み込みに成功しています。

3.Node.jsをインストールする
----------------------------------------

Titanium-cliを使うには、**npm**というパッケージ管理システムが必要です。  
そして、npmは**Nodejs**をインストールすると自動的に使えるようになります。

なので、Nodejsをインストールします。  
**brew**コマンドでインストールするのが手っ取り早いかと思います。

ターミナルを立ち上げ、以下の内容を入力して下さい。

```
$ cd ~
$ brew update && brew install node
```

brewのインストールについては、ググってください。

> [[Mac] Mountain Lionへパッケージ管理「Homebrew」をインストールする手順のメモ | Tools 4 Hack](http://tools4hack.santalab.me/howto-mountainlion-install-homebrew.html)

Nodejsのインストールが出来たら、動作確認のためバージョンを確認します。

```
$ node -v
v0.8.17
$ npm -v
1.2.0
```

バージョンが出てきたら、OKです。

4.titanium-cliをインストールする
----------------------------------------

Nodejsをインストールしてnpmが使えるようになったので、  
**titanium-cli**をグローバルインストールします。

```
$ sudo npm install -g titanium
```

インストールするときには、Titanium-cliではなく、**titanium**です。 パスワードを聞かれたらMacのパスワードを入力。

titaniumのインストールしたら、一応バージョンを確認します。

```
$ titanium -v
3.0.24
```

バージョンが表示されたらOKです。

5.Titanium-cliの設定をする
----------------------------------------

Titanium-cliのインストールが完了したので、 次に環境設定を行います。とても簡単です。

ターミナルに、

```
$ titanium setup
```

と入力します。 いくつか設定項目があるので、指示通り入力します。

* **What is your name?**
      * ユーザー名。半角アルファベットならなんでもOKです
* **What is your email address used for logging into the Appcelerator Network?**
      * 先ほどAppceleratorに登録したメールアドレスを入力します
* **What would you like as your default locale?**
      * 国を指定します。日本の方なら`ja`と入力
* **What Titanium SDK would you like to use by default? (3.0.2.GA)**
      * Titanium SDKのバージョンを指定します。  
        `(3.0.2.GA)`と表示されていたら、そのままEnter
* **Path to your workspace where your projects should be created**
      * プロジェクトを作成するときのパスを指定する  
        `./`と入力しておけばOKかと
* **Path to the Android SDK**
      * Android SDKのパスを指定する  
        先ほどTitanium Studioで設定した通り、`/Developers/android-sdk/`と入力

これらを記入して、`Configuration saved`と表示されれば、設定完了です。

6.プロジェクトを作成する
----------------------------------------

設定が完了したので、早速プロジェクトを作成します。

ターミナルに以下のように入力します

```
$ titanium create
```

またいくつか質問をされるので、埋めていきます。

* **Target platforms**
    * 対象のプラットフォームをカンマ区切りで入力  
      今回はiosとandroid用のアプリを作りたいので、`android,ios`と入力
* **App ID**
    * アプリのIDを入力  
      これは、自分のドメインを逆順に書き、最後に`.アプリ名`を書くのが通例のようです。  
      私の場合、持っているドメインは`leko.jp`なので、  
      アプリ名を`myapp`とすると、App IDは`jp.leko.myapp`となります
* **Project name**
    * アプリの名前を入力  
      App IDで`myapp`としたので、そのまま`myapp`と入力

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

7.ビルドしてエミュレーターを起動する
----------------------------------------

次に、アプリをビルドして  
iOSのシミュレータ、Androidのエミュレータで起動してみます。

プロジェクトをcreateした時点で、実は簡単なアプリが記述されています。 なので、何かプログラムを書く必要なく動作確認ができます。

まず、iOSのアプリ形式にビルドします。  
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

そのまましばらく待っていると、 iOSシミュレータが起動して、アプリが表示されると思います。

<img src="/images/2013/04/preview_io.png" alt="Preview io" title="preview_io.png" border="0" width="312" height="600" />

次に、Androidのアプリ形式にビルドします。 ターミナルの以下の内容を入力して下さい。

```
$ titanium build -p android
```

**Androidのエミュレータは重い**ので、１〜２分くらいのんびり待ってみて下さい。

<img src="/images/2013/04/preview_an.png" alt="Preview an" title="preview_an.png" border="0" width="400" />

iOSのシミュレータと同じように、  
Androidのエミュレータが起動してアプリが表示されればOKです。

ビルドを自動化する
----------------------------------------

先述の**ビルドしてエミュレータを起動する**までの内容で、  
**手動での**アプリのビルドとエミュレータの起動は出来ます。

しかし、CoffeeScirptを使ったり、  
ビルドを**自動化**したい方は、ぜひ後編(作成中)を御覧ください。

### 参考サイト

* [Titanium Mobile入門 (全28回) – プログラミングならドットインストール](http://dotinstall.com/lessons/basic_titanium)
* [先取り "新" Titanium CLI \| old.imthinker.net](http://old.imthinker.net/2012/10/anticipate-new-titanium-cli/)
* [Titanium CLIのセットアップ・ビルドなど導入編 ::ハブろぐ](http://havelog.ayumusato.com/develop/others/e549-titanium_cli_install.html)

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>