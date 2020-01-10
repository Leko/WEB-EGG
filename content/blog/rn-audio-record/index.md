---
title: React nativeで音声を録音する
date: 2017-07-25T10:00:00+0900
featuredImage: ./featured-image.png
tags:
- JavaScript
- React
- React Native
- iOS
- Android
---

こんにちは。  
React Nativeで音声の録音機能を実装した時のメモです。

使用するライブラリはAndroidにも対応しているので、iOS/Android両方対応してみます。

<!--more-->

つくったもの
------------------------------------------
> &mdash; [Leko/ReactNative-KitchenSink: Kitchen sink of react-native](https://github.com/Leko/ReactNative-KitchenSink)

ここにおいてあります。  
この記事に関係する差分は[このPR](https://github.com/Leko/ReactNative-KitchenSink/pull/1)になります。

先の話ですが、今後React Nativeの実験的な記事を書いていくときにここにコードを置いていこうと思います。

react-native-audioを導入
------------------------------------------
[jsierles/react-native-audio](https://github.com/jsierles/react-native-audio)というライブラリを使ってみました。  
他にも選択肢はあったんですが、Starが結構（執筆時点で417）ついていて、LicenseもMITなので採用しました。

```shell
npm install react-native-audio --save
react-native link react-native-audio
```

差分は[こちら](https://github.com/Leko/ReactNative-KitchenSink/compare/94c16d2...47a5089)を確認して下さい

Info.plistを編集
------------------------------------------
マイクを扱うには、ユーザに許可を求めるために設定を書き換える必要があります。

差分は[こちら](https://github.com/Leko/ReactNative-KitchenSink/compare/47a5089...867ca77)を確認して下さい

### iOS
`ios/ReactNativeKitchenSink/Info.plist`に追加

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This sample uses the microphone to record your speech and convert it to text.</string>
```

`<string>...</string>`のところはなぜマイクを使う必要があるのかを記入します。

> &mdash; [[iOS 10] 各種ユーザーデータへアクセスする目的を記述することが必須になるようです ｜ Developers.IO](http://dev.classmethod.jp/smartphone/iphone/ios10-privacy-data-purpose-description/)

### Android
`android/app/src/main/AndroidManifest.xml`に追加

```
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

音声の仕様を決定する
------------------------------------------
[公式のCross-platform options](https://github.com/jsierles/react-native-audio#cross-platform-options)を見てみると、  
iOS, Androidの共通項となるオーディオフォーマットは`aac`だけです。  
ということで、今回は`.aac`ファイルとして録音した音声を保存することにします。

ひとまず音になっていればいいので、サンプリングレートやチャンネル数は適当にしておきます。

録音処理
------------------------------------------
[公式のUsage](https://github.com/jsierles/react-native-audio#usage)がやや複雑なので、もう少し簡素なものを実装しました。
まるごと貼ると長くなってしまうので、全差分は[こちら](https://github.com/Leko/ReactNative-KitchenSink/blob/master/src/scenes/AudioRecord.js)を確認して下さい。

### 録音するための準備
録音を開始する前に、ファイルパスやフォーマット、メタ情報などを与えておく必要があります。

```js
  async setUp () {
    const options = {
      SampleRate: 22050,    // CDと同じ
      Channels: 1,          // モノラル
      AudioQuality: 'Low',  // 
      AudioEncoding: 'aac', // iOS/Android両対応のフォーマット
    }

    return AudioRecorder.prepareRecordingAtPath(this.props.audioPath, options)
  }
```

### 録音する
準備が整っていれば、`AudioRecorder.startRecording`を呼ぶだけです。

```js
  async record () {
    return await AudioRecorder.startRecording()
  }
```

### 録音中の経過時間を取得する
iOS/Androidともに`AudioRecorder.onProgress`というイベントハンドラが設定できます。  
これをstateやactionに渡してあげることで、何秒間録音しているかを表示したり、録音可能な秒数を制限する機能の実装などができると思います。

```js
  componentDidMount () {
    // ...
    AudioRecorder.onProgress = ({ currentTime }) => {
      this.setState({ recordingTime: Math.floor(currentTime) })
    }
  }
```

### 録音終了する（Android）
Androidの場合は`AudioRecorder.stopRecording`を呼ぶだけです。  
なぜここが揃ってないのかわからないのですが、iOSは別の方法で完了をハンドリングします

```js
  async tearDown (success) {
    this.setState({ recording: false, recorded: success, recordingTime: 0 })
  }

  async handleStop () {
    if (!this.state.recording) {
      return
    }

    const filePath = await AudioRecorder.stopRecording()
    if (Platform.OS === 'android') {
      await this.tearDown(true, filePath)
    }
  }
```

### 録音終了する（iOS）
iOS用の録音を終了する処理は`AudioRecorder.onFinished`イベントハンドラから行います  
これは、Androidのほうで出てきた`AudioRecorder.stopRecording`から内部的にコールされます  
`tearDown`は先ほど貼ったコードと同じなので割愛します

```js
  componentDidMount () {
    const isOK = flow(digger('status'), is('OK'))
    AudioRecorder.onFinished = (data) => {
      if (Platform.OS !== 'ios') {
        return
      }
      this.tearDown(isOK(data))
    }
    // ...
  }
```

録音中のstate変更とUI
------------------------------------------
上記コードの中ですでにsetStateが出ていることからもお察しの通り、  
react-native-audioは録音していることをあらわすUIは提供してくれません。自前で実装する必要があります。

べた書きコンポーネントなのでやや読みづらいかもしれませんが、  
コードを読めばどこが状態を書き換えるべきポイントかは分かるかと思います。  
もしReduxな方ならactionに変えればいいし、他のFluxでも同様に、フックポイントにあたる部分を好みの通りに改変してもらえればと思います。

録音した音声を再生する
------------------------------------------
「あ、その機能はないんだ」感がややありますが、録音した音声を再生する手段が提供されていません。  
ですが、公式のデモにもある通り、[react-native-sound](https://github.com/zmxv/react-native-sound)を利用すれば簡単に再生できます。  
名前がややこしいですが、`audio`は録音、`sound`は再生、覚えゲーです。混同しないようにご注意下さい。  

[AAC形式の音声はiOS/Androidどちらでも再生可能](https://github.com/zmxv/react-native-sound#notes)なので、録音形式をAACにしておけば、互換性にさほど悩まずに済むと思います。

あとがき
------------------------------------------
公式のREADME見るだけではやはりハマるポイントがあり、まとめておきたいと思いました。  
一度写経した上で削って最小構成にして理解していく、という方法が私が理解しやすいかなと思っています。

次回以降の記事で、

- 音声メディアで出てくる用語
- 音声メディアで出てくるファイルの形式・オーディオコーデック
- この録音した音声をS3にアップロードしたり、といった音声メディアの取扱い

などについてものんびりと書き留めていこうと思っていますので、ぜひ今後の続編も読んでいただけると幸いです。
