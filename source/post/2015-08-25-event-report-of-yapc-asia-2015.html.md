---
path: /post/event-report-of-yapc-asia-2015/
title: YAPC 2015行ってきました
date: 2015-08-25T09:03:17+00:00
dsq_thread_id:
  - "4062991206"
twitter_id:
  - "635965643225853952"
categories:
  - イベントレポート
tags:
  - Go
  - ISUCON
  - Nginx
  - YAPC
  - カンファレンス
---

こんにちは。  
会社の先輩に誘っていただき、 [YAPC 2015](http://yapcasia.org/2015/) に行ってきました。  
Perl の祭典です。<del>Perl 全く書かないけど。</del>人生初のカンファレンスです。

Perl 色がもっと強いものかと思ってましたが、「申し訳程度の Perl 要素…」  
と何度も思うくらいには Perl 要素が薄く、初心者にも入りやすかったです。

**「ブログに書くまでが YAPC です」** と何度も念を押されたので、というわけではなく、  
単に自分への備忘録とイベントレポートとして残します。

<!--more-->

## メリークリスマス！

- [メリークリスマス！ – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/a636430c-0fbf-11e5-8a02-43ec7d574c3a)
- [Perl の父 Larry Wall が描く『指輪物語』 そしてメリークリスマス！ #yapcasia #yapcasiaA – Togetter まとめ](http://togetter.com/li/863357)

メモ

- Perl 作った方
- はてなによる音声同時翻訳
- 「何が得られるか、ではなく人に何を与えられるか」に幸せを感じる

<blockquote class="twitter-tweet" lang="ja">
  <p lang="ja" dir="ltr">
    <a href="https://twitter.com/hashtag/yapcasia?src=hash">#yapcasia</a> 言語を構築するのは世界を構築するのと同じ
  </p>&mdash; しょーちゃん (@show_m001)   
  <a href="https://twitter.com/show_m001/status/634536792679694341">2015, 8月 21</a>
</blockquote>

<blockquote class="twitter-tweet" lang="ja">
  <p lang="ja" dir="ltr">
    2015/12/25「Perl6を出すといったな、あれは嘘だ」 <a href="https://twitter.com/hashtag/yapcasia?src=hash">#yapcasia</a>
  </p>&mdash; れこ (@L_e_k_o)   
  <a href="https://twitter.com/L_e_k_o/status/634540578013868032">2015, 8月 21</a>
</blockquote>

OSS のお話とか、Perl 5 と Perl 6 の話をホビットの冒険と指輪物語に例えつつな感じでした。  
どちらもタイトルしか知らないのでうまく喩え話が頭に入らず。。。  
そして **「同時翻訳すごい！ すごい！」** と感動して肝心の話を殆ど聞いてませんでした。

---

## Effective ES6

圧倒的な満席で入れず。スライドだけでも。

<div style="margin-bottom:5px">
  <strong> <a href="//www.slideshare.net/teppeis/effective-es6" title="Effective ES6" target="_blank">Effective ES6</a> </strong> from <strong><a href="//www.slideshare.net/teppeis" target="_blank">teppeis </a></strong>
</div>

---

## Web 由来の組み込みエンジニアの半年間のすべて 〜Web と iOS と BLE とハードウェアデバイスのこと〜

- [Web 由来の組み込みエンジニアの半年間のすべて 〜Web と iOS と BLE とハードウェアデバイスのこと〜 – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/4bab2728-00fa-11e5-9931-79c97d574c3a)
- [みんなが聞きたい IoT!!"Akerun"の作り方~Web からハードウェアへの移行での苦労~ #yapcasia #yapcasiaD – Togetter まとめ](http://togetter.com/li/863373)
- [スライド](http://kazuph.github.io/presentation/yapc-2015-iot-presentation/)
- [本人 発表後日談](http://kazuph.hateblo.jp/entry/2015/08/22/163000)

メモ

- [@kazuph](https://twitter.com/kazuph?lang=en)
- スマートロックロボット[Akerun](https://akerun.com/)、組み込み、ネイティブアプリ
  - 4/23 販売開始、スマフォから鍵を開けられる **完全にあとづけの鍵** [リンク](https://akerun.com/)
- **この世で最もハックされてないものをハックしよう** → 鍵だった → 新聞社などで取り上げ → 企業
  - Web の知識を持ったハード・組み込みエンジニアが重宝されるのではないか
  - Web しかやってこなかった人間がどう IoT の世界に入っていったか
- Web なら早ければ 3 日でリリースできる、が。
  - 原理施策（物理的に実現可能なのか？）
  - 量産試作（量産に耐えられるか）
  - 生産開始
- 忙しさの波
  - メカ → エレキ → ファーム
  - 各工程で忙しさの波がある
- **「あとはファームでカバー」≒「運用でカバー」**
- Web エンジニアが組み込むのに足りない技術
  - C or C++、[苦しんで覚える C 言語](http://9cguide.appspot.com/)
  - 物理的な考え方（数式、座標、速度、時間、角度）
  - デジタルマルチメータ、オシロスコープ
- 練習台：Arduino
  - setup → 無限に動く loop という大筋の流れを知る
  - 本番製品にはいる前のプロトタイプ
- Arduino と本番の違い
  - Arduino のようにずっと起きてるマイコン、ではなく長いプロセスは殺す
  - 便利関数(Arduino, C++)がない
  - Arduino 以外だとググっても情報がほとんど出てこない
  - セキュリティの知識
- BLE
  - Bluetooth Low Energy
  - Bluetooth 3.0 から導入された比較的新しい企画
  - GATT というプロファイルを愛発者が設定して通信にしよう
  - iOS/Android に標準搭載
  - BLE Serial(Arduino とスマフォ感でのシリアル通信)
- [CoolTerm](http://freeware.the-meiers.org/)
  - Eclipse 使いたくない
- 通信方式とセキュリティ
  - BLE 自体のセキュリティは弱い
  - 独自実装はせず、汎用的な技術で通信方式を固めた
    - AES256、HMAC、RSA
  - プロにレビューしてもらう
  - 脆弱性検証してもらう
  - [暗号技術入門](http://www.amazon.co.jp/%E6%96%B0%E7%89%88%E6%9A%97%E5%8F%B7%E6%8A%80%E8%A1%93%E5%85%A5%E9%96%80-%E7%A7%98%E5%AF%86%E3%81%AE%E5%9B%BD%E3%81%AE%E3%82%A2%E3%83%AA%E3%82%B9-%E7%B5%90%E5%9F%8E-%E6%B5%A9/dp/4797350997)
  - [マスタリング TCP/IP](http://www.amazon.co.jp/%E3%83%9E%E3%82%B9%E3%82%BF%E3%83%AA%E3%83%B3%E3%82%B0TCP-IP-%E6%83%85%E5%A0%B1%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA%E3%83%86%E3%82%A3%E7%B7%A8-%E9%BD%8B%E8%97%A4-%E5%AD%9D%E9%81%93/dp/4274069214)
- プロに教えてもらう
  - [BLE Boot Camp](http://peatix.com/event/49938/)
- Web エンジニアと IoT プロダクト
  - IoT プロダクトの全体設計ができる
  - ハード・ソフト両方強い人
  - Web では当たり前な枯れたセキュリティ技術
  - **O** n **T** he **A** ir **D** evice **F** irmware **U** pdate（おとうふ）
  - 出荷用アプリケーションを web で実装、など「web 化の手」がでる
  - Web 屋も組み込み屋になれる
- 「大手メーカーにスピードで負けたらベンチャーで起業した意味が無い」

<blockquote class="twitter-tweet" lang="ja">
  <p lang="ja" dir="ltr">
    GPIO(Lチカ)⇒PWM(Lフワ)⇒Timer割込でいろいろ⇒I2C通信という流れで進んだ模様。
<a href="https://twitter.com/hashtag/yapcasiaD?src=hash">#yapcasiaD</a>
  </p>&mdash; takasago (@sago35tk)   
  <a href="https://twitter.com/sago35tk/status/634553318098907136">2015, 8月 21</a>
</blockquote>

---

## HTTP/2 時代のウェブサイト設計

<div style="margin-bottom:5px">
  <strong> <a href="//www.slideshare.net/kazuho/http2-51888328" title="HTTP/2時代のウェブサイト設計" target="_blank">HTTP/2時代のウェブサイト設計</a> </strong> from <strong><a href="//www.slideshare.net/kazuho" target="_blank">Kazuho Oku</a></strong>
</div>

- [HTTP/2 時代のウェブサイト設計 – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/dead6890-09b7-11e5-998a-67dc7d574c3a)
- [H2O は先を行く！HTTP/2 時代にむけたウェブサイト設計のポイント #yapcasia #yapcasiaD #http2 – Togetter まとめ](http://togetter.com/li/863416)

メモ

- HTTP と Web ページの読み込み速度
  - バンド幅が広くなっても、ある一定以上はページロード時間は早くならない
    - 実行バンド幅 1.6Mbps 程度で頭打ちになる
  - **レイテンシが小さいほど速い**
- HTTP1.1
  - HTTP パイプライン
    - 仕様、レスポンス受信前に次のリクエストを送信可能
    - **レスポンス未受信のリクエストを再送信してよいか不明**
      - サーバが同じリクエストを吹くうう階処理してしまう可能性
  - レイテンシ：光の速度は変わらない
    - アメリカまで光ファイバーで往復すれば 80 ミリ秒

**いかん、Web が遅くなっている** → レイテンシに負けないプロトコル → HTTP/2

### バイナリプロトコル

脆弱性を防ぐ

- HTTP Request/Response Splitting Attack
  - テキストだからおざなりになる、厳格にしようよ
  - HTTP/1.1 のパーサによる解釈の差異を突く攻撃
- 転送データ量の低減
  - コア化な粒度でレスポンスの順序を変更したい

すべての通信データは **フレーム** に格納される  
色々な種類がある

- https://http2.github.io/http2-spec/
- [h2i](https://github.com/bradfitz/http2/tree/master/h2i)

### 多重化

### ヘッダ圧縮

### 優先度制御

ex.  
CSS, js を再優先でとっておいて、HTML は低優先度で取ってくる  
HTML が取得された時点で CSS, js の読み取りは完了しているので、その時点でレンダリングを開始できる

#### サーバ

サーバ側が正しく実装しないと、クライアント側がチューニングできない。

- H2O
  - reprioritize-blocking-assets オプションで 20％ほど高速化できる
- nghttp2

この二つ以外はまともに実装されていない

### サーバプッシュ

- クライアントがするであろうリクエストを予測し、サーバ側からプッシュする
- RFC に忠実だと performance が出しにくい
- プッシュするリソースは常に最優先
- H2O1.5: cache-aware server-push
  - ウェブを高速化する技術である
  - レイテンシを隠蔽
    - 優先度制御
    - 小さなレスポンスが大量に流れても問題ない
    - HTTP/2 ではレイテンシではなくバンド幅が再び表示速度のボトルネックになってくる

### HTTP/2 でオワコンになる最適化

- アセットの結合
  - 不要なデータまで転送するから
  - 一部変更したら全部再転送になる
- expires のりよう
  - expires の仕様
  - HTTP/2 なら 304 レスポンスを使い放題
  - ファイルごとに クエリパラメータ を管理するのが面倒だから
  - ファイルごとに管理していない理由は、別のファイル更新で、全部再転送するのは良くない
- ドメインシャーディング
  - アセットを別ホストに置くことで HTTP/1 の同時接続数を 6 本以上にするハック
    - CDN などはこれ
  - ホストが異なると、HTTP2 でも別の TCP 接続になる
  - 複数の TCP 接続にまたがった優先度制御はできない
  - 結果、first-pain time が遅くなる
- CDN を使っている場合は Web アプリ

### まとめ

- Web サイトを早くすればページビューが増える
  - HTTP にすれば売上が伸びる
- H2O は一番早い HTTP/2 サーバ
- Cipersuites
- Forward Secrecy
  - 長期鍵が漏洩・解析されてもカコの友心内容が解読可能にならない、という性質
- セッション ticket
  - サーバが使う共通鍵をクライアントが覚える
  - サーバは共通鍵をクライアントに送信
    - セッション ticket の暗号化に使う鍵はサーバ動作中は変わらない
    - PFS 対応の cupersuite を使っていても、この鍵がバレたら全通信が解読可能になる
  - 一般的なサーバではセッション ticket を無効にしておこう

HTTP2 クライアントとして libcurl が優れている

サーバ証明書買わなきゃいけないの…？  
[LeysEncrypt](https://letsencrypt.org/) がリリースされれば無料で取れる

---

「HTTP/2 でオワコンになる最適化」の話で  
今のフロントエンドのビルドツール周り（アセットの結合）が圧縮技術＋オーバヘッド削減によって、むしろボトルネックになる可能性があるという話が印象的でした。

---

## Perl の上にも三年 〜 ずっとイケてるサービスを作り続ける技術 〜

- [Perl の上にも三年 〜 ずっとイケてるサービスを作り続ける技術 〜 – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/de9e7a1e-136d-11e5-a9fc-d9f87d574c3a)
- [最高のオブジェクト指向&最高のドメイン駆動 ひとでくんさんの Perl の上の三年 #yapcasia #yapcasiaE](http://togetter.com/li/863438)

メモ

- 最 高
- 内輪感すごい
- はてなブログのフレームワーク（ジョーク？）
  - 読むコードが最小
  - 安全
  - ルーティング
  - セキュリティ対策
  - 過剰な抽象化を避ける（DRY3 ルール）
  - Service 層
- 契約による設計
  - お互いの約束
  - 責任外のことをチェックしない
  - 冗長さの排除
- 全体で使えるものを設計し使い続けるのは難しい
  - 状態のなくて済むものに状態を与えてはならない
  - Builder パターン
- 長年開発していると、知見が集まってくる
  - 新しい指針に合わせて
  - コアドメインに注力
    - コアドメイン以外はどうでもよい
  - 最高の本
- DDD
  - エンティティ と 値オブジェクト
  - 最高の本
- 言葉の統一
  - エンジニアも営業も企画もデザイナーも同じ名前で呼ぶ
  - 用語集.md

内容は広くいろいろな話題があって気付かされることが多かったです。  
エリック・エヴァンスのドメイン駆動設計の本 2 冊ともポチりました。

---

## Electron: Building desktop apps with web technologies

- [Electron: Building desktop apps with web technologies – YAPC::Asia Tokyo 2015]()
- [WEB 技術を使ってデスクトップ開発！Electron とは!? #yapcasia #yapcasiaA](http://togetter.com/li/863466)

中の人がわざわざいらしてお話してくれた。  
でもビギナー向けな内容で、話す内容も質疑応答も知ってたという感じでした。ざっくりと。

---

## esa.io – 趣味から育てた Web サービスで生きていく

- [esa.io – 趣味から育てた Web サービスで生きていく – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/c191c08a-0a98-11e5-be34-67dc7d574c3a)
- [趣味からサービスへ！esa.io の中の人に学ぶプロダクト開発 #yapcasia #yapcasiaA](http://togetter.com/li/863489)
- [esa.io](https://esa.io/)

### 趣味でやっていく

制御可能なものを見極め、それを制御することに集中

- https://github.com/masutaka/ci-bundle-update
  - 毎日 bundle update して PR してくれる
- 心からのドッグフーディング
- リリースノート駆動開発
- モチベーション駆動開発
- **どんどん試行錯誤しよう**

<blockquote class="twitter-tweet" lang="ja">
  <p lang="ja" dir="ltr">
    βリリース前に知人の会社が使ってくれて、フィードバックいっぱいくれた。これは仕事にできそうだなぁと思った。会社を作ったのは、真面目に続けてく意思表示みたいなもの <a href="https://twitter.com/hashtag/yapcasia?src=hash">#yapcasia</a> <a href="https://twitter.com/hashtag/yapcasiaA?src=hash">#yapcasiaA</a>
  </p>&mdash; たま● (@tmd45)   
  <a href="https://twitter.com/tmd45/status/634623202833010689">2015, 8月 21</a>
</blockquote>

他のセッションに比べて濃いわけではなかったけど、一番心に残ったセッションでした。  
(\( ⁰⊖⁰)/)

---

## ISUCON の勝ち方

<div style="margin-bottom:5px">
  <strong> <a href="//www.slideshare.net/kazeburo/isucon-yapcasia-tokyo-2015" title="ISUCONの勝ち方 YAPC::Asia Tokyo 2015" target="_blank">ISUCONの勝ち方 YAPC::Asia Tokyo 2015</a> </strong> from <strong><a href="//www.slideshare.net/kazeburo" target="_blank">Masahiro Nagano</a></strong>
</div>

- [ISUCON の勝ち方 – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/86ebd212-fab3-11e4-8f5a-8ab37d574c3a)
- [「ISUCON の勝ち方」！ 100 万円を獲るためのチューニングの極意 #yapcasia #yapcasiaE](http://togetter.com/li/863801)

### ISUCON とは

ISUCON で得られた知見を公開されることで、業界の技術力に寄与  
ベンチマーク：動作の変更がないことをチェック、テストに落ちたら失格

### 私と ISUCON

2 年連続優勝  
事前に出題に挑戦し、ベンチマークの問題を洗い出す

### ISUCON から生まれた技術

[Kossy](https://github.com/kazeburo/Kossy): ISUCON から生まれた WAF [Gazelle](https://github.com/kazeburo/Gazelle), [Redis::Jet](https://github.com/kazeburo/Redis-Jet), [Plack::Middleware::Session::Simple](https://github.com/kazeburo/Plack-Middleware-Session-Simple) など

### Web アプリケーションのパフォーマンス

管理コスト・障害対応のコストも減らせる  
大規模なインフラでは嬉しい

### ISUCON の勝ち方

- お互いの作業をチェックし、ミスを減らす
- コミュニケーションコストを減らすため普段から業務を行っているメンバー推奨
- チームメイトとの会話を重視する
  - 問題をいちはやく相談して解決する
  - 本線では目の前に居る
  - 決まったことはメモとして書き出す、手戻りを減らす
- 紙と鉛筆さいつよ
- 時間配分
  - 最初の一時間は「まだ慌てる時間じゃない」課題の理解、プロファイリングとチューニングの方向性を決めることだけに使う
  - 最後の 30 分は再起動テストに残す
    - ベンチマーク前に web サーバの再起動があってからテストが走る
    - サーバ再起動したら NFS のマウントができなかった
    - 問題が残ってれば 7 時間がみずのあわ
- 事前準備
  - Private Git Repository
  - Wiki
    - メンバーの SSH 鍵
    - 秘伝のタレ
  - チャット
  - 技術選択についての簡単に打ち合わせ
  - 過去問をとく
    - [ISUCON 予選突破の鍵は過去問を解くことなので無料で試せるようにした(Vagrant+Ansible)](http://d.hatena.ne.jp/tmatsuu/20150815/1439643715)
    - Vagrant だと本番とスコアの出方が違うので、GCP、AWS などで試したほうが良いと思う

### チューニングの進め方

- レギュレーションや当日の説明をよく読む
  - **スコアの算出方法、失格条件は特に重要**
- ブラウザで課題となるサイトへアクセスする
- とりあえずベンチマークを動かす
- 起きていること
  - アクセスログ解析
    - ベンチマークがアクセスしている先
    - **頻度** と **レスポンス時間** をバランスよく見る
      - **重いけどスコアには関係ない箇所がある** こともある
    - ログ解析
      - Apache なら`%D`つける（レスポンス時間）
      - アクセスログ消して再起動してベンチマーク使用
      - [analyze_apache_logs](https://github.com/tagomoris/Apache-Log-Parser/blob/master/bin/analyze_apache_logs)
      - [kataribe](https://github.com/matsuu/kataribe/)
  - SlowQuery 解析
    - 時間だけでなく、 **頻度**
    - [pt-query-digest](https://www.percona.com/doc/percona-toolkit/2.2/pt-query-digest.html)
    - `SET GLOBAL`で変数として設定しとけば再起動するだけで設定が元に戻せる。戻し忘れ防止
  - アプリのプロファイリング
    - 各言語ごとのツールを使用
    - strace
      - システムコールレベルでアプリケーションの動作を確認
    - tcpdump
      - 通信内容のキャプチャ
  - サーバ負荷の確認
    - top: 全体の負荷
    - iftop: ネットワーク
    - iotop: ディスク I/O
    - dstat
    - などなど。使い慣れたものを
  - **プロファイリング結果を読み解く慣れ**

### サーバ構成の確認

`Client → ReverseProxy → APP → RDBMS, KVS`

- それぞれどのようなサーバ、ミドルウェアが動作しているか
- サーバ、ミドルウェアの設定
- 過去には設定の typo や罠も
  - memcached を生で使ってるかと思えば MySQL の memcached プラグインだった、とか。しかも memcached も起動していて悪質な罠
- ISUCON ではサーバのおかわりはできない。与えられたサーバを効率よく使い切る
- 効率のよい CPU の使い方を知る
  - [CPU の気持ちになれるツールを作った](http://yuroyoro.net/latency.html)
- コンテキストスイッチング
  - 効率よくプロセスを動かすしくみ

### 目指すべきアプリケーション

- いかに何もしないアプリに近づけていくか
  - 参照を減らす
  - 通信を減らす
  - プロセスを減らす、コンテキストスイッチを減らす

### Web サーバ

- Apache vs nginx
  - ISUCON の環境では大体の場合 nginx が有利
- nginx vs h2o
  - h2o はプロセスではなくスレッド、スレッド間の情報の共有がしやすい、コンテキストスイッチのコストが低い

### よくある重い処理

- テンプレートの処理
- 外部プロセスの起動
- テキスト、画像を変換する処理
- RDBMS/Cache との接続
- N+1 問題

### MySQL

- いつも心に B+Tree を
  - B+木を意識して操作距離を最小に保つ
- 捨てるデータの読み取りを最小限に
  - ソート＋オフセットなど

### 大事なこと

- 初期状態を記録し、いつでも戻せるようにする
- 変更を都度記録し、壊れる前の状態に戻しやすくする
- 前日はよく寝る

---

## 実践 nginx モジュール開発〜C と Lua〜

- [Nginx を拡張しよう！ モジュールと Lua があればなんでも出来る！？ #yapcasia #yapcasiaB](http://togetter.com/li/863872)
- [実践 nginx モジュール開発〜C と Lua〜 – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/a4318242-f5f2-11e4-afb7-49b37d574c3a)

### nginx の http モジュール

- シングルプロセス
- モジュール指向

### モジュールの例

- [ngx_small_light](https://github.com/cubicdaiya/ngx_small_light)
  - 動的な画像変換、Proxy 噛ませれば S3 にある画像も対応可能
- [perusio/nginx-hello-world-module](https://github.com/perusio/nginx-hello-world-module)
  - 小さなモジュール

### ngin API

- memory-pool
  - 一気にガツッととっておいて、共有メモリ空間を複数プロセスで使用する
- list
- string
  - 文字列が terminate されている、という前提で書くと送信途中に処理されたりするので詰む
- array
- hash-table
- time
- regular-expression
- temporary-file
- etc…

### nginx のテストは Perl で書かれている（重要なので 2 回言いました）

ただし Perl あまり好きじゃ n あっ…

Perl は 2 行だけ。Perl 知らんでも書ける

### [ngx_lua](https://github.com/openresty/lua-nginx-module)

各フェーズごとに lua のスクリプトをフックできる

- `ngx.say(message)` レスポンスボディに出力する
- `ngx.exit(status)` ステータスコードを指定して返す(`ngx.HTTP_OK`など)
- `ngx.log(level, message)` エラーログに吐く(`ngx.ALERT`, `ngx.CRIT`などがある)
- `ngx.var.VARIABLE` nginx の変数を上書きする、ただし新規作成はできない。上書きのみ
- `ngx.shared.DICT` nginx の共有メモリにアクセスする
- `ngx.header.HEADER` nginx のレスポンスヘッダにアクセス、上書きする
- `ngx.req.set_header()` nginx のレスポンスヘッダにアクセス、上書きする
- `ngx.time()` タイムスタンプを返す(`ngx.localtime()`などもある)

### Lua 標準の正規表現のほうがはるかに速い

が、機能がそこまでない。必要に応じて`ngx.re`を使用する

### ブロッキングしない

- nginx の強みを消さないため

### OpenResty https://openresty.org/

---

## Profiling & Optimizing in Go

- [スライド](https://docs.google.com/presentation/d/1lL7Wlh9GBtTSieqHGJ5AUd1XVYR48UPhEloVem-79mA/preview?sle=true&slide=id.p)
- [資料](https://github.com/bradfitz/talk-yapc-asia-2015/blob/master/talk.md)
- [鮮やかすぎるライブコーディング！より Awesome な #golang ! #yapcasia #yapcasiaA](http://togetter.com/li/863950)

目からうろこというか、新しいことの連続でした。  
Go はまだ入門したばかりでツール周りなど全く触れていなかったので、足がかりとしてものすごくありがたいスピーチでした。

コーディング早すぎる。ぼけーっとしながら眺めるばかりという感じでした。

---

## その他雑多な感想

<blockquote class="twitter-tweet" lang="ja">
  <p lang="ja" dir="ltr">
    うおおおお、本がすげーと思ったら、ただのタペストリーだった。かんっぜんに騙されてもうた。　<a href="https://twitter.com/hashtag/yapcasia?src=hash">#yapcasia</a> <a href="http://t.co/1pi8KZ5WLX">pic.twitter.com/1pi8KZ5WLX</a>
  </p>&mdash; tabunmuri (@tabunmuri255)   
  <a href="https://twitter.com/tabunmuri255/status/634539982930227201">2015, 8月 21</a>
</blockquote>
