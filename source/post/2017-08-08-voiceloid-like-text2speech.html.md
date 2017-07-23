---
title: docomoの音声合成APIを利用して無料でVOICELOIDっぽい声を生成してみる
date: 2017-08-08 10:30 JST
tags:
- Nodejs
- 音声合成
- ffmpeg
---

こんにちは。  
とある案件でdocomoの音声合成APIを利用することが合ったのですが、  
エーアイ版のAPIのデモを試していたら「これゆかりんの声やんけ！！！と思ったら葵ちゃんもいる！！」とテンションが上ってしまいました。  
本来VOICELOIDは有償（それも安くはないお値段）なのに、docomoのAPIを介せば無料で使えるというワクワク感。  

もはや仕事なんてしている場合じゃない、理解を深めなければ。ということで試してみました。

<!--more-->

まえおき
-----------------------------------------------------------------
ボイロの話題に興味が湧いて来てくださった方が多いと信じて、ボイロ自体の説明は割愛します。  
ボイロ自体の知識は持っているという前提で記事を書いています。予めご了承下さい。

また、試して見た限りではすべてのボイロが扱えるわけではなく、

* 結月ゆかり
* 弦巻マキ
* 月読アイ

の３名が使えることを確認できました。  
残念ながらdocomoのAPIだけでは全ボイロは試せませんでした。  
エーアイ版APIを提供してらっしゃる[AITalkのデモ版](http://www.ai-j.jp/demonstration/)には葵ちゃんの声があるので、APIから使えないのは残念です。  
特に琴葉姉妹、きりたんはとても試してみたかったのでとても悔やまれますが、使いたければ買えという話なので仕方ない。

### 利用規約を確認してみる

[ガイドライン](https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=text_to_speech&p_name=guideline#tag01)を確認してみると、  

* 本APIを用いたアプリケーションは無償で提供すること。
* 本APIを用いたアプリケーション内で広告収入を含む収益行為を行わないこと。

の２つが条件で利用して良いとのことなので、売り物作るわけではないし実験する分には大丈夫だろうという判断です。

作ったもの
-----------------------------------------------------------------
とりあえず３名の声は使えるとわかったので、それら３役でかけあいができるような簡単なスクリプトを書きました。  
[こちら](https://gist.github.com/Leko/937b97724def8de90b8fe97a3bfb639c)に公開しています。  
README通りにセットアップを済ませ、

```js
./playbook-to-voices xxx.csv
```

と実行すると、CSVで書いた台本が音声ファイル（.wav）として入手できます。  
ごく簡素なデモなので、生成した音声ファイルのパス、フォーマットの指定などはいじれないのでご了承下さい。

下準備
-----------------------------------------------------------------
APIを利用するためにやや学習コストが発生します。各要素軽くだけ触れておきます。

### 利用するAPI
既に名前が出てきていますが、利用するAPIはdocomo Developer APIの[音声合成API エーアイ REST SSML版](https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=text_to_speech&p_name=api_1#tag01)です。  
他のAPIも声を確かめてみたのですが、ボイロの声はなかったので、このAPIだけを利用します。

### docomo developerに登録してAPIキーを入手
APIを使うためにはAPIキーが必要です。  
会員登録とアプリケーションの利用申請を出して、APIキーを入手しておいて下さい。

### SSMLとはなんぞや
さらっとSSML版と書きましたが、SSMLとは[Speech Synthesis Markup Language](https://www.w3.org/TR/speech-synthesis11/)の略です。  
音声合成のためのマークアップ言語です。  
微妙にフォーマットが違いますが、Amazon Polly(Alexa)などでも使用されている仕様だそうです。

詳しくはAPIを叩くときに解説しますが、  
声の種類や話す内容だけではなく、**よみがな（ルビ）やイントネーションを操作することも可能**なパワフルな言語です。  
おそらく作り込めばかなり表現力は増すのですが、イントネーション周りは制御がかなり難しかったです。  
マークアップさえ与えればその通りに喋った音声が手に入るので、音声自体の扱いは大して気にすることはありません。

### 台本を作る
とはいえ、最近素のHTMLで愚直なマークアップする機会もなかなか減っていると思います。XMLベースの言語って冗長で面倒くさいですし。  
ということで、ExcelやGoogle Spreadsheetなどで編集することを想定に、CSVの「台本」を受け取って音声化する、ということを試してみます。  
調声かなり難しかったので、デフォ値にこだわらずに調声のプリセットも与えられるようにして、細かい調声は利用者側でできるようにします。

台本のフォーマットはこんな感じです。  
個人的に好きな[豚野郎さんのsm30193805](http://www.nicovideo.jp/watch/sm30193805)の"ここテン"を台本化してみました。

```csv
結月ゆかり,,皆さんこんにちは、結月ゆかりです
弦巻マキ,,"<phoneme ph=""ツル’／マ’キ"">弦巻</phoneme>マキです"
ゆっくり霊夢,,ゆっくり霊夢です
結月ゆかり,,突然ですけど私、スーパーハカーになりました！
ゆっくり霊夢,,この人いきなり何言ってんだ…
弦巻マキ,,なろうと思って簡単になれるものじゃないぞ
弦巻マキ,,あとハカーじゃなくてハッカーね
結月ゆかり,,ゆかりさんの華麗なハッキング技術で
結月ゆかり,,お前たちの個人情報を丸裸にしてやる！
結月ゆかり,,具体的にはPCのDドライブの中身を晒してやる！
```

**既に嫌な予感MAX**ななんかが出てきていますが、「弦巻マキ」の発音がおかしくて調整した結果です。  
デフォルトだと「小比類巻」みたいな山なりの発音になってしまうので、ツルマキの部分を「うずまき」的な発音に寄せた調声です。  
詳しくはマキマキのところで後述します。

「１列目はボイス名、２列目は調声プリセット（デフォは空）、３列目は喋る内容」という構成にしました。  
ボイロ動画を作るなら、背景やら字幕タイミング、立ち絵プリセットだったり差分プリセットだったりと色々必要になってしまうと思うのですが、今回は**音声のみ**に絞って実装します。

なお、上記の台本を音声化したものが以下のファイルになります。

<audio src="/sounds/voiceloid-like-text2speech.wav" preload="auto" controls>

VOICELOIDっぽい声を生成する
-----------------------------------------------------------------
では早速APIを利用したいと思います。

### 台本をSSMLに変換
先程の台本を今回利用するAPIに合わせたSSMLに変換すると、このようになります。  
実際には改行されてませんが、見にくいのでインデントを整えたのが以下のSSMLです。

```xml
<?xml version="1.0" encoding="utf-8" ?>
<speak version="1.1">
    <voice name="sumire">
        <prosody rate="1.4" pitch="1.2">皆さんこんにちは、結月ゆかりです</prosody>
    </voice>
    <voice name="maki">
        <prosody rate="1.2">
            <phoneme ph="ツル’／マ’キ">弦巻</phoneme>マキです
        </prosody>
    </voice>
    <voice name="reina">
        <prosody rate="1">ゆっくり霊夢です</prosody>
    </voice>

    ...略...

</speak>
```

長いので省略しました。最低限必要なのはこれらのタグだと思います。

|タグ名|説明|
|---|---|
|speak|ルート要素。`version="1.1"`が必要|
|voice|声の種類を指定する。指定可能な値は後述|
|prosody|日本語だと[韻律](https://ja.wikipedia.org/wiki/%E9%9F%BB%E5%BE%8B_(%E8%A8%80%E8%AA%9E%E5%AD%A6))というそう。ピッチや抑揚、スピードを制御できるので調声するために必須|
|phoneme|日本語だと[音素](https://ja.wikipedia.org/wiki/%E9%9F%B3%E7%B4%A0)というそう。その言葉に対する発音の仕方を定義できます。イントネーションを変えたい場合に使用可能|

お察しの通り複雑ではないので、SSMLを生成するロジック自体は[gist](https://gist.github.com/Leko/937b97724def8de90b8fe97a3bfb639c#file-playbook-to-voices-L48)の方を見ていただければと思います。  
記事ではSSMLで使うタグの説明にとどめます。

`voice`のname属性に与えられる値のうち、ボイロ製品に該当するのは

|属性名|ボイロ名|
|---|---|
|sumire|結月ゆかり|
|maki|弦巻マキ|
|anzu|月詠アイ|

です。  
デフォルトだと速度やピッチにやや違和感があるので、調声が必要です。

大まかな調声に使う`prosody`に指定できる属性は、

* `pitch`（ピッチ）
* `rate`（喋る速度）
* `range`（抑揚）
* `volume`（音量）

です。  
これらを調整するだけでかなりそれっぽくなります。詳しくは公式のドキュメントを読んで下さい。

`phoneme`のph属性には[JEITAカナ](http://www.jeita.or.jp/cgi-bin/standard/pdf.cgi?jk_n=1408&amp;jk_pdf_file=20110307080703_8FnXHkG4Y0.pdf')という仕様にもとづいた値が指定可能です。  
これがまーぁ難しい。ドキュメントが読みづらく、pdfに書かれている仕様が100%はカバーされていないようで、何が使えて何が使えないのかわからない。  
完全に手探りでほしいイントネーションを探り当てる必要があるので、よほど気になる発音でない限りは触れないほうが無難だと思います。

### 音声合成APIを叩く
SSMLが作れたら、APIを叩きます。
APIを叩くのは、よくあるPOSTリクエストです。リクエストボディには先程生成したSSMLを与えます。

```js
const querystring = require('querystring')
const fetch = require('isomorphic-fetch')

const textToSpeech = async (ssml) => {
  const ENDPOINT = 'https://api.apigw.smt.docomo.ne.jp/aiTalk/v1/textToSpeech'
  const query = querystring.stringify({
    APIKEY: process.env.DOCOMO_API_KEY,
  })

  return fetch(`${ENDPOINT}?${query}`, {
    method: 'POST',
    body: ssml,
    headers: {
      'Content-Type': 'application/ssml+xml',
      'Accept': 'audio/L16',
    }
  })
}
```

Content-TypeはSSMLなので良いとして、Acceptの`audio/L16`ってなんでしょう。  
音声フォーマットなのですが、これが音声に詳しくない人（私）にとっては曲者だったので説明します

### audio/l16(PCM音源)をwav形式に変換する
audio/l16（以降PCM）というのは、16bitのリニアPCMと呼ばれるオーディオコーデックの形式です。  

> &mdash; [PCM(ぴーしーえむ)とは - コトバンク](https://kotobank.jp/word/PCM-7659)

> &mdash; [ＰＣＭの基礎知識](http://www.hikari-ongaku.com/study/pcm.html)

.wavとPCMの大きな違いは、メタデータの有無です。  

PCMはただの音声波形にすぎず、「サンプリングレート」や「ビットレート」などの情報がファイル自体に含まれていません。  
そうすると、音声プレイヤーなどは与えられた音声波形をどう再生したら良いかが分からないので、意図したとおり再生されないなどの現象が起こります。  
一方WAVEファイルの中にはそれらのメタデータ＋PCMが含まれているので、音声として正しく再生可能になります。

pcm単体では扱いにくいデータなので、ffmpegで.wavに変換してしまいましょう。  
幸いpcmの詳細はドキュメントに記載されているので、ちゃちゃっと変換してしまいます。

```js
const fs = require('fs')
const Promise = require('bluebird')
const ffmpeg = require('fluent-ffmpeg')

const unlink = Promise.promisify(fs.unlink)
const readFile = Promise.promisify(fs.readFile)
const writeFile = Promise.promisify(fs.writeFile)

const toWav = async (pcmPath) => {
  const destPath = pcmPath + '.wav'
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(pcmPath)
      .inputOptions(['-ac 1', '-ar 16000'])
      .inputFormat('s16be')
      .output(destPath)
      .on('end', () => {
        console.log(destPath)
        unlink(pcmPath).then(resolve)
      })
      .on('error', reject)
      .run()
  })
}
```

`inputOptions`と`inputFormat`が無いと正しく変換されません。  
なぜなら、先程説明したとおりpcmにはメタデータが含まれていないからです。  
なのでそれらの値を外部から明示的に指定する必要があります。

吐き出されたwavは汎用的なフォーマットなので、だいたいのPCで再生可能だと思います。  

まとめ
------------------------------------------

以上が主要な処理の内容になります。各処理の詳細は[gist](https://gist.github.com/Leko/937b97724def8de90b8fe97a3bfb639c)をご確認下さい。  
機能の制限が厳しく、製品版のボイロには遠く及びませんでしたが、"それっぽい音声"までは迫れたかなと思います。  
色々試しがいがありそうなので、今後もちょこちょこ触ってみようと思います。

以降の内容は、各ボイロごとのSSMLのおさらいとハマリポイントを記載します。

### 結月ゆかりボイスを試してみる
再掲ですが、ゆかりんのボイスをSSMLに起こすとこのような感じになります。  
豚野郎さんの調整に合わせるには、ピッチ（`pitch`）と喋る速度（`rate`）を少し上げるとちょうどよい感じになりました。

```xml
    <voice name="sumire">
        <prosody rate="1.4" pitch="1.2">皆さんこんにちは、結月ゆかりです</prosody>
    </voice>
```

### 弦巻マキボイスを試してみる
自分の名前の発音だけ曲者でしたが、それ以外は結構いい感じでした。  
マキマキも豚野郎さんの調整に合わせるなら速度を少し上げるといい感じでした。

```xml
    <voice name="maki">
        <prosody rate="1.2">
            <phoneme ph="ツル’／マ’キ">弦巻</phoneme>マキです
        </prosody>
    </voice>
```

### 月読アイボイスを試してみる
ゆっくり霊夢（Softalk）はWebAPIがなかったので、代わりにアイちゃんに喋ってもらいました。  
これは似せるもなにもないので、デフォルトでいってます。  
アイちゃんは声自体の癖が強めなので、どう調声してもだいたいアイちゃんに聞こえると思います。

```xml
    <voice name="reina">
        <prosody rate="1">ゆっくり霊夢です</prosody>
    </voice>
```


さいごに
-----------------------------------------------------------------

```xml
    <voice name="maki">
        <prosody range="2.0" pitch="2.0" rate="0.5">
            グレートエレキファイアー
        </prosody>
    </voice>
```

<audio src="/sounds/voiceloid-like-text2speech-great-elechi-fire.wav" preload="auto" controls>

ｾﾔﾅｰしたかった
