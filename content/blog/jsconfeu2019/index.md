---
title: JSConf EU 2019に行ってきました
date: '2019-06-05T10:32:30.552Z'
featuredImage: ./featured-image.png
tags:
  - JavaScript
  - Node.js
---

2019/6/1~6/2の二日間ドイツのベルリンにて開催された[JSConf EU 2019](https://2019.jsconf.eu)に行ってきたのでレポートを書きます。  
トーク以外にもイベント運営としてのクオリティの高さやJSConfブランドに関してとかドイツ観光とか色々と感動したもの得たものが多くて書ききれないので、詳しくはお会いすることがあればお酒の肴にでも聞いてあげてください。

トークの概要だけ知りたい方は1,2日目まとめのあたりを読んで下さい。

<!--more-->

## 何しに行ったの

- JS界隈の世界的にトップレベルのエンジニアたちのトークを聞きたい
- 懇親会とかで英語で交流してみたい
- 海外のカンファレンス行ったことなくビビってる自分を打破するために行って成功体験を積みたい
- 海外の大きなカンファレンスで喋れそうかどうかテーマやレベル感、空気感を知りたい
- JSConf JPのスタッフなので本家EUのすごさを知ってJSConf JPに還元したい

あたりが主な目標でした。  
もっと英語ができていればより充実したと思いますが、目的は果たせたかなと思いました。

Node.jsのコラボレータなので前日まで開催されるOpenJS Collab Summitにも行けたのですが、英語のSpeaking/Listeningで議論に参加できる自身がなくてチキった結果、自費で行くことにしました。  
OpenJS Collab Summitとは、去年までNode.js Collab Summitと呼ばれていたコラボレータたちが今後について議論する会で、ここで決まったことが次のメジャーバージョンに大きく影響したり、もっと将来的な大きな方向性を決定・合意する重要なイベントです。

> &mdash; [Node.js FoundationとJS Foundationが合併しOpenJS Foundationを設立 - The Linux Foundation](https://www.linuxfoundation.jp/press-release/2019/03/node-js-foundation-and-js-foundation-merge-to-form-openjs-foundation/)

## JSConf EUとは？
10年の歴史を持つJSのカンファレンスです。  
Ryan DahlがNode.jsを発表したり、その9年後にDenoを発表したりと行ったトークが有名なのかなと思います。

今回参加した2019の全日程のスケジュールはここから見れます。
https://2019.jsconf.eu/schedule/

メインは１−２日目なんですが、前後の日にもそれぞれちょっとだけ催しがあるという感じでした。

## ０日目まとめ

<blockquote class="twitter-tweet" data-lang="en"><p lang="und" dir="ltr"><a href="https://t.co/odp6goxiHJ">pic.twitter.com/odp6goxiHJ</a></p>&mdash; れこ | 6/18 TS meetup #1 (@L_e_k_o) <a href="https://twitter.com/L_e_k_o/status/1134548819734126598?ref_src=twsrc%5Etfw">May 31, 2019</a></blockquote>

０日目は前夜祭的に行われたpre-register event（当日スムーズに入場できるようあらかじめ入場券を手に入れつつお酒飲んで交流しよう）があったので、せっかくだし行ってみました。  
トークはなくて、入場券を手に入れたら野外スペースでDJがﾄﾞｩﾝﾄﾞｩﾝ演奏してる中お酒を飲んで語らう会でした。  
道に迷いつつなんとか会場についたものの、皆すでに打ち解けて（るように見えて）おり、更に酔ってて英語がくだけてて早いので、何言ってるかわからず、まったく話の輪に混じれずとてももどかしい思いをしていました。  

<blockquote class="twitter-tweet" data-lang="en"><p lang="ja" dir="ltr">ただでさえ英語喋れないのにちょっと混ぜてもらっていいですかはハードル高すぎる…会場にいるのにチキってる情けなさ</p>&mdash; れこ | 6/18 TS meetup #1 (@L_e_k_o) <a href="https://twitter.com/L_e_k_o/status/1134549110420365313?ref_src=twsrc%5Etfw">May 31, 2019</a></blockquote>

話し相手が居ないのでひとり寂しく３杯目のワインに手をかけようとしたときに、偶然目があった方と挨拶して、少しお話ができました。  
何してる人なのか聞いたらgulpを作ってる人と、gulpプラグインを業務用にゴリゴリ作って使い倒してるgulpユーザの２人でした。  
gulpはここ数年ほとんど使ってなかったので、まだアクティブに開発されてたんだ！？という驚きと、会で初めて話す人が著名なOSSの人ってとんでもないなと驚かされました。  
勤め先の話とか初めての参加ですか？とか世間話をしつつ、gulpを今後どんな形でアップグレードしていくか（ファイルウォッチの効率化、高速化、テストの強化、プラグインのAPIにbreaking changeを絶対に起こさないよう開発する）とか、gulp-contribへコミット、メンテナをどう確保するかとかとか、OSS談義を**聞いてました。**  
gulpやOSSの体制づくりなど分かる話題だったので6-7割くらいは聞き取れたんですが、喋ろうとするとまったく速度が追いつかなくて、20文に１回くらい少し喋る（それも喋るのをゆっくり待ってもらいながら）って感じでした。  

> 補足ですが何か英語を口にすれば真摯に聞いてくれる方ばかりで、少しずつ単語を紡いでいたのですが、自分に心が折れてしまってだんだん口数が減っていったのが問題で、聞き手には一切の非はありません。喋るのを待ってくれているのに喋ろうとする心が折れた私の全面的なミスです。

誰か、だれか日本人は来てないのか、、、と甘えたくなったものの誰一人として見当たらない。  
ほんの少しだけど会話ができた満足感と、とにかく焦りと不安を感じるスタートでした。

<blockquote class="twitter-tweet" data-lang="en"><p lang="ja" dir="ltr">偶然話させてもらった人がgulp人だった。一gulpユーザーとしてのcontribへのcontributionのハードルの高さと、そんなことないよって実例にsecurity fixの実例を出しハードルは低いしコミュニティがついてるでと解き、future of gulpについて話してたのは聞いてたけど議論に加われなかった</p>&mdash; れこ | 6/18 TS meetup #1 (@L_e_k_o) <a href="https://twitter.com/L_e_k_o/status/1134568372916686848?ref_src=twsrc%5Etfw">May 31, 2019</a></blockquote>

<blockquote class="twitter-tweet" data-lang="en"><p lang="ja" dir="ltr">英語を聞いてくれようとする姿勢が優しくて涙流れる</p>&mdash; れこ | 6/18 TS meetup #1 (@L_e_k_o) <a href="https://twitter.com/L_e_k_o/status/1134574580671045633?ref_src=twsrc%5Etfw">May 31, 2019</a></blockquote>


## １日目まとめ
１日目のタイムテーブルはこちらから参照できます。

https://2019.jsconf.eu/schedule/timetable.html#day1

Back track, Side trackが主にトークをしている会場で、この２つに絞ってレポートします。（それでもめっちゃ多い）

### Curators Opening JSConf EU 2019

### Laurie Voss JavaScript: who, what, where, why and next

### Jessica Jordan Crafting Comics for Literally Everyone

### Jason Williams Let’s build a JavaScript Engine

### Tara Z. Manicsic ES2019 Features: What Even Are They?

### Garann Means What happened to my JavaScript phone?

### TC39 Committee Panel

### Roshan Gautam You should start a tech community too.

### Michael Mifsud GraphQL: Towards a universal query language

### Jason Straughan Teaching Kids to Code by a 13 year-old

### Aditya Mukerjee করো: Translating Code to Other (Human) Languages, and Back Again

### Allison McMillan BDD: Baby Driven Development

### Kat Marchán tink: A Next Generation Package Manager

### Maël Nison Yarn - 2019 and beyond

### C J Silverio The economics of open source

### Curators Closing Day 1

### { live : js } Making of this Stage

### Vitalii Bobrov JavaScript, JavaScript…. Rocks You!

### jenn schiffer javascript considered...useful

### Martin Sonnenholzer animations - learning from cartoons

### Paulo Lopes 10 things I learned making the fastest js server runtime in the world

### Constanza Yáñez Calderón About life, robots and cats!

### Sher Minn Chong Recreating Retro Computer Art with JS!

### Nat Alison Polyhedra, I Choose You! Letting Your Passions Take Form

### Stefan Judis HTTP headers for the responsible developer

### Shwetank Dixit Block, unblock, block! : How ad blockers are being circumvented, and how they are fighting back.

### Amanda Sopkin What JS Developers can Learn from Medieval Coats of Arms about Accessibility

### Ziran Sun Build an end-to-end IoT system using JavaScript with "GDPR awareness"

### Marley Rafson The Case for Augmented Reality on the Web

### Manu Martinez-Almeida Stencil: a built-time approach to the web

## ２日目まとめ
１日目のタイムテーブルはこちらから参照できます

https://2019.jsconf.eu/schedule/timetable.html#day2

### Nick Kreeger & Nikhil Thorat TensorFlow.js: Bringing Machine Learning to the Web and Beyond.

### Una Kravets CSS Houdini & The Future of Styling

### Ashley Williams JavaScript's Journey to the Edge

### Maxim Koretskyi A sneak peek into super optimized code in JS frameworks

### Houssein Djirdeh Performance Empathy

### Ella van Durpe Designing a Rich Content Editor for a Third of the Web

### Meya Stephen Kenigbolo Javascript is for Everyone!

### Maximiliano Firtman The modern PWA Cheat Sheet

### Max Bittker Simulating Sand: Building Interactivity With WebAssembly

### OpenJS Foundation Panel: +1 to a Collaborative Future ~ the Foundation of JavaScript

### Leandro Ostera Building WebApps Like It's 1972 🧙‍♂️

### Havi Hoffman In the land of the JavaScripters

### Henri Helvetica Shape Of The Web

### Curators Closing Conference; Instructions for Party

### Kevin Doran Offline-first data: Getting Bigger

### Bryan Hughes The Contentious Relationship Between the LGBTQ+ community and Tech

### Johnny Austin Finding Your Abstraction Sweet Spot

### Alexandra Sunderland Bringing back dial-up: the internet over SMS

### Chidinma Kalu Why Can’t We All Just Get Along?

### Fedor Indutny llhttp - new HTTP 1.1 parser for Node.js

### Joyee Cheung Web APIs in Node.js Core: Past, Present, and Future

### Joe Sepi Promises API in Node.js core: where we are and where we’ll get to

### Stanimira Vlaeva Embedding V8 in the real world

### Pier Paolo Fumagalli Tales from the Toilet: how Javascript helps the production of tissue papers

## ３日目まとめ
３日目はRelax.js Brunchと呼ばれるブランチタイムで、JSConf EU参加者たちの最後の交流の場という感じでした。  
集合時間や解散時間が明確なわけではなく、各自スケジュールに合わせて適当に飲み食いしながら語り合って、流れ解散という感じでした。

後から振り返ってみると世間話やドイツ観光、カンファレンスの感想の共有とかJSに関連する何かしらの話ではあったのですが、  
フリーな会話はコンテキストを飲み込めずまったくついていけなくて、何聞かれているのかも怪しいし、受け答えも全然うまくできず、ひたすら辛い...となってました。  

そのあとは会の間に仲良くさせていただいたベルリン在住の[@shuheikagawa](https://twitter.com/shuheikagawa)さんの務めるZalandoのオフィスを見学させていただいて（めっっっっっちゃキレイだった）、自転車でベルリンの街をふらふらと散策し帰国しこの記事を書いてます。

## 来年行ってみたいって方へ

JSConf EUは10年間開催した区切りで一旦休止するそうです。  
初めて行ってみたことでモチベーションあがって、来年こそはCFP出すぞ！と思ってたんですが、本家でそれが叶うことは直近ではなくなりました。  
でも終わりではなく"休止"だと言っていたので、再開されるのを心から楽しみにしています。

ぜひ次回があればまたいきたい。その時までに普通に会話ができるくらい英語の実践経験を貯めようと思いました。  
すでに英語が喋れていた日本人の方々に何をして鍛えたかを聞いて回ったので、教えてもらったことを１つ１つ試します。

なお本家（EU）からのれん分けした各国のローカル版JSConfは引き続き開催されるので、JSConfが気になった方は今冬開催の[JSConf JP](https://www.jsconf.jp)にぜひ参加して下さい！！
CFPも募集中です！  

TODO: Job boardの写真（会長のツイート）
