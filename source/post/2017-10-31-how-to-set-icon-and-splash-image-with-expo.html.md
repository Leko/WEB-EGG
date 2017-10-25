---
title: Expoではアイコンとスプラッシュ画像を指定するのに1枚あれば十分
date: 2017-10-31 10:30 JST
tags:
- React Native
- Expo
---

こんにちは。
普段仕事では[React Native](https://facebook.github.io/react-native/)(以下RN)のコードを書いているのですが、
ひょんなことから[Expo](https://expo.io/)([create-react-native-app](https://github.com/react-community/create-react-native-app))を利用することがありました。

RNでは、アプリアイコンの指定もスプラッシュ画像の指定もiOS/Androidのお作法に則ってそれぞれ各サイズ作らねばなりませんでした。  
端末のサイズもIDEもネイティブ側のAPIも日々変化するので、情報の古い記事で溢れかえりググったもののいまくいかないx30...みたいな状況です。
結局公式のガイドを都度確認すると言う方法に私は落ち着いているのですが、それでも面倒くさいのは確か。
嫌気がさしてimagemagickなどを利用して自前で変換処理を書いてらっしゃる方もいるかもしれません。

一方Expoでは、**アイコンで１枚、スプラッシュで１枚だけ**画像を指定すれば、内部でリサイズしてくれて、所定のパスへの配置までやってくれます。
もし細かく指定したい場合には、解像度や端末ごとのある程度の分岐も可能です。

そんな便利なExpoのアセットに関する機能と動作原理を読み解いてみたいと思います。

<!--more-->

アイコン画像を指定する方法
--------------------------------------------------------------------
RNとは違い、Expoを使用する場合そもそも`ios`ディレクトリも`android`ディレクトリもありません。
当然それぞれのプロジェクトファイルや定義ファイルもExpo内部に隠蔽されているため、RNのような指定はそもそもできません。

両OS対応したことがある方ならなんとなく嫌な予感を感じ取っていただけると思いますが、実際試してみたら案外いい感じでした。
公式ドキュメントがしっかりしておりハマりどころも特にないので引用にとどめます。

> Local path or remote url to an image to use for your app’s icon.  
> We recommend that you use a 512x512 png file with transparency.  
> This icon will appear on the home screen and within the Expo app.
>
> &mdash; [Configuration with app.json | Expo latest documentation](https://docs.expo.io/versions/latest/guides/configuration.html#content)

スプラッシュ画像を指定する方法
--------------------------------------------------------------------
スプラッシュ画像も同様で、公式ドキュメントがしっかりしておりハマりどころも特にないと思います。
**ジャストサイズの画像を何個も作るのではなく、リサイズされる前提で1枚の画像を指定する**、と言うことさえ意識して作っていれば、見た目のイメージもつかめると思います。

> The default splash screen is a blank white screen.  
> This might work for you, if it does, you’re in luck! If not, you’re also in luck because it’s quite easy to customize using app.json and the splash key.  
> Let’s walk through it.
>
> &mdash; [Splash Screens | Expo latest documentation](https://docs.expo.io/versions/latest/guides/splash-screens.html)

アイコン画像の変換処理
--------------------------------------------------------------------
RNでアプリを作ったことがある方なら、かなり楽だと感じていただけたと思います。

と言うことで本題です。
早速Expo内部の変換処理を見てみましょう。

スプラッシュ画像の変換処理
--------------------------------------------------------------------
スプラッシュ画像も同様に追ってみましょう。

Expoはどこまで変化に追従できそうか？
--------------------------------------------------------------------

さいごに
--------------------------------------------------------------------
Expoのフルスタックフレームワークかと言わんばかりのAll in oneな感じがとても好きじゃないのですが、
XXX

内部挙動を見てみて思ったのは、
