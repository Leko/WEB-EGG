---
title: KeyboardAvoidingViewが使いこなせなかったのでKeyboardSpacer的なものを作った
date: 2017-09-05 11:55 JST
tags:
- ReactNative
- JavaScript
---

こんにちは。  
ReactNativeで開発している時の困ることあるあるの１つで、「キーボードに要素が隠れる」があると思います。  
効率のためについついデバッグ途中はシミュレータをPCのキーボードと接続してしまい、画面にキーボードが表示された時のレイアウトを確認し忘れることがあります。  
そんなキーボードの高さ・レイアウト問題を解消するための公式の[KeyboardAvoidingView](http://facebook.github.io/react-native/releases/0.47/docs/keyboardavoidingview.html#keyboardavoidingview)というComponentがあるのですが、これの挙動があまり直感的ではなく、手に馴染んでくれない。  

[react-nativeのリポジトリにも色々Issue](https://github.com/facebook/react-native/issues?utf8=%E2%9C%93&q=is%3Aissue%20KeyboardAvoidingView%20%20example)が上がっており色々な開発者の方が使い方に悩んでいるようなのですが、「これだ！」という情報には行きあたれず。  
別のアプローチを取れないか模索してみたところ、いい感じの使い心地にできたので、残そうと思います。

<!--more-->

## はじめに

作ったものはこちらで試せます。

{{{TODO}}}

ReactNative周辺のバージョンは以下の通りです

|package|version|
|---|---|
|react||
|react-native||
|react-native-cli||

## やりたいこと


## KeyboardAvoidingViewの挙動
> &mdash; [React Nativeで画面を作ってるときにキーボードでボタンが隠れて困るときに使えるKeyboardAvoidingViewが良いという話 - ぽっちぽちにしてやんよ](http://blog.pchw.io/entry/2017/06/07/132628)

こちらの記事がとても分かり易かったです。  
`behavior`プロパティに与えられる値（キーボードの制御方法）は大きく分けて挙動は３通りで、

* `padding`: ViewにpaddingBottomをセットする。一番求めるものに近いが、高さが合わなかったりする。よく分からない
* `height`: Viewにheightを指定する。なぜかキーボードが消えてもたかさが戻らないという意味わからないバグを孕む
* `position`: Viewのpositionを上にずらす。高さ自体が変わるわけじゃないので要素が上に消えるという本末転倒な状態

で、私の用途ではpadding以外を指定したいユースケースは思い浮かびませんでした。

## Keyboard API

KeyboardAvoidingViewとは別に、[Keyboard](http://facebook.github.io/react-native/releases/0.47/docs/keyboard.html#keyboard)というAPIが公式から提供されています。  
このAPIは`keyboardDidShow`, `keyboardDidHide`などの、**キーボードに関するイベントの発火**や、**キーボードの高さの取得**機能を提供してくれます。

KeyboardAvoidingViewとは違いこっちはかなり直感的なI/Fなので、これなら頑張れそうということで採用。

## 考えたレイアウト

色々なサイズのデバイスがあるので、可能な限り固定値でのレイアウトを使いたくない。  
ということで、こんなレイアウトがいいかなと思います。

```
+----------------------------------+
|+--------------------------------+|
||                                ||
||                                ||
||        ViewA(flex: 1)          ||
||                                ||
||                                ||
|+--------------------------------+|
||     ViewB(KeyboardSpacer)      ||
|+--------------------------------+|
+----------------------------------+
```

ViewAはただのViewで、flex:1のスタイルを当てておきます  
ViewBが今回作るコンポーネントで、キーボードの高さに応じて自動的に高さが変わります。  
ViewAはflexになっているので、ViewBの高さに応じて**自動的に残りの高さ**に変わります。  
こうするとViewA自体はキーボードのこと自体を一切考慮しなくてよくなります。

ルートコンポーネントとかにKeyboardSpacerを入れておいて、上記の階層構造になるようにしておけば、キーボードの高さに応じて全画面が高さ変わるように対応できます。

## KeyboardSpacer

### 高さの制御

### アニメーション
なくてもいいかなと思ったのですが、ガクッと高さが変わるのはあまり自然な動きではなかったので入れました。  
あまり細かい頻度でアニメーションさせるとAndroidでカクつきます。

### 画面の回転の制御

## さいごに

キーボードの考慮は忘れやすく、発覚後の対応はほぼ必須になると思うので、  
なるべく先手で対応しておいて、思考停止で作ってても勝手に対応されてる状態がいいと思います。  

Keyboard APIも公式っちゃ公式ではあるのですが、自前のロジックがわずかに入るこんでしまっています。  
もちろん公式のコンポーネントであるKeyboardAvoidingView側で完全な対応がなされる方があるべき姿だと思うので、今後もアップデートを監視しつつ、なるべくなアプローチが取れればと思います。
