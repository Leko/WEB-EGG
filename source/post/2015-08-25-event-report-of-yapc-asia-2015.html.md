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
Perlの祭典です。<del>Perl全く書かないけど。</del>人生初のカンファレンスです。

Perl色がもっと強いものかと思ってましたが、「申し訳程度のPerl要素…」  
と何度も思うくらいにはPerl要素が薄く、初心者にも入りやすかったです。

**「ブログに書くまでがYAPCです」** と何度も念を押されたので、というわけではなく、  
単に自分への備忘録とイベントレポートとして残します。

<!--more-->

メリークリスマス！
----------------------------------------

* [メリークリスマス！ – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/a636430c-0fbf-11e5-8a02-43ec7d574c3a)
* [Perlの父 Larry Wall が描く『指輪物語』 そしてメリークリスマス！ #yapcasia #yapcasiaA – Togetterまとめ](http://togetter.com/li/863357)

メモ

* Perl作った方
* はてなによる音声同時翻訳
* 「何が得られるか、ではなく人に何を与えられるか」に幸せを感じる

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

OSSのお話とか、Perl 5とPerl 6の話をホビットの冒険と指輪物語に例えつつな感じでした。  
どちらもタイトルしか知らないのでうまく喩え話が頭に入らず。。。  
そして **「同時翻訳すごい！ すごい！」** と感動して肝心の話を殆ど聞いてませんでした。

* * *

## Effective ES6

圧倒的な満席で入れず。スライドだけでも。

<div style="margin-bottom:5px">
  <strong> <a href="//www.slideshare.net/teppeis/effective-es6" title="Effective ES6" target="_blank">Effective ES6</a> </strong> from <strong><a href="//www.slideshare.net/teppeis" target="_blank">teppeis </a></strong>
</div>

* * *

## Web由来の組み込みエンジニアの半年間のすべて 〜WebとiOSとBLEとハードウェアデバイスのこと〜

* [Web由来の組み込みエンジニアの半年間のすべて 〜WebとiOSとBLEとハードウェアデバイスのこと〜 – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/4bab2728-00fa-11e5-9931-79c97d574c3a)
* [みんなが聞きたいIoT!!"Akerun"の作り方~Webからハードウェアへの移行での苦労~ #yapcasia #yapcasiaD – Togetterまとめ](http://togetter.com/li/863373)
* [スライド](http://kazuph.github.io/presentation/yapc-2015-iot-presentation/)
* [本人 発表後日談](http://kazuph.hateblo.jp/entry/2015/08/22/163000)

メモ

* [@kazuph](https://twitter.com/kazuph?lang=en)
* スマートロックロボット[Akerun](https://akerun.com/)、組み込み、ネイティブアプリ 
    * 4/23販売開始、スマフォから鍵を開けられる **完全にあとづけの鍵** [リンク](https://akerun.com/)
* **この世で最もハックされてないものをハックしよう** → 鍵だった → 新聞社などで取り上げ → 企業 
    * Webの知識を持ったハード・組み込みエンジニアが重宝されるのではないか
    * Webしかやってこなかった人間がどうIoTの世界に入っていったか
* Webなら早ければ3日でリリースできる、が。 
    * 原理施策（物理的に実現可能なのか？）
    * 量産試作（量産に耐えられるか）
    * 生産開始
* 忙しさの波 
    * メカ → エレキ → ファーム
    * 各工程で忙しさの波がある
* **「あとはファームでカバー」≒「運用でカバー」**
* Webエンジニアが組み込むのに足りない技術 
    * C or C++、[苦しんで覚えるC言語](http://9cguide.appspot.com/)
    * 物理的な考え方（数式、座標、速度、時間、角度）
    * デジタルマルチメータ、オシロスコープ
* 練習台：Arduino 
    * setup → 無限に動くloop という大筋の流れを知る
    * 本番製品にはいる前のプロトタイプ
* Arduinoと本番の違い 
    * Arduinoのようにずっと起きてるマイコン、ではなく長いプロセスは殺す
    * 便利関数(Arduino, C++)がない
    * Arduino以外だとググっても情報がほとんど出てこない
    * セキュリティの知識
* BLE 
    * Bluetooth Low Energy
    * Bluetooth 3.0から導入された比較的新しい企画
    * GATTというプロファイルを愛発者が設定して通信にしよう
    * iOS/Androidに標準搭載
    * BLE Serial(Arduinoとスマフォ感でのシリアル通信)
* [CoolTerm](http://freeware.the-meiers.org/) 
    * Eclipse使いたくない
* 通信方式とセキュリティ 
    * BLE自体のセキュリティは弱い
    * 独自実装はせず、汎用的な技術で通信方式を固めた 
        * AES256、HMAC、RSA
    * プロにレビューしてもらう
    * 脆弱性検証してもらう
    * [暗号技術入門](http://www.amazon.co.jp/%E6%96%B0%E7%89%88%E6%9A%97%E5%8F%B7%E6%8A%80%E8%A1%93%E5%85%A5%E9%96%80-%E7%A7%98%E5%AF%86%E3%81%AE%E5%9B%BD%E3%81%AE%E3%82%A2%E3%83%AA%E3%82%B9-%E7%B5%90%E5%9F%8E-%E6%B5%A9/dp/4797350997)
    * [マスタリングTCP/IP](http://www.amazon.co.jp/%E3%83%9E%E3%82%B9%E3%82%BF%E3%83%AA%E3%83%B3%E3%82%B0TCP-IP-%E6%83%85%E5%A0%B1%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA%E3%83%86%E3%82%A3%E7%B7%A8-%E9%BD%8B%E8%97%A4-%E5%AD%9D%E9%81%93/dp/4274069214)
* プロに教えてもらう 
    * [BLE Boot Camp](http://peatix.com/event/49938/)
* WebエンジニアとIoTプロダクト 
    * IoTプロダクトの全体設計ができる
    * ハード・ソフト両方強い人
    * Webでは当たり前な枯れたセキュリティ技術
    * **O** n **T** he **A** ir **D** evice **F** irmware **U** pdate（おとうふ）
    * 出荷用アプリケーションをwebで実装、など「web化の手」がでる
    * Web屋も組み込み屋になれる
* 「大手メーカーにスピードで負けたらベンチャーで起業した意味が無い」

<blockquote class="twitter-tweet" lang="ja">
  <p lang="ja" dir="ltr">
    GPIO(Lチカ)⇒PWM(Lフワ)⇒Timer割込でいろいろ⇒I2C通信という流れで進んだ模様。
<a href="https://twitter.com/hashtag/yapcasiaD?src=hash">#yapcasiaD</a>
  </p>&mdash; takasago (@sago35tk)   
  <a href="https://twitter.com/sago35tk/status/634553318098907136">2015, 8月 21</a>
</blockquote>

* * *

HTTP/2時代のウェブサイト設計
----------------------------------------

<div style="margin-bottom:5px">
  <strong> <a href="//www.slideshare.net/kazuho/http2-51888328" title="HTTP/2時代のウェブサイト設計" target="_blank">HTTP/2時代のウェブサイト設計</a> </strong> from <strong><a href="//www.slideshare.net/kazuho" target="_blank">Kazuho Oku</a></strong>
</div>

* [HTTP/2時代のウェブサイト設計 – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/dead6890-09b7-11e5-998a-67dc7d574c3a)
* [H2Oは先を行く！HTTP/2時代にむけたウェブサイト設計のポイント #yapcasia #yapcasiaD #http2 – Togetterまとめ](http://togetter.com/li/863416)

メモ

* HTTPとWebページの読み込み速度 
    * バンド幅が広くなっても、ある一定以上はページロード時間は早くならない 
        * 実行バンド幅1.6Mbps程度で頭打ちになる
    * **レイテンシが小さいほど速い**
* HTTP1.1 
    * HTTPパイプライン 
        * 仕様、レsポンス受診前に次のリクエストを送信可能
        * **レスポンス未受信のリクエストを再送信してよいか不明** 
            * サーバが同じリクエストを吹くうう階処理してしまう可能性
    * レイテンシ：光の速度は変わらない 
        * アメリカまで光ファイバーで往復すれば80ミリ秒

**いかん、Webが遅くなっている** → レイテンシに負けないプロトコル → HTTP/2

### バイナリプロトコル

脆弱性を防ぐ

* HTTP Request/Response Splitting Attack 
    * テキストだからおざなりになる、厳格にしようよ
    * HTTP/1.1のパーサによる解釈の差異を突く攻撃
* 転送データ量の低減 
    * コア化な粒度でレスポンスの順序を変更したい

すべての通信データは **フレーム** に格納される  
色々な種類がある

* https://http2.github.io/http2-spec/
* [h2i](https://github.com/bradfitz/http2/tree/master/h2i)

### 多重化

### ヘッダ圧縮

### 優先度制御

ex.  
CSS, jsを再優先でとっておいて、HTMLは低優先度で取ってくる  
HTMLが取得された時点でCSS, jsの読み取りは完了しているので、その時点でレンダリングを開始できる

#### サーバ

サーバ側が正しく実装しないと、クライアント側がチューニングできない。

* H2O 
    * reprioritize-blocking-assets オプションで20％ほど高速化できる
* nghttp2

この二つ以外はまともに実装されていない

### サーバプッシュ

* クライアントがするであろうリクエストを予測し、サーバ側からプッシュする
* RFCに忠実だとperformanceが出しにくい
* プッシュするリソースは常に最優先
* H2O1.5: cache-aware server-push 
    * ウェブを高速化する技術である
    * レイテンシを隠蔽 
        * 優先度制御
        * 小さなレスポンスが大量に流れても問題ない
        * HTTP/2 ではレイテンシではなくバンド幅が再び表示速度のボトルネックになってくる

### HTTP/2でオワコンになる最適化

* アセットの結合 
    * 不要なデータまで転送するから
    * 一部変更したら全部再転送になる
* expiresのりよう 
    * expiresの仕様
    * HTTP/2なら304レスポンスを使い放題
    * ファイルごとに クエリパラメータ を管理するのが面倒だから
    * ファイルごとに管理していない理由は、別のファイル更新で、全部再転送するのは良くない
* ドメインシャーディング 
    * アセットを別ホストに置くことでHTTP/1の同時接続数を6本以上にするハック 
        * CDNなどはこれ
    * ホストが異なると、HTTP2でも別のTCP接続になる
    * 複数のTCP接続にまたがった優先度制御はできない
    * 結果、first-pain timeが遅くなる
* CDNを使っている場合はWebアプリ　

### まとめ

* Webサイトを早くすればページビューが増える 
    * HTTPにすれば売上が伸びる
* H2Oは一番早いHTTP/2サーバ
* Cipersuites
* Forward Secrecy 
    * 長期鍵が漏洩・解析されてもカコの友心内容が解読可能にならない、という性質
* セッション ticket 
    * サーバが使う共通鍵をクライアントが覚える
    * サーバは共通鍵をクライアントに送信 
        * セッション ticketの暗号化に使う鍵はサーバ動作中は変わらない
        * PFS対応のcupersuiteを使っていても、この鍵がバレたら全通信が解読可能になる
    * 一般的なサーバではセッション ticketを無効にしておこう

HTTP2クライアントとしてlibcurlが優れている

サーバ証明書買わなきゃいけないの…？  
[LeysEncrypt](https://letsencrypt.org/) がリリースされれば無料で取れる

* * *

「HTTP/2でオワコンになる最適化」の話で  
今のフロントエンドのビルドツール周り（アセットの結合）が圧縮技術＋オーバヘッド削減によって、むしろボトルネックになる可能性があるという話が印象的でした。

* * *

## Perlの上にも三年 〜 ずっとイケてるサービスを作り続ける技術 〜

* [Perlの上にも三年 〜 ずっとイケてるサービスを作り続ける技術 〜 – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/de9e7a1e-136d-11e5-a9fc-d9f87d574c3a)
* [最高のオブジェクト指向&最高のドメイン駆動 ひとでくんさんのPerlの上の三年 #yapcasia #yapcasiaE](http://togetter.com/li/863438)

メモ

* 最 高
* 内輪感すごい
* はてなブログのフレームワーク（ジョーク？） 
    * 読むコードが最小
    * 安全
    * ルーティング
    * セキュリティ対策
    * 過剰な抽象化を避ける（DRY3ルール）
    * Service層
* 契約による設計 
    * お互いの約束
    * 責任外のことをチェックしない
    * 冗長さの排除
* 全体で使えるものを設計し使い続けるのは難しい 
    * 状態のなくて済むものに状態を与えてはならない
    * Builderパターン
* 長年開発していると、知見が集まってくる 
    * 新しい指針に合わせて
    * コアドメインに注力 
        * コアドメイン以外はどうでもよい
    * 最高の本
* DDD 
    * エンティティ と 値オブジェクト
    * 最高の本
* 言葉の統一 
    * エンジニアも営業も企画もデザイナーも同じ名前で呼ぶ
    * 用語集.md

内容は広くいろいろな話題があって気付かされることが多かったです。  
エリック・エヴァンスのドメイン駆動設計の本2冊ともポチりました。

* * *

## Electron: Building desktop apps with web technologies

* [Electron: Building desktop apps with web technologies – YAPC::Asia Tokyo 2015]()
* [WEB技術を使ってデスクトップ開発！Electronとは!? #yapcasia #yapcasiaA](http://togetter.com/li/863466)

中の人がわざわざいらしてお話してくれた。  
でもビギナー向けな内容で、話す内容も質疑応答も知ってたという感じでした。ざっくりと。

* * *

## esa.io – 趣味から育てたWebサービスで生きていく

* [esa.io – 趣味から育てたWebサービスで生きていく – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/c191c08a-0a98-11e5-be34-67dc7d574c3a)
* [趣味からサービスへ！esa.ioの中の人に学ぶプロダクト開発 #yapcasia #yapcasiaA](http://togetter.com/li/863489)
* [esa.io](https://esa.io/)

### 趣味でやっていく

制御可能なものを見極め、それを制御することに集中

* https://github.com/masutaka/ci-bundle-update 
    * 毎日bundle updateしてPRしてくれる
* 心からのドッグフーディング
* リリースノート駆動開発
* モチベーション駆動開発
* **どんどん試行錯誤しよう**

<blockquote class="twitter-tweet" lang="ja">
  <p lang="ja" dir="ltr">
    βリリース前に知人の会社が使ってくれて、フィードバックいっぱいくれた。これは仕事にできそうだなぁと思った。会社を作ったのは、真面目に続けてく意思表示みたいなもの <a href="https://twitter.com/hashtag/yapcasia?src=hash">#yapcasia</a> <a href="https://twitter.com/hashtag/yapcasiaA?src=hash">#yapcasiaA</a>
  </p>&mdash; たま● (@tmd45)   
  <a href="https://twitter.com/tmd45/status/634623202833010689">2015, 8月 21</a>
</blockquote>

他のセッションに比べて濃いわけではなかったけど、一番心に残ったセッションでした。  
(\( ⁰⊖⁰)/)

* * *

ISUCONの勝ち方
----------------------------------------

<div style="margin-bottom:5px">
  <strong> <a href="//www.slideshare.net/kazeburo/isucon-yapcasia-tokyo-2015" title="ISUCONの勝ち方 YAPC::Asia Tokyo 2015" target="_blank">ISUCONの勝ち方 YAPC::Asia Tokyo 2015</a> </strong> from <strong><a href="//www.slideshare.net/kazeburo" target="_blank">Masahiro Nagano</a></strong>
</div>

* [ISUCONの勝ち方 – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/86ebd212-fab3-11e4-8f5a-8ab37d574c3a)
* [「ISUCONの勝ち方」！ 100万円を獲るためのチューニングの極意 #yapcasia #yapcasiaE](http://togetter.com/li/863801)

### ISUCONとは

ISUCONで得られた知見を公開されることで、業界の技術力に寄与  
ベンチマーク：動作の変更がないことをチェック、テストに落ちたら失格

### 私とISUCON

2年連続優勝  
事前に出題に挑戦し、ベンチマークの問題を洗い出す

### ISUCONから生まれた技術

[Kossy](https://github.com/kazeburo/Kossy): ISUCONから生まれたWAF [Gazelle](https://github.com/kazeburo/Gazelle), [Redis::Jet](https://github.com/kazeburo/Redis-Jet), [Plack::Middleware::Session::Simple](https://github.com/kazeburo/Plack-Middleware-Session-Simple) など

### Webアプリケーションのパフォーマンス

管理コスト・障害対応のコストも減らせる  
大規模なインフラでは嬉しい

### ISUCONの勝ち方

* お互いの作業をチェックし、ミスを減らす
* コミュニケーションコストを減らすため普段から業務を行っているメンバー推奨
* チームメイトとの会話を重視する 
    * 問題をいちはやく相談して解決する
    * 本線では目の前に居る
    * 決まったことはメモとして書き出す、手戻りを減らす
* 紙と鉛筆さいつよ
* 時間配分 
    * 最初の一時間は「まだ慌てる時間じゃない」課題の理解、プロファイリングとチューニングの方向性を決めることだけに使う
    * 最後の30分は再起動テストに残す 
        * ベンチマーク前にwebサーバの再起動があってからテストが走る
        * サーバ再起動したらNFSのマウントができなかった
        * 問題が残ってれば7時間がみずのあわ
* 事前準備 
    * Private Git Repository
    * Wiki 
        * メンバーのSSH鍵
        * 秘伝のタレ
    * チャット
    * 技術選択についての簡単に打ち合わせ
    * 過去問をとく 
        * [ISUCON予選突破の鍵は過去問を解くことなので無料で試せるようにした(Vagrant+Ansible)](http://d.hatena.ne.jp/tmatsuu/20150815/1439643715)
        * Vagrantだと本番とスコアの出方が違うので、GCP、AWSなどで試したほうが良いと思う

### チューニングの進め方

* レギュレーションや当日の説明をよく読む 
    * **スコアの算出方法、失格条件は特に重要**
* ブラウザで課題となるサイトへアクセスする
* とりあえずベンチマークを動かす
* 起きていること 
    * アクセスログ解析 
        * ベンチマークがアクセスしている先
        * **頻度** と **レスポンス時間** をバランスよく見る 
            * **重いけどスコアには関係ない箇所がある** こともある
        * ログ解析 
            * Apacheなら`%D`つける（レスポンス時間）
            * アクセスログ消して再起動してベンチマーク使用
            * [analyze_apache_logs](https://github.com/tagomoris/Apache-Log-Parser/blob/master/bin/analyze_apache_logs)
            * [kataribe](https://github.com/matsuu/kataribe/)
    * SlowQuery解析 
        * 時間だけでなく、 **頻度**
        * [pt-query-digest](https://www.percona.com/doc/percona-toolkit/2.2/pt-query-digest.html)
        * `SET GLOBAL`で変数として設定しとけば再起動するだけで設定が元に戻せる。戻し忘れ防止
    * アプリのプロファイリング 
        * 各言語ごとのツールを使用
        * strace 
            * システムコールレベルでアプリケーションの動作を確認
        * tcpdump 
            * 通信内容のキャプチャ
    * サーバ負荷の確認 
        * top: 全体の負荷
        * iftop: ネットワーク
        * iotop: ディスク I/O
        * dstat
        * などなど。使い慣れたものを
    * **プロファイリング結果を読み解く慣れ**

### サーバ構成の確認

`Client → ReverseProxy → APP → RDBMS, KVS`

* それぞれどのようなサーバ、ミドルウェアが動作しているか
* サーバ、ミドルウェアの設定
* 過去には設定のtypoや罠も 
    * memcachedを生で使ってるかと思えばMySQLのmemcachedプラグインだった、とか。しかもmemcachedも起動していて悪質な罠
* ISUCONではサーバのおかわりはできない。与えられたサーバを効率よく使い切る
* 効率のよいCPUの使い方を知る 
    * [CPUの気持ちになれるツールを作った](http://yuroyoro.net/latency.html)
* コンテキストスイッチング 
    * 効率よくプロセスを動かすしくみ

### 目指すべきアプリケーション

* いかに何もしないアプリに近づけていくか 
    * 参照を減らす
    * 通信を減らす
    * プロセスを減らす、コンテキストスイッチを減らす

### Webサーバ

* Apache vs nginx 
    * ISUCONの環境では大体の場合nginxが有利
* nginx vs h2o 
    * h2oはプロセスではなくスレッド、スレッド間の情報の共有がしやすい、コンテキストスイッチのコストが低い

### よくある重い処理

* テンプレートの処理
* 外部プロセスの起動
* テキスト、画像を変換する処理
* RDBMS/Cacheとの接続
* N+1問題

### MySQL

* いつも心にB+Treeを 
    * B+木を意識して操作距離を最小に保つ
* 捨てるデータの読み取りを最小限に 
    * ソート＋オフセットなど

### 大事なこと

* 初期状態を記録し、いつでも戻せるようにする
* 変更を都度記録し、壊れる前の状態に戻しやすくする
* 前日はよく寝る

* * *

実践nginxモジュール開発〜CとLua〜
----------------------------------------

* [Nginxを拡張しよう！ モジュールとLuaがあればなんでも出来る！？ #yapcasia #yapcasiaB](http://togetter.com/li/863872)
* [実践nginxモジュール開発〜CとLua〜 – YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/talk/show/a4318242-f5f2-11e4-afb7-49b37d574c3a)

### nginxのhttpモジュール

* シングルプロセス
* モジュール指向

### モジュールの例

* [ngx_small_light](https://github.com/cubicdaiya/ngx_small_light) 
    * 動的な画像変換、Proxy噛ませればS3にある画像も対応可能
* [perusio/nginx-hello-world-module](https://github.com/perusio/nginx-hello-world-module) 
    * 小さなモジュール

### ngin API

* memory-pool 
    * 一気にガツッととっておいて、共有メモリ空間を複数プロセスで使用する
* list
* string 
    * 文字列がterminateされている、という前提で書くと送信途中に処理されたりするので詰む
* array
* hash-table
* time
* regular-expression
* temporary-file
* etc…

### nginxのテストはPerlで書かれている（重要なので2回言いました）

ただしPerlあまり好きじゃnあっ…

Perlは2行だけ。Perl知らんでも書ける

### [ngx_lua](https://github.com/openresty/lua-nginx-module)

各フェーズごとにluaのスクリプトをフックできる

* `ngx.say(message)` レスポンスボディに出力する
* `ngx.exit(status)` ステータスコードを指定して返す(`ngx.HTTP_OK`など)
* `ngx.log(level, message)` エラーログに吐く(`ngx.ALERT`, `ngx.CRIT`などがある)
* `ngx.var.VARIABLE` nginxの変数を上書きする、ただし新規作成はできない。上書きのみ
* `ngx.shared.DICT` nginxの共有メモリにアクセスする
* `ngx.header.HEADER` nginxのレスポンスヘッダにアクセス、上書きする
* `ngx.req.set_header()` nginxのレスポンスヘッダにアクセス、上書きする
* `ngx.time()` タイムスタンプを返す(`ngx.localtime()`などもある)

### Lua標準の正規表現のほうがはるかに速い

が、機能がそこまでない。必要に応じて`ngx.re`を使用する

### ブロッキングしない

* nginxの強みを消さないため

### OpenResty https://openresty.org/ 

* * *

## Profiling & Optimizing in Go

* [スライド](https://docs.google.com/presentation/d/1lL7Wlh9GBtTSieqHGJ5AUd1XVYR48UPhEloVem-79mA/preview?sle=true&slide=id.p)
* [資料](https://github.com/bradfitz/talk-yapc-asia-2015/blob/master/talk.md)
* [鮮やかすぎるライブコーディング！よりAwesomeな #golang ! #yapcasia #yapcasiaA](http://togetter.com/li/863950)

目からうろこというか、新しいことの連続でした。  
Goはまだ入門したばかりでツール周りなど全く触れていなかったので、足がかりとしてものすごくありがたいスピーチでした。

コーディング早すぎる。ぼけーっとしながら眺めるばかりという感じでした。

* * *

その他雑多な感想
----------------------------------------

<blockquote class="twitter-tweet" lang="ja">
  <p lang="ja" dir="ltr">
    うおおおお、本がすげーと思ったら、ただのタペストリーだった。かんっぜんに騙されてもうた。　<a href="https://twitter.com/hashtag/yapcasia?src=hash">#yapcasia</a> <a href="http://t.co/1pi8KZ5WLX">pic.twitter.com/1pi8KZ5WLX</a>
  </p>&mdash; tabunmuri (@tabunmuri255)   
  <a href="https://twitter.com/tabunmuri255/status/634539982930227201">2015, 8月 21</a>
</blockquote>

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>