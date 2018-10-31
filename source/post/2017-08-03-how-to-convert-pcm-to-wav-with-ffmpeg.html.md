---
title: ffmpegでPCM音源をWAVE形式に変換するときにハマったこと
date: 2017-08-03 10:30 JST
image: /images/2017/08/eyecatch-how-to-convert-pcm-to-wav-with-ffmpeg.png
tags:
  - ffmpeg
  - Nodejs
---

こんにちは。  
ffmpeg で PCM 音源を変換するときに、期待したとおりに変換されなくてハマったので備忘録を残します。

渡しの場合、音声を扱うプログラムも経験がなく、そもそもサンプリングレートとかの用語からして分からないという感じでした。  
同じ悩みを抱える方がいればと思い備忘録を残します。

<!--more-->

## 用語の説明

音声ファイルについての用語を調べてまとめて書こうと思ったのですが、  
この記事と Wikipedia 読めばだいたい必要な情報は揃ってしまったので、ご紹介にとどめます。

> &mdash; [サンプリングレート・ビット深度・ビットレートの意味と関係性](http://aviutl.info/sannpurinngure-to-bittosinngo/)

## PCM ってなに

PCM は音声波形を電子化したもので、「音」そのものと捉えるとしっくり来ました。

> &mdash; [PCM(ぴーしーえむ)とは - コトバンク](https://kotobank.jp/word/PCM-7659)

> &mdash; [ＰＣＭの基礎知識](http://www.hikari-ongaku.com/study/pcm.html)

## PCM と WAVE ファイルの違い

WAVE（.wav）ファイルはよく見る形式だと思うのでファイル自体の説明は割愛します。ここでは違いについてだけ。  
**.wav と PCM の大きな違いは、メタデータの有無**です。

PCM はただの音声波形にすぎず、「サンプリングレート」や「ビットレート」などの情報がファイル自体に含まれていません。  
一方 WAVE ファイルの中にはそれらのメタデータ＋ PCM が含まれています。  
この差が何を起こすか、コードベースで説明します。

## 問題のコード

ffmpeg をナマで扱うのはつらいので、[fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)という npm パッケージを利用させていただきました。  
バイナリのパスの指定なども柔軟にできるので、Lambda とかクセのあるランタイム下でも扱いやすいです。

で、以下が問題のあるコードです。  
変換元の音声ファイルは`16000Hz, Signed, 16bit, LPCM`です。

```js
const ffmpeg = require('fluent-ffmpeg')

const pcmPath = './demo' # pcm
const destPath = './demo.wav'

ffmpeg()
  .input(pcmPath)
  .inputFormat('s16be')
  .output(destPath)
  .run()
```

ffmpeg は拡張子を見て input, output をよしなにしてくれるらしいと噂を聞いたので、シンプルに実装してみました。  
`s16be`というのは、Signed で 16bit で Big endian な PCM のフォーマットを指します。  
変換した結果が、これです。

<audio src="/sounds/how-to-convert-pcm-to-wav-with-ffmpeg-failed-too-fast.wav" preload="auto" controls>

…**なんかキュルキュル言ってる。**  
本来であれば、以下ような音声が再生されるのが期待する変換処理です。

<audio src="/sounds/how-to-convert-pcm-to-wav-with-ffmpeg-correct.wav" preload="auto" controls>

## PCM にはメタデータがない

ここで WAVE ファイルのバイナリ構成を整理してみます。

| 開始 byte | 終了 byte | byte | データ内容                                                  |
| --------- | --------- | ---- | ----------------------------------------------------------- |
| 1         | 4         | 4    | 'RIFF'の４文字                                              |
| 5         | 8         | 4    | 総ファイルサイズ-8(byte)                                    |
| 9         | 12        | 4    | 'WAVE'の４文字                                              |
| 13        | 16        | 4    | 'fmt 'の４文字　フォーマットチャンク                        |
| 17        | 20        | 4    | フォーマットサイズ　デフォルト値 16                         |
| 21        | 22        | 2    | フォーマットコード　非圧縮の PCM フォーマットは 1           |
| 23        | 24        | 2    | チャンネル数　モノラルは 1、ステレオは 2                    |
| 25        | 28        | 4    | サンプリングレート　 44.1kHz の場合なら 44100               |
| 29        | 32        | 4    | バイト／秒　１秒間の録音に必要なバイト数                    |
| 33        | 34        | 2    | ブロック境界　ステレオ 16bit なら、16bit\*2 = 32bit = 4byte |
| 35        | 36        | 2    | ビット／サンプル　１サンプルに必要なビット数                |
| 37        | 40        | 4    | 'data'の４文字　フォーマットチャンク                        |
| 41        | 44        | 4    | 総ファイルサイズ-126                                        |

> &mdash; [WAVE ファイルの構造](http://www.graffiti.jp/pc/p030506a.htm)

見ての通り、ファイルの中に「チャンネル数」「サンプリングレート」などの情報が保持されています。  
なので ffmpeg などに WAVE ファイルのパスを与えれば、ファイルの中身から音声の情報を読み取り変換処理が実行できます。

一方、**PCM にはこれらの情報が含まれていないので、ファイルパスと音声ファイルのフォーマット（`s16be`）だけを与えても情報が足りません**  
なので PCM だけを ffmpeg に与えても、音声プレイヤーやコンバータなどは与えられた音声波形をどう扱えば良いかが分からず、期待した通りに再生/変換されないなどの現象が起こります。

## 解決策：inputOptions

上記の問題に気づけずに、ひたすらオプションを組み替えて試していたら、偶然うまくいった例がありました。

```js
const ffmpeg = require("fluent-ffmpeg");

const pcmPath = "./demo.pcm";
const destPath = "./demo.wav";

ffmpeg()
  .input(pcmPath)
  .inputOptions(["-ac 1", "-ar 16000"])
  .inputFormat("s16be")
  .output(destPath)
  .run();
```

`inputOptions`が増えました。それ以外は同じです。  
変換するための情報としてサンプリングレート（`-ar`）が欠けていたようです。

ということで、PCM 音源を ffmpeg で変換する際には、符号化方式やサンプリングレートなどの**PCM ファイルには含まれない情報を明示的に指定する**必要があります。

## さいごに

変換処理のデモに使わさせていただいた音声は、docomo の音声合成 API を利用しています。  
後日公開ですが、こちらの記事も見ていただけると幸いです。

（2017/08/08 ごろ公開予定）docomo の音声合成 API を利用して無料で VOICEROID っぽい声を生成してみる
