---
path: /post/use-chatwork-like-slack/
title: ChatworkだってSlackしたい！！
date: 2016-12-14T23:45:16+00:00
dsq_thread_id:
  - "5379762353"
image: /images/2016/12/eb855f94decc9aeb6ce76f56622ec2cb.png
categories:
  - やってみた
tags:
  - Advent Calendar
  - Chrome extension
  - JavaScript
---
なんとも日本語が不自由な感じのタイトルですが、始めます。  
普段仕事でChatworkを使っているのですが、どうにもUIが好きになれない。

別に使いにくくはないんですが、趣味でSlack使ってるせいでどうにも馴染めません。  
でも仕事で使うのでどうにかして向き合わなければならない。

**ならSlack使ってる感覚に陥るChatworkであれば違和感なく使えるのでは…？**  
ということで試してみました。

<!--more-->

完成物
----------------------------------------

こちらです。スクショとかアイコン適当ですみません。  
<https://chrome.google.com/webstore/detail/chack/fdjillhmoogcihmmokkpiipbcgbfejek?hl=ja&gl=JP>

ソースはGithubに公開してあります。

> [GitHub – Leko/chatwork-skin-slack: Chrome extension to apply Slack skin to Chatwork](https://github.com/Leko/chatwork-skin-slack)

**※Chatworkのマークアップと密結合しているため突然動かなくなることが有ります。予めご了承ください。**

チャット送信部分
----------------------------------------

<img src="/images/2016/12/2a4a82cac962e22f0d04c4d1ce8582a9.png" alt="スクリーンショット 2016-12-14 22.10.30" width="543" height="191" class="alignnone size-full wp-image-916" />

こんな感じにしてみました。

チャット一覧
----------------------------------------

<img src="/images/2016/12/ed15bda9363fb6281f2df55836cb915b.png" alt="スクリーンショット 2016-12-14 22.11.34" width="229" height="358" class="alignnone size-full wp-image-917" />

だんだんそれっぽくなってきたと思います。 思い切ってチャットのアイコンを消して、1行に圧縮してみました。ロゴ部分もSlackっぽくしてみました。  
白抜きまみれじゃねえか！ ！ という感じですが、見せられないものは仕方ないです。

グループチャット（channel）と個人チャット(direct message)を分けようともがいてみたのですが、心が折れそうだったので諦めました。

チャット部分
----------------------------------------

<img src="/images/2016/12/1627ad8a398b4e9e6a5c20784c776a44.png" alt="スクリーンショット 2016-12-14 22.15.12" width="591" height="211" class="alignnone size-full wp-image-918" />

TOとかREとかのアイキャッチと色、時間の位置はそのままにしておきました。  
だいぶSlackっぽくなってきたと思います。

メッセージをマウスオーバーすると 
<img src="/images/2016/12/f12758331faecab6e36cdbfb454f65be.png" alt="スクリーンショット 2016-12-14 22.01.04" width="295" height="76" class="alignnone size-full wp-image-923" /> Slackっぽくなります。

チャット説明文あたり
----------------------------------------

<img src="/images/2016/12/9c4291930da7dcf8c7e7471936614a3b.png" alt="スクリーンショット 2016-12-14 22.01.51" width="702" height="104" class="alignnone size-full wp-image-919" />

タイトルと説明文をざっくりと改変しました。  
説明文をマウスオーバーすると全文出て来るようにしました。これもSlackっぽいはず。  
画面の上の方だけ見てりゃいいので視線が右に左に行かなくて楽です。

サイドバー
----------------------------------------

<img src="/images/2016/12/7c2291a0dba774bdc47b995d53e92788.png" alt="スクリーンショット 2016-12-14 22.21.46" width="422" height="89" class="alignnone size-full wp-image-920" /> タスク一覧くらいしか用がなくなったのでかなりおざなりです。  
ファイル一覧のツールチップとかは大きくいじってません。

チャット作るところ
----------------------------------------

<img src="/images/2016/12/480931b62833ab3a743d0ddc55fc75f9.png" alt="スクリーンショット 2016-12-14 22.28.48" width="418" height="170" class="alignnone size-full wp-image-921" /> こんな感じにしてみました。

グローバルメニュー
----------------------------------------

<img src="/images/2016/12/3507acbe3cdd22d1ba3a6ea5257c2554.png" alt="スクリーンショット 2016-12-14 22.28.40" width="279" height="194" class="alignnone size-full wp-image-922" /> こんな感じに。Slackもここにあったので左上に持ってきてみた。

使い心地どうなの
----------------------------------------

とかとか、「あ、Chatworkやだ」って思った時に拡張機能をちょこちょこ作っています。  
実際に半年くらい使ってみての感想なんですが、 **めっちゃ使いやすいです** 。  
デザイナーの方にはとても申し訳ないと思いつつ、この拡張がなかったら若干イライラするくらいには馴染んできてしまいました。

まとめ
----------------------------------------

歴史的経緯に挫けないための技術スキルなのではないかとすら思っている(✌ ՞ਊ ՞)✌

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>