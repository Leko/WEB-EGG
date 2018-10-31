---
path: /post/automate-build-netlify-with-heroku/
title: NetlifyとHerokuで予約投稿機能を実現する
date: 2017-07-11T11:30:00+00:00
image: /images/2017/07/eyecatch-automate-build-netlify-with-heroku.png
tags:
  - Netlify
  - Heroku
---

こんにちは。  
[前回の記事](/post/migrate-wp-to-middleman-and-netlify/)にてブログを Netlify+Middleman に置き換えた、と書きましたが、  
静的サイトジェネレータを利用したときの弱点の１つである、予約投稿する機能を Netlify の Buildhook と、Heroku scheduler で再現してみました。

<!--more-->

## 要件

- Middleman 自体が未来の日付を指定すると自動で記事を非公開にしてくれるので、それに頼る
  - ※記事の表示/非表示の切り替えがビルドのタイミング以外（コミットが必要なフラグなど）に依存する場合、今回の記事は要件不足です。あしからず
- 無料
- 可能な限り細かい頻度でビルドできること（１日１回とかだと少ない）
- Git のログを汚さないこと

Netlify 自体が自動ビルド＋デプロイの機構を備えているため、master ブランチに push すれば勝手にビルドされます。  
ただ、空コミットを作ったりして Git のログが汚れていくのは嫌だったので、そういった副作用なしに、無料でビルドできる方法を探りました

## Netlify の Build hook とは

Netlify が提供する、ビルドを叩くための URL なようです  
管理画面の Settings から設定ができます。

```
curl -X POST -d '{"files":{}}' ビルドフックのURL
```

でビルドを叩くことができました。  
`files`のキーがないと、ビルド受付待ちのまま固まってしまったので、この方法でいいのかどうかはわかりませんが、ひとまず動いてるのでよしとします。

というわけで、単に curl コマンドを１つ叩けばよいだけなので、選択肢はかなりたくさん有ると思います。

## 不採用：Travis CI の cron 機能

無料なんですが、最短でも 1d/1 回しかビルドできないので、頻度が足りず断念

## 不採用：AWS Lambda のスケジューリング機能

ほぼ無みたいなものですが、完全に無料ではないので見送り

## 採用：Heroku scheduler

結局使い慣れた Heroku を採用しました。  
最短で 10 分に 1 回ビルドできます。無料です。簡単です。

## Netlify の Build hook と Heroku scheduler で予約投稿する

わざわざボタン化するほど自動化できてないのですが、一応 Heroku のデプロイボタン作成しました。  
詳しい方法も README に書いてあります。ぜひお試しください。

[Leko/Netlify-builder](https://github.com/Leko/Netlify-builder)
