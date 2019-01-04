---
path: /post/how-to-use-mmdjs/
title: MMDのモデルにブラウザで踊って頂いた
date: 2016-12-02T23:50:10+00:00
dsq_thread_id:
  - "5320877677"
featuredImage: ./featured-image.png
categories:
  - やってみた
tags:
  - JavaScript
  - MikuMikuDance
  - Three.js
---
2016/12/03 末尾に追記しました

この記事は[12/3 Three.js Advent Calendar](http://qiita.com/advent-calendar/2016/threejs)と[12/4 Hamee Advent Calendar](http://qiita.com/advent-calendar/2016/hamee)の記事です。  
もう半年以上前の話ですが、猛烈に[ドリームクラブ](https://www.d3p.co.jp/dreamclub/)というゲームの実況にハマりまして、あまりにハマりすぎて **「ノノノちゃん踊らせたい！ ！ ！ 歌ってほしい!!」** と思い、  
それと同時期にスプラトゥーンの実況にもハマっており、ハイカラシンカを踊るアオリちゃんとホタルちゃんが可愛すぎて **「二人ともぎゃんかわ！ ！ もう手中に収めて無限ループしたい!!！」**

とか思い、 **「ブラウザでもMMDしたい！ ！ ！」** と想いから[three.js](https://threejs.org/)と[MMD.js](https://threejs.org/examples/webgl_loader_mmd.html)を使ってみた話を。

<!--more-->

完成物
----------------------------------------

  * [ノノノ ☆Paradise☆(ドリームクラブ)](http://closet.leko.jp/2016/mmd/dreamclub/)
  * [シオカラーズ ハイカラシンカ(splatoon)](http://ika:fes@closet.leko.jp/2016/mmd/splatoon)

どちらも、各素材様へのリンクはページ内にあります。  
このページから落とすのではなく、素材元のページからDLをお願い致します。  
ノノノちゃんの方は無音です（ハイカラシンカの曲は裏側にYouTubeを埋め込んで流しているので、動画が消された場合無音です）

使ったもの
----------------------------------------

  * [three.js](https://threejs.org/)
  * [MMD Loader](https://threejs.org/examples/?q=mmd)

やったこと
----------------------------------------

  * 素材をニコ動とかニコニ・コモンズから見つけてくる
  * 展開してファイル名の文字化け治す
  * デモ実装をコピー&ペースト

## ハマったこととMMD Loader中の人の神対応

<blockquote class="twitter-tweet" data-lang="ja">
  <p lang="ja" dir="ltr">
    亜麻音の右目が真っ白。なんでじゃ
  </p>&mdash; れこ (@L_e_k_o)   
  <a href="https://twitter.com/L_e_k_o/status/718804877116243968">2016年4月9日</a>
</blockquote>

※一瞬ノノノ用のモーションを亜麻音モデルに当てて二人で踊らせようとした時の話

<blockquote class="twitter-tweet" data-lang="ja">
  <p lang="ja" dir="ltr">
    <a href="https://twitter.com/L_e_k_o">@L_e_k_o</a> MMDLoaderがどううまく動いていないのか興味あるのでスクリーンショットつきで詳細とモデルを教えてもらえませんか？ <a href="https://t.co/FlFZYhFQlg">https://t.co/FlFZYhFQlg</a> <a href="https://t.co/nYy3nhxzJl">https://t.co/nYy3nhxzJl</a> <a href="https://t.co/7r93J09ybG">https://t.co/7r93J09ybG</a>
  </p>&mdash; takahiro(John Smith) (@superhoge)   
  <a href="https://twitter.com/superhoge/status/719030809252876289">2016年4月10日</a>
</blockquote>

この後デバッグしつつ、色々教えてもらいつつ、結局私は何もできずに治して頂き、完成という感じでした。

なんかノノノちゃんの足が変な方向に向きますが、それくらいご愛嬌です。  
**モデルもモーションも完成度が高すぎて、ノノノはがに股でも可愛い** ということが証明されました。

まとめ
----------------------------------------

横展開して色々観賞用にしようと思ったのですが、  
ファイル名が日本語になってるとエンコーディング周りでものすごく面倒で、横展開する元気が削がれてしまいました。

またドはまりした作品が出たら、ブラウザ上でこっそり眺めようと思います。

* * *

2016/12/03 追記

という記事を公開したら、再び中の人からご指摘を頂きました。

<blockquote class="twitter-tweet" data-lang="ja">
  <p lang="ja" dir="ltr">
    <a href="https://twitter.com/L_e_k_o">@L_e_k_o</a> この足がおかしい問題は <a href="https://t.co/7cvMkiTukq">https://t.co/7cvMkiTukq</a> 最新のThree.js r83 devを使えば直るのではと思います
  </p>&mdash; takahiro(John Smith) (@superhoge)   
  <a href="https://twitter.com/superhoge/status/804740710364610560">2016年12月2日</a>
</blockquote>

まだ未検証ですが、最新版のThree.jsを利用することで思った通りの挙動になるようです。
