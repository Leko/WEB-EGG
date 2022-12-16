---
title: GitHubのトレンドで振り返る2022年のJavaScript/TypeScript
date: '2022-12-06T14:17:34.856Z'
featuredImage: ./featured-image.png
tags:
  - JavaScript
---

今年も GitHub のトレンドで 2022 年の JavaScript/TypeScript を振り返ります。去年の記事はこちらです。

— [GitHub のトレンドで振り返る 2021 年の JavaScript | WEB EGG](https://blog.leko.jp/post/2021-javascript-typescript-trending-history/#2021-%E5%B9%B4%E3%81%AB%E4%BD%9C%E3%82%89%E3%82%8C%E3%81%9F2021-%E5%B9%B4%E3%81%8B%E3%82%89%E6%B5%81%E8%A1%8C%E3%81%A3%E3%81%9F%E3%83%AA%E3%83%9D%E3%82%B8%E3%83%88%E3%83%AA)

## 集計方法

本記事の集計期間は 2022/01/01〜2022/12/07、対象言語は JavaScript および TypeScript です。  
なお **GitHub がそのリポジトリをなんの言語と見なしてトレンドに掲載したかをもとに集計対象を決定していることにご留意ください。** 別言語で書かれた Rust 製の JS 向けのツールや CSS フレームワークなどは基本的に対象外となります。

集計に利用したデータですが、GitHub は過去のトレンドを閲覧する方法を提供していないため、独自の仕組みで GitHub トレンドのアーカイブを生成しそのデータを利用しました。毎日 UTC 0 時ごろにデータ取得処理が走り、日毎のディレクトリの中にその時点でのトレンドの内容を CSV 化した`言語名.csv`が作成されます。

当記事では集計期間の全ての`javascript.csv`と`typescript.csv`をマージし、リポジトリの作成日やリポジトリのトピック、今年に獲得した star 数などのいくつかのメタ情報を追加取得する集計スクリプトでサマリーデータを生成しました。

- トレンドのアーカイブ（CSV）は[こちら](https://github.com/Leko/github-trending-archive/tree/main/archive/raw)
  - JS/TS に限らず[こちら](https://github.com/Leko/github-trending-archive/tree/main/packages/collector/src/main.ts#L10)に定義された言語が蓄積されています
- 集計スクリプトは[こちら](https://github.com/Leko/github-trending-archive/blob/main/packages/summarize/src/main.ts)
  - CLI 引数で集計期間と言語を指定したサマリーデータが生成できるので、もし機会があれば使ってみてください。
- 実際に生成されたサマリーデータは[こちら](https://docs.google.com/spreadsheets/d/1ZSdw70KbQasTbYF251Sv6paGhMSC8qSB7SgnY0h2d_c/edit?usp=sharing)

## 2022 年に作られた・2022 年から流行ったリポジトリ

まずは今年作られた・今年から流行ったリポジトリの紹介です。リポジトリの作成日を考慮せずトレンドの掲載回数やスター数だけで集計すると既知のリポジトリばかりになるので今年からトレンドになったリポジトリに絞って紹介します。

抽出条件:

- 2022/01/01 時点でスター数が 100 未満
- 集計期間のスター数の差分が+5000 以上
- 今年獲得したスター数が大きい順にソート

一覧:

- [AykutSarac/jsoncrack.com](https://github.com/AykutSarac/jsoncrack.com) +20216(1 → 20217)
- [AykutSarac/jsonvisio.com](https://github.com/AykutSarac/jsonvisio.com) +20216(1 → 20217)
- [spacedriveapp/spacedrive](https://github.com/spacedriveapp/spacedrive) +15812(10 → 15822)
- [pyscript/pyscript](https://github.com/pyscript/pyscript) +15041(7 → 15048)
- [facebook/lexical](https://github.com/facebook/lexical) +12455(9 → 12464)
- [nexxeln/create-t3-app](https://github.com/nexxeln/create-t3-app) +11634(29 → 11663)
- [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app) +11632(33 → 11665)
- [toeverything/AFFiNE](https://github.com/toeverything/AFFiNE) +11215(6 → 11221)
- [lensterxyz/lenster](https://github.com/lensterxyz/lenster) +9544(25 → 9569)
- [alibaba/lowcode-engine](https://github.com/alibaba/lowcode-engine) +8610(6 → 8616)
- [faker-js/faker](https://github.com/faker-js/faker) +8175(14 → 8189)
- [upscayl/upscayl](https://github.com/upscayl/upscayl) +7138(53 → 7191)
- [apihero-run/jsonhero-web](https://github.com/apihero-run/jsonhero-web) +7026(6 → 7032)
- [jsonhero-io/jsonhero-web](https://github.com/jsonhero-io/jsonhero-web) +7025(11 → 7036)
- [total-typescript/beginners-typescript](https://github.com/total-typescript/beginners-typescript) +6882(5 → 6887)
- [total-typescript/beginners-typescript-tutorial](https://github.com/total-typescript/beginners-typescript-tutorial) +6882(5 → 6887)
- [divamgupta/diffusionbee-stable-diffusion-ui](https://github.com/divamgupta/diffusionbee-stable-diffusion-ui) +6782(17 → 6799)
- [formkit/auto-animate](https://github.com/formkit/auto-animate) +6261(5 → 6266)
- [vercel/satori](https://github.com/vercel/satori) +6028(5 → 6033)
- [BishopFox/unredacter](https://github.com/BishopFox/unredacter) +5928(0 → 5928)
- [alyssaxuu/omni](https://github.com/alyssaxuu/omni) +5749(0 → 5749)
- [ciderapp/Cider](https://github.com/ciderapp/Cider) +5591(65 → 5656)
- [actualbudget/actual](https://github.com/actualbudget/actual) +5561(1 → 5562)
- [Kindelia/HVM](https://github.com/Kindelia/HVM) +5383(2 → 5385)
- [Sanster/lama-cleaner](https://github.com/Sanster/lama-cleaner) +5201(71 → 5272)
- [tremorlabs/tremor](https://github.com/tremorlabs/tremor) +5033(3 → 5036)

### AykutSarac/jsoncrack.com

> 🔮 Seamlessly visualize your JSON data instantly into graphs; paste, import or fetch!  
> [AykutSarac/jsoncrack.com](https://github.com/AykutSarac/jsoncrack.com)

### AykutSarac/jsonvisio.com

> 🔮 Seamlessly visualize your JSON data instantly into graphs; paste, import or fetch!  
> [AykutSarac/jsonvisio.com](https://github.com/AykutSarac/jsonvisio.com)

### spacedriveapp/spacedrive

> Spacedrive is an open source cross-platform file explorer, powered by a virtual distributed filesystem written in Rust.  
> [spacedriveapp/spacedrive](https://github.com/spacedriveapp/spacedrive)

### pyscript/pyscript

> Home Page: https://pyscript.net Examples: https://pyscript.net/examples  
> [pyscript/pyscript](https://github.com/pyscript/pyscript)

### facebook/lexical

> Lexical is an extensible text editor framework that provides excellent reliability, accessibility and performance.  
> [facebook/lexical](https://github.com/facebook/lexical)

### nexxeln/create-t3-app

> The best way to start a full-stack, typesafe Next.js app  
> [nexxeln/create-t3-app](https://github.com/nexxeln/create-t3-app)

### t3-oss/create-t3-app

> The best way to start a full-stack, typesafe Next.js app  
> [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app)

### toeverything/AFFiNE

> There can be more than Notion and Miro. AFFiNE is a next-gen knowledge base that brings planning, sorting and creating all together. Privacy first, open-source, customizable and ready to use.  
> [toeverything/AFFiNE](https://github.com/toeverything/AFFiNE)

### lensterxyz/lenster

> Lenster is a decentralized, and permissionless social media app built with Lens Protocol 🌿  
> [lensterxyz/lenster](https://github.com/lensterxyz/lenster)

### alibaba/lowcode-engine

> An enterprise-class low-code technology stack with scale-out design / 一套面向扩展设计的企业级低代码技术体系  
> [alibaba/lowcode-engine](https://github.com/alibaba/lowcode-engine)

### faker-js/faker

> Generate massive amounts of fake data in the browser and node.js  
> [faker-js/faker](https://github.com/faker-js/faker)

### upscayl/upscayl

> 🆙 Upscayl - Free and Open Source AI Image Upscaler for Linux, MacOS and Windows built with Linux-First philosophy.  
> [upscayl/upscayl](https://github.com/upscayl/upscayl)

### apihero-run/jsonhero-web

> JSON Hero is an open-source, beautiful JSON explorer for the web that lets you browse, search and navigate your JSON files at speed. 🚀  
> [apihero-run/jsonhero-web](https://github.com/apihero-run/jsonhero-web)

### jsonhero-io/jsonhero-web

> JSON Hero is an open-source, beautiful JSON explorer for the web that lets you browse, search and navigate your JSON files at speed. 🚀  
> [jsonhero-io/jsonhero-web](https://github.com/jsonhero-io/jsonhero-web)

### total-typescript/beginners-typescript

> An interactive TypeScript tutorial for beginners  
> [total-typescript/beginners-typescript](https://github.com/total-typescript/beginners-typescript)

### total-typescript/beginners-typescript-tutorial

> An interactive TypeScript tutorial for beginners  
> [total-typescript/beginners-typescript-tutorial](https://github.com/total-typescript/beginners-typescript-tutorial)

### divamgupta/diffusionbee-stable-diffusion-ui

> Diffusion Bee is the easiest way to run Stable Diffusion locally on your M1 Mac. Comes with a one-click installer. No dependencies or technical knowledge needed.  
> [divamgupta/diffusionbee-stable-diffusion-ui](https://github.com/divamgupta/diffusionbee-stable-diffusion-ui)

### formkit/auto-animate

> A zero-config, drop-in animation utility that adds smooth transitions to your web app. You can use it with React, Vue, or any other JavaScript application.  
> [formkit/auto-animate](https://github.com/formkit/auto-animate)

### vercel/satori

> Enlightened library to convert HTML and CSS to SVG  
> [vercel/satori](https://github.com/vercel/satori)

### BishopFox/unredacter

> Never ever ever use pixelation as a redaction technique  
> [BishopFox/unredacter](https://github.com/BishopFox/unredacter)

### alyssaxuu/omni

> The all-in-one tool to supercharge your productivity ⌨️  
> [alyssaxuu/omni](https://github.com/alyssaxuu/omni)

### ciderapp/Cider

> A new cross-platform Apple Music experience based on Electron and Vue.js written from scratch with performance in mind. 🚀  
> [ciderapp/Cider](https://github.com/ciderapp/Cider)

### actualbudget/actual

> A local-first personal finance system  
> [actualbudget/actual](https://github.com/actualbudget/actual)

### Kindelia/HVM

> A massively parallel, optimal functional runtime in Rust  
> [Kindelia/HVM](https://github.com/Kindelia/HVM)

### Sanster/lama-cleaner

> Image inpainting tool powered by SOTA AI Model. Remove any unwanted object, defect, people from your pictures or erase and replace(powered by stable diffusion) any thing on your pictures.  
> [Sanster/lama-cleaner](https://github.com/Sanster/lama-cleaner)

### tremorlabs/tremor

> The react library to build dashboards fast.  
> [tremorlabs/tremor](https://github.com/tremorlabs/tremor)

## 欄外だけど個人的な興味でピックアップ

獲得スター数的には欄外ですが、今年トレンドに載ったことのあるリポジトリのうち個人的に関心のあるものをいくつかピックアップします。

## 2021 年にもっともスターを獲得したリポジトリ

次に新しいか否かに関わらず 2021 年もっともスターを獲得したリポジトリを見ていきます。

抽出条件:

- 2022 年に一回以上トレンドに載ったリポジトリ
- 今年獲得したスター数が大きい順にソート
- 上位 20 件抽出

ここまでの内容と重複しているものは~~取り消し線~~を入れてます

- [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook) +48747(100 → 48847)
- [kamranahmedse/developer-roadmap](https://github.com/kamranahmedse/developer-roadmap) +42310(178160 → 220470)
- [awesome-selfhosted/awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted) +39282(71552 → 110834)
- [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) +27881(128347 → 156228)
- [freeCodeCamp/freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp) +24188(333763 → 357951)
- [microsoft/Web-Dev-For-Beginners](https://github.com/microsoft/Web-Dev-For-Beginners) +22791(38100 → 60891)
- [facebook/react](https://github.com/facebook/react) +21999(176753 → 198752)
- [yangshun/tech-interview-handbook](https://github.com/yangshun/tech-interview-handbook) +21071(62027 → 83098)
- ~~[AykutSarac/jsoncrack.com](https://github.com/AykutSarac/jsoncrack.com) +20216(1 → 20217)~~
- ~~[AykutSarac/jsonvisio.com](https://github.com/AykutSarac/jsonvisio.com) +20216(1 → 20217)~~
- [vercel/next.js](https://github.com/vercel/next.js) +20151(77258 → 97409)
- [type-challenges/type-challenges](https://github.com/type-challenges/type-challenges) +17465(10936 → 28401)
- [supabase/supabase](https://github.com/supabase/supabase) +16803(25204 → 42007)
- [30-seconds/30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code) +16490(88898 → 105388)
- [iptv-org/iptv](https://github.com/iptv-org/iptv) +16406(42598 → 59004)
- [microsoft/vscode](https://github.com/microsoft/vscode) +16349(123528 → 139877)
- [ryanmcdermott/clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript) +15876(60300 → 76176)
- [vitejs/vite](https://github.com/vitejs/vite) +15371(34818 → 50189)

### Anduin2017/HowToCook

> 程序员在家做饭方法指南。Programmer's guide about how to cook at home (Chinese only).  
> [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook)

### kamranahmedse/developer-roadmap

> Interactive roadmaps, guides and other educational content to help developers grow in their careers.  
> [kamranahmedse/developer-roadmap](https://github.com/kamranahmedse/developer-roadmap)

### awesome-selfhosted/awesome-selfhosted

> A list of Free Software network services and web applications which can be hosted on your own servers  
> [awesome-selfhosted/awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted)

### trekhleb/javascript-algorithms

> 📝 Algorithms and data structures implemented in JavaScript with explanations and links to further readings  
> [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)

### freeCodeCamp/freeCodeCamp

> freeCodeCamp.org's open-source codebase and curriculum. Learn to code for free.  
> [freeCodeCamp/freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp)

### microsoft/Web-Dev-For-Beginners

> 24 Lessons, 12 Weeks, Get Started as a Web Developer  
> [microsoft/Web-Dev-For-Beginners](https://github.com/microsoft/Web-Dev-For-Beginners)

### facebook/react

> A declarative, efficient, and flexible JavaScript library for building user interfaces.  
> [facebook/react](https://github.com/facebook/react)

### yangshun/tech-interview-handbook

> 💯 Curated coding interview preparation materials for busy software engineers  
> [yangshun/tech-interview-handbook](https://github.com/yangshun/tech-interview-handbook)

### vercel/next.js

> The React Framework  
> [vercel/next.js](https://github.com/vercel/next.js)

### Asabeneh/30-Days-Of-JavaScript

> 30 days of JavaScript programming challenge is a step-by-step guide to learn JavaScript programming language in 30 days. This challenge may take more than 100 days, please just follow your own pace.  
> [Asabeneh/30-Days-Of-JavaScript](https://github.com/Asabeneh/30-Days-Of-JavaScript)

### type-challenges/type-challenges

> Collection of TypeScript type challenges with online judge  
> [type-challenges/type-challenges](https://github.com/type-challenges/type-challenges)

### supabase/supabase

> The open source Firebase alternative. Follow to stay updated about our public Beta.  
> [supabase/supabase](https://github.com/supabase/supabase)

### 30-seconds/30-seconds-of-code

> Short JavaScript code snippets for all your development needs  
> [30-seconds/30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code)

### iptv-org/iptv

> Collection of publicly available IPTV channels from all over the world  
> [iptv-org/iptv](https://github.com/iptv-org/iptv)

### microsoft/vscode

> Visual Studio Code  
> [microsoft/vscode](https://github.com/microsoft/vscode)

### ryanmcdermott/clean-code-javascript

> :bathtub: Clean Code concepts adapted for JavaScript  
> [ryanmcdermott/clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript)

### spacedriveapp/spacedrive

> Spacedrive is an open source cross-platform file explorer, powered by a virtual distributed filesystem written in Rust.  
> [spacedriveapp/spacedrive](https://github.com/spacedriveapp/spacedrive)

### vitejs/vite

> Next generation frontend tooling. It's fast!  
> [vitejs/vite](https://github.com/vitejs/vite)

## Node.js 関連のトピックに絞った場合

次に Node.js に関連したトピックを持ったリポジトリを比較します。

抽出条件:

- 2022 年に一回以上トレンドに載った`nodejs-framework`, `node-js`, `node`, `nodejs`いずれかのトピックがついているリポジトリ
- 集計期間のスター数の差分が +5000 以上
- 獲得したスター数が多い順にソートし上位 20 件抽出

ここまでの内容と重複しているものは~~取り消し線~~を入れてます

- ~~[kamranahmedse/developer-roadmap](https://github.com/kamranahmedse/developer-roadmap) +42310(178160 → 220470)~~
- ~~[freeCodeCamp/freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp) +24188(333763 → 357951)~~
- ~~[vercel/next.js](https://github.com/vercel/next.js) +20151(77258 → 97409)~~
- ~~[Asabeneh/30-Days-Of-JavaScript](https://github.com/Asabeneh/30-Days-Of-JavaScript) +19604(11037 → 30641)~~
- ~~[30-seconds/30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code) +16490(88898 → 105388)~~
- [withastro/astro](https://github.com/withastro/astro) +14678(8501 → 23179)
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) +11883(71943 → 83826)
- [google/zx](https://github.com/google/zx) +11524(23785 → 35309)
- [ToolJet/ToolJet](https://github.com/ToolJet/ToolJet) +11156(4210 → 15366)
- [novuhq/novu](https://github.com/novuhq/novu) +11108(2927 → 14035)
- [nestjs/nest](https://github.com/nestjs/nest) +10181(42472 → 52653)
- [medusajs/medusa](https://github.com/medusajs/medusa) +9889(5450 → 15339)
- [nodejs/node](https://github.com/nodejs/node) +9303(82658 → 91961)
- [strapi/strapi](https://github.com/strapi/strapi) +9204(41222 → 50426)
- [axios/axios](https://github.com/axios/axios) +8854(88792 → 97646)
- [prisma/prisma](https://github.com/prisma/prisma) +8651(18791 → 27442)
- [leonardomso/33-js-concepts](https://github.com/leonardomso/33-js-concepts) +8512(44949 → 53461)
- ~~[faker-js/faker](https://github.com/faker-js/faker) +8175(14 → 8189)~~
- [payloadcms/payload](https://github.com/payloadcms/payload) +8148(485 → 8633)
- [n8n-io/n8n](https://github.com/n8n-io/n8n) +7791(19067 → 26858)

### withastro/astro

> Build faster websites with Astro's next-gen island architecture 🏝✨  
> [withastro/astro](https://github.com/withastro/astro)

### goldbergyoni/nodebestpractices

> :white_check_mark: The Node.js best practices list (November 2022)  
> [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)

### google/zx

> A tool for writing better scripts  
> [google/zx](https://github.com/google/zx)

### ToolJet/ToolJet

> Extensible low-code framework for building business applications. Connect to databases, cloud storages, GraphQL, API endpoints, Airtable, etc and build apps using drag and drop application builder. Built using JavaScript/TypeScript. 🚀  
> [ToolJet/ToolJet](https://github.com/ToolJet/ToolJet)

### novuhq/novu

> The open-source notification infrastructure for products  
> [novuhq/novu](https://github.com/novuhq/novu)

### nestjs/nest

> A progressive Node.js framework for building efficient, scalable, and enterprise-grade server-side applications on top of TypeScript & JavaScript (ES6, ES7, ES8) 🚀  
> [nestjs/nest](https://github.com/nestjs/nest)

### medusajs/medusa

> The open-source Shopify alternative ⚡️  
> [medusajs/medusa](https://github.com/medusajs/medusa)

### nodejs/node

> Node.js JavaScript runtime :sparkles::turtle::rocket::sparkles:  
> [nodejs/node](https://github.com/nodejs/node)

### strapi/strapi

> 🚀 Strapi is the leading open-source headless CMS. It’s 100% JavaScript, fully customizable and developer-first.  
> [strapi/strapi](https://github.com/strapi/strapi)

### axios/axios

> Promise based HTTP client for the browser and node.js  
> [axios/axios](https://github.com/axios/axios)

### prisma/prisma

> Next-generation ORM for Node.js & TypeScript | PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, MongoDB and CockroachDB  
> [prisma/prisma](https://github.com/prisma/prisma)

### leonardomso/33-js-concepts

> 📜 33 JavaScript concepts every developer should know.  
> [leonardomso/33-js-concepts](https://github.com/leonardomso/33-js-concepts)

### payloadcms/payload

> Free and Open-source Headless CMS and Application Framework built with TypeScript, Node.js, React and MongoDB  
> [payloadcms/payload](https://github.com/payloadcms/payload)

### n8n-io/n8n

> Free and source-available fair-code licensed workflow automation tool. Easily automate tasks across different services.  
> [n8n-io/n8n](https://github.com/n8n-io/n8n)

## トレンドに上がったリポジトリのトピック

今年トレンドに上がったリポジトリのトピックを集計しました。

抽出条件:

- 2022 年に一回以上トレンドに載ったリポジトリ
- 外れ値や表記揺れノイズを減らすため 5 つ以上のリポジトリに付けられたトピックのみ抽出

TODO: バブルチャート

トピック毎にそのトピックがついたリポジトリ数を円の大きさとしたバブルチャートがこちらになります。なお当記事のサムネイル画像はバブルチャートの中心あたりを一部抜粋したものになります。こちらのリンクから SVG で全体を確認できます。

TODO: リンク

## トレンド常連組

最後に GitHub のトレンド常連組を載せます。

抽出条件:

- 集計期間内にトレンドに載った日数でソートし上位 20 件抽出

TODO: リスト

以上です。良いお年を！
