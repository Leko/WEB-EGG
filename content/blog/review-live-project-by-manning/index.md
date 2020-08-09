---
title: マニング出版のliveProjectというサービスの持ち込み提案書をレビューした話
date: '2020-08-08T18:00:46.249Z'
featuredImage: '../deno-ja-on-techbookfest-7/2019-09-22-23-43-28.png'
---

先日、[マニング出版（Manning Publications）](https://www.manning.com/)というニューヨークの出版社から唐突に「こういう提案書が送信されたんだけどどう思う？レビューをお願いできないか？」と脈絡のないメールがありました。  
全くつながりのない名前の会社からの依頼に驚きつつも、提案書が興味をそそられるトピックだったのでレビューに参加した体験記を残します。

連絡をいただいたマニング出版の方にこの記事を書く許可をもらっています。  
ただし、提案書やその結果生まれるコンテンツはまだ公になってないため内容には触れられないことをご了承ください。あくまで具体的な内容ではなくマニング出版からきたレビュー依頼のプロセスのお話として読んでもらえればと思います。

## TL;DR

- マニング出版という出版社が liveProject という e ラーニングのサービスを運営している
- チュートリアル的な要素は少なく実際にあるプロジェクトを想定した実戦的で先進的な技術をな短期間で習得できることが売りのサービスらしい
- そのサービスに掲載する教材の提案書が提出されたので同社の執筆プロセスの一環としてレビューに参加した
- もしあなたに連絡が来たときは怪しまずにレビューをしてみると面白いと思う
- Node.js 関連で liveProject に提案書を持ち込みたい/提案書をレビューしたい人を探してるそうなので興味ある方は[@L\_e\_k\_o](https://twitter.com/L_e_k_o)までご連絡を

## 先駆者

私はあまり本を読まないのでマニング出版と聞いてもピンときませんでした。知り合いからもこういった形式のレビューの話を聞いたことがなく接点がなさすぎて最初は怪しんでました。  
ただ単に私のアンテナが狭いだけかも知れないので似た体験をした人を調べたところ、こちらの記事がヒットしました。

> &mdash; [アメリカの技術系出版社 Manning の企画提案書が面白い - blog.8-p.info](https://blog.8-p.info/ja/2018/08/10/manning/)

この方も突然レビューの依頼があったようです。

> Manning はアメリカの技術系出版社で、日本で翻訳書が出るときには、オライリージャパンをはじめ色々な出版社からでること、その際に表紙も変えられてしまうことも相まっていまひとつ存在感がないかもしれないけれど、jQuery の John Resig 自らが著者に名を連ねる Secrets of the JavaScript Ninja や、Keras の François Chollet が書いた Deep Learning with Python、ちょっと毛色が変わったところでは、higepon さんオススメの Soft Skills まで、手広くやっている。
>
> &mdash; [アメリカの技術系出版社 Manning の企画提案書が面白い - blog.8-p.info](https://blog.8-p.info/ja/2018/08/10/manning/)

知らない出版社だと思っていたのですが Soft Skills は社会人なりたての頃に読んだ本でした。独特な絵画調の表紙が多いので表紙で思い出しました。  
依然として接点が薄いことに変わりはありませんが少し興味を持ちました。

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
> 1. real projects for real learning  
> liveProjects are based on real-world challenges. You’ll have peers for support , and you’ll get free access to books and videos from Manning.com.
>
> 2. hands-on experience  
> You’ll solve practical problems, write working code, and analyze real data. As you know, the best way to master a subject is by creating something that works.
>
> 3. build cutting-edge skills  
> Learn technology so new you’ve only read about it, and bring new skills to your team. Boost your career by staying ahead of the curve.
>
> &mdash; [liveProject - premium training by Manning](https://liveproject.manning.com/)

> A Manning liveProject is a project for you to complete. Tackle a real-world scenario, and learn new skills as you go. Choose from a range of projects in data science and software development. You’ll develop your own solution and get just enough help to succeed!
>
> &mdash; [Introducing liveProject. Learn by doing. Build your tech skills… | by Manning Publications | Medium](https://medium.com/@ManningBooks/introducing-liveproject-aeb394d5d0e)

で、このサービスに新しいコースの提案書を持ち込み自分のコースを作ることができるようです。今回提案書を持ち込んだ方もマニング出版やliveProjectの中の人ではなく全く別の会社に勤めてる方です。  
要は外部からliveProjectに持ち込まれた企画が成功するかどうかをバイアスなしで技術的に判断してほしいという依頼のようです。

マニング出版の紹介はこれくらいにして本題に移ります。

## 依頼の全容

具体的に依頼されたタスクは以下の通りです。

- A4 用紙数枚の提案書を読む
- liveProject運営が用意した20 項目くらいのアンケートに回答する

自分で教材を作るのではなく提案書を読んでレビューするだけなので作業量に無理はないですし、提案書で取り扱っているトピックも面白く、さらに提案書もレビューも英語なので英語で社外活動する機会だと思って依頼を受けました。なお依頼は無償ではありません。金銭はもらえませんが、既に同社から出版されている電子書籍または[現在執筆中の原稿（MEAP=Manning Early Access Program）](https://www.manning.com/meap-program)から１冊、または liveProject のコース１つのいずれかが貰えます。

### 提案書

提案書のフォーマットは以下の観点で記述されています。

- あなた（提案者）は何者か、この提案の分野におけるあなたの専門性を示す客観的に評価可能な実績・成果は何か
- 提案内容の具体的なシナリオ・ユースケース・問題定義、その問題を解決する技術選定と選定理由
- なぜこのプロジェクトを学ぶ必要があるのか
- 学習者がこのプロジェクトに取り組む前に必要な事前知識はあるか、ないか。またその根拠
- プロジェクトのアウトライン・マイルストーン
  - このマイルストーンで具体的に取り組む内容・手順。またそのアプローチを取る理由
  - このマイルストーンにおける学習者の完了状態。ここまで終えた時点で得られている能力は何か
  - 学習完了までの見積もり時間と根拠
  - このマイルストーンで使用する知識・技術・ツールの一覧

「具体的なシナリオ・ユースケース・問題定義」がかなり具体的に書かれており、どのような背景で（技術的に解決すべき）ビジネス上のはなにで、なぜこの技術選定で問題解決に挑むのかなどなど、現実にあるある～と想像できる現場像が想定されてました。すごいリアルで、これを学習しましたって成果物を面接で見せられたらオッて思うだろうなと思いました。  
マイルストーンごとにどれだけ時間をかければ学習を完了できるかを見積もっており、そのスケジュールに収まらない場合の代替手段なども考えられています。これは liveProject の売りの１つで「**短期間で**先進的で実戦的なスキルを得られる」ことに根ざしていると思います。だいたい1 日 1-2 時間くらいで進めたら 10-15 日くらいで終わるかなというボリューム感でした。

レビュー対象の提案書を読み、自分よりはるかに実績のある人が、その裏付けとなる専門的で体系的な知識をもとに書いていると感じられました。カンファレンスの登壇やメディアへの寄稿などもしているようで、読みやすいしイメージがわく書き方がうまいと思いました。自分が似たようなものを作った時とは大枠同じだけど技術選定が少し異なっており、その差異がいい気づきになったし早速試してみたいと思いました。  
気づきもあったし面白かったのでこの提案書のレビューに携われてよかったと感じました。

### レビュー

そんな提案書を読んだ上で、マニング出版が用意した20個程度の設問に回答します。主な設問はこんな感じでした。

- レビュー者（私）がこのトピックに対してどの程度の知識・経験を持っているか
- この提案書によってliveProjectとは何かがクリアになったか
- この提案書のトピックは重要か
- このコースで得られたスキルは具体的にどのような仕事に活かせると思うか
- 著者はこの提案書の分野に精通しているといえるか
- ゴールは明確だと感じたか、問題定義と問題解決アプローチは適切か
- どのような技術的背景をもつ学習者に適したコースになると思うか
- 学習者が躓きそうな問題はあるか、どうすればギャップを減らすことができると思うか
- 学習者が10h/週使ったとして4週間以内に終えることができると思うか
- このコースは学習者が購入したいと思えるものか
- このプロジェクトのメンターになりたいか

アンケートに答えてみて、とにかくコンテンツ数を増やそうという感じではなく、サービスとしてのクオリティコントロールに力を入れていると感じました。その分野に詳しくない人が適当に「よく知らないけどなんか良さそう」とは回答しにくいような圧を感じる設問が多かったです。  

ただ、GitHubで見かけた程度のエンジニアにランダムに連絡を取ったとしても提案書のトピックとその人の技術的背景が一致するとも限らないので、どうやってテーマのマッチング率を上げているか気になるところです。

## Node.jsの企画の持ち込みを募集している

依頼を完了した後に少しお話したのですが、liveProjectでNode.jsに関連するコースの提案を持ち込んでくれる人を探しているそうです。初学者向けの入門書ではなく実践的なコースを作ってみたい方がいたら[@L\_e\_k\_o](https://twitter.com/L_e_k_o)までご連絡いただければ担当の方につなげます。

## さいごに
最初はなんかの迷惑メールかと思ったのですが、スルーせずに受けてよかったです。面白かった。似たようなメールが届いたときにはぜひスルーせずに依頼を受けてみてください。
