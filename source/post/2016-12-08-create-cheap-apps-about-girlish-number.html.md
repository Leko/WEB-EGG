---
path: /post/create-cheap-apps-about-girlish-number/
title: 難波社長と「勝ったな ガハハ」できるクソアプリ作った
date: 2016-12-08T13:50:56+00:00
dsq_thread_id:
  - "5335791015"
image: /images/2016/11/Screen-Shot-2016-11-27-at-10.13.22-PM.png
categories:
  - やってみた
tags:
  - React
  - Youtube
---
この記事は[12/8 クソアプリ Advent Calendar](http://qiita.com/advent-calendar/2016/kusoapp)の記事です。

表題のとおりです。 **はい。**

はいじゃないが。ということでアプリの紹介と内部で使用した技術の紹介をしようと思います。

<!--more-->

アプリの概要
----------------------------------------

URLはこちらです。 なお、 **PC版Chromeでしか動作確認してません。**

> — [難波社長と「勝ったな ガハハ」](http://closet.leko.jp/2016/gahaha/) > ※予告なしに非公開にする恐れがあります。あらかじめご了承ください。

スクショはこんな感じ。

<img src="/images/2016/12/Screen-Shot-2016-11-27-at-10.22.44-PM.png" alt="Screen Shot 2016-11-27 at 10.22.44 PM" width="400" class="alignnone size-full wp-image-906" />

声と音を使うアプリなので、 **あらかじめスピーカーの音量は最大にしておいてください。** 「おだててもらう」ボタンを押すと録音が開始されます。

<img src="/images/2016/12/Screen-Shot-2016-11-27-at-10.22.55-PM.png" alt="Screen Shot 2016-11-27 at 10.22.55 PM" width="400" class="alignnone size-full wp-image-905" />

赤いバーが出てる間に、例えば「勝った？ 勝った！ ？ これ勝った！」と喋ってみてください。

…

…

はい、そんなアプリです。 ヘルプを見て頂ければ他に地味にバリエーションがあることがわかると思います。 以下の内容は後語り的なやつです。

企画した背景
----------------------------------------

ガーリッシュナンバー、割と言葉選びが過激で１話で切ろうと思ったんですが、 九頭Pと難波社長の「勝ったな、ガハハ」がツボすぎて、それだけのために見てます。

３話くらいで千歳ちゃんも「勝ったなガハハ」と言い出すんですが、 **僕は千歳ちゃんではなく難波社長の「勝ったな、ガハハ」のためにこのアニメを見てるんです。**

ということで難波社長が好きすぎて、俺も社長と一緒にガハハしたい…という欲望を叶えてみました。

内部技術
----------------------------------------

このアプリの内部技術の話も簡単にしておきます。 難波社長の画像がリポジトリに入っちゃっているので、ソースの公開はやめておこうと思います。

### 音声解析

以前調べたまとめ資料があるので、こちらを御覧ください。

> — [Chromeでの音声解析について調べてみた · GitHub](https://gist.github.com/Leko/ae8c2b31454453a16204)

### 公式のYouTubeから音だけ再生する

アニメ本編から音声を抽出して…とかやったら確実に消されるので、 公式が公開している[アニメ2話予告](https://www.youtube.com/watch?v=G9zyLfez5sM)の動画を埋め込んで、動画は非表示にして、再生する秒数をいじることで難波社長の声を手に入れています。

この技はMMDのダンスBGMでも使用させてもらっています。 よろしければこの記事も合わせて御覧ください。

> — [MMDのモデルにブラウザで踊って頂いた \| WEB EGG](/post/how-to-use-mmdjs/)

で、本編に戻しますが、 内部でReact使ってるので、`react-youtube`というライブラリがいい感じに馴染んでくれました。

> — [GitHub – troybetz/react-youtube: react.js powered YouTube player component](https://github.com/troybetz/react-youtube)

```jsx
import React, { Component } from 'react'
import Youtube from 'react-youtube'

export default class TextToSpeech extends Component {
  handleReady (playerVars, e) {
    this.player(playerVars, e.target)
  }  
  player (playerVars, player) {
    const start = playerVars.start || 0

    player.seekTo(start)
    player.playVideo()
  }

  stopper (playerVars, e) {
    if (e.data !== 1) return
    
    setTimeout(() => {
      e.target.pauseVideo()
    }, (playerVars.end - playerVars.start) * 1000)
  }

  getPlayerOptions () {
    const base = {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      rel: 0,
      showinfo: 0,
      loop: 0,
      modestbranding: 1,
      origin: location.origin
    }
    
    if (this.props.text === null) {
      return base
    }
    
    switch (this.props.text) {
      case '勝ったな、ガハハ':
        return Object.assign(base, { start: 2.3, end: 4 })
      case 'かっぱな、アハハハハ':
        return Object.assign(base, { start: 7.7, end: 9.6 })
      default:
        return Object.assign(base, { start: 17.3, end: 20.8 })
    }
  }  
  render () {
    const playerVars = this.getPlayerOptions()  
    return (
      <Youtube
        ref='player'
        videoId={'G9zyLfez5sM'}
        opts={{ playerVars: _.omit(playerVars, 'start', 'end') }}
        onReady={this.handleReady.bind(this, playerVars)}
        onStateChange={this.stopper.bind(this, playerVars)}
        onError={(e) => console.error(e)}
      />
    )
  }
}
```

</youtube>

大枠の処理はこんな感じです。 **[埋め込みプレイヤーのパラメータ](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#Parameters)では開始位置、終了位置ともに整数以外が指定できない** ので、結構な確率で不必要な部分が混じります。 ですがjsのAPIを利用することで小数点以下のシークバー移動が可能になります。

あとは微調整しながら難波社長の声だけが入るようにすれば音声素材の用意は完了です。

音声解析して、特定のキーワードにマッチしたら喋らせるパーツは説明しました。 他の部分はごく普通なReactアプリです。という感じです。

まとめ
----------------------------------------

これから毎日難波社長とガハハしてから寝ます。嘘です。

勢いでゴリゴリと作ってしまいましたが、なにげに音声利用するアプリをReactで作るの初めてでした。 タグで表現できないオブジェクトもコンポーネントとしてラップできる抽象概念は素晴らしいな、と改めて感じつつ、いつか使えるスニペットとして蓄積できそうです。 YouTubeのjs APIの扱いにもかなり詳しくなったし、後々に役立つ知見が色々たまったと思います。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>