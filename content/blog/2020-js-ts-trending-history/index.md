---
title: GitHubのトレンドで振り返る2020年のJavaScript
date: '2020-12-05T19:58:42.458Z'
featuredImage: ./2020-12-09-01-19-48.png
tags:
  - JavaScript
  - TypeScript
  - GitHub
---

れこです。この記事は[Node.js Advent Calendar 2020](https://qiita.com/advent-calendar/2020/nodejs)の 12 日目の記事です。今回は年の瀬ということで酒の肴になりそうな記事を書きたいと思います。

本記事では 2020 年に GitHub のトレンドに上がったリポジトリをいくつかの切り口で集計して、独断と偏見で感想を付け加えます。  
この記事を酒の肴に 2020 年の JS/TS について振り返ってもらえたら幸いです。

## まえおき

予期しない解釈をされないよう予防線を張ります。気にしない方は読み飛ばしてください。

**本記事の正しい受け取り方は「こんなのあったね、懐かしいなぁ」です。**集計結果に付け加えて独断と偏見でいくつかのリポジトリをピックアップしています。「なんで＊＊＊をピックアップしないんだ」とか怒らないでください。またバズった指標の一つとして GitHub のスター数を用いています。スター数が多い/少ないからと言ってそのものの良し悪しを決定づけることはないと筆者は思っていますし、この記事をもって「これが 2020 年・2021 年の＊＊＊だ」とか言うつもりは全くありません。

## 集計方法

GitHub のトレンドは過去の履歴が残っていないので非公式に集計されたデータを利用しています。

- 集計期間は 2020/01/01 から 2020/12/05 までの 341 日間
- 対象言語は`JavaScript`と`TypeScript`のみ（CSS や HTML、.vue や.elm とか JS/TS 以外のリポジトリは除外）
- トレンドの過去データのソースは[xiaobaiha/github-trending-history](https://github.com/xiaobaiha/github-trending-history)を参照
  - 日ごとにまとめた markdown になっており、remark で AST→ データ化しました
- スター数の遷移をチャート化するのに[Star History](https://star-history.t9t.io)を利用しています

一つ注意していただきたいのが**GitHub がそのリポジトリをなんの言語と見なしたかをもとに集計対象を決定しています。**そのため本来ここに載るべきリポジトリがなんらかの理由（ex. ドキュメントの HTML などが大量にコミットされておりリポジトリ全体が HTML と判定された）によって集計対象外になっている可能性があります。

データ化したものは[こちら](https://docs.google.com/spreadsheets/d/e/2PACX-1vTHFXqzaCMuNqPuDBs4PE6wuxJuJfwbUIYvv8l-IV8neo-6G0BDfP68kcZ8MlV_fFJMkpIdADMzya84/pub?gid=259916409&single=true&output=csv)に CSV として公開しています。

<details><summary>説明が必要そうなCSVカラムの一覧を開く</summary>

- firstAppearedOn: 2020/1/1 移行ではじめてトレンドに載った日
- appearedCount: 集計期間にトレンドに載った日数
- appearedDates: 集計期間にトレンドに載った日の一覧（カンマ区切り）
- stargazers20200101: 2020/1/1 時点での star 数（リポジトリが存在しなかった場合は 0）
- stargazers20201206: 2020/12/6 時点での star 数（リネームなどにより最新状況が取得できなかった場合は空欄）
- stargazers2020Diff: `stargazers20201206`と`stargazers20200101`の差（2020 年だけのスター数の差分）
- topics: 2020/12/6 時点でそのリポジトリについているトピックの一覧（カンマ区切り）

</details>

## 今年作られた・今年から流行ったリポジトリ

まずは今年作られた・今年から流行ったリポジトリを見てみます。
単純にトレンドに多く載った順やスター数の累計で集計すると 2020 年以前から既知のものばかりで酒の肴にはならないので、今年誕生して流行った or 今年から流行り始めたリポジトリに絞って集計してみました。

- 2020 年に一度でもトレンドに載ったことがある
- かつ 2020 年にはじめてトレンド入りした時点でスター数が 100 未満
- 集計開始（2020/1/1）時点でのスター数と、集計終了（2020/12/6）時点でのスター数の差が大きい順にソート
- 差分が+5000 以上のリポジトリだけ抽出

では一覧です。冒頭にある矢印は`2020/1/1のスター数 -> 2020/12/6のスター数`です。

- 1 -> 18211 [microsoft/playwright](https://github.com/microsoft/playwright)
- 0 -> 14795 [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- 0 -> 13896 [rome/tools](https://github.com/rome/tools) (ex-[facebookexperimental/rome](https://github.com/facebookexperimental/rome))
- 0 -> 13476 [vitejs/vite](https://github.com/vitejs/vite) (ex-[vuejs/vite](https://github.com/vuejs/vite))
- 0 -> 13245 [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)
- 0 -> 12137 [cyrildiagne/ar-cutpaste](https://github.com/cyrildiagne/ar-cutpaste)
- 0 -> 10824 [facebookexperimental/Recoil](https://github.com/facebookexperimental/Recoil)
- 0 -> 10571 [tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons)
- 18 -> 10400 [desktop/desktop](https://github.com/desktop/desktop)
- 68 -> 9557 [lensapp/lens](https://github.com/lensapp/lens)
- 0 -> 9476 [tabler/tabler-icons](https://github.com/tabler/tabler-icons)
- 1 -> 9137 [responsively-org/responsively-app](https://github.com/responsively-org/responsively-app) (ex-[manojVivek/responsively-app](https://github.com/manojVivek/responsively-app))
- 0 -> 8872 [backstage/backstage](https://github.com/backstage/backstage) (ex-[spotify/backstage](https://github.com/spotify/backstage))
- 0 -> 8095 [bradtraversy/vanillawebprojects](https://github.com/bradtraversy/vanillawebprojects)
- 0 -> 7790 [foambubble/foam](https://github.com/foambubble/foam)
- 0 -> 7506 [yemount/pose-animator](https://github.com/yemount/pose-animator)
- 0 -> 7168 [kautukkundan/Awesome-Profile-README-templates](https://github.com/kautukkundan/Awesome-Profile-README-templates)
- 0 -> 6873 [chuzhixin/vue-admin-beautiful](https://github.com/chuzhixin/vue-admin-beautiful)
- 0 -> 6802 [hediet/vscode-drawio](https://github.com/hediet/vscode-drawio)
- 0 -> 6593 [mengshukeji/Luckysheet](https://github.com/mengshukeji/Luckysheet)
- 0 -> 6588 [AMAI-GmbH/AI-Expert-Roadmap](https://github.com/AMAI-GmbH/AI-Expert-Roadmap)
- 6 -> 6577 [hediet/vscode-debug-visualizer](https://github.com/hediet/vscode-debug-visualizer)
- 0 -> 6464 [oldboyxx/jira_clone](https://github.com/oldboyxx/jira_clone)
- 0 -> 6426 [microsoft/Web-Dev-For-Beginners](https://github.com/microsoft/Web-Dev-For-Beginners)
- 0 -> 6261 [wuhan2020/wuhan2020](https://github.com/wuhan2020/wuhan2020)
- 0 -> 5985 [element-plus/element-plus](https://github.com/element-plus/element-plus)
- 0 -> 5536 [blitz-js/blitz](https://github.com/blitz-js/blitz)
- 0 -> 5316 [rough-stuff/rough-notation](https://github.com/rough-stuff/rough-notation) (ex-[pshihn/rough-notation](https://github.com/pshihn/rough-notation))
- 0 -> 5070 [mikecao/umami](https://github.com/mikecao/umami)
- 0 -> 5054 [poloclub/cnn-explainer](https://github.com/poloclub/cnn-explainer)

### microsoft/playwright

もっと昔からあると思っていたので今年のリポジトリだったことに驚きです。めちゃくちゃお世話になっています。  
playwight は Chromium/Firefox/WebKit の３大ブラウザを透過的な API で扱えるようにした MS 謹製の headless ブラウザ操作ツールです。  
この playwright を E2E テスト用に特化した[microsoft/playwright-test](https://github.com/microsoft/playwright-test)や、ブラウザを起動し GUI での操作を記録して JS のコードを生成してくれる[microsoft/playwright-cli](https://github.com/microsoft/playwright-cli)など、周辺ツールも整ってきました。

### anuraghazra/github-readme-stats

このリポジトリは JS あまり関係ないですが、7 月ごろに GitHub のプロフィールに載せる README ファイルが作れるようになりましたね。手間をかけずにある程度いい感じになる README のパーツを生成してくれる系ツールの１つです。

> &mdash; [Managing your profile README - GitHub Docs](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/managing-your-profile-readme)

### rome/tools

> Rome は Babel と yarn の作成者である Sebastian McKenzie と Facebook の React Native チームが作成した実験的な JavaScript ツールチェーンである。Rome には、コンパイラ、リンター、フォーマッター、バンドラー、およびテストフレームワークが含まれており、「JavaScript ソースコードの処理に関連するあらゆるもののための包括的なツール」を目指している。
>
> &mdash; [Facebook が実験的な JavaScript ツールチェーンである Rome を発表](https://www.infoq.com/jp/news/2020/08/rome-experimental-js-toolchain/)

Facebook の Rome かなり話題になりましたね。個人的には ESLint ルールを自作したりバンドルのチューニングをしたり細かい設定を自由にできる方が好きなのであまり関心がないのですが「関連ツールが多すぎてとっつきにくい、それぞれの役割を理解して扱う学習コスト」と言う JS の大きな問題の１つに挑んでる偉大なリポジトリだと思います。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">rome興味なくて全くキャッチアップしてなかったのに唐突に意見求められて困惑しているけど、こういう刺激がないとどんどん鈍っていくんだろうなという危機感を感じている</p>&mdash; Leko / れこ (@L_e_k_o) <a href="https://twitter.com/L_e_k_o/status/1233402076979269637?ref_src=twsrc%5Etfw">February 28, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### facebookexperimental/Recoil

Recoil も流行りましたね。発表されたのは 5 月くらいだったと記憶しています。  
私は Rx みたいなものだと理解しました。Rx を製品として真剣に使ったことないので解釈違いかもしれません。面白いし気にはなるけど「これを行儀よくファイルに分けて誰しもが読みやすいように定義しメンテするにはどうしたら良いんだろう？」と言う疑問を残したまま存在を忘れていました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">recoilちょろっと触ってみて、これ比較対象はReduxじゃなくてRxではと思った</p>&mdash; Leko / れこ (@L_e_k_o) <a href="https://twitter.com/L_e_k_o/status/1261654648479346688?ref_src=twsrc%5Etfw">May 16, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### vitejs/vite

まさにジョバンニが一晩でやってくれましたシリーズですね。esbuild が早いぞと話題になっている頃、Vue の作者がバンドラのパフォーマンスについて悶々と考えた結果生まれた高速な dev サーバです。Vue 作者が作って名前もそれっぽいので Vue 専用ツールなのかと思っていましたが、React や preact でも使える汎用的な作りになってるみたいですね。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Open sourced at <a href="https://t.co/LYv5vnOv1O">https://t.co/LYv5vnOv1O</a> <a href="https://t.co/KU2LLpEmTD">https://t.co/KU2LLpEmTD</a></p>&mdash; Evan You (@youyuxi) <a href="https://twitter.com/youyuxi/status/1252578206454087680?ref_src=twsrc%5Etfw">April 21, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### tailwindlabs/heroicons

このリポジトリもそうですが、同 org の Tailwind CSS も流行りましたね（Tailwind CSS は言語が CSS なので本記事から除外されています）  
せっかくなので個別に集計した結果、2020 年の star 数の差分は`+14627 (17596 -> 32223)`でした。2018 年からすでに知名度のあるライブラリだったんですね。今年に流行ったものかと思っていましたが、数年前からずっと流行ってました。

[Tailwind CSS の star 数の変遷](https://github-stars.socode.pro/?stack=91cadd02-b30f-1865-728a-3e76d0b0c3a4&repos=tailwindlabs%2Ftailwindcss)

### excalidraw/excalidraw

[excalidraw](https://excalidraw.com/)は手書きっぽい優しい雰囲気の図形が描ける描画ツールです。ライブラリというよりは web アプリです。UI はミニマルですが完成度はかなり高いと思います。なんと同時編集もできますし、公式にホスティングされているアプリとして使うのはもちろん（React のみですが）埋め込みにも対応しており、ラフなアイデアを共有したり議論するのにかなり使えそうな予感がしています。  
年始に颯爽と現れ描画ツール界隈がザワつきました。日本だと複雑 GUI の会で話題になっていたのを見かけました。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Made this in <a href="https://twitter.com/Vjeux?ref_src=twsrc%5Etfw">@Vjeux</a>&#39;s Excalidraw <a href="https://t.co/9oAjdW0wAc">https://t.co/9oAjdW0wAc</a><br>Liberating to have fewer options yet have the results look great. Stop caring so much about your stupid graphics. Every imperfection is a little reminder to stop bikeshedding and focus on communicating something. <a href="https://t.co/vD1uWu4Ay5">pic.twitter.com/vD1uWu4Ay5</a></p>&mdash; jordwalke (@jordwalke) <a href="https://twitter.com/jordwalke/status/1214858186789806080?ref_src=twsrc%5Etfw">January 8, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### rough-stuff/rough-notation

![](2020-12-08-23-52-25.png)

全く流行ってはないと思うんですが、個人的に好きなライブラリをピックアップです。Web ページに ↑ スクショのようなマーカーペンや手書きっぽいアノテーションを加えられるライブラリです。前述の excalidraw も内部で使用している Rough.js を使っており、こちらは web アプリというよりライブラリです。デモは[こちら](https://roughnotation.com/)から。  
アニメーションがヌルヌル動くし、手書きっぽさもかなり自然で、アノテーションを文字に被せてもテキストに支障はありません。ブログやプレゼン資料のハイライトなどに使ってみると面白いかもしれません。アニメーションしすぎてうざくなる可能性もありますが。

## 2020 年にもっともスターを獲得したリポジトリ

つぎにリポジトリがいつ作られたかを考慮せずに、2020 年もっともスターを獲得したリポジトリを見ていきます。

- 2020 年に一度でもトレンドに載ったことがある
- 集計開始（2020/1/1）時点でのスター数と、集計終了（2020/12/6）時点でのスター数の差が大きい順にソート
- 多いので上位 20 件だけ抽出
- 前述の"今年作られた・今年から流行ったリポジトリ"と重複したものは~~取り消し線~~を入れてます

では一覧です。

- +30042 [denoland/deno](https://github.com/denoland/deno)
- +29401 [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)
- +24368 [vuejs/vue](https://github.com/vuejs/vue)
- +21125 [facebook/react](https://github.com/facebook/react)
- +19598 [microsoft/vscode](https://github.com/microsoft/vscode)
- +18808 [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)
- ~~+18211 [microsoft/playwright](https://github.com/microsoft/playwright)~~
- +16853 [gothinkster/realworld](https://github.com/gothinkster/realworld)
- +15321 [vercel/next.js](https://github.com/vercel/next.js), (ex-[zeit/next.js](https://github.com/zeit/next.js))
- ~~+14795 [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)~~
- +14563 [ryanmcdermott/clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript)
- +14560 [azl397985856/leetcode](https://github.com/azl397985856/leetcode)
- +14352 [freeCodeCamp/freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp)
- +14027 [angular/angular](https://github.com/angular/angular)
- ~~+13896 [rome/tools](https://github.com/rome/tools) (ex-[facebookexperimental/rome](https://github.com/facebookexperimental/rome))~~
- +13583 [30-seconds/30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code)
- ~~+13476 [vitejs/vite](https://github.com/vitejs/vite) (ex-[vuejs/vite](https://github.com/vuejs/vite))~~
- ~~+13245 [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)~~
- +13112 [GitSquared/edex-ui](https://github.com/GitSquared/edex-ui)
- +12873 [tannerlinsley/react-query](https://github.com/tannerlinsley/react-query)

想像していた通りです。もともとスター数を集めている有名なリポジトリがさらに star を伸ばしたという感じですが、個人的には Deno と vue-next(Vue3)をピックアップします。

### denoland/deno

Deno は 2018 年に[10 Things I Regret About Node.js](https://www.youtube.com/watch?v=M3BM9TB-8yA)発表されてから２年の時を経て、今年の 5 月に[v1 がリリース](https://deno.land/posts/v1)されました。2021 年は Deno 元年になるのでしょうか。今後の勢いに注目したいです。

v1 記念に Rust のコードを読み込む Rust plugin を試したことがあるんですが、安定版になる前に機能ごと削除されるかもしれません。こちらから議論に参加できます。

> &mdash; [Remove unstable native plugins · Issue #8490 · denoland/deno](https://github.com/denoland/deno/issues/8490)

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Denoで3rd party crateを利用するRust pluginのデモ。deno_core crateがバンバン破壊的変更してるのでGitHub上に転がってるサンプルは型が合わなくて全滅してた。公式にあるソースだけが唯一参考になる。CommonMark準拠のmarkdownトランスパイルを実行するサンプル<a href="https://t.co/VxTonUp60x">https://t.co/VxTonUp60x</a></p>&mdash; Leko / れこ (@L_e_k_o) <a href="https://twitter.com/L_e_k_o/status/1269303228539129857?ref_src=twsrc%5Etfw">June 6, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### vuejs/vue

Vue に関しては今年の 7 月に v3 RC をアナウンスし、その後 9 月に Vue.js Amsterdam にて[V3.0 にアナウンス](https://news.vuejs.org/issues/186)されて賑わいましたね。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Vue 3.0 &quot;One Piece&quot; is here! <a href="https://t.co/jH6FfByDmX">https://t.co/jH6FfByDmX</a></p>&mdash; Vue.js (@vuejs) <a href="https://twitter.com/vuejs/status/1306992969728380930?ref_src=twsrc%5Etfw">September 18, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### vercel/next.js

Next.js に関してはこの前の[Next.js Conf](https://nextjs.org/conf/stage/n)で発表された v10 の新機能たちでザワついたことが記憶に新しいと思います。個人的にはこれまでのサーバサイドフレームワークの責務を再定義したと思える大きなリリースだと思います。[Front-End Study #1](https://forkwell.connpass.com/event/190313/)の[Keynote トーク：Frontend 領域を再定義する](https://zenn.dev/mizchi/articles/c638f1b3b0cd239d3eea)でも Next.js（とそれをラップしたフルスタックフレームワーク時代の開幕）について触れられていましたね。Next.js をベースにしたフルスタックフレームワーク Blitz もランクインしていますがあまり関心がないのでピックアップはしません。

## トレンドに上がったリポジトリのトピック

今度はスターではなく今年トレンドに上がったリポジトリのトピックをみてみます。

- 2020 年に一度でもトレンドに載ったことがあるリポジトリが対象
- 5 つ以上のリポジトリに共通してつけられているトピックだけ対象

[![](2020-12-09-00-32-59.png)](https://observablehq.com/embed/@leko/bubble-chart?cell=chart)

画像が大きいので中心部分だけ抜粋しました。こちらから SVG で全体が見れます。

> &mdash; [Bubble Chart / Shingo Inoue / Observable](https://observablehq.com/@leko/bubble-chart)

予想外なことはありません。そして比較材料がないので特筆事項もなさそうです。同じことを来年もやってこの記事と比較したいです。

## 殿堂入り

最後に、トレンドの常連だったリポジトリたちを並べて終わります。載せるまでもなく有名なリポジトリです。

- 集計期間内に 50 日以上トレンドに載ったリポジトリが対象

- 102 日: [angular/angular](https://github.com/angular/angular)
- 74 日: [microsoft/TypeScript](https://github.com/microsoft/TypeScript)
- 69 日: [storybookjs/storybook](https://github.com/storybookjs/storybook)
- 68 日: [ant-design/ant-design](https://github.com/ant-design/ant-design)
- 67 日: [nestjs/nest](https://github.com/nestjs/nest)
- 66 日: [grafana/grafana](https://github.com/grafana/grafana)
- 66 日: [denoland/deno](https://github.com/denoland/deno)
- 66 日: [microsoft/vscode](https://github.com/microsoft/vscode)
- 64 日: [vuejs/vue-next](https://github.com/vuejs/vue-next)
- 63 日: [aws/aws-cdk](https://github.com/aws/aws-cdk)
- 61 日: [react-hook-form/react-hook-form](https://github.com/react-hook-form/react-hook-form)
- 60 日: [typeorm/typeorm](https://github.com/typeorm/typeorm)
- 58 日: [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)
- 57 日: [DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- 57 日: [facebook/react](https://github.com/facebook/react)
- 53 日: [mui-org/material-ui](https://github.com/mui-org/material-ui)
- 52 日: [angular/angular-cli](https://github.com/angular/angular-cli)
- 52 日: [angular/components](https://github.com/angular/components)
- 52 日: [elastic/kibana](https://github.com/elastic/kibana)
- 52 日: [strapi/strapi](https://github.com/strapi/strapi)
- 51 日: [streamich/react-use](https://github.com/streamich/react-use)
- 50 日: [facebook/react-native](https://github.com/facebook/react-native)

今年のトレンドでもっとも出現回数が多かったのは Angular でした。ぶっちぎりです。が、Angular は全く追っていないため今年に何が起こったのかは全くわかっていません。Angular のアドカレを貼ってお茶を濁します。

> &mdash; [Angular Advent Calendar 2020 - Qiita](https://qiita.com/advent-calendar/2020/angular)

![](2020-12-06-03-59-04.png)

[view chart online](https://github-stars.socode.pro/?stack=5b0abe7d-3c2a-3a09-fba0-5fbeb24963f1&repos=angular%2Fangular%2Cmicrosoft%2FTypeScript%2Cstorybookjs%2Fstorybook%2Cant-design%2Fant-design%2Cnestjs%2Fnest%2Cgrafana%2Fgrafana%2Cdenoland%2Fdeno%2Cmicrosoft%2Fvscode%2Cvuejs%2Fvue-next%2Caws%2Faws-cdk%2Creact-hook-form%2Freact-hook-form%2Ctypeorm%2Ftypeorm%2Ctrekhleb%2Fjavascript-algorithms%2CDefinitelyTyped%2FDefinitelyTyped%2Cfacebook%2Freact%2Cmui-org%2Fmaterial-ui%2Cangular%2Fangular-cli%2Cangular%2Fcomponents%2Celastic%2Fkibana%2Cstrapi%2Fstrapi%2Cstreamich%2Freact-use%2Cfacebook%2Freact-native)

ついでにこれらのリポジトリの star 数の変遷を取ってみたのですが、累計でみると React がとんでもないことになってますね。

## Node.js は？

ここまで Node.js が出てきませんでした。Node.js が C++と認識されて対象外になっているなんてことはありません。もちろん集計対象です。ただ今年は他のリポジトリに比べるとちょっと勢いが足りなかったようです。

今年の star 数の差分は`+9638 (65544 -> 75182)`でした。

## おわり

以上です！
では良いお年を！
