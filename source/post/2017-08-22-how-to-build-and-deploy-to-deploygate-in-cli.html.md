---
title: CLIだけでReactNativeアプリをビルドしてDeployGateにデプロイする方法
date: 2017-08-22 10:30 JST
tags:
- iOS
- Android
- ReactNative
- DeployGate
---

こんにちは。  
仕事でReactNativeを触っているのですが、ステージング（DeployGate）へアプリを反映するときに、

* XCodeを起動
* Product > Archiveを選択
* しばらく待つ
* エクスポート方法（Ad-Hoc）を選択
* オプション（Code Signingに使用するアカウント）を選択
* しばらく待つ
* DeployGateを開く
* 出来上がったipaファイルをDeployGateにドロップ

という手作業をちまちまやるのが面倒になったので、  
どうにかできないか調べてみたらCLIだけで完結できたので、その方法を残します

<!--more-->

iOSアプリで.ipaファイルを作成する
---------------------------
iOSでipaファイルを作るには、ビルドとエクスポートの２ステップが必要です。
どちらも`xcodebuild`コマンドで実行できます。

### ipaファイルを作るための下準備
XCodeの起動は必要ありませんが、インストールは必要です。  
インストールした上で、XCodeのコマンドラインツールもインストールしておいてください。

> &mdash; [Running On Device – React Native | A framework for building native apps using React](https://facebook.github.io/react-native/releases/0.19/docs/running-on-device-ios.html)

### xcodebuildでビルド
ビルドするには、プロジェクトルートで以下のコマンドを実行します。

```
xcodebuild \
  -project "ios/{プロジェクト名}.xcodeproj" \
  -scheme "{スキーム名}" \
  archive \
  -archivePath "./target/{スキーム名}.xcarchive"
```

プロジェクト名はおそらく問題ないと思います。  
`{スキーム名}`は、`xcodebuild -list -project "ios/{プロジェクト名}.xcodeproj"`とコマンドを打つとスキーム名の一覧が出てくるので、そこからコピペするといいと思います。

```bash
$ xcodebuild -list -project ios/{アプリ}.xcodeproj/
Information about project "{アプリ}":
    Targets:
        {アプリ}
        {アプリ}Tests
        {アプリ}-tvOS
        {アプリ}-tvOSTests

    Build Configurations:
        Debug
        Release

    If no build configuration is specified and -scheme is not passed then "Release" is used.

    Schemes:
        {アプリ}
        ...
```

みたいな出力が得られると思うので、`Schemes:`以下に出力されている行をコピペしましょう。

### xcodebuildでIPAファイルを作成
IPAファイルを作るには、以下のコマンドを入力します。

```bash
xcodebuild \
  -exportArchive \
  -archivePath "前述のコマンドで-archivePathに指定した値" \
  -exportPath "出力先のディレクトリ" \
  -exportOptionsPlist "説明します"
```

-archivePathはビルドしたファイルのパスを指定、  
-exportPathには、ipaファイルの出力先を指定、  
-exportOptionsPlistには、**ビルド用の設定ファイル（plist）**のファイルパスを指定します。

ビルド用の設定ファイル（plist）はこんな感じです。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>ad-hoc</string>

    <key>uploadBitcode</key>
    <false/>

    <key>uploadSymbols</key>
    <true/>
</dict>
</plist>
```

XCodeの画面からipaファイル作ったことある方なら、なんとなくマッピングできるかと思います。  
このGUIで選択することをそのままXMLにしたものです。

![XCode export](/images/2017/08/xcode-archive-settings.png)

AndroidでAPKファイルを作成する
---------------------------
AndroidのAPKファイルつくるのはとても簡単です

### APKファイルを作成するための下準備
> &mdash; [Android Setup – React Native | A framework for building native apps using React](https://facebook.github.io/react-native/releases/0.23/docs/android-setup.html)

でAndroidの開発環境のセットアップと、

> &mdash; [Generating Signed APK](https://facebook.github.io/react-native/docs/signed-apk-android.html)

で署名についてのセットアップを済ませておきます。
これをやらないと、署名ができずビルドの最後の方でエラーになります。

### GradleでReactNativeアプリをビルドしてAPKファイルを作成

```bash
./android/gradlew --project-dir ./android assembleRelease
```

これだけです。  
`--project-dir`を指定しないとディレクトリがずれてうまくいきません。

DeployGate APIでアプリをアップロード
---------------------------
iOSでipaファイルを、Androidでapkファイルを生成できたら、DeployGateへアップロードします。  
あらかじめログインしてAPIキーを入手しておいてください。

コマンドはこんな感じでいかがでしょう。  
Gitの最新コミットメッセージを混ぜていたりとか、好みが分かれる処理も入っているので書き換えて使用してください。

コミットID、メッセージが入っていると、反映されたバージョンを確認できるので便利だと思います。

```bash
#!/usr/bin/env bash
# Usage:
#   DEPLOY_GATE_TOKEN=XXXXX deploy <apk or ipa path> [DEPLOYGATE_USERNAME] [DEPLOY_MESSAGE]

set -eux

PKG_PATH=$1
DEPLOYGATE_USERNAME=${2:-CureApp-dev}
DEPLOY_MESSAGE=${3:-$(git log --oneline --no-merges -n1 --color=never)}

curl \
  -F "token=$DEPLOY_GATE_TOKEN" \
  -F "file=@$PKG_PATH" \
  -F "message=$DEPLOY_MESSAGE" \
  https://deploygate.com/api/users/$DEPLOYGATE_USERNAME/apps
```

このファイルを`scripts/deploy`だとすると、こんな感じで使用します。

```bash
DEPLOY_GATE_TOKEN=XXXXX ./scripts/deploy target/アプリ名.ipa Leko
```

さいごに
---------------------------
[Fastlaneのgym](https://github.com/fastlane/fastlane/tree/master/gym)コマンドが同じようなことをしてくれますが、  
Fastlane自体の学習コストは決して安くないので、もっと質素にビルドできる方法が見つかってよかったです。  
主にXCode周りの面倒なところ、安く自動化できる手作業はガンガン自動化して開発効率あげましょう！！！

なお、今回の記事のコマンドたちは[Gist](https://gist.github.com/Leko/e6d205993466ce7865a905259b6d18a2)に上げてあります。  
ぜひ見てみてください
