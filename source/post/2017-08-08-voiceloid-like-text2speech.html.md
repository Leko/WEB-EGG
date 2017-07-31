---
title: docomoの音声合成APIを利用して無料でVOICEROIDっぽい声を生成してみる
date: 2017-08-08 10:30 JST
image: /images/2017/08/eyecatch-voiceloid-like-text2speech.png
tags:
- Nodejs
- 音声合成
- ffmpeg
---

こんにちは。  
とある案件でdocomoの音声合成APIを利用することが合ったのですが、  
エーアイ版のAPIのデモを試していたら「これゆかりんの声やんけ！ と思ったら葵ちゃんもいる！」とテンションが上ってしまいました。  
本来**VOICEROIDは有償（それも安くはないお値段）なのに、docomoのAPIを介せば無料**で使えるというワクワク感。  

もはや仕事なんてしている場合じゃない、理解を深めなければ。ということで試してみました。

<!--more-->

まえおき
-----------------------------------------------------------------
ボイロの話題に興味が湧いて来てくださった方が多いと信じて、ボイロ自体の説明は割愛します。  
ボイロ自体の知識は持っているという前提で記事を書いています。あらかじめご了承下さい。

また、試して見た限りではすべてのボイロが扱えるわけではなく、

* 結月ゆかり
* 弦巻マキ
* 月読アイ

の３名が使えることを確認できました。  
残念ながらdocomoのAPIだけでは全ボイロは試せませんでした。  
特にエーアイ版APIを提供してらっしゃる[AITalkのデモ版](http://www.ai-j.jp/demonstration/)には葵ちゃんの声があるので、APIで使えないのが残念です。  
とても悔やまれますが、使いたければ買えという話なので仕方ない。

### 利用規約を確認してみる

[ガイドライン](https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=text_to_speech&p_name=guideline#tag01)を確認してみると、  

* 本APIを用いたアプリケーションは無償で提供すること
* 本APIを用いたアプリケーション内で広告収入を含む収益行為を行わないこと

の２つが条件で利用して良いとのことなので、売り物作るわけではないし実験する分には大丈夫だろうという判断です。

作ったもの
-----------------------------------------------------------------
### 題材
今回の記事でお借りする台詞は、  
個人的に好きな[豚野郎さんのsm30193805](http://www.nicovideo.jp/watch/sm30193805)の"ここテン"をお借りしました。

<iframe width="312" height="230" src="http://ext.nicovideo.jp/thumb/sm30193805" scrolling="no" style="border:solid 1px #ccc;" frameborder="0"><a href="http://www.nicovideo.jp/watch/sm30193805">[Watch Dogs 2] 　ゆかりさんハッキングする [VOICEROID+ゆっくり実況]</a></iframe>

今回作る台本・プリセットで音声化したものが以下の音声ファイルです

<audio src="/sounds/voiceloid-like-text2speech.wav" preload="auto" controls>

### デモ
とりあえず３名の声は使えるとわかったので、それら３役でかけあいができるような簡単なスクリプトを書きました。  
[こちら](https://gist.github.com/Leko/937b97724def8de90b8fe97a3bfb639c)に公開しています。  
README通りにセットアップを済ませ、

```js
./playbook-to-voices 台本.csv -p 台本preset.csv -o ./音声.wav
```

と実行すると、CSVで書いた台本が音声ファイル（.wav）として入手できます。  

下準備
-----------------------------------------------------------------
APIを利用するためにやや学習コストが発生します。各要素軽くだけ触れておきます。

### 利用するAPI
既に名前が出てきていますが、利用するAPIはdocomo Developer APIの[音声合成API エーアイ REST SSML版](https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=text_to_speech&p_name=api_1#tag01)です。  
他のAPIも試してみたのですが、ボイロの声ではなかったので、この記事では上記APIだけを利用します。

### docomo developerに登録してAPIキーを入手
docomoAPIを使うためにはAPIキーが必要です。  
会員登録とアプリケーションの利用申請を出して、APIキーを入手しておいて下さい。

### SSMLとはなんぞや
さらっとSSML版と書きましたが、SSMLとは[Speech Synthesis Markup Language](https://www.w3.org/TR/speech-synthesis11/)の略です。  
音声合成のためのマークアップ言語です。  
微妙にフォーマットが違いますが、Amazon Echoなどでも使用されている仕様だそうです。

> &mdash; [Amazon Echoで「バルス」を実現する - Qiita](http://qiita.com/sparkgene/items/cf4ca976dbf09b45971d)

詳しくはAPIを叩くときに解説しますが、  
声の種類や話す内容だけではなく、**よみがな（ルビ）やイントネーションを操作することも可能**なパワフルな言語です。  
おそらく作り込めばかなり表現力は増すのですが、イントネーション周りは制御がかなり難しかったです。  
マークアップさえ与えればその通りに喋った音声が手に入るので、音声自体の扱いは大して気にすることはありません。

### 台本を作る
とはいえ、最近素のHTMLで愚直なマークアップする機会もなかなか減っていると思います。XMLベースの言語って冗長で面倒くさいですし。  
ということで、ExcelやGoogle Spreadsheetなどで編集することを想定に、**CSVの「台本」を受け取ってSSMLに変換して音声化**してみます。  
台本のフォーマットはこんな感じです。  

<iframe height="400" class="full-width" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQK-kMNHZuTHF55cC2JWa-NyUmlOlFyqLtFPVjTEXykkyQNutvg_OQfgq1kDl0zEyz7vbu8Pk1m9sYh/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"></iframe>

「１列目はボイス名、２列目は調声プリセット（デフォは空）、３列目は喋る内容」という構成にしました。  

**既に嫌な予感MAX**な記述が出てきていますが、**字幕と喋っている音声が違う**箇所と、「弦巻マキ」の発音がおかしくて**イントネーションを弄った**結果です。  
デフォルトだと「小比類巻」みたいな山なりの発音になってしまうので、ツルマキの部分を「うずまき」的な発音に寄せた調声です。  
詳しくはマキマキのところで後述します。

ボイロ動画を作るなら、背景やら字幕タイミング、立ち絵プリセットだったり差分プリセットだったりと色々必要になってしまうと思うのですが、今回はシンプルに**音声のみ**に絞って実装します。

### プリセットを作る
調声がかなり難しかったので、デフォ値にこだわらずに調声のプリセットも与えられるようにして、利用者側で細かく調声できるようにします。  
調声用のプリセットは以下の通りです

<iframe height="230" class="full-width" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQK-kMNHZuTHF55cC2JWa-NyUmlOlFyqLtFPVjTEXykkyQNutvg_OQfgq1kDl0zEyz7vbu8Pk1m9sYh/pubhtml?gid=2080442496&amp;single=true&amp;widget=true&amp;headers=false"></iframe>

キャラ名、プリセット名、喋るスピード、ピッチ、抑揚、ボリューム　の順です。  
空の場合はデフォ値を使います。  
プリセット名が空の場合は、プリセットなし（デフォルト）の調声を変更します

VOICEROIDっぽい声を生成する
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

長いので省略しました。  
お察しの通りさほど複雑ではないので、SSMLを生成するロジック自体は[gist](https://gist.github.com/Leko/937b97724def8de90b8fe97a3bfb639c#file-playbook-to-voices)の方を見ていただければと思います。  
記事ではSSMLで使うタグの説明にとどめます。  
ボイロ化に最低限必要なのは、これらのタグでした。

|タグ名|説明|
|---|---|
|speak|ルート要素。`version="1.1"`が必要|
|voice|声の種類を指定する。指定可能な値は後述|
|prosody|日本語だと[韻律](https://ja.wikipedia.org/wiki/%E9%9F%BB%E5%BE%8B_(%E8%A8%80%E8%AA%9E%E5%AD%A6))というそう。ピッチや抑揚、スピードを制御できるので調声するために必須|
|phoneme|日本語だと[音素](https://ja.wikipedia.org/wiki/%E9%9F%B3%E7%B4%A0)というそう。その言葉に対する発音の仕方を定義できます。イントネーションを変えたい場合に使用可能|

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
これらを調整するだけでかなりそれっぽくなります。詳しくは[公式のAPIドキュメント](https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=text_to_speech&p_name=api_1#tag01)を読んで下さい。

`phoneme`のph属性には[JEITAカナ](http://www.jeita.or.jp/cgi-bin/standard/pdf.cgi?jk_n=1408&amp;jk_pdf_file=20110307080703_8FnXHkG4Y0.pdf')という仕様にもとづいた値が指定可能です。  
これが**めちゃくちゃ難しい**。何が難しいかって、ドキュメントを読み解くのに一苦労で、なおかつpdfに書かれている仕様が100％はカバーされていないようで、何が使えて何が使えないのかがわからない。  
完全に手探りで、欲しいイントネーションを探り当てる必要があるので、よほど気になる発音でない限りは触れないほうが無難だと思います。

### 音声合成APIを叩く
SSMLが作れたら、APIを叩きます。
APIを叩くのは、よくあるPOSTリクエストです。詳細は[公式のAPIドキュメント](https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=text_to_speech&p_name=api_1#tag01)に記載があります。  
リクエストボディには先程生成したSSMLを与えます。

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
audio/l16（以降PCM）というのは、16bitのリニアPCMと呼ばれる音声ファイルの形式です。  

pcm単体では扱いにくいので、ffmpegで.wavに変換してしまいましょう。  
幸いpcmのメタデータ詳細は[公式のAPIドキュメント](https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=text_to_speech&p_name=api_1#tag01)に記載されているので、ちゃちゃっと変換してしまいます。

```js
const fs = require('fs')
const Promise = require('bluebird')
const ffmpeg = require('fluent-ffmpeg')

const unlink = Promise.promisify(fs.unlink)

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

PCMファイルについての説明や、変換処理については別途記事を書いてますので、そちらもあわせてご確認下さい。

> &mdash; [ffmpegでPCM音源をWAVE形式に変換するときにハマったこと | WEB EGG](https://blog.leko.jp/post/how-to-convert-pcm-to-wav-with-ffmpeg/)

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
        <prosody rate="1.4">
            <phoneme ph="ツル’／マ’キ">弦巻</phoneme>マキです
        </prosody>
    </voice>
```

### 月読アイボイスを試してみる
ゆっくり霊夢（Softalk）はWeb APIがなかったので、代わりにアイちゃんに喋ってもらいました。  
これは似せるもなにもないので、適当に合わせています。  
アイちゃんは声自体の癖が強めなので、どう調声してもだいたいアイちゃんに聞こえると思います。

```xml
    <voice name="reina">
        <prosody rate="1.4">ゆっくり霊夢です</prosody>
    </voice>
```


さいごに
-----------------------------------------------------------------

```csv
voice,preset,text
弦巻マキ,ｾﾔﾅｰ,グレートエレキファイア
```

```csv
voice,name,rate,pitch,range,volume
弦巻マキ,ｾﾔﾅｰ,0.5,2.0,2.0,
```

```
./playbook-to-voices グレートエレキファイア.csv -p グレートエレキファイア_preset.csv -o ./talk.wav
```

<audio src="/sounds/voiceloid-like-text2speech-great-elechi-fire.wav" preload="auto" controls>

ｾﾔﾅｰしたかった

---

アイキャッチ画像に使用した立ち絵はこちらからお借りしました。

> &mdash; [結月ゆかり 動画用素材 / 柚子胡椒 さんのイラスト - ニコニコ静画 (イラスト)](http://seiga.nicovideo.jp/seiga/im5449281)

> &mdash; [弦巻マキ 動画用素材 / 柚子胡椒 さんのイラスト - ニコニコ静画 (イラスト)](http://seiga.nicovideo.jp/seiga/im5517795)
