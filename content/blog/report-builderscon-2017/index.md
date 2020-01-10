---
title: Builderscon tokyo 2017に行ってきた
date: 2017-08-10T10:30:00+0900
featuredImage: ./featured-image.png
tags:
  - Builderscon
  - カンファレンス
---

こんにちは。  
先日[Builderscon 2017](https://builderscon.io/tokyo/2017)に参加してきたので、レポートを残します。

<!--more-->

## オンプレ、クラウドを組み合わせて作るビックデータ基盤 -データ基盤の選び方-

<iframe src="//www.slideshare.net/slideshow/embed_code/key/43Hb1aoCBP1ROM" width="595" height="485" frameborder="0"  scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/yuyamada777/ss-78555123" title="オンプレ、クラウドを組み合わせて作るビックデータ基盤 データ基盤の選び方" target="_blank">オンプレ、クラウドを組み合わせて作るビックデータ基盤 データ基盤の選び方</a> </strong> from <strong><a target="_blank" href="https://www.slideshare.net/yuyamada777">Yu Yamada</a></strong> </div>

- この分野への自分の経験値
  - TreasureData, BigQuery, Athena などの DWH や、re;dash や Kibana などの BI ツールをかじったことある程度
- [Mercari KAURU](https://mercarikauru.com/)の中の人
  - 公式サイトの画像に"恋は雨上がりのように"が入ってて少しテンション上がった
- クエリがテストできる環境の必要性を感じた
  - 重い分析クエリ投げて本番が固まるなんて事件が起きたことが過去にあった
- （引用）DWH の検討軸の例
  - 容量、料金、コスパ
  - 事業計画に沿ってスケールできるか
  - データパイプラインが作りやすいか
  - 分析の用途にマッチするか
  - 運用がつらくないか
- そもそも、データ分析に投資できるくらいの体力（利益）すらない小さな企業だと予算どりが辛そう

## OSS 開発を仕事にする技術

（スライドが見つからない）

- この分野への自分の経験値
  - Github に色々リポジトリ公開しているけど、大御所 OSS へのコミットはほんの数回
- 前回の Builderscon で Kubernates の話してた人
  - [Highly available and scalable Kubernetes on AWS - builderscon tokyo 2016](https://builderscon.io/builderscon/tokyo/2016/session/ff8657cb-a751-4415-ad93-374fb9fda2b6)
- 今回は Kubernates の話というより OSS の話
- OSS プロジェクトの運営方法論の世界はかなり未開拓
  - [XDSD(eXtremely Distributed Software Development)](http://www.xdsd.org/)くらいしかないらしい
- 仕事にするとコミュニティ運営も発生するので、純粋な作業量は２倍になる
  - もし枯れてない OSS にドッグフーディングする時があれば工数は多めに見積もっておこう
  - だけど一人では実現できない練度のプロダクトになる
- やろうと思ったこと
  - OSS 使っててエンバグしたらすぐフィードバック（Issue）
  - 自分がよく使う OSS って何か考えてみる
    - Node.js
    - babel 系統
    - webpack 系統
    - fetch([github/fetch](https://github.com/github/fetch), [bitinn/node-fetch](https://github.com/bitinn/node-fetch))
    - React 系統
    - React Native 系統
    - commander
    - debug
    - mocha
    - lodash
    - sinon
    - etc
  - 洗い出してみると意外とありそう。バグに出くわしたこともあった。貢献できそう

## マイクロチームでの高速な新規開発を支える開発・分析基盤

<script async class="speakerdeck-embed" data-id="3281817cec3a4f8ca99a0158a51c5980" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

- [Gunosy LUCRA](https://lucra.jp/)の中の人
  - このプロダクト知らなかった
- 3 ヶ月で 3 人でプロダクトをローンチさせた
  - ゴリ押しではなく、きちんと定時で帰って心身ともに健全に完遂
  - さらに施策を打つための分析基盤の構築まで行った
- 無意識に発生している待ち時間はとことん削る
  - アプリのビルドや CI のビルド待ちの時間は削ろう
- やる/やらの判断をしっかりする
  - プロダクトのコンセプトを検証する上で必要か？
    - 初期においては Android 対応は切った
    - お気に入り・フォローなども切った
- ログはとにかくたくさんとる
  - タブのクリック、スワイプレベルのログまで取る
  - 通信頻度減らすためにログを buffer/flush する仕組みが必要そう
- 非エンジニアも SQL 打って自分の欲しいデータを料理できる
  - 現職も全員とは言わずとも適正ありそうな人お呼びしてできる現職勉強会してみようかな
  - まず可視化できる環境の整備が先
- 施策の効果計測をするのではなく、そもそもその施策をするべきか否か A/B で数字が出るか否かでフィルタする
  - 出してから考えるのではなく、だす前にきっちり考える
  - その上で出したものはプロダクトにとってマイナスがない限り捨てない
- 「データありきで考える」というマインドは面白そう
  - かなり組織毎の合う/合わないは別れるし、現職では難しそうと思う
  - 完全に染まりきれずとも定量的・定性的なデータをもとに判断軸を形成することは大事だと思う
- 集まったメンツのおかげなのだろうか？ そうではないと感じた
  - もちろん実力による要因は大きいとは思うけど、方法論の話だと感じた
- 組織・ツールが成熟していることが必要だと感じた
  - まずはそういった分析ができるだけのログ収集、データ（ユーザ）量、可視化ツールを整えないと話にならない

## 静的解析と UI の自動生成を駆使してモバイルアプリの運用コストを大幅に下げた話

<iframe src="//www.slideshare.net/slideshow/embed_code/key/CmQk4Mxr1b9zla" width="595" height="485" frameborder="0"  scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/takuyaueda967/ui-78581401" title="静的解析とUiの自動生成を駆使してモバイルアプリの運用コストを大幅に下げた話" target="_blank">静的解析とUiの自動生成を駆使してモバイルアプリの運用コストを大幅に下げた話</a> </strong> from <strong><a target="_blank" href="https://www.slideshare.net/takuyaueda967">Takuya Ueda</a></strong> </div>

- [ソウゾウ](https://www.souzoh.com/jp/)の中の人
- 社内用バナー管理コンソールの話
- プロダクト毎に分けるのではなく、マルチテナント型にしてプロダクト毎に GAE の namespace を切る
- 非エンジニアだけで運用できる体制づくりだいじだと思う

## Ionic 3+ではじめる次世代アプリ開発（HTML で iPhone アプリをつくろう！）

<script async class="speakerdeck-embed" data-id="4f7b54304ac446f8a7d950fee73a4df2" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

- Ionic2→3 の新機能とか開発環境周りの話とかを期待していたけど、ちょっと違った
- Ionic 触ったことなさそうな人らの反応は Twitter 見てる限り良かったので、ポテンシャルはありそうなのかなと思った
- 現状 React Native 触ってるけど、わざわざ乗り換えるだけの強みはないかな、と思った

## polyglot になろう !!

<script async class="speakerdeck-embed" data-id="075f111a6c8e4e5684b3d42cc05ee9dd" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

- 複数の言語のノウハウを集積して他の言語に活かせるエンジニアになろう！ な話
- C++の NVI イディオム知らなかった
  - けどこういう実装はしたことあるので言わんとしてることはわかった
- もうちょいポンポンと例が出てきたら良かったと感じた

## Factory Class

（スライドが見つからない）

- キーボード作った人の話

## The Evolution of PHP at Slack HQ

（スライドが見つからない）

- Slack を支える PHP の話
- Slack が PHP なのはもともと知ってた
- PHP はサーバが立ち上がりっぱな形式ではないので、メモリ管理はかなり雑でいいというのは同意
  - そこに精神すり減らすのはスタートアップがやるべきことではないという点にも激しく同意
  - その時いたメンツが PHP 得意だったから Slack は PHP を選んだという背景もあるそう
- 多言語へのスクラッチではなく、HHVM を選んだ
  - 素の PHP からでも段階的に始められるので事業リスクが少ない
  - やや事業サイドな感じはしたが、好きな温度感だし、そうじゃないとあれだけの事業にはなってないと感じる
  - あらためてリプレースなんてただの博打で、ポーカーで持ち札全部捨てるのと同じですわと感じた
- 昔 Slack の日本法人の HR 見たけどエンジニアの募集はなかったような
  - [あらためて見てみたけど](https://slack.com/jobs)採用ページでは募集してなかった

## 全体的に

- いい刺激になった。色々やってみたい欲が湧いてきた
- 去年よりも規模も幅も広くなった感じがした
- 次回はトーク応募してみようと思った
