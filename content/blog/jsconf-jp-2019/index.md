---
title: JSConf JP 2019スタッフ参戦後記
date: '2019-12-03T10:11:24.151Z'
featuredImage: ./2019-12-02-22-13-17.png
tags:
  - JavaScript
  - JSConf
  - Community
---

[JSConf JP 2019](https://jsconf.jp/2019/)にご来場いただいた皆様ありがとうございました。運営スタッフの仕事を終えたので参戦後記を書きます。  
トークはほとんど聞けてないためイベントの参加レポートではなく、運営スタッフとしての後記です。あらかじめご了承下さい。

頑張ったからねぎらって欲しいって趣旨では全くなくて、「スタッフはこんなことをやっていたよ」「こんな経緯で私はスタッフになったよ」「どんなことをするのか知ったら少しはコミュニティに深く加わるハードル下がるんじゃないか」とか JSConf コミュニティについて悶々と考えつつ書いてます。

<!--more-->

## 役割

今回私が携わっていたのは主に以下のタスクでした。

- [jsconf.jp](https://jsconf.jp/2019/)のサイトづくり
- スピーカー、スポンサー、トーク、タイムテーブルなどのデータメンテナンス
- [jsconfjp/jsconf.jp](https://github.com/jsconfjp/jsconf.jp)リポジトリへの PR 対応
- 弊社（[株式会社 CureApp](https://cureapp.co.jp/)）はゴールドスポンサーでもあったのでその対応
  - スポンサー交渉したり社内にチケット配ったり
- Twitter （[@jsconfjp](https://twitter.com/jsconfjp)）運用
- スピーカーディナーのお手伝い
- １日目・２日目の受付
- 懇親会とかで知り合いと知り合いをつなぐ
- その他臨機応変に

## サイトづくり＋運用

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">We&#39;ve done the first meeting of Website WG for <a href="https://twitter.com/jsconfjp?ref_src=twsrc%5Etfw">@jsconfjp</a> with <a href="https://twitter.com/yosuke_furukawa?ref_src=twsrc%5Etfw">@yosuke_furukawa</a>, <a href="https://twitter.com/L_e_k_o?ref_src=twsrc%5Etfw">@L_e_k_o</a> and <a href="https://twitter.com/Rentan0313?ref_src=twsrc%5Etfw">@rentan0313</a>. <a href="https://t.co/VeJ3uEfI8E">pic.twitter.com/VeJ3uEfI8E</a></p>&mdash; Daijiro Wachi at JSConf Japan (@watilde) <a href="https://twitter.com/watilde/status/1140597449590841344?ref_src=twsrc%5Etfw">June 17, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

ワイヤー・情報設計までこのメンバーで認識を揃え、デザインは[@rentan0313](https://twitter.com/Rentan0313?ref_src=twsrc%5Etfw)さん、その後の実装は私という感じで進めました。このブログを Gatsby で作っているので使い慣れている Gatsby+TypeScript+i18next+styled-components の組み合わせでサイトを作った。サイトを公開後は Twitter でエゴサしたり自分の判断や運営チームからの要望で逐次治すというスタイルで運用していました。

見た目の実装上最も大変だったのはタイムテーブルでした。

- A,B,C でセッションの時間が必ずしも揃っていない（ex. ２日目のハンズオン）
- 休憩など、全トラックで共通の要素がある

以上から縦にも横にも柔軟に動かせる実装が必要で、flex ベースのレイアウトでは限界があり、最終的に CSS Grid で組んで要求を満たしたが、けっこうゴリ押しをしている。実装のアイデアは terrierscript さんの登壇資料から拝借しました。

> &mdash; [styled-component + CSS Grid - Speaker Deck](https://speakerdeck.com/terrierscript/styled-component-plus-css-grid)

また、i18n や見た目のバグに関して何件か PR を出してくれた方がおりそのレビューなどもしていた。OSS としてサイトを公開していると Web に詳しい方がいろいろ教えてくれてありがたかったです。

AMP 対応やパフォーマンスチューニングなど、やりたいことはあったがなんやかんやでデータのメンテナンスに時間を使っており満足いかないまま当日を迎えてしまった。

## スポンサー対応

JSConf JP にスポンサーしてくださる企業の対応ではなく、弊社 CureApp が JSConf JP にスポンサーしていたため、スポンサー企業側としての対応をしていました。  
CureApp は JavaScript を強く推す会社なので JSConf JP に投資する価値があると判断して数年ぶりにイベントに協賛することにした。スポンサートークもついてるので、普段の JS 界隈の勉強会コミュニティだけではなく、より幅広い JavaScript エンジニアたちに会社のことを知ってもらいアピールできるチャンスだったと思います。

スポンサーになると特典で参加チケットがもらえるので、行きたい人はぜひ行こうと誘ってみたところ既に数人個人でチケットを購入済みだった。誘わずとも関心があるようだった。せっかくスポンサー企業なので個人で買った人のぶんも経費で落として「会社としてイベントに行っておいて」という立て付けになり、計 6 名くらいが参加しました。各位の聞いてきたトークのまとめを聞くのが楽しみです。  
スポンサートークについては私はスタッフでドタバタしているため[@yamatatsu193](https://twitter.com/yamatatsu193?lang=en)にお願いしました。

ブースに関しては、エンジニアが参加するならブースに居るよりトーク聞いて懇親して、社外のエンジニアとつながってもらうほうが有意義だと思ったのでブースやノベルティは設置しないようにした。

## 当日の動き

当日は受付をやりつつ、web サイトの問題があれば修正、その他の時間は場に応じて必要なことをするという感じで臨機応変に動いていた。寒かったりネットワークだったりトラブルがいろいろ発生したので、てんやわんやしてました。主な役割としてはこんなことをやってました。

### 受付

来場された方のチケットのチェックとか案内とかをしていた。チケット販売サービスには[pretix](https://pretix.eu/about/en/)（peatix ではない）というサービスを利用し問題なく使えていたと思います。QR コードの読み取りに関しても大きなトラブルは起きずに遂行できたと思います。

海外から参加者もスピーカーも来るので英語が少し必要だったが、基本的に定型文しか喋らないし、簡単な会場についての質疑応答をする程度だったのであまり英語は必要ではなかった。でも英語が自然にできるならもっと会話できてただろうなーという後悔はしている。  
２日目にハンズオンをやった[@sxywu](https://twitter.com/sxywu)と Windows 版環境の準備をしたり、初めて（？）日本に来たらしい[@left_pad](https://twitter.com/left_pad)にしゃぶしゃぶ屋さんを紹介したりイレギュラーな対応もあったのでアタフタしたが、仕事にはなっていたと思います。

### 司会

２日目の午後のセッションだけ B 会場で以下のセッションの司会をしてました。といってもトークセッションではなかったのであまりやることはなかった。

> &mdash; [Minimum Hands-on Node.js - 栗山 太希 | JSConf JP](https://jsconf.jp/2019/talk/sponsor-yahoo)  
> &mdash; [Recruit Speed Hackathon - 新井 智士 | JSConf JP](https://jsconf.jp/2019/talk/sponsor-recruit)

ハンズオンは分かりやすく丁寧で場作りもうまく、Node.js の教え方の勉強になったし、ハッカソンは司会しつつ 100 点取れて満足だったし、楽しかったです。まともに参加できたのはこの２セッションだけで、基本的に受付に居たり人手が足りないところにヘルプに行ったりトーク中はバタバタしてました。

### 知り合いと知り合いをつなぐ

懇親会だったりエントランスでの談笑タイムしてるときに、人見知りな弊社の社員や大阪や長野からわざわざ来てくださったエンジニアの方、数年ぶりに合ったハッカソンのメンティーの子、Deno について興味を興味がある学生さんなどなど、明確な適任が居たわけではないが自分が知ってる限りのご縁を活用して、人と人をつなげるお仕事をしてました。私も交友関係が広いわけではないけども、それでも少しは有意義な出会いになってくれたら良いなーと願ってます。

ちょうどタイムリーに[日本語で初対面の人と仲良くなるのむずい問題 – jaguchi log](https://jaguchi.com/blog/2019/12/japanese-is-hard/)という記事で知り合いと知り合いをつなぐみたいな話が出ていて、やっぱそう思うよなぁと感じた。

## JSConf コミュニティと私

今年から始まった JSConf JP は今後どんなコミュニティ・カンファレンスになっていくのが良いんだろうと会の間悩んでいた。

JSConf JP に関するパネルトークのセッションは Twitter で TL 追っていた程度で参加できておらず、あくまで私個人として JSConf JP のコミュニティに関わりたいと思う方に向けて過去の自分との対比を書く。

> &mdash; [JSConf Panel Talks - Jan Lehnardt and Lena Morita and Mariko Kosaka and Yosuke Furukawa | JSConf JP](https://jsconf.jp/2019/talk/yosuke-furukawa)

### Node 学園祭 / Japan Node.js Association と私

普段から東京で Node や Web フロントエンド界隈によく顔を出していれば顔見知りも多いかも知れないけど、遠方から来てたり普段あまり勉強会に行かない人やまだ界隈に居る歴の浅い方であれば、まぁぼっちになると思います。というか私も最初はぼっちでした。  
今でも面識のない人に話しかけると言葉が詰まるし、話題がうまく盛り上がらないときには背中に嫌な汗をかきます。

私が今スタッフをやっている経緯としては、JSConf JP の前身である[東京 Node 学園祭 2017](https://nodefest.jp/2017/)にスピーカーとして参加したのがきっかけだったと思います。スピーカーだったけども懇親会では見事にぼっちだった。２日目の Code and Learn をきっかけに Node.js にコミットすることになって少しコミュニティに関わるようになり、翌年の[東京 Node 学園祭 2018](https://nodefest.jp/2018/)で会長([@yosuke_furukawa](https://twitter.com/yosuke_furukawa))から「去年スピーカーやってたけど今年はスタッフどうすか」と誘われてスタッフになり、懇親会＋ DJ/VJ の準備と設営を担当した。

スタッフとして知り合いになった方や、イベントで知り合ったり紹介してもらったりした方と少しずつ仲良くなっていって、勉強会やら懇親会に行くのも少しずつ楽しくなっていった。

### JSConf と私

スタッフとして関わるまでは、そもそも JSConf というカンファレンスのことを存在すら知らなかった。Deno を発表した Ryan Dahl のトーク[10 Things I Regret About Node.js](https://www.youtube.com/watch?v=M3BM9TB-8yA&vl=en)が有名だと思うが、これが JSConf ってカンファレンスだということを意識していなかったし、はるか遠方のどこか遠くの世界での出来事というくらいにしか捉えていなかった。  
去年の Node 学園祭で会長が「来年は JSConf やるよ！」と言ったのをきっかけに、徐々に自分の中で姿が捉えられる身近な存在に変わっていった。そうなってしまえば後は簡単で、開催に向けて経験・勉強のために[JSConf EU にも行った](https://blog.leko.jp/post/jsconfeu2019/)し、[JSConf Korea](https://2019.jsconfkorea.com/en/)にも行ったし、JSConf ファミリーではないが [TSConf US にも行った](https://talks.leko.jp/tsconfus2019/)り、一度も行ったことなかった海外カンファレンスにも参加し JSConf や他の海外カンファレンスの雰囲気や温度観、場作りを勉強するようになった。

その過程で[JSConf EU 2019](https://blog.leko.jp/post/jsconfeu2019/)の web サイトに感銘を受け「JSConf の web サイト作りたい！」と意気込み web サイトのスタッフを名乗り出た。今年は JSConf EU のようなサイトにはできなかったと感じている。来年はもっと良いサイト作れるように頑張ろうと意気込んでいる。もし web サイトに協力してくださる方が居たらぜひご連絡下さい。

### JSConf コミュニティに関わりたいと思う方へ

そんな経緯で JSConf JP のスタッフをやっています。あくまで個人的な意見だけど、コミュニティに加わる第一歩としてまずはハードルの低い当日スタッフが選択肢の１つかなと思います。全部のトークを聞くほどの余裕はないけど懇親会や打ち上げで知り合いが増えると思います。今回は当日スタッフを公募せずに知り合いの知り合いみたいな感じでリファラルに広げていったけども、「やってみたいです！」と誰かスタッフに声かけてもらえればと思ってます。  
次にハードルが低いのは何かしらの役割を持つコアメンバーになること、一番オススメなのはスピーカーとしてトークして懇親会で１人でも２人でも話しかけてもらえるようになることかなと思います。

[Angular Japan User Group](https://community.angular.jp/about)や[Vuefes](https://vuefes.jp/2019/#the-staff-list-section)のように、今年スタッフやってた人の一覧とかあったら声かけやすいとかありますかね？  
もし需要があれば今更ではあるけどもサイトを更新しようと思います。

## さいごに

いろいろと不手際やご不便おかけしたと思いますが、それでも楽しかったと言ってもらえると励みになります。ぜひ来年の JSConf もよろしくおねがいします。

宣伝：あと JSConf とは関係ありませんが、来年の２月に TypeScript のカンファレンス[TSConf JP](https://www.tsconf.jp/)やるのでそちらもぜひご参加下さい!  
CFP の応募は先月締め切っており、スポンサーの公募は間もなく開始、チケットの販売は 12 月中をめどに考えております!
