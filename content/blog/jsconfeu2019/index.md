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

０日目は前夜祭的に行われたpre-register event（当日スムーズに入場できるようあらかじめ入場券を手に入れつつお酒飲んで交流しよう）があったので、せっかくだし行ってみました。  
トークはなくて、入場券を手に入れたら野外スペースでDJがﾄﾞｩﾝﾄﾞｩﾝ演奏してる中お酒を飲んで語らう会でした。  
道に迷いつつなんとか会場についたものの、皆すでに打ち解けて（るように見えて）おり、更に酔ってて英語がくだけてて早いので、何言ってるかわからず、まったく話の輪に入って行けず、もどかしい思いをしていました。  

<blockquote class="twitter-tweet" data-lang="en"><p lang="ja" dir="ltr">ただでさえ英語喋れないのにちょっと混ぜてもらっていいですかはハードル高すぎる…会場にいるのにチキってる情けなさ</p>&mdash; れこ | 6/18 TS meetup #1 (@L_e_k_o) <a href="https://twitter.com/L_e_k_o/status/1134549110420365313?ref_src=twsrc%5Etfw">May 31, 2019</a></blockquote>

話し相手が居ないのでひとり寂しく３杯目のワインに手をかけようとしたときに、偶然目があった方と挨拶して、少しお話ができました。  
何してる人なのか聞いたらgulpを作ってる人と、gulpプラグインを業務用にゴリゴリ作って使い倒してるgulpユーザの２人でした。  
gulpはここ数年ほとんど使ってなかったので「まだアクティブに開発されてたんだ！」という驚きと、会で初めて話す人が著名なOSSの人ってとんでもないなと驚かされました。  
勤め先の話とか初めての参加ですかーとか世間話をしつつ、gulpを今後どんな形でアップグレードしていくか（ファイルウォッチの効率化、高速化、テストの強化、プラグインのAPIにbreaking changeを絶対に起こさないよう開発する）とか、gulp-contribへコミット、メンテナをどう確保するかとかとか、OSS談義を**聞いてました。**  
gulpやOSSの体制づくりなど分かる話題だったので6-7割くらいは聞き取れたんですが、喋ろうとするとまったく速度が追いつかなくて、20文に１回くらい少し喋る（それも喋るのをゆっくり待ってもらいながら）って感じでした。  
何か英語を口にすれば真摯に聞いてくれる方ばかりで、少しずつ単語を紡いでいたのですが、自分に心が折れてしまってだんだん口数が減っていったのが問題で、聞き手には一切の非はありません。喋るのを待ってくれているのに喋ろうとする心が折れた私の全面的なミスです。

誰か、だれか日本人は来てないのか、、、と甘えたくなったものの誰一人として見当たらない。  
ほんの少しだけど会話ができた満足感と、とにかく焦りと不安を感じるスタートでした。

---
---
---

## １日目トークまとめ
１日目のタイムテーブルはこちらから参照できます。

https://2019.jsconf.eu/schedule/timetable.html#day1

Back track, Side trackが主にトークをしている会場で、この２つに絞ってレポートします。  
現地での日本語の実況は[#jsconfeu_ja](https://twitter.com/hashtag/jsconfeu_ja?src=hash)タグを観ると分かりやすいと思います。  

各トークの概要を引用しています。引用先のページにスピーカーのTwitterやGitHub、ホームページ等のリンクがあります。  
また、[#sketchnote](https://twitter.com/search?f=images&vertical=default&q=%23sketchnotes%20jsconfeu&src=typd)というタグにて、１枚絵でトークのまとめを描いてツイートしている素晴らしい方々がおりとても分かりやすかったので、ツイートを埋め込みさせていただいています。  

### Curators Opening JSConf EU 2019
オープニングです。動画がYouTubeに上がっていたので紹介します。
映像では音ひかえめなんですが、現地での音圧すごくて、テーマ曲に合わせた映像もすごく可愛く、そのあとの演奏もかっこよくて。しょっぱなから「すごいお祭りが始まった」感を味わいました。

<iframe width="560" height="315" src="https://www.youtube.com/embed/o1rzsna263c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### [Laurie Voss] JavaScript: who, what, where, why and next

> npm has more data than anyone about who JavaScript developers are and what we’re up to. Using registry stats and the results of our 2019 ecosystem survey of over 30,000 developers, I break down the current state of JavaScript and where trends look like they’re headed, so you can make more informed technical choices.
>
> &mdash; [Laurie Voss: JavaScript: who, what, where, why and next](https://2019.jsconf.eu/laurie-voss/javascript-who-what-where-why-and-next.html)

スライド: https://slides.com/seldo/jsconf-eu-2019#/

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">“JavaScript: who, what, where, why and next” by <a href="https://twitter.com/seldo?ref_src=twsrc%5Etfw">@seldo</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> <a href="https://t.co/feyMUJquMd">pic.twitter.com/feyMUJquMd</a></p>&mdash; Clairikine @ staying hydrated (@clairikine) <a href="https://twitter.com/clairikine/status/1134778919704334341?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Future and trends of the JavaScript community by <a href="https://twitter.com/seldo?ref_src=twsrc%5Etfw">@seldo</a> at <a href="https://twitter.com/jsconfeu?ref_src=twsrc%5Etfw">@jsconfeu</a> <a href="https://twitter.com/hashtag/JSconfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSconfEU</a> <a href="https://twitter.com/hashtag/jsconfeu2019?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu2019</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/U3bPNk11fS">pic.twitter.com/U3bPNk11fS</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1134786384483561472?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

### [Jessica Jordan] Crafting Comics for Literally Everyone

> Remember loving to read comics on a Sunday afternoon when you were a kid? Maybe you don’t. In the past, traditional print comics have made it impossible for blind and visually-impaired readers to experience their heroes’ adventures first-hand. Today an increasing number of initiatives like comic book stores for the blind aim to overcome this challenge.
> What if I told you that the web platform empowers us to even create comics for literally everyone?
> Alongside a demo application, you see how accessibility best practices enable you to craft an immersive webcomic experience that is not only engaging for the sighted but accessible for everyone.
>
> &mdash; [Jessica Jordan: Crafting Comics for Literally Everyone](https://2019.jsconf.eu/jessica-jordan/crafting-comics-for-literally-everyone.html)

<iframe width="560" height="315" src="https://www.youtube.com/embed/BPmuR4mAQaw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

スライド: http://comics-for-everyone.jessicajordan.de/#/

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Wow!! My favourite talk so far by <a href="https://twitter.com/jjordan_dev?ref_src=twsrc%5Etfw">@jjordan_dev</a> on making web comics an accessible experience for everyone - at <a href="https://twitter.com/jsconfeu?ref_src=twsrc%5Etfw">@jsconfeu</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://twitter.com/hashtag/jsconfeu2019?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu2019</a> <a href="https://twitter.com/hashtag/jsconfeu?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu</a> <a href="https://t.co/owhVQ0SeWr">pic.twitter.com/owhVQ0SeWr</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1134789406831915008?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">“Crafting Comics for Literally Everyone” by <a href="https://twitter.com/jjordan_dev?ref_src=twsrc%5Etfw">@jjordan_dev</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> <a href="https://twitter.com/hashtag/a11y?src=hash&amp;ref_src=twsrc%5Etfw">#a11y</a> <a href="https://t.co/Ie3zUbF41o">pic.twitter.com/Ie3zUbF41o</a></p>&mdash; Clairikine @ staying hydrated (@clairikine) <a href="https://twitter.com/clairikine/status/1134778937576448000?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Sketchnote for <a href="https://twitter.com/jjordan_dev?ref_src=twsrc%5Etfw">@jjordan_dev</a> speaking about accessible web comic <a href="https://twitter.com/jsconfeu?ref_src=twsrc%5Etfw">@jsconfeu</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> 💕 <a href="https://t.co/V2ceMvG1Fe">pic.twitter.com/V2ceMvG1Fe</a></p>&mdash; Lisi Linhart (@lisi_linhart) <a href="https://twitter.com/lisi_linhart/status/1134749608083689472?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

### [Jason Williams] Let’s build a JavaScript Engine

> Have you wondered how JS engines work? This past year I built an engine from scratch in Rust. It was fun, weird, exciting and sometimes exhausting. I will share my experience as well as what it is like to work on the specification, collaborate with TC39, and lessons from engines in use today.
>
> &mdash; [Jason Williams: Let’s build a JavaScript Engine](https://2019.jsconf.eu/jason-williams/lets-build-a-javascript-engine.html)

[jasonwilliams/boa](https://github.com/jasonwilliams/boa)というRustで実装されたJSの実行エンジンをリポジトリを題材に、RustでJSインタプリタを実装しWebAssemblyに変換しブラウザで動作デモする話でした。

スライドはありませんが、ブログにも詳しく書かれていたのでこちらも参照です。

> &mdash; [Building a JS Interpreter in Rust Part 1 – Jason Williams](https://jason-williams.co.uk/building-a-js-interpreter-in-rust-part-1/#more-140)  
> &mdash; [Building a JS Interpreter in Rust – Part 2 – Jason Williams](https://jason-williams.co.uk/building-a-js-interpreter-in-rust-part-2/#more-165)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Let&#39;s build a JS engine - talk by <a href="https://twitter.com/Jason_williams?ref_src=twsrc%5Etfw">@Jason_williams</a> at <a href="https://twitter.com/hashtag/jsconfeu?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu</a> <a href="https://twitter.com/hashtag/jsconfeu2019?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu2019</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/JOtq65bZKF">pic.twitter.com/JOtq65bZKF</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1134791596229255170?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

### [Tara Z. Manicsic] ES2019 Features: What Even Are They?

> Thankfully, every year ECMAScript gives us new shinies to advance how we code JavaScript. I’ve found myself digging into features & proposals ever since my curiosity of ES2017’s SharedArrayBuffer took me down a fascinating rabbit hole. Let’s delve into some of the features & proposals we get to look forward to in 2019.
>
> &mdash; [Tara Z. Manicsic: ES2019 Features: What Even Are They?](https://2019.jsconf.eu/tara-z-manicsic/es2019-features-what-even-are-they.html)

スライド: https://github.com/tzmanics/talk-slides/blob/master/reveals/es2019features.html  
※生HTMLです、ホスティング版は見つからなかった

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The new ES2019 features by <a href="https://twitter.com/Tzmanics?ref_src=twsrc%5Etfw">@Tzmanics</a> at <a href="https://twitter.com/hashtag/jsconfeu2019?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu2019</a> <a href="https://twitter.com/hashtag/jsconfeu?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/woRDIuSEbv">pic.twitter.com/woRDIuSEbv</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1134794065189490689?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

### [Garann Means] What happened to my JavaScript phone?

> Not long ago, it seemed like JavaScript devices were going to free JS developers from the constraints of the browser and let us control every aspect of our lives as easily as we once controlled hover menus. Though nodebots were captivating, many of us were anxious for the JS device revolution to reach a more mundane destination: our phones. And yet today the constraints of the mobile landscape look not much different from several years ago. We have the same two operating systems, the same two app stores, and same option to write a native app or push people to save what is still mostly a bookmark. How did we cover so little distance, given the enthusiasm, resources, and potential that appeared to exist, and more importantly, how close can we come to a JavaScript phone today?
>
> &mdash; [Garann Means: What happened to my JavaScript phone?](https://2019.jsconf.eu/garann-means/what-happened-to-my-javascript-phone.html)

スライド: https://speakerdeck.com/garann/what-happened-to-my-javascript-phone

### TC39 Committee Panel
> Join us for the third annual TC39 panel at JSConf EU! TC39 is the standards committee that designs the JavaScript language (sometimes called ECMAScript). The panel will feature a range of committee members and is your chance to ask questions about the past, present and future of JavaScript!  
> Submitting a Question  
> To submit a question to the panel, please tweet us mentioning @jsconfeu and #tc39panel.  
> Everybody can submit a question, no conference ticket necessary! Like all our talks, this panel will be published on YouTube.  
>
> &mdash; [TC39 Committee: Panel](https://2019.jsconf.eu/tc39-committee/panel.html)

とあるのでYouTubeに動画がアップされるのをお待ちください

### [Roshan Gautam] You should start a tech community too.

> I will share my story of establishing and growing JS Community in a developing country Nepal. How tech communities will help you and other grow together ? Challenges that you might face while starting a community in your place. (Based on my experience) How to overcome these challenges ?
>
> &mdash; [Roshan Gautam: You should start a tech community too.](https://2019.jsconf.eu/roshan-gautam/you-should-start-a-tech-community-too.html)

スライド: なし？

ネパールからの参戦。初めての英語でのトークだったそうです 🎉

### [Michael Mifsud] GraphQL: Towards a universal query language

> From its friendly developer experience to its performance benefits, a lot has been said about GraphQL. Underlying it all is the GraphQL query language, made possible by GraphQL schema language. These surprisingly versatile features have the potential to provide a single interface for all modern web app development concerns.
> We will start with a case study on how we use GraphQL queries as an universal interface to resolve data over a variety of datasources ranging from remote HTTP requests, to local CSV files, and in-memory data stores. Next we will explore these ideas further, using GraphQL queries as an interface over the DOM and various other web APIs.
>
> &mdash; [Michael Mifsud: GraphQL: Towards a universal query language](https://2019.jsconf.eu/michael-mifsud/graphql-towards-a-universal-query-language.html)

スライド: https://docs.google.com/presentation/d/1ZcatubPe76N2-dPOTti1UhZoDgxZDapsDExyBhzb1QU/edit#slide=id.p

### [Jason Straughan] Teaching Kids to Code by a 13 year-old

> Teaching programming to children is hard. Computer Science topics can be difficult to grasp using standard programming languages and tools. Using MIT’s Scratch programming platform, creating games and working software is simple and fun thanks to their drag and drop interface.
> To prove that this is as simple as it sounds, this session will be led by a 13-year-old. What better way to learn how to teach kids how to code than by learning from a kid?
>
> &mdash; [Jason Straughan: Teaching Kids to Code by a 13 year-old](https://2019.jsconf.eu/jason-straughan/teaching-kids-to-code-by-a-13-year-old.html)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Sketchnotes for <a href="https://twitter.com/jdstraughan?ref_src=twsrc%5Etfw">@jdstraughan</a> and his son’s talk on coding with scratch <a href="https://twitter.com/jsconfeu?ref_src=twsrc%5Etfw">@jsconfeu</a> <a href="https://twitter.com/hashtag/JSconfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSconfEU</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/vPvoJEF2ci">pic.twitter.com/vPvoJEF2ci</a></p>&mdash; Lisi Linhart (@lisi_linhart) <a href="https://twitter.com/lisi_linhart/status/1134829409859448835?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

### [Aditya Mukerjee] করো: Translating Code to Other (Human) Languages, and Back Again

> JavaScript runs on nearly any platform. Most languages can compile to JavaScript. It’s well-positioned to become the lingua franca of programmers, with one problem: Like most programming languages, JavaScript is based on English. 89% of the world’s population doesn’t speak any English. Many of those people can’t even read the Latin script. If we want JavaScript to be a lingua franca, we need to ensure it is accessible to all people, regardless of their native language.
> Let’s look at the barriers that non-native speakers face when contributing to OSS JavaScript projects and what it would take to remove them entirely, so that two developers could collaborate without speaking the same language. We will see what techniques JavaScript can borrow from other languages by taking a look at করো (koro), a project which adds Bengali support to the Go compiler. And, we will learn enough about compilers and character encoding to answer the eternal question: “Could we do this in JavaScript?”
>
> &mdash; [Aditya Mukerjee: করো: Translating Code to Other (Human) Languages, and Back Again](https://2019.jsconf.eu/aditya-mukerjee/translating-code-to-other-human-languages-and-back-again.html)

スライド: https://speakerdeck.com/chimeracoder/kro-translating-code-to-other-human-languages-and-back-again

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Coding means power but it is also inaccessible through the usage of English. <a href="https://twitter.com/chimeracoder?ref_src=twsrc%5Etfw">@chimeracoder</a> showed a way to extend a Go compiler in Bengali. Very inspiring. JS devs - feel challenged to bring this to JS!! <a href="https://twitter.com/hashtag/jsconfeu2019?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu2019</a> <a href="https://twitter.com/hashtag/jsconfeu?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/elBpjhHAKO">pic.twitter.com/elBpjhHAKO</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1134867650897727489?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>


### [Allison McMillan] BDD: Baby Driven Development
> When I became a parent, I was completely unprepared for the challenges that awaited me. I reached out to hundreds of fellow parents in tech and learned there are common challenges that simply aren’t spoken about. These focus around one fact that no one wants to admit… parenting is not fun. Parenting is stressful, difficult, and oftentimes incredibly lonely. But being a parent also makes people more organized, focused, and empathetic. We’ll explore these survey results to expose common trends and issues and discuss solutions that show how supporting parents helps all team members thrive.
>
> &mdash; [Allison McMillan: BDD: Baby Driven Development](https://2019.jsconf.eu/allison-mcmillan/bdd-baby-driven-development.html)

スライド: https://speakerdeck.com/asheren/baby-driven-development-rubyconf  
※RubyConfって書かれてますが本人がツイートしているのでおそらく合ってると思う

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">“Baby-Driven Development” by <a href="https://twitter.com/allie_p?ref_src=twsrc%5Etfw">@allie_p</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> (my last <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> of the day!) <a href="https://t.co/lwbhRxvGoI">pic.twitter.com/lwbhRxvGoI</a></p>&mdash; Clairikine @ staying hydrated (@clairikine) <a href="https://twitter.com/clairikine/status/1134858244739031040?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>


### [Kat Marchán] tink: A Next Generation Package Manager

> With nearly 1,000,000 packages, the npm ecosystem is the largest out there, by far – but the ecosystem and its package manager were created in more humble times, for small projects and packages centered around the Node.js ecosystem itself.
> It’s about time we redefined package management for modern web development, and that redefinition is tink: a package unwinder for JavaScript brought to you by npm itself. With tink, you’ll find unprecedented speeds, deep compatibility with everything from Node.js to bundlers, and a UX workflow optimized for the modern web developer. Come join us for the official unveiling and find out what the future of all package management will look like for years to come.
>
> &mdash; [Kat Marchán: tink: A Next Generation Package Manager](https://2019.jsconf.eu/kat-marchan/tink-a-next-generation-package-manager.html)

<iframe width="560" height="315" src="https://www.youtube.com/embed/SHIci8-6_gs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

スライド: https://github.com/zkat/talks/blob/master/2019-06-jsconfeu/presentation.pdf

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Sketchnotes for <a href="https://twitter.com/maybekatz?ref_src=twsrc%5Etfw">@maybekatz</a> speaking about tink <a href="https://twitter.com/jsconfeu?ref_src=twsrc%5Etfw">@jsconfeu</a> <a href="https://twitter.com/hashtag/JSconfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSconfEU</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://twitter.com/hashtag/npm?src=hash&amp;ref_src=twsrc%5Etfw">#npm</a> <a href="https://t.co/CrjwYNzsHE">pic.twitter.com/CrjwYNzsHE</a></p>&mdash; Lisi Linhart (@lisi_linhart) <a href="https://twitter.com/lisi_linhart/status/1134858643915100160?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>


### [Maël Nison] Yarn - 2019 and beyond

> Since its creation in 2016, Yarn continuously pushed for better standards in the JavaScript ecosystem in particular. Dependency locking, built-in monorepos, zero-network modes, Plug’n’Play resolution, we’ve been on all fronts. Let’s discuss what we have in store for the future, and what it means for our ecosystem!
>
> &mdash; [Maël Nison: Yarn - 2019 and beyond](https://2019.jsconf.eu/mael-nison/yarn-2019-and-beyond.html)

<iframe width="560" height="315" src="https://www.youtube.com/embed/XePfzVs852s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> &mdash; [Yarn's Future - v2 and beyond · Issue #6953 · yarnpkg/yarn](https://github.com/yarnpkg/yarn/issues/6953)

YarnのV2についてのトーク。tink(npm)からの連続でトークというのが最高にエモかった。

### [C J Silverio] The economics of open source

> The JS package commons is in the hands of a for-profit entity. We trust npm with our shared code, but we have no way to hold npm accountable for its behavior. A trust-based system cannot function without accountability, but somebody still has to pay for the servers. How did we get here, and what should JavaScript do now?
>
> &mdash; [C J Silverio: The economics of open source](https://2019.jsconf.eu/c-j-silverio/the-economics-of-open-source.html)

<iframe width="560" height="315" src="https://www.youtube.com/embed/MO8hZlgK5zc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

スライド: https://github.com/ceejbot/economics-of-package-management/blob/master/slides.pdf

おそらく最大の盛り上がりを見せ、スタンディングオベーションも起こったトークです。  
出だしから気迫が凄まじく、一体なんのトークが始まるんだとドキドキしてましたが、npm時代に得たことを活かし新しい分散型のパッケージマネージャ（レジストリ）entropicが発表されました。

> &mdash; [entropic-dev/entropic: a package registry for anything, but mostly javascript](https://github.com/entropic-dev/entropic)

### [Vitalii Bobrov] JavaScript, JavaScript…. Rocks You!
> After so many years sitting with the computer you can take your old scratched Les Paul or Stratocaster from the case and fill all the space around with warm riffs. I’m going to show how to transform the code into Kirk Hammett’s wah-wah, Stevie Ray Vaughan’s overdrive and Kurt Cobain’s distortion. You’ll learn how to parse audio input in real-time using JavaScript and the Web Audio API.
> I’ll be jamming live on stage with my guitar to demo every code example and we’ll also use WebRTC to jam with friends across the world! After this talk, you will be familiar with the principles behind pedal sound effects and how to create them in code. Let’s rock the Web!
>
> &mdash; [Vitalii Bobrov: JavaScript, JavaScript…. Rocks You!](https://2019.jsconf.eu/vitalii-bobrov/javascript-javascript-rocks-you.html)

スライド: https://speakerdeck.com/bobrov1989/javascript-javascript-dot-dot-dot-rocks-you-251dec18-0917-4b75-be77-45e7d9e89896

### [jenn schiffer] JavaScript considered...useful

> Most people connected to the Web are carrying JavaScript in their pocket without even knowing it, and those of us making tools for building with it are either unaware of or blissfully ignoring that population. While JavaScript’s pervasiveness grows, so is the gap in its literacy, and this is a gap we need to solve if we’re ever going to survive self-driving cars on the blockchain. Let’s talk about JavaScript, the tool, as opposed to JavaScript, the Oracle-run Twitter account.
>
> &mdash; [jenn schiffer: javascript considered...useful](https://2019.jsconf.eu/jenn-schiffer/javascript-considereduseful.html)

### [Martin Sonnenholzer] animations - learning from cartoons

> With CSS animations and web animations moving elements became possible in the browser. But how one moves an object in such a way that it appears “correct” for the human eye? How does a motion feel natural? These and similar questions confronted the artists who brought cartoons to life as early as 1906. Let’s take a look behind the scenes and see how drawings learned to walk and what we can learn from it for animations in the browser.
>
> &mdash; [Martin Sonnenholzer: animations - learning from cartoons](https://2019.jsconf.eu/martin-sonnenholzer/animations-learning-from-cartoons.html)

スライド: なし？

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Sketchnotes for <a href="https://twitter.com/chaos_monster?ref_src=twsrc%5Etfw">@chaos_monster</a> speaking about animation principles <a href="https://twitter.com/jsconfeu?ref_src=twsrc%5Etfw">@jsconfeu</a> <a href="https://twitter.com/hashtag/JSconfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSconfEU</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/RiI1rkt0KQ">pic.twitter.com/RiI1rkt0KQ</a></p>&mdash; Lisi Linhart (@lisi_linhart) <a href="https://twitter.com/lisi_linhart/status/1134774405937152000?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">“Animations - Learning from Cartoons” by <a href="https://twitter.com/chaos_monster?ref_src=twsrc%5Etfw">@chaos_monster</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> <a href="https://t.co/jis8BBUgNf">pic.twitter.com/jis8BBUgNf</a></p>&mdash; Clairikine @ staying hydrated (@clairikine) <a href="https://twitter.com/clairikine/status/1134778949626662912?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>


### [Paulo Lopes] 10 things I learned making the fastest js server runtime in the world

> This presentation is about server performance, which means that no time in the world would be enough to cover it all. Hopefully, I can share with you the top  
> \#10 things I’ve learned while putting JavaScript on the top of the server side benchmarks.  
> You will learn about runtimes and engines, how some are more capable than others, and sometimes the obvious choice is not always the right one…  
> This talk is about thinking outside of the box, being creative and don’t take anything for granted. We will debunk myths about native code vs script or RAM usage, it’s going to be fast! I promise!
>
> &mdash; [Paulo Lopes: 10 things I learned making the fastest js server runtime in the world](https://2019.jsconf.eu/paulo-lopes/10-things-i-learned-making-the-fastest-js-server-runtime-in-the-world.html)

スライド: https://www.jetdrone.xyz/presentations/10-things-js/#/

### [Constanza Yáñez Calderón] About life, robots and cats!

> When I was a child I dreamt a lot about creating robots that helped me in my daily life, like tidying up my bedroom. That was just a dream till I grow up and found out that there’s something called home automation. So I decided to build Sasha, my cats’ pet sitter, that helps me by feeding my cats when I have to get home a little bit late. Sasha changed my life and my cats are stressless, because they can eat their meal at the right time.  
> In this talk I will share my experience on using JavaScript to build Sasha and will walkthrough its features. Last, I’ll talk about other possible use cases and the potential of home automation with JavaScript.
>
> &mdash; [Constanza Yáñez Calderón: About life, robots and cats!](https://2019.jsconf.eu/constanza-yanez-calderon/about-life-robots-and-cats.html)

スライド: https://slides.com/co_constanza/about-life-robots-and-cats#/

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">“About Life, Robots and Cats!” by <a href="https://twitter.com/co_constanza?ref_src=twsrc%5Etfw">@co_constanza</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> <a href="https://t.co/judHXMQzFX">pic.twitter.com/judHXMQzFX</a></p>&mdash; Clairikine @ staying hydrated (@clairikine) <a href="https://twitter.com/clairikine/status/1134778968341647361?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>


### [Sher Minn Chong] Recreating Retro Computer Art with JS!

> Before personal computing became a thing, there was a handful of programmers and artists saw computers as a tool beyond their intended purpose: to create art.  
> In this talk, we will explore the early history of computer art, from ghostly oscilloscope paints to pre-ASCII text art. We’ll discuss how simple techniques with limited technology back then could yield compelling pieces. We’ll see how the history of computer displays and printers have evolved in the 1950s to 1980s.  
> While quite a bit of retro art survives today, most of them do not come preserved with their algorithms. In this talk, I’ll also demo some attempts to recreate retro art pieces using p5.js, a JavaScript graphics library as well as talk through some of the techniques of creating generative computer art.  
>
> &mdash; [Sher Minn Chong: Recreating Retro Computer Art with JS!](https://2019.jsconf.eu/sher-minn-chong/recreating-retro-computer-art-with-js.html)

スライド: http://piratefsh.github.io/presentations/jsconfeu-retro-art/#/

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Retro computer art with <a href="https://twitter.com/piratefsh?ref_src=twsrc%5Etfw">@piratefsh</a> at <a href="https://twitter.com/hashtag/jsconfeu2019?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu2019</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/tTocBYBiGb">pic.twitter.com/tTocBYBiGb</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1134839887323193346?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>


### [Nat Alison] Polyhedra, I Choose You! Letting Your Passions Take Form

> For millennia, mathematicians and artists have been fascinated by polyhedra, 3D shapes that encode complex symmetries and relationships. My name is [anonymized], and for the last ten years I have dedicated my life to sharing the beauty of these shapes with the world. Join me on an epic quest filled with ancient 3D libraries, arcane mathematical data structures, and Pokémon GIFs as I strive to make my vision a reality the only way I know how: an interactive web app. Come and twist, expand, and gyroelongate polyhedra with me, and let my journey inspire you to use the web to make your own passions come to life.  
>
> &mdash; [Nat Alison: Polyhedra, I Choose You! Letting Your Passions Take Form](https://2019.jsconf.eu/nat-alison/polyhedra-i-choose-you-letting-your-passions-take-form.html)

スライド: なし？

<blockquote class="twitter-tweet" data-lang="en"><p lang="et" dir="ltr">Polyhedra ❤ by <a href="https://twitter.com/tesseralis?ref_src=twsrc%5Etfw">@tesseralis</a> at <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/jsconfeu2019?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu2019</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/KSPPO2B3MP">pic.twitter.com/KSPPO2B3MP</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1134841297372667906?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

### [Stefan Judis] HTTP headers for the responsible developer

> To build inclusive websites, developers have to consider accessibility, performance and user flows. Crafted source code forms the foundation for thought-through UIs, but it’s not only about the code. Let’s have a look at HTTP, and to be specific, its headers that can have a direct impact on user experience.  
>
> &mdash; [Stefan Judis: HTTP headers for the responsible developer](https://2019.jsconf.eu/stefan-judis/http-headers-for-the-responsible-developer.html)

スライド: https://speakerdeck.com/stefanjudis/http-headers-for-the-responsible-developer

ブログ記事にも詳細がありました

> &mdash; [HTTP headers for the responsible developer - Twilio](https://www.twilio.com/blog/a-http-headers-for-the-responsible-developer)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">HTTP headers for the responsible developer - by <a href="https://twitter.com/stefanjudis?ref_src=twsrc%5Etfw">@stefanjudis</a> at <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/jsconfeu2019?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu2019</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/aby20LjAyK">pic.twitter.com/aby20LjAyK</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1134841736725966849?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">“HTTP Headers for the Responsible Developer” by <a href="https://twitter.com/stefanjudis?ref_src=twsrc%5Etfw">@stefanjudis</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> <a href="https://twitter.com/hashtag/JSconfEU2019?src=hash&amp;ref_src=twsrc%5Etfw">#JSconfEU2019</a> <a href="https://t.co/eKzN2LhTzh">pic.twitter.com/eKzN2LhTzh</a></p>&mdash; Clairikine @ staying hydrated (@clairikine) <a href="https://twitter.com/clairikine/status/1134816747889070080?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

### [Shwetank Dixit] Block, unblock, block! : How ad blockers are being circumvented, and how they are fighting back.back.

> As usage of ad blocking software has risen over the years, an entire micro-industry has popped up catering to publishers - promising to get around the ad blocker and show ads to users of ad blocking software.  
> Some of these techniques rely on browser bugs, or limitations of browser extensions and some are just extremely creative ways to get around ad-blockers. This has forced ad blockers to come up with their own ingenious ways to counter and block the circumvented ads.  
> In this talk, we’ll go over some of the techniques used in this cat and mouse game between ad blocking extensions and the people who want to circumvent them. It’s a fascinating peek into a world very few people seem to know.  
>
> &mdash; [Shwetank Dixit: Block, unblock, block! : How ad blockers are being circumvented, and how they are fighting back.](https://2019.jsconf.eu/shwetank-dixit/block-unblock-block-how-ad-blockers-are-being-circumvented-and-how-they-are-fighting-back.html)

スライド: なし？

Ad blockerの作者とAd blockerを回避する広告とのせめぎあいの話でした。

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Block, unblock, block. How adblockers are circumvented. By <a href="https://twitter.com/shwetank?ref_src=twsrc%5Etfw">@shwetank</a> at <a href="https://twitter.com/hashtag/jsconfeu2019?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu2019</a> <a href="https://twitter.com/hashtag/jsconfeu?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/5qaHNZxoh6">pic.twitter.com/5qaHNZxoh6</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1134866239686418432?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>


### [Amanda Sopkin] What JS Developers can Learn from Medieval Coats of Arms about Accessibility

> Accessibility on the web for all groups including the visually and motor impaired is an important issue. But many of the usability lessons we explore on our products today are actually centuries old. Let’s explore how these concepts are manifested in coats of arms throughout history. Come learn about what we can learn from the designers of medieval crests.  
>
> &mdash; [Amanda Sopkin: What JS Developers can Learn from Medieval Coats of Arms about Accessibility](https://2019.jsconf.eu/amanda-sopkin/what-js-developers-can-learn-from-medieval-coats-of-arms-about-accessibility.html)

スライド: https://docs.google.com/presentation/d/1HDWdNIfkMaSk7m5Op0XE00e8JNhOZjOT5ZYOnvH6nwY/edit#slide=id.p

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">“What JS Developers Can Learn From Medieval Coats of Arms About Accessibility” by <a href="https://twitter.com/amandasopkin?ref_src=twsrc%5Etfw">@amandasopkin</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> <a href="https://twitter.com/hashtag/a11y?src=hash&amp;ref_src=twsrc%5Etfw">#a11y</a> <a href="https://t.co/JqcsIpInf5">pic.twitter.com/JqcsIpInf5</a></p>&mdash; Clairikine @ staying hydrated (@clairikine) <a href="https://twitter.com/clairikine/status/1134858229266206720?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>

### [Ziran Sun] Build an end-to-end IoT system using JavaScript with "GDPR awareness"

> This talk will discuss why we think that JavaScript is a good language option for IoT development by walking you through a loosely coupled end to end IoT system, from new device on-boarding to remote access via gateway.  
> Technologies we have been used and/or contributed to for building the IoT system using JavaScript will be discussed. At each stage, GDPR compliance of these technologies will be looked into.  
> To address the issue of resource restriction in embedded devices, we will introduce you to JerryScript, an ultra-light JavaScript engine by Samsung. It is followed by a comparison of popular JavaScript platforms based on JerryScript that provide direct JavaScript APIs to developers. The open gateway framework is node.js based and targets at decentralized ‘Internet of Things’ with privacy and security in mind.  
>
> &mdash; [Ziran Sun: Build an end-to-end IoT system using JavaScript with "GDPR awareness"](https://2019.jsconf.eu/ziran-sun/build-an-end-to-end-iot-system-using-javascript-with-gdpr-awareness.html)

スライド: なし？

### [Marley Rafson] The Case for Augmented Reality on the Web

> Augmented reality is already making its way into everyday browsers! This talk will dive into what that might mean for the traditional web developer, and why developing immersive experiences makes so much sense on the web, even in the face of native alternatives. We will cover topics like off-the-shelf web technologies, performance, and privacy all in the context of augmented reality.  
>
> &mdash; [Marley Rafson: The Case for Augmented Reality on the Web](https://2019.jsconf.eu/marley-rafson/the-case-for-augmented-reality-on-the-web.html)

スライド: なし？

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The case for augmented reality on the web - by <a href="https://twitter.com/mprafson?ref_src=twsrc%5Etfw">@mprafson</a> at <a href="https://twitter.com/hashtag/jsconfeu2019?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu2019</a> <a href="https://twitter.com/hashtag/jsconfeu?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> (Marley looks a bit thoughtful here...) <a href="https://t.co/Drhb7pDZME">pic.twitter.com/Drhb7pDZME</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1134864622085988353?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>


### [Manu Martinez-Almeida] Stencil: a built-time approach to the web

> We all know and love framework-like features such as hot module replacement, reactive properties, templating, CSS-in-JS, lazy-loaded bundling, etc. Stencil is a new approach, a build-time abstraction with framework-level productivity, that generates hand-optimized components using future-proof web APIs. We’ll discuss the architecture of Stencil and the innovations a compiler can introduce to your apps and design systems!  
>
> &mdash; [Manu Martinez-Almeida: Stencil: a built-time approach to the web](https://2019.jsconf.eu/manu-martinez-almeida/stencil-a-built-time-approach-to-the-web.html)

スライド: https://github.com/manucorporat/talk-stencil-build-time-approach/blob/master/stencil-build-time-approach.pdf

---
---
---

## ２日目トークまとめ
２日目のタイムテーブルはこちらから参照できます

https://2019.jsconf.eu/schedule/timetable.html#day2

### [Nick Kreeger & Nikhil Thorat] TensorFlow.js: Bringing Machine Learning to the Web and Beyond.
> Machine Learning is a powerful tool that offers unique opportunities for JavaScript developers. This is why we created TensorFlow.js, a library for training and deploying ML models in the browser and in Node.js. In this talk, you will learn about the TensorFlow.js ecosystem: how to bring an existing ML model into your JS app and re-train the model using your data. We’ll also go over our efforts beyond the browser to bring ML to platforms such as React Native, Raspberry Pi, and Electron, and we’ll do a live demo of some of our favorite and unique applications!  
>
> &mdash; [Nick Kreeger: TensorFlow.js: Bringing Machine Learning to the Web and Beyond.](https://2019.jsconf.eu/nick-kreeger/tensorflowjs-bringing-machine-learning-to-the-web-and-beyond.html)

スライド: なし？

### [Una Kravets] CSS Houdini & The Future of Styling

> It’s almost here! Houdini — the future of CSS! This spec allows developers to write web worklets with JavaScript syntax and access the CSS Object Model for the very first time. Everything will change!  
> In this talk, we’ll will walk through some of the visual magic we can create by using Houdini and its various upcoming browser APIs, and go through a live demo of how we can get started with implementation. Learn about how to use Houdini and what it means for the future of web application styling.  
>
> &mdash; [Una Kravets: CSS Houdini & The Future of Styling](https://2019.jsconf.eu/una-kravets/css-houdini-and-the-future-of-styling.html)

スライドはありませんが、こちらのサイトにまとまってるので読めば大枠はわかると思います！

> &mdash; [Houdini Spellbook](https://houdini.glitch.me/)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Thank you so much for coming to my <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> talk!! ❤️✨<br><br>Some <a href="https://twitter.com/csshoudini?ref_src=twsrc%5Etfw">@csshoudini</a> resources:<br><br>📚 <a href="https://t.co/EIy2zE7uEM">https://t.co/EIy2zE7uEM</a> -All the info by <a href="https://twitter.com/DasSurma?ref_src=twsrc%5Etfw">@DasSurma</a><br>🚀 <a href="https://t.co/FD1bacE4p4">https://t.co/FD1bacE4p4</a> -😍 demos by <a href="https://twitter.com/iamvdo?ref_src=twsrc%5Etfw">@iamvdo</a> <br>🎏 <a href="https://t.co/ZAIuMMKIuy">https://t.co/ZAIuMMKIuy</a> -Spellbook <a href="https://twitter.com/Snugug?ref_src=twsrc%5Etfw">@Snugug</a><br>✨ <a href="https://t.co/iHyCNDHePb">https://t.co/iHyCNDHePb</a> -Extra.CSS by ME!</p>&mdash; Una Kravets 👩🏻‍💻 (@Una) <a href="https://twitter.com/Una/status/1135115392467312640?ref_src=twsrc%5Etfw">June 2, 2019</a></blockquote>

### [Ashley Williams] JavaScript's Journey to the Edge

> In September of 2008, Google’s Chromium Project released V8, a JavaScript engine, as part of a browser optimization wave that heralded the era of JavaScript browser applications that we both love, and love to hate. Less than a year later, in 2009, Ryan Dahl announced (at this very conference!) a way to run the V8 browser environment outside of the browser- Node.js, a platform that held the promise of unifying web application development, where both client and server side development could happen in the same language - JavaScript.  
> A decade later, V8, JavaScript, and its new buddy WebAssembly, have expanded to lands charted only a few years after Node.js debuted- known (confusingly) as the “Edge”. In this talk, we’ll introduce what the “Edge” is and why we are excited for it to revolutionize computation on the web. We’ll explore how this adventurous JavaScript engine, V8, is so well suited to tasks previously limited to Virtual Machines, Containers, or even simply Operating Systems. Finally, we’ll talk about security, Spectre, and ask ourselves the age old question, “You can do it, but should you?”.  
> In true JSConf EU tradition, this talk itself is going be an exciting announcement. You should come if you want to be there for the beginning of a new era of the Internet.  
>
> &mdash; [Ashley Williams: JavaScript's Journey to the Edge](https://2019.jsconf.eu/ashley-williams/javascripts-journey-to-the-edge.html)

<iframe width="560" height="315" src="https://www.youtube.com/embed/MBndZddVQdw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### [Maxim Koretskyi] A sneak peek into super optimized code in JS frameworks
> Very few developers have the need to write super optimized code. In application development we tend to favor readability over optimization. But that’s not the case with frameworks. Developers who use frameworks expect them to run as fast as possible. In fact, speed is often a defining characteristic when choosing a framework. There are techniques that make code run faster. You’ve probably heard about linked lists, monomorphism and bitmasks, right? Maybe you’ve even used some. Well, you can find all these and a bunch of other interesting approaches in the sources of most popular JS frameworks. Over the past year I’ve seen a lot while reverse-engineering Angular and React. In this talk I want to share my findings with you. Some of you may end up applying them at work. And others, who knows, may even end up writing the next big framework.  
>
> &mdash; [Maxim Koretskyi: A sneak peek into super optimized code in JS frameworks](https://2019.jsconf.eu/maxim-koretskyi/a-sneak-peek-into-super-optimized-code-in-js-frameworks.html)

スライド: なし？

Angular, Reactのcontributorが内部のパフォーマンス最適化アルゴリズムについて詳しく説明するディープなトークでした

<blockquote class="twitter-tweet" data-lang="en"><p lang="ja" dir="ltr">えっ、angularってDIがコンポーネントのどれに影響与えるかをbloomfilter使って高速化してんの？知らなかった <a href="https://twitter.com/hashtag/jsconfeu_ja?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu_ja</a></p>&mdash; Yosuke FURUKAWA (@yosuke_furukawa) <a href="https://twitter.com/yosuke_furukawa/status/1135127547451236352?ref_src=twsrc%5Etfw">June 2, 2019</a></blockquote>


### [Houssein Djirdeh] Performance Empathy
> Performance advocates spend a lot of time telling developers how to build fast and reliable experiences on the web. Every website is built differently, however.  
> Instead of just listing a number of progressive enhancements and techniques, this talk will try to take a different approach. We’ll first explore who needs to consider improving their site in the first place and see if their is a messaging problem between advocates and developers in the community. We’ll then address concerns that can arise when performance is being worked on and discuss some real and practical solutions.  
>
> &mdash; [Houssein Djirdeh: Performance Empathy](https://2019.jsconf.eu/houssein-djirdeh/performance-empathy.html)

スライド: なし？

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Performance empathy - by <a href="https://twitter.com/hdjirdeh?ref_src=twsrc%5Etfw">@hdjirdeh</a> at <a href="https://twitter.com/hashtag/JSConfEU2019?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU2019</a> <a href="https://twitter.com/hashtag/jsconfeu?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/c0th4XZJLa">pic.twitter.com/c0th4XZJLa</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1135172970220068865?ref_src=twsrc%5Etfw">June 2, 2019</a></blockquote>

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">“Performance Empathy” by <a href="https://twitter.com/hdjirdeh?ref_src=twsrc%5Etfw">@hdjirdeh</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> <a href="https://t.co/siHmPQfpAX">pic.twitter.com/siHmPQfpAX</a></p>&mdash; Clairikine @ staying hydrated (@clairikine) <a href="https://twitter.com/clairikine/status/1135147673600909312?ref_src=twsrc%5Etfw">June 2, 2019</a></blockquote>

### [Ella van Durpe] Designing a Rich Content Editor for a Third of the Web
> How WordPress built its own brand new visual editor experience from the ground up. The talk will include an introduction of WordPress and how the Gutenberg editor project started, details of how it works and how we incrementally improved the block editor over two years, and what our plans are for the future.  
>
> &mdash; [Ella van Durpe: Designing a Rich Content Editor for a Third of the Web](https://2019.jsconf.eu/ella-van-durpe/designing-a-rich-content-editor-for-a-third-of-the-web.html)

スライドや動画はありませんでしたが、過去のカンファレンスでの録画がありました。  
Wordpressの中の人によるWISYWIGエディタに関するトークでした。

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Wow, here&#39;s a recording of my talk at <a href="https://twitter.com/ReactEurope?ref_src=twsrc%5Etfw">@ReactEurope</a>. Not as good as I had hoped for! Slides are too dense, generally a bit dry, needs more examples, visuals, time explaining the problem, longer demo... Rewriting it all for for the next presentation! 😊<a href="https://t.co/Bsa5Rb5sjc">https://t.co/Bsa5Rb5sjc</a></p>&mdash; Ella van Durpe (@ellatrx) <a href="https://twitter.com/ellatrx/status/1133676186146615296?ref_src=twsrc%5Etfw">May 29, 2019</a></blockquote>

### [Meya Stephen Kenigbolo] JavaScript is for Everyone!
> Teaching absolute beginners with no technical experience whatsoever to understand JavaScript can be quite a daunting task. It’s more challenging if you have a thick British accent and your students are mostly African students. If you’ve ever designed a tech curriculum then you understand how complicated this can be. At code Afrique where we help the community by offering a free weekend intensive bootcamp, we explored and have now achieved success with ember where we had earlier failed. The aim of this talk is to show, what we tried, where we failed and how JavaScript via Ember brought us success like no other.  
>
> &mdash; [Meya Stephen Kenigbolo: JavaScript is for Everyone!](https://2019.jsconf.eu/meya-stephen-kenigbolo/javascript-is-for-everyone.html)

スライド: なし？

### [Maximiliano Firtman] The modern PWA Cheat Sheet
> PWAs are now installable on every mobile and desktop OSs, but there is a lot of new things since last year we need to do to create a successful experience. We will start understanding the App Lifecycle on every OS including new APIs, the limitations on iOS and how to deal with them, and how WebAPK works on Android. We will mention challenges on desktop PWAs, including multi-window management and we will finally cover distribution channels, including new DOM events to improve analytics, how to create a custom Install experience, and how to distribute the app in the store.  
>
> &mdash; [Maximiliano Firtman: The modern PWA Cheat Sheet](https://2019.jsconf.eu/maximiliano-firtman/the-modern-pwa-cheat-sheet.html)

スライド: https://www.slideshare.net/firt/the-modern-pwa-cheat-sheet

### [Max Bittker] Simulating Sand: Building Interactivity With WebAssembly
トーク概要、スライドは見つかりませんでした

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">extremely excited about <a href="https://twitter.com/MaxBittker?ref_src=twsrc%5Etfw">@MaxBittker</a>’s talk about falling sand games 😀 <a href="https://twitter.com/hashtag/jsconfeu?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu</a> <a href="https://t.co/i87Ujh2Nsi">pic.twitter.com/i87Ujh2Nsi</a></p>&mdash; without butts, dreams dry up (@ag_dubs) <a href="https://twitter.com/ag_dubs/status/1135173386479505409?ref_src=twsrc%5Etfw">June 2, 2019</a></blockquote>

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">“Simulating Sand: Building Interactivity with WebAssembly” by <a href="https://twitter.com/MaxBittker?ref_src=twsrc%5Etfw">@MaxBittker</a> <a href="https://twitter.com/hashtag/JSconfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSconfEU</a> <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> <a href="https://t.co/GGLNPa5Ck6">pic.twitter.com/GGLNPa5Ck6</a></p>&mdash; Clairikine @ staying hydrated (@clairikine) <a href="https://twitter.com/clairikine/status/1135204705737609216?ref_src=twsrc%5Etfw">June 2, 2019</a></blockquote>

### [OpenJS Foundation Panel]: +1 to a Collaborative Future ~ the Foundation of JavaScript
> The JavaScript ecosystem has been breaking ground in both the Browser and in the backend with Node.js since JSConfEU launched 10 years ago. We’ve recently recognized that in the same way that using JavaScript both on the front and back end unlocks opportunities for more people to contribute to a larger part of an overall application, combining the JavaScript and Node.js Foundations allows for easier collaboration and contribution to larger portions of the JavaScript ecosystem. This panel will cover the key issues, concerns, discussions, and lessons learned that were part of the effort to bring the JavaScript and Node.js Foundations together. We’ll also dive into the new opportunities and exciting future it brings to people and projects across the JS ecosystem.  
>
> &mdash; [OpenJS Foundation: Panel: +1 to a Collaborative Future ~ the Foundation of JavaScript](https://2019.jsconf.eu/openjs-foundation/panel-1-to-a-collaborative-future-~-the-foundation-of-javascript.html)

パネルトークでした。スライドや動画は見つかりませんでした。

### [Leandro Ostera] Building WebApps Like It's 1972 🧙‍♂️
> The year is 1972 and GUI applications like no one has seen before are being built in Smalltalk: bitmaps graphics, draggable elements, drop-down menus, collapsable windows 🤯; all of them and many more coming straight from the future, powered by asynchronous message passing, object orientation, and functional programming. An unprecedented cocktail to be later rediscovered as the Actor-model.  
> Fast forward to the present day, and typical web applications are modeled as monolithic deeply nested structures, resembling the medium the web was built for (HTML), but leaving us handicapped to build outstanding user facing applications. 🦖  
> Let’s explore together what we can learn from the early days of UIs, languages like Erlang and Smalltalk, the Actor-model, and how we can apply some of these principles and ideas today to take our UIs back to the future 🚀  
>
> &mdash; [Leandro Ostera: Building WebApps Like It's 1972 🧙‍♂️](https://2019.jsconf.eu/leandro-ostera/building-webapps-like-its-1972-male.html)

スライドはありませんでしたが、発表の原稿が見つかりました  
https://gist.github.com/ostera/1c9ef3eeec3dab887c08d2a1eb537535

### [Havi Hoffman] In the land of the JavaScripters
> In 2009 I was managing Yahoo’s tech event budget when we agreed to sponsor the very first JSConf, the one that almost didn’t happen, the one that started something… And though I’ve still never attended a JSConf, nor learned to code, the zeitgeist of the JavaScript community and its event culture have had a profound effect on how I live and the devrel work I do.  
> I’d like to speak about cultivating “JavaScript: The Good Times”—the evolution of inclusiveness, the effort to replace customs that no longer reflect the values and demographics of the community, the focus on new practices for joyful conference-going and knowledge sharing. The JavaScript ethos has fueled a reinvention of the tech gathering as an act of participation and experiment, generating enduring artifacts for learning and excellent new habits for our relationships - personal and professional.  
>
> &mdash; [Havi Hoffman: In the land of the JavaScripters](https://2019.jsconf.eu/havi-hoffman/in-the-land-of-the-javascripters.html)

スライドはありませんでしたが特設ページが見つかりました  
https://2019.jsconf.eu/sonnets/

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Please check out the sonnets 📜📝 (<a href="https://t.co/Kh7LDm6K8w">https://t.co/Kh7LDm6K8w</a>) by <a href="https://twitter.com/freshelectrons?ref_src=twsrc%5Etfw">@freshelectrons</a> about the <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> history.  <a href="https://twitter.com/hashtag/JSConfEU2019?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU2019</a>  <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/Wrv2B7w0ng">pic.twitter.com/Wrv2B7w0ng</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1135518152694075392?ref_src=twsrc%5Etfw">June 3, 2019</a></blockquote>


### [Henri Helvetica] Shape Of The Web

> Until 1992, the web was largely textual, reserved almost exclusively to academia, with the charm of searching for library books via card catalogs.  
> The sea change came when a browser allowed for both text and images to now be displayed in the viewport. Despite some vehement opposition, this was described as the “gateway to the riches of the internet”.  
> This was a technological advancement that some had wagered would further fuel more advacement. We now have seen technologies like APIs, PWAs, DevTools and many more.  
> “The Shape Of The Web” is about both accomplishments and challenges that lay in past, present and future of the web - from its technologies employed and its employed technologists.  
>
> &mdash; [Henri Helvetica: Shape Of The Web](https://2019.jsconf.eu/henri-helvetica/shape-of-the-web.html)

<iframe width="560" height="315" src="https://www.youtube.com/embed/SeV_Pqw5egU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

スライド: なし？

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> of <a href="https://twitter.com/HenriHelvetica?ref_src=twsrc%5Etfw">@HenriHelvetica</a>&#39;s talk on the shape of the web - at <a href="https://twitter.com/hashtag/JSConfEU2019?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU2019</a> <a href="https://twitter.com/hashtag/jsconfeu?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu</a> 🌿🏵 <a href="https://t.co/N9wCNv9wPo">pic.twitter.com/N9wCNv9wPo</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1135516344441626625?ref_src=twsrc%5Etfw">June 3, 2019</a></blockquote>

### [Kevin Doran] Offline-first data: Getting Bigger

> Offline capable web apps have come a long way in just a few years. Tools like service workers, PouchDB & CouchDB gave answers to the first questions of “can we do this, where do we begin?”, pushing new possibilities to the browser.  
> But taking the medical supply system online & offline for Africa’s most populous country asked us a whole new set of questions. How do you model distributed data and scalable code for 30,000 clinics? What about that growth is easy to mess up, and how do we plan for it?  
>
> &mdash; [Kevin Doran: Offline-first data: Getting Bigger](https://2019.jsconf.eu/kevin-doran/offline-first-data-getting-bigger.html)

スライド: なし？

### [Bryan Hughes] The Contentious Relationship Between the LGBTQ+ community and Tech
> “Queers hate techies,” the slogan proudly proclaimed in a window in San Francisco. Being a queer techie, I was immediately conflicted.  
> The tech industry provides a safe haven for many queer folks, myself included. It offers stable employement to us more willingly than other industries. These benefits don’t extend to all queer folks though, and these benefits are often revoked as soon as we step out of line. Queer folks are a model minority in an industry who’s products often negatively impact our community.  
> This talk will dive into these complications and how we can improve the tech industry to make it a truly welcoming place for queer folks.  
>
> &mdash; [Bryan Hughes: The Contentious Relationship Between the LGBTQ+ community and Tech](https://2019.jsconf.eu/bryan-hughes/the-contentious-relationship-between-the-lgbtq-community-and-tech.html)

スライド: なし？

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">“The Contentious Relationship Between The LGBTQ+ Community and Tech” by <a href="https://twitter.com/nebrius?ref_src=twsrc%5Etfw">@nebrius</a> <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a> <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> <a href="https://t.co/QseOBccAGK">pic.twitter.com/QseOBccAGK</a></p>&mdash; Clairikine @ staying hydrated (@clairikine) <a href="https://twitter.com/clairikine/status/1135146937659928576?ref_src=twsrc%5Etfw">June 2, 2019</a></blockquote>


### [Johnny Austin] Finding Your Abstraction Sweet Spot
> Many would argue there are only two hard problems in software: naming and cache invalidation. I’d argue there’s a third problem - abstractions. Whether you’re implementing an API for devs outside of your organization or creating a reusable library for devs on your team, creating the right level of abstraction is difficult. You have to balance flexibility with the ease-of-use. The correct choice is often a function of time constraints, compromise, and trial & error. I’ll talk about how to navigate these issues more efficiently.  
>
> &mdash; [Johnny Austin: Finding Your Abstraction Sweet Spot](https://2019.jsconf.eu/johnny-austin/finding-your-abstraction-sweet-spot.html)

スライド: なし？

### [Alexandra Sunderland] Bringing back dial-up: the internet over SMS
> Travelling to JSConf EU from another country? You probably had to pay an arm and a leg for a data roaming package on your phone. But there’s a better way! What if I told you that you could stay connected to the internet with a phone that can only send and receive text messages? In this talk we’ll build our own browser that makes all requests over SMS, so that next time you can forget about that fancy data package.  
>
> &mdash; [Alexandra Sunderland: Bringing back dial-up: the internet over SMS](https://2019.jsconf.eu/alexandra-sunderland/bringing-back-dial-up-the-internet-over-sms.html)

スライド: なし？

### [Chidinma Kalu] Why Can’t We All Just Get Along?

> There’s a divisive movement around the world which has arguable impacted the software development community. How can we remain open-minded and respectful when talking about different programming paradigms or languages?  
> In this talk, I will be talking about empathy, how we can have divergent views and still have meaningful conversations.  
>
> &mdash; [Chidinma Kalu: Why Can’t We All Just Get Along?](https://2019.jsconf.eu/chidinma-kalu/why-cant-we-all-just-get-along.html)

スライド: なし？

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I loved this talk by <a href="https://twitter.com/ChidinmaKO?ref_src=twsrc%5Etfw">@ChidinmaKO</a> at <a href="https://twitter.com/hashtag/JSConfEU2019?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU2019</a> Being kind entails pausing, listening, changing your point of view, apologizing, speaking up for others and sharing what you know. Let this be our daily practice, <a href="https://twitter.com/hashtag/JSConfEU?src=hash&amp;ref_src=twsrc%5Etfw">#JSConfEU</a>! <a href="https://twitter.com/hashtag/sketchnotes?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnotes</a> <a href="https://t.co/pIH54T6J6L">pic.twitter.com/pIH54T6J6L</a></p>&mdash; Malwine (@malweene) <a href="https://twitter.com/malweene/status/1135174253861580801?ref_src=twsrc%5Etfw">June 2, 2019</a></blockquote>


### [Fedor Indutny] llhttp - new HTTP 1.1 parser for Node.js
> Node.js has been using a derivative of nginx’s parser with a lot of customization/rewrite since its inception. Despite being fast enough, the project architecture made it very hard to maintain in a long run. To mitigate that, the author has created a tool to generate the new HTTP parser called “llhttp” from the TypeScript code in understandable, verifiable, and maintainable way. Incidentally, the performance of “llhttp” is two times better than of the old parser. In this talk we’ll walk through the basics of generating such parsers and how “llhttp” works.  
>
> &mdash; [Fedor Indutny: llhttp - new HTTP 1.1 parser for Node.js](https://2019.jsconf.eu/fedor-indutny/llhttp-new-http-11-parser-for-nodejs.html)

スライド: https://indutny.github.io/jsconfeu-2019/reveal.js/index.html#/



### [Joyee Cheung] Web APIs in Node.js Core: Past, Present, and Future
> Web APIs developed and standardized by the browsers have been serving client-side JavaScript applications with a wide selection of features out of the box, while Node.js have been developing another set of APIs that are today the de-facto standards for server-side JavaScript runtimes. There is now a conscious effort to bring the two worlds closer together, in particular by introducing more Web APIs into Node.js core, but it’s not an easy ride - not every Web API, designed for the browsers, makes sense for Node.js.  
> In this talk, we are going to take a look at the story of Web APIs in Node.js core - what Node.js have implemented, what are being discussed, what are blocking more APIs from being implemented, and what we can do to improve the developer experience of the JavaScript ecosystem.  
>
> &mdash; [Joyee Cheung: Web APIs in Node.js Core: Past, Present, and Future](https://2019.jsconf.eu/joyee-cheung/web-apis-in-nodejs-core-past-present-and-future.html)

スライド: https://github.com/joyeecheung/talks/blob/master/jsconfeu_201906/web-api-in-node-core.pdf

### [Joe Sepi] Promises API in Node.js core: where we are and where we’ll get to
> Currently only ‘fs’ and ‘dns’ have an experimental promise api in Node core. People LOL at node.js core modules for still using the callback pattern. I could launch into a bunch of puns here but instead I’ll just say the current status is sad but fixable. Where are we? What do we need to do? How can you help?  
>
> &mdash; [Joe Sepi: Promises API in Node.js core: where we are and where we’ll get to](https://2019.jsconf.eu/joe-sepi/promises-api-in-nodejs-core-where-we-are-and-where-well-get-to.html)

スライド: なし  
コールバックパターンを採用していたNode.jsからPromiseが当たり前の世界へ変遷していき、今後どうなっていくかのトークでした。

<blockquote class="twitter-tweet" data-lang="en"><p lang="ja" dir="ltr">Node.jsにそもそもなぜPromiseがないか、ryanは考慮不足と言っていた。ただあの時点では正しい抽象化なのかは分からなかった、それよりもシンプルさを目指してcallbackモデルにしていた <a href="https://twitter.com/hashtag/jsconfeu_ja?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu_ja</a> <a href="https://t.co/mlBcWGiEFe">pic.twitter.com/mlBcWGiEFe</a></p>&mdash; Yosuke FURUKAWA (@yosuke_furukawa) <a href="https://twitter.com/yosuke_furukawa/status/1135175560848650240?ref_src=twsrc%5Etfw">June 2, 2019</a></blockquote>

### [Stanimira Vlaeva] Embedding V8 in the real world
> V8 is the JavaScript engine powering Google Chrome, Node.js and NativeScript. NativeScript embeds V8 to process JavaScript and dynamically call Android APIs. This enables developers to write Android applications in JavaScript and directly access the underlying OS. Come to this session to learn what challenges the NativeScript team met embedding V8 in a mobile framework and how you can power any C++ based application with one of the most sophisticated JavaScript engines.  
>
> &mdash; [Stanimira Vlaeva: Embedding V8 in the real world](https://2019.jsconf.eu/stanimira-vlaeva/embedding-v8-in-the-real-world.html)

スライド: https://docs.google.com/presentation/d/e/2PACX-1vT9cg9BuUO6PEMQbjbiXcRP4nqJX2HfSk3ki8Jv24ZNRsXaZBQFBwHkYGHhSWQc6V2-bdFeMz9wvZi2/pub?start=false&loop=false&delayms=60000&slide=id.g57c1f1de39_0_1216

### [Pier Paolo Fumagalli] Tales from the Toilet: how JavaScript helps the production of tissue papers

> Producing tissue paper, kitchen rolls, folded napkins or toilet paper is not for the faint of heart. Gigantic machines rewind huge rolls of tissue paper weighing almost a ton processing it at a speed of 40 km/h, and a single minute of downtime cuts into the slim margins of the paper industry.  
> The asynchronous nature of JavaScript and Node.JS allows telemetry data to be harvested from ancient PLCs controlling the production, and its real-time analysis in the cloud, enabling operators and factories to raise production quality, improve performance and reduce waste.  
> Join me on a journey to understand how modern programming techniques make IIoT and Industry 4.0 a reality today in the toilet paper world!  
>
> &mdash; [Pier Paolo Fumagalli: Tales from the Toilet: how JavaScript helps the production of tissue papers](https://2019.jsconf.eu/pier-paolo-fumagalli/tales-from-the-toilet-how-javascript-helps-the-production-of-tissue-papers.html)

スライド: なし？

---
---
---

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">JSConf EU 2019 is done! <a href="https://t.co/UYl3mosJtF">pic.twitter.com/UYl3mosJtF</a></p>&mdash; JSConf EU (@jsconfeu) <a href="https://twitter.com/jsconfeu/status/1135225817099882496?ref_src=twsrc%5Etfw">June 2, 2019</a></blockquote>


## ３日目まとめ
３日目はRelax.js Brunchと呼ばれるブランチタイムで、JSConf EU参加者たちの最後の交流の場という感じでした。  
集合時間や解散時間が明確なわけではなく、各自スケジュールに合わせて適当に飲み食いしながら語り合って、流れ解散という感じでした。

そのあとは会の間に仲良くさせていただいたベルリン在住の[@shuheikagawa](https://twitter.com/shuheikagawa)さんの務めるZalandoのオフィスを見学させていただいて（めっっっっっちゃキレイだった）、自転車でベルリンの街を散策し帰国しこの記事を書いてます。

ためになったし、懇親会で話させてもらった方々や内容も楽しかったし、新しいご縁もできたし、経験値になったし、糧になったと思います。  
次回が開催されるのをとても楽しみにして居ます。行ってよかった！

## 来年行ってみたいって方へ

JSConf EUは10年間開催した区切りで一旦休止するそうです。  
初めて行ってみたことでモチベーションあがって、来年こそはCFP出すぞと思ってたんですが、本家でそれが叶うことは直近ではなくなりました。  
でも終わりではなく"休止"だと言っていたので、再開されるのを心から楽しみにしています。ぜひ次回があればまたいきたいし、その時までに普通に会話ができるくらい英語の実践経験を貯めようと思いました。  

なお本家（EU）からのれん分けした各国のローカル版JSConfは引き続き開催されます。  
JSConfが気になった方は今冬開催の[JSConf JP](https://www.jsconf.jp)にぜひ参加して下さい！
CFPも募集中です！  

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://t.co/b51ielVOoe">https://t.co/b51ielVOoe</a> is the largest JavaScript conference in Japan!! CFP is opened :) <a href="https://twitter.com/hashtag/jsconfeu?src=hash&amp;ref_src=twsrc%5Etfw">#jsconfeu</a> <a href="https://t.co/9SYaRnURZq">pic.twitter.com/9SYaRnURZq</a></p>&mdash; Yosuke FURUKAWA (@yosuke_furukawa) <a href="https://twitter.com/yosuke_furukawa/status/1134713046381748224?ref_src=twsrc%5Etfw">June 1, 2019</a></blockquote>
