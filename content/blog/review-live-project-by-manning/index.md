---
title: マニング出版のliveProjectというサービスの提案書をレビューした話
date: '2020-08-08T18:00:46.249Z'
featuredImage: '../deno-ja-on-techbookfest-7/2019-09-22-23-43-28.png'
---

先日、[マニング出版（Manning Publications）](https://www.manning.com/)というニューヨークの出版社から唐突に「こういう提案書が送信されたんだけどどう思う？レビューをお願いできないか？」と脈絡のないメールがありました。  
全くつながりのない名前の会社からの依頼に驚きつつも、提案書が興味をそそられるトピックだったのでレビューに参加した体験記を残します。

この記事を書くことは連絡をいただいたマニング出版の方に許可をもらっています。  
ただし、提案書やその結果生まれるコンテンツはまだ公になってないため内容には触れられないことをご了承ください。あくまで具体的な内容ではなくマニング出版からきたレビュー依頼のプロセスのお話として読んでもらえればと思います。

## TL;DR

- マニング出版という出版社が liveProject という e ラーニングのサービスを運営している
- チュートリアル的な要素は少なく実際にあるプロジェクトを想定した実戦的で先進的な技術をな短期間で習得できることが売りのサービスらしい
- そのサービスに掲載する教材の提案書が提出されたので同社の執筆プロセスの一環としてレビューに参加した
- もしあなたに連絡が来たときは怪しまずにレビューをしてみると面白いと思う
- Node.js 関連で liveProject に提案書を持ち込みたい/提案書をレビューしたい人を探してるそうなので興味ある方は[@L_e_k_o](https://twitter.com/L_e_k_o)までご連絡を

## 先駆者

私はあまり本を読まないのでマニング出版と聞いても全くピンときませんでした。知り合いからもこういった形式のレビューの話を聞いたことがないし、連絡をくれたマニング出版の方が知り合いなわけでもなく、接点がなさすぎて最初は怪しんでました。  
しかし単に私のアンテナが狭いだけかも知れないので似た体験をした人を調べたところ、こちらの記事がヒットしました。

> &mdash; [アメリカの技術系出版社 Manning の企画提案書が面白い - blog.8-p.info](https://blog.8-p.info/ja/2018/08/10/manning/)

この方も突然レビューの依頼があったようです。

> Manning はアメリカの技術系出版社で、日本で翻訳書が出るときには、オライリージャパンをはじめ色々な出版社からでること、その際に表紙も変えられてしまうことも相まっていまひとつ存在感がないかもしれないけれど、jQuery の John Resig 自らが著者に名を連ねる Secrets of the JavaScript Ninja や、Keras の François Chollet が書いた Deep Learning with Python、ちょっと毛色が変わったところでは、higepon さんオススメの Soft Skills まで、手広くやっている。
>
> &mdash; [アメリカの技術系出版社 Manning の企画提案書が面白い - blog.8-p.info](https://blog.8-p.info/ja/2018/08/10/manning/)

知らない出版社だと思っていたのですが Soft Skills は社会人なりたての頃に読んだ本でした。独特な絵画調の表紙が多いので表紙で思い出せました。依然として接点が薄いことに変わりはありませんが少し興味を持ちました。

> ![](https://images.manning.com/360/480/resize/book/0/54e56db-260b-46a7-b15d-ad4dfa39a867/sonmez.png)  
> &mdash; [Manning | Soft Skills](https://www.manning.com/books/soft-skills)

ちなみに Twitter でアンケートを取ってみた結果はこちらです。半数以上の方が同社の存在を知りませんでした。

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="ja" dir="ltr">マニング出版を知ってますか</p>&mdash; Leko / れこ (@L_e_k_o) <a href="https://twitter.com/L_e_k_o/status/1291258950592077824?ref_src=twsrc%5Etfw">August 6, 2020</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## liveProject とは

そんなマニング出版が[liveProject](https://liveproject.manning.com/)という e ラーニングのサービスを運営しています。  
コンテンツの方向性が振り切ってて面白いなと思いました。理論から学ぶ体系的な学びではなく先進的で実戦的な分野を攻めるという現場寄りな絞り方が面白く興味をもちました。

> what is liveProject?
>
> 1
> real projects for real learning
> liveProjects are based on real-world challenges. You’ll have peers for support , and you’ll get free access to books and videos from Manning.com.
>
> 2
> hands-on experience
> You’ll solve practical problems, write working code, and analyze real data. As you know, the best way to master a subject is by creating something that works.
>
> 3
> build cutting-edge skills
> Learn technology so new you’ve only read about it, and bring new skills to your team. Boost your career by staying ahead of the curve.
>
> &mdash; [liveProject - premium training by Manning](https://liveproject.manning.com/)

> A Manning liveProject is a project for you to complete. Tackle a real-world scenario, and learn new skills as you go. Choose from a range of projects in data science and software development. You’ll develop your own solution and get just enough help to succeed!
>
> &mdash; [Introducing liveProject. Learn by doing. Build your tech skills… | by Manning Publications | Medium](https://medium.com/@ManningBooks/introducing-liveproject-aeb394d5d0e)

説明といくつかサンプルを覗いてみたところ、このサービスは未経験者や始めたての初学者は対象にしてないと感じました。例えば公式ドキュメントやチュートリアルを読めば完結するような内容はありません。そういった基礎的な学習を終えた学習者がインタビューに使えそうなポートフォリオを増やせるサービスなのかなと感じました。実際にこのサービスを使ったことはないのであくまでその程度の感想ですが。

マニング出版の紹介はこれくらいにして本題に移ります。

## レビューを受けた心情

日本のプログラマ向けの e ラーニングサービスでも「教材を作ってみませんか？成果報酬で！」みたいなお誘いはたまに来ますが、教材を作るのってとても大変ですし、お金的にもおいしくないのでそういうモチベはありませんでした。  
ただ、今回は自分で教材を作るのではなく教材の提案書（A4 用紙 7 枚程度）をレビューするだけなので作業量に無理がなく、さらに提案書もレビューも英語なので英語で技術的な社外活動の機会だと思って依頼を受けようと思いました。

ちなみに完全に無償なわけではなく、既に同社から出版されている電子書籍または[現在執筆中のほやほやの原稿（MEAP=Manning Early Access Program）](https://www.manning.com/meap-program)から１冊、または liveProject のコース１つのいずれかが貰えます。

## レビューの流れ

liveProject のプロジェクト単位のプロセスは[こちら]()から確認できます。
このうち、私が担当する範囲は「」に相当する以下タスクです。

- A4 用紙 7 枚程度の提案書を読む
- 20 項目くらいのアンケートに回答する

### 提案書

※私がレビューした提案書はまだ公になっていないため提案書の具体的な内容については書けません。

提案書の内容は、私が仕事および趣味で何度か作ったことがある機能で、アーキテクチャや技術選定について意見がある分野でした。  
自分の中でほぼ正解を持っているつもりだったのですが、100％の確証はない。数値化するなら 87%くらいの自信度の分野です。  
少し前に GitHub で関連するリポジトリの Issue にコメントしたり活動していたので、そこで目をつけられたのかも知れません。

提案書のフォーマットは liveProject のプロセスに沿っており、以下の観点で記述されています。

- あなた（提案者）は何者か、この提案の分野におけるあなたの専門性を示す対外的な実績や質的・量的に評価可能な成果は何か
- 提案内容の具体的なシナリオ・ユースケース、および技術選定と選定理由
- このプロジェクトに学習者が取り組む前に必要な事前知識はあるか、ない場合なぜないと言えるのか具体的な説明
- プロジェクトのアウトライン
  - マイルストーンの一覧
    - 具体的に取り組む内容・ステップ。そのアプローチを取る理由
    - このマイルストーンにおける学習者の完了状態、この時点で得られる能力は何か
    - 想定する学習完了時間
    - このマイルストーンで使用する技術・ツールの一覧

「具体的なシナリオ・ユースケース」がかなり具体的に書かれており、どのような背景でどういう問題を抱えており、なぜこの技術選定で問題解決に挑むのかなどなど、現実に起こるだろうなと容易に想像できる具体的な現場像が描写されてました。  
また、マイルストーンごとにどれだけ時間をかければ学習を完了できるかを見積もっており、そのスケジュールに収まらない場合の代替手段なども考えられています。これは liveProject の売りの１つで「**短期間で**先進的で実戦的なスキルを得られる」ことに根ざしていると思います。とはいえかなり具体的な取り組みなので半日とかで終わる内容ではないので、1 日 1-2 時間くらいで進めたら 10-15 日くらいかなというボリューム感でした。

この提案書を読んだことで、同分野における私の自信度の 87％が 93%くらいまで向上する発見がありました。  
仕事の優先度が許すなら今すぐ仕事でも取り入れたい良いアプローチで、この提案書のレビューに携われてよかったと思っています。

### レビュー

そんな提案書を読んだ上で、マニング出版が用意した数十個ある設問に回答します。

アンケートの設問は提案のクオリティ向上、学習者がそのプロジェクトに取り組む際の体験向上、サービスとしてのクオリティコントロールに力を入れていると感じました。
その分野につながりの何い人が適当に「よく知らないけどなんか良さそう」とは回答しにくいような、真剣に答える圧を感じる設問が多かったです。
主な設問は以下の通り。ただ。

TODO

いただいたの動き
残# 方
