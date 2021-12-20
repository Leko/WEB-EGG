---
title: GitHubのトレンドで振り返る2021年のJavaScript/TypeScript
date: '2021-12-21T11:50:58.086Z'
featuredImage: ./2021-12-20-20-37-48.png
tags:
  - JavaScript
  - TypeScript
  - GitHub
---

今年も GitHub のトレンドで 2021 年の JavaScript/TypeScript を振り返ります。去年も同じネタの記事を書いているため、去年との差異を交えつつ書きたいと思います。去年の記事はこちらです。

> &mdash; [GitHub のトレンドで振り返る 2020 年の JavaScript | WEB EGG](https://blog.leko.jp/post/2020-js-ts-trending-history/)

## 集計方法

GitHub のトレンドは過去の履歴が残っていないので非公式に集計されたデータを利用しています。

- 集計期間は 2021/01/01 から 2021/12/15 まで
- 対象言語は`JavaScript`と`TypeScript`のみ
- トレンドの過去データのソースは[larsbijl/trending_archive](https://github.com/larsbijl/trending_archive)を参照
  - 去年は[xiaobaiha/github-trending-history](https://github.com/xiaobaiha/github-trending-history)を利用したが今年のデータは無かったのでソースを変更
  - 日ごとにまとめた markdown になっており、remark で AST→ データ化しました

生データをベースに加工した集計用の生データは[こちら](https://docs.google.com/spreadsheets/d/1S0qz8kQHdiMoVkIZr2JQ2t770J7ZKdjfsfI_CE7HU_o/edit?usp=sharing)にスプレッドシートとして公開しています。

**GitHub がそのリポジトリをなんの言語と見なしたかをもとに集計対象を決定している**ことにご留意ください。また、別言語で書かれた JS 向けのツール（swc, esbuild など）、CSS フレームワークなどは対象外としています。

## 2021 年に作られた・2021 年から流行ったリポジトリ

まずは今年作られた・今年から流行ったリポジトリを見ます。単純にトレンドへの掲載率や累計スター数で集計すると既知のリポジトリばかりになるので、今年誕生して流行った or 今年からトレンドに載ったリポジトリを絞って紹介します。

- 抽出条件
  - 2021 年に初めてトレンド入りした時点でスター数が 100 未満
  - 集計期間のスター数の差分が+5000 以上
  - 今年獲得したスター数（集計開始時のスター数と、集計終了時のスター数の差）が大きい順にソート

行頭にある矢印の見方は 2020/1/1 のスター数->2021/12/6 のスター数です。

- 92 -> 76501(+76409) [ant-design/ant-design](https://github.com/ant-design/ant-design)
- 17 -> 20440(+20423) [conwnet/github1s](https://github.com/conwnet/github1s)
- 47 -> 16747(+16700) [slidevjs/slidev](https://github.com/slidevjs/slidev)
- 20 -> 12018(+11998) [pavlobu/deskreen](https://github.com/pavlobu/deskreen)
- 10 -> 9208(+9198) [benawad/dogehouse](https://github.com/benawad/dogehouse)
- 11 -> 9144(+9133) [VickScarlet/lifeRestart](https://github.com/VickScarlet/lifeRestart)
- 66 -> 8961(+8895) [calendso/calendso](https://github.com/calendso/calendso)
- 46 -> 8811(+8765) [JonnyBurger/remotion](https://github.com/JonnyBurger/remotion)
- 46 -> 8810(+8764) [remotion-dev/remotion](https://github.com/remotion-dev/remotion)
- 61 -> 8674(+8613) [snowpackjs/astro](https://github.com/snowpackjs/astro)
- 49 -> 7779(+7730) [alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react)
- 15 -> 6963(+6948) [upgundecha/howtheysre](https://github.com/upgundecha/howtheysre)
- 57 -> 6997(+6940) [mattermost/focalboard](https://github.com/mattermost/focalboard)
- 98 -> 6150(+6052) [docmirror/dev-sidecar](https://github.com/docmirror/dev-sidecar)
- 77 -> 6009(+5932) [sveltejs/kit](https://github.com/sveltejs/kit)
- 32 -> 5442(+5410) [vuejs/petite-vue](https://github.com/vuejs/petite-vue)
- 20 -> 5407(+5387) [SigNoz/signoz](https://github.com/SigNoz/signoz)
- 12 -> 5290(+5278) [blueedgetechno/win11React](https://github.com/blueedgetechno/win11React)
- 12 -> 5207(+5195) [nextapps-de/winbox](https://github.com/nextapps-de/winbox)

## 2021 年にもっともスターを獲得したリポジトリ

次にリポジトリ作成日に関係なく 2020 年もっともスターを獲得したリポジトリを見ていきます。

- 抽出条件
  - 2020 年に一度以上トレンドに載った
  - 今年獲得したスター数が大きい順にソート
  - 上位 20 件のみ抽出

前セクションと重複しているものは~~取り消し線~~を入れてます

- ~~92 -> 76501 (+76409) [ant-design/ant-design](https://github.com/ant-design/ant-design)~~
- 138667 -> 180899 (+42232) [kamranahmedse/developer-roadmap](https://github.com/kamranahmedse/developer-roadmap)
- 89240 -> 129501 (+40261) [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)
- 11171 -> 39404 (+28233) [microsoft/Web-Dev-For-Beginners](https://github.com/microsoft/Web-Dev-For-Beginners)
- 157 -> 24070 (+23913) [google/zx](https://github.com/google/zx)
- 65584 -> 89130 (+23546) [30-seconds/30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code)
- 314511 -> 337473 (+22962) [freeCodeCamp/freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp)
- 13960 -> 35127 (+21167) [vitejs/vite](https://github.com/vitejs/vite)
- 57747 -> 78416 (+20669) [vercel/next.js](https://github.com/vercel/next.js)
- 4671 -> 25175 (+20504) [supabase/supabase](https://github.com/supabase/supabase)
- ~~17 -> 20440 (+20423) [conwnet/github1s](https://github.com/conwnet/github1s)~~
- 159245 -> 179394 (+20149) [facebook/react](https://github.com/facebook/react)
- 23348 -> 43372 (+20024) [iptv-org/iptv](https://github.com/iptv-org/iptv)
- 51251 -> 71034 (+19783) [awesome-selfhosted/awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted)
- 16037 -> 34973 (+18936) [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- 106733 -> 125448 (+18715) [microsoft/vscode](https://github.com/microsoft/vscode)
- 42664 -> 60921 (+18257) [ryanmcdermott/clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript)
- 33163 -> 50926 (+17763) [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
- ~~47 -> 16747 (+16700) [slidevjs/slidev](https://github.com/slidevjs/slidev)~~
- 174775 -> 191415 (+16640) [vuejs/vue](https://github.com/vuejs/vue)

## Node.js 関連のトピックに絞った場合

次に Node.js に関連したトピックを持ったリポジトリを比較します。

- 抽出条件
  - `nodejs`トピックがついている
  - 2020 年に 5000 スター以上獲得した
  - 獲得したスター数が多い順にソート

ここまでの内容と重複しているものは取り消し線を入れてます

{{TODO}}

## トレンドに上がったリポジトリのトピック

ここまでの内容と重複しているものは取り消し線を入れてます

https://observablehq.com/@leko/2021-github-trending-topics

## トレンド常連組

最後に GitHub のトレンド常連組を載せます。

- 抽出条件

  - 集計期間内にトレンドに載った日数でソート
  - 上位 20 件を抽出

- 122 日 [vercel/next.js](https://github.com/vercel/next.js)
- 106 日 [angular/angular](https://github.com/angular/angular)
- 101 日 [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)
- 94 日 [github/docs](https://github.com/github/docs)
- 88 日 [storybookjs/storybook](https://github.com/storybookjs/storybook)
- 87 日 [angular/angular-cli](https://github.com/angular/angular-cli)
- 85 日 [ant-design/ant-design](https://github.com/ant-design/ant-design)
- 82 日 [discordjs/discord.js](https://github.com/discordjs/discord.js)
- 77 日 [ionic-team/ionic-framework](https://github.com/ionic-team/ionic-framework)
- 76 日 [cypress-io/cypress](https://github.com/cypress-io/cypress)
- 76 日 [facebook/react-native](https://github.com/facebook/react-native)
- 76 日 [grafana/grafana](https://github.com/grafana/grafana)
- 75 日 [vitejs/vite](https://github.com/vitejs/vite)
- 74 日 [puppeteer/puppeteer](https://github.com/puppeteer/puppeteer)
- 71 日 [iptv-org/iptv](https://github.com/iptv-org/iptv)
- 70 日 [trustwallet/assets](https://github.com/trustwallet/assets)
- 70 日 [Azure/azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs)
- 69 日 [microsoft/Web-Dev-For-Beginners](https://github.com/microsoft/Web-Dev-For-Beginners)
- 68 日 [microsoft/vscode](https://github.com/microsoft/vscode)
- 68 日 [mui-org/material-ui](https://github.com/mui-org/material-ui)
