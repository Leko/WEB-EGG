---
title: CLIだけでReact NativeアプリをビルドしてDeployGateにデプロイする方法
date: 2017-08-22 10:30 JST
tags:
  - iOS
  - Android
  - React Native
  - DeployGate
---

こんにちは。  
仕事で React Native を触っているのですが、ステージング（DeployGate）へアプリを反映するときに、

- Xcode を起動
- Product > Archive を選択
- しばらく待つ
- エクスポート方法（Ad-Hoc）を選択
- オプション（Code Signing に使用するアカウント）を選択
- しばらく待つ
- DeployGate を開く
- 出来上がった ipa ファイルを DeployGate にドロップ

という手作業をちまちまやるのが面倒になったので、  
どうにかできないか調べてみたら CLI だけで完結できたので、その方法を残します

<!--more-->

## iOS アプリで.ipa ファイルを作成する

iOS で ipa ファイルを作るには、ビルドとエクスポートの２ステップが必要です。
どちらも`xcodebuild`コマンドで実行できます。

### ipa ファイルを作るための下準備

Xcode の起動は必要ありませんが、インストールは必要です。  
インストールした上で、Xcode のコマンドラインツールもインストールしておいてください。

> &mdash; [Running On Device – React Native | A framework for building native apps using React](https://facebook.github.io/react-native/releases/0.19/docs/running-on-device-ios.html)

### xcodebuild でビルド

ビルドするには、プロジェクトルートで以下のコマンドを実行します。

```
xcodebuild \
  -project "ios/{プロジェクト名}.xcodeproj" \
  -scheme "{スキーム名}" \
  archive \
  -archivePath "./target/{スキーム名}.xcarchive"
```

プロジェクト名はおそらく問題ないと思います。  
`{スキーム名}`は、`xcodebuild -list -project "ios/{プロジェクト名}.xcodeproj"`とコマンドを打つとスキーム名の一覧が出てくるので、そこからコピーするといいと思います。

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

のような出力が得られると思うので、`Schemes:`以下に出力されている行をコピーしましょう。

### xcodebuild で IPA ファイルを作成

IPA ファイルを作るには、以下のコマンドを入力します。

```bash
xcodebuild \
  -exportArchive \
  -archivePath "前述のコマンドで-archivePathに指定した値" \
  -exportPath "出力先のディレクトリ" \
  -exportOptionsPlist "説明します"
```

-archivePath はビルドしたファイルのパスを指定、  
-exportPath には、ipa ファイルの出力先を指定、  
-exportOptionsPlist には、**ビルド用の設定ファイル（plist）**のファイルパスを指定します。

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

Xcode の画面から ipa ファイル作ったことある方なら、なんとなくマッピングできるかと思います。  
この GUI で選択することをそのまま XML にしたものです。

![Xcode export](/images/2017/08/xcode-archive-settings.png)

## Android で APK ファイルを作成する

Android の APK ファイルつくるのはとても簡単です

### APK ファイルを作成するための下準備

> &mdash; [Android Setup – React Native | A framework for building native apps using React](https://facebook.github.io/react-native/releases/0.23/docs/android-setup.html)

で Android の開発環境のセットアップと、

> &mdash; [Generating Signed APK](https://facebook.github.io/react-native/docs/signed-apk-android.html)

で署名についてのセットアップを済ませておきます。
これをやらないと、署名ができずビルドの最後の方でエラーになります。

### Gradle で React Native アプリをビルドして APK ファイルを作成

```bash
./android/gradlew --project-dir ./android assembleRelease
```

これだけです。  
`--project-dir`を指定しないとディレクトリがずれてうまくいきません。

## DeployGate API でアプリをアップロード

iOS で ipa ファイルを、Android で apk ファイルを生成できたら、DeployGate へアップロードします。  
あらかじめログインして API キーを入手しておいてください。

コマンドはこんな感じでいかがでしょう。  
Git の最新コミットメッセージを混ぜていたりとか、好みが分かれる処理も入っているので書き換えて使用してください。

コミット ID、メッセージが入っていると、反映されたバージョンを確認できるので便利だと思います。

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

## さいごに

[Fastlane の gym](https://github.com/fastlane/fastlane/tree/master/gym)コマンドが同じようなことをしてくれますが、  
Fastlane 自体の学習コストは決して安くないので、もっと質素にビルドできる方法が見つかってよかったです。  
主に Xcode 周りの面倒なところ、安く自動化できる手作業はガンガン自動化して開発効率あげましょう!!!

なお、今回の記事のコマンドたちは[Gist](https://gist.github.com/Leko/e6d205993466ce7865a905259b6d18a2)に上げてあります。  
ぜひ見てみてください
