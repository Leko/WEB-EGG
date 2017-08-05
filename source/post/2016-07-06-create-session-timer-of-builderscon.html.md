---
path: /post/create-session-timer-of-builderscon/
title: Buildersconのセッションタイマーを作った
date: 2016-07-06T12:07:55+00:00
dsq_thread_id:
  - "4964044748"
image: /images/2016/07/099d91afa53de3892408d332de58ecbb-1.png
categories:
  - お知らせ
tags:
  - Builderscon
---
元 YAPC::Asia 主催の牧さん [@lestrrat](https://twitter.com/lestrrat) によるカンファレンス [Builderscon](http://builderscon.io/) の[Web版セッションタイマー](http://web.timer.builderscon.io/)を作りました。

<!--more-->

ちなみに、Builderscon公式ブログでも紹介してくださっています。やったぜ。

> <span class="removed_link" title="http://blog.builderscon.io/builderscon/2016/06/27/session-timer.html">Releasing Our Session Timers – builderscon::blog</span>

タイマーの実物は[こちら](http://web.timer.builderscon.io/)から試せます。

画像で紹介すると、こんな感じです。  
残り時間に応じて背景の色が代わり、数字を見なくてもだいたい分かるような作りになってます。


![スクリーンショッ](/images/2016/07/099d91afa53de3892408d332de58ecbb.png)



実際にiPadにはめ込んでみた時の図(公式ブログから拝借)

使用したものは素[React](https://facebook.github.io/react/)。他にも[Riot](http://riotjs.com/)や[MagJS](https://github.com/magnumjs/mag.js/)など色々試したかったんですが、  
イベントに使用するものということで、メンテできる人が多そうな長いものに巻かれておきました。

まだイベント本番へ向けて微調整が色々残ってますが、こんなのやりました報告です。  
ソースコードはGithubにあげているので、詳しい内容はそちらを御覧ください。

> [builderscon/session-timer](https://github.com/builderscon/session-timer)

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>
