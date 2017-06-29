---
path: /post/introduction-of-golang/
title: Goに入門してRedis+PostgresなアプリをHerokuにデプロイするまで
date: 2015-07-21T12:30:59+00:00
twitter_id:
  - "622509648927551488"
dsq_thread_id:
  - "3953699855"
image: /images/2015/07/Untitled-1.jpg
categories:
  - やってみた
tags:
  - Ansible
  - Gin
  - Go
  - Heroku
  - PostgreSQL
  - Redis
  - Vagrant
---
お久しぶりです。Goの門を叩いてみました

Goはマスコットの謎生物が可愛いですね。Gopherというらしいです。
  
どこかで見たことあると思ったら、くまのプ●さんにゴーファーというそのままなキャラクターがいましたね。

他の言語とはソースコードの構成やら書き方やら結構違っていて馴染めなかったのですが、なんとかことはじめの記事くらいは書ける程度にはなれたので、備忘録として残します。

Goの環境構築から、Ginという軽量フレームワークでRedisとPostgreSQLを使ったデモアプリを作って、Herokuにデプロイするところまでの備忘録です。 少しでもGoに入門する人の助けになれば幸いです。

<!--more-->

なぜGoなのか
----------------------------------------

<del>なんとなく</del>と言ってしまえばそれまでなのですが、 **最近あまり新しいことに挑戦してないなー** と思ったのがきっかけです。
  
というのと、今まで触れたことない言語に触れてみたい欲が湧いたので、Goを選んでみました。

Goについて調べているうちに、並列・スケールしやすいとか動作が速いとか良さそうなキーワードが手に入ったり、 **ライブラリ管理つらい** とか嫌ーな情報を入手しつつ、な入門です。

**まだGoのコードや構成の良し悪しの判断がつかないひよっ子ですので、誤った解釈・もっと良い方法などがございましたらご教授いただけると幸いです。**

参考資料
----------------------------------------

この記事を書くに当たりこれらの情報を参考にさせていただきました。ありがとうございます。

> [A Tour of Go](http://go-tour-jp.appspot.com/)

<!---->

> [Golang周辺のツールをいろいろ使いながらGin Web FrameworkでAPIを作る](http://takasing104.hateblo.jp/entry/2015/05/14/150000)

<!---->

> [takasing/golang-gin-api](https://github.com/takasing/golang-gin-api)

<!---->

> [GoアプリをHerokuにデプロイする](http://t32k.me/mol/log/go-on-heroku/)

<!---->

> [Deploying a Golang web apps to Heroku](https://github.com/l-lin/l-lin.github.io/blob/master/_posts/2015-01-31-Golang-Deploy_to_heroku.md)

<!---->

> [herokuでセッションの保存先をRedisにする](http://qiita.com/Oakbow/items/98599da0fc62863fc1b8)

<!---->

> [Ubuntu環境に、Redisをインストールして、使ってみる](http://qiita.com/HirofumiYashima/items/552c1f39b439d6acafd7)

<!---->

> [Go言語での構造体実装パターン](http://blog.monochromegane.com/blog/2014/03/23/struct-implementaion-patterns-in-golang/)

<!---->

> [便利メソッド(util)系を Static Method としてまとめる](http://qiita.com/Jxck_/items/547f1c16669f91cc9c29)

デモ、今回の構成
----------------------------------------

まずGoでハマったのが、 **ファイル構成よくわからん。**

**パスを縛るな、好きなディレクトリで開発させろや(#ﾟДﾟ)ｺﾞﾙｧ!!**
  
…すみません好き勝手な構成にした愚鈍めをお許し下さい…プロジェクト作り直しますので…

という感じでした。
  
**自プロジェクト内にある別ファイルをどうインポートするのか** がわからず全部1ファイルに書いてしまおうかという悪夢を見ました。
  
この辺は参考記事さまのデモアプリ([takasing/golang-gin-api](https://github.com/takasing/golang-gin-api))のコードを見て理解しました。

ということで今回の構成です。

  * Go(1.4.1)
  * Vagrant
  * Ansible
  * (軽量)フレームワーク: [gin-gonic/gin](https://github.com/gin-gonic/gin)
  * ORM兼マイグレーション: [jinzhu/gorm](https://github.com/jinzhu/gorm)
  * 環境変数: [joho/godotenv](https://github.com/joho/godotenv)
  * CSRF対策: [gin-gonic/nosurf](https://github.com/gin-gonic/nosurf)
  * パスワードハッシュ: [crypto/bcrypt](https://godoc.org/golang.org/x/crypto/bcrypt)
  * セッション管理: [boj/redistore](https://github.com/boj/redistore) + [soveran/redisurl](https://github.com/soveran/redisurl)
  * ライブリロード: [codegangsta/gin](https://github.com/codegangsta/gin)

Macローカルに色々インストールするのは嫌なので、Vagrant+AnsibleでVM環境を作って、その内にGoやその他もろもろを追加します。
  
自前で作った部分はごく僅かです。各ツール・ライブラリを公開してくださっている皆様に感謝です。

欲張りすぎず簡単すぎない程度に、DBアクセス、認証、セッション管理、CSRF対策あたりをやってみようと思います。
  
セッション管理にはRedisを使ってみます。複数台構成にするときに面倒にならないよう早めにセッション共有を突っ込んでおく狙いです。 ライブリロードに使用しているginとフレームワークのginは別物なので要注意です。

今回の記事で作るものはこちらのリポジトリにて公開しています。記事と合わせてご覧ください。
  
（無料プランなので接続に時間がかかる場合があります。 **Goが遅いわけではなくHerokuが原因です。** ご留意ください。）

リポジトリ： [Leko/godemo](https://github.com/Leko/godemo)
  
動作デモ(Heroku)： [go-demo](https://go-demo.herokuapp.com/)

※ここから先の内容はデモリポジトリを使う前提で進めます。何をしているかの詳細は各ファイルを御覧ください。

環境を整える
----------------------------------------

Vagrantfileとprovisioningフォルダが入っているので、さくっと環境構築を済ませます。

<span class="removed_link" title="http://qiita.com/itayan/items/b41f8541892e693aeb0a">Vagrant+AnsibleでGo環境を構築し、せっかくなのでAWS SDK for Goを試してみる。</span>さまの記事をベースにしつつ、Vagrantの設定、構成・プロビジョニング周りを色々自分好みに改造してます。
  
Ansibleのインストール等は上記の記事をご覧ください。

```
$ vagrant -v
Vagrant 1.7.2

$ ansible --version
ansible 1.9.2

$ git --version
git version 2.4.5

$ git clone git@github.com:Leko/godemo.git
$ cd godemo
$ bower install
$ vagrant up --provision
```

Ansibleのプロビジョニングが走り、エラーが出なければおそらくOKです。
  
VM内にログインしてGoのアプリを起動してみます。

```
$ vagrant ssh
$ vagrant@precise64:~$ cd go/src/godemo
$ vagrant@precise64:~/go/src/godemo$ go get
$ vagrant@precise64:~/go/src/godemo$ go get github.com/codegangsta/gin
$ vagrant@precise64:~/go/src/godemo$ gin -p 8080
```

<img src="http://leko.jp/images/2015/07/ping.png" alt="/ping" title="/ping.png" border="0" width="415" height="97" />

`http://localhost:3000/ping`にアクセスし、上記画面になれば動作確認OKです。
  
以下の内容はこのデモアプリの解説になります。

プロジェクトを作成する
----------------------------------------

ファイル構成はこのようにします。

ローカル側は`~/work/godemo`(任意のパスでOKです)、VM側は`/home/vagrant/go/src/godemo`とします。
  
VagrantのSynced folderで紐付けを行っています。

```
godemo/
├── Godeps            # ライブラリの依存性定義とソースコード
├── assets            # フロントエンドのファイル(gulpを使ってビルド)
│   ├── dist    
│   ├── scss    
│   └── vendor  
├── controller        # コントローラ
│   └── users.go
├── database          # データベース接続(PostgreSQL, Redisのユーティリティ)
│   ├── postgres.go
│   └── redis.go
├── model             # モデル
│   └── user.go
├── session           # Redisを使用したセッション管理
│   └── session.go
├── templates         # テンプレートファイル
│   ├── footer.tpl    # 共通フッタ(jsの読み込みなど)
│   ├── header.tpl    # 共通ヘッダ(metaタグ, CSSの読み込み, グローバルメニューなど)
│   ├── index.tpl
│   └── user_form.tpl
├── Procfile          # Heroku用
└── main.go           # メインファイル
```

※Goの構成やHerokuと直接関係のないファイルは除外しています。

Herokuにデプロイする（準備）
----------------------------------------

[Godep](https://github.com/tools/godep)というツールを用いてライブラリの管理を行います。 くわしくは[Herokuのマニュアル](https://devcenter.heroku.com/articles/go-dependencies-via-godep)を御覧ください。

> [Getting Started with Go on Heroku \| Heroku Dev Center](https://devcenter.heroku.com/articles/getting-started-with-go#introduction)

ここでの疑問は、できあがった`Godeps/_workspace`というディレクトリはコミットする必要があるのか？ignoreして大丈夫なのか？です。
  
マニュアルを読んでみてもignoreの話が出てこないので、試してみたところ`_workspace`はignoreしたらデプロイできませんでした。コミット必須なようです。

HerokuでRedisを使用するには[Redis Cloud](https://addons.heroku.com/rediscloud?utm_campaign=search&utm_medium=dashboard&utm_source=addons)というアドオンが良さそうでした。ということで採用。インストールのコマンドは次の章にまとめて掲載しています。

RedistoreでRedis CloudのURLを扱う際は、NewRediStoreだと「too many colons」のエラーが出ます。代わりに

  * `github.com/garyburd/redigo/redis`と`github.com/soveran/redisurl`をインポート
  * [soveran/redisurl](https://github.com/soveran/redisurl)を使用して、redis.Connを入手（デモのコード参照）
  * それを返す関数を作成し、redis.NewPoolに渡す（デモのコード参照）
  * NewRediStoreの代わりにNewRediStoreWithPoolを使用してインスタンスを生成

redisurlはredis.Connを返し、NewRediStoreWithPoolはredis.Poolを受け取る想定なので、変換に一手間かかりました。 かなりゴリ押し感が出てしまっているので、良い対処法をご存知の方がいらっしゃいましたらご教授いただけると幸いです。

この件はこちらの記事（Stackoverflow）が参考になりました。
  
使っているライブラリが違うなど、直接の原因や対策が出てこず苦戦しました。まだ人口の少ない言語なので仕方ないかと思います。

> [Go – JSON-RPC – "too many colons"](http://stackoverflow.com/questions/8854682/go-json-rpc-too-many-colons)

<!---->

> [Golang Redis error on heroku](http://stackoverflow.com/questions/25831869/golang-redis-error-on-heroku)

Herokuにデプロイする
----------------------------------------

ここまでくればおなじみのコマンドです。
  
Goは独自のビルドパックを使用する必要があるので`heroku create`コマンドの後ろに`--buildpack`オプションを渡しています。

```
$ heroku create --buildpack https://github.com/kr/heroku-buildpack-go.git
$ heroku addons:create rediscloud:30
$ heroku addons:create heroku-postgresql:hobby-dev
$ git push heroku master
$ heroku open
```

動作確認
----------------------------------------

```
$ heroku open
```

登録/ログイン/パスワードのハッシュ化/ログアウトあたりが確認できればOKかと思います。

所感
----------------------------------------

Goを触っていて思ったことの雑記です。

### 型を制するものがGoを制す？？

配列を制すものがPHPを制す、関数を制すものがjsを制す、
  
とか他の言語で適当な標語を掲げたりしていますが、Goはtypeキーワードを使った片付け周りが柔軟かつ高機能なので、そこがキーになりそうだなと感じました。
  
現状はいまいち理解できていないので構造体しか使えてませんが、理解をしっかり深めていきたいです。

### 型付け+コンパイルやっぱり素敵

C, Java, スクリプト言語と入っているので、プログラミングを始めた頃は型付け+コンパイルがお友達でした。
  
スクリプト言語のゆるふわさは楽で良いのですが、他の人が書いたコードはじっくり読まないと扱いにくいし破綻しやすいという感じがしています。

例えばPHPなら[タイプヒンティング](http://php.net/manual/ja/language.oop5.typehinting.php)で引数の型は縛れますが戻り値の型は矯正できません。PHP7でできるようになりますが、 **PHP5で書かれたものを7にリプレースする体力はあるのだろうか、新規なら別に7で書けばいいけど言語の選択肢がある新規プロジェクトならわざわざPHP選択したくないよ。** といった感じです。

### 言語構造がシンプル

構文やリテラルがそこまで多くなく、機能もそこまで多いわけではないので、入門にさほど時間が要りませんでした。
  
型の情報も相まって、入門直後でもライブラリを使っていて分からないことは直接ソースを読めば理解できるくらいにはシンプルだなと感じました。

### ドキュメント生成ツールを公式が提供

[GoDoc](http://godoc.org/golang.org/x/tools/cmd/godoc)を公式が提供していることもあり、各ライブラリがきちんとAPIドキュメントを公開しているのが好印象です。 ライブラリが作られGodocも増えて洗練されて、と開発者ありきのコミュニティの下地をきちんと整えられているなーと思います。 片付け言語なこともありコメントで補わなきゃならない情報が少なく、ドキュメントと実装の型、引数が異なることもないので、ドキュメントの質も高いと思います。

### Gopherの方々はレベルの高い印象

入門者におすすめされる言語ではない、まだメジャーではないなどが理由なのかもしれませんが、情報が少ない分クオリティが高いなと感じています。 もちろんすべてがそう、とは言えませんがクオリティが総じて高いと言っても良いんじゃないかなと思います。

<del>一方ぺちぺちする言語とかどこぞの宝石とか移植性キングとかクソい情報ばかり散見されるなと思ってます</del> <del>自分がレベルを下げる要因にならないよう気をつけて参ります。</del>

Goも人口が増えて入門者が増えればどんどんクオリティの低い情報であふれると思いますが、今ならStackoverflowを調べればだいたいいい情報が出てきます。

### 起動がとにかく速い

サーバの起動が一瞬なのがとても良いです。
  
はじめてGoのサーバ立てたときに思わず **「は？」** と口に出してしまいました。

Railsで開発していると、サーバの起動にローカルだと20秒くらいかかることがあって。Spring使っても初回起動はとにかく遅いので、（何か設定間違えてるのかもしれませんが）何をするにもいちいち遅いのが個人的に嫌でした。 一方Goはサーバの起動に1秒かかりません。感覚的にはサーバ起動のコマンドを入力し、Enterキーから指を離した頃には起動している、くらいです。

とはいえ、マイクロフレームワークと重量洗車Railsを比較するのは不平等だと思いますが、
  
入門ついでに[Revel](https://revel.github.io/)というGoのフルスタックフレームワークも試してみましたが、こちらも同様にサーバの起動が速いです。 サーバの再起動がこれだけ速ければデプロイ時の懸念事項も減ってリリースしやすいアプリが作れるのかなー、と感じました。

### ビルド時に不使用の変数、パッケージを検出してくれる

開発時にはやや不便ですが、その不便さを差し置いても素晴らしいと思います。
  
エラーで通らないのは当たり前で、使ってない依存性までエラーにしてくれるなんて素敵過ぎる。

Goのルールになれるまでは面倒だなーと思ってましたが使ってないパッケージのimportが入っていると後々のコードがどんどん汚れていきそうなので、ファイルを保存する時点で最低限の体裁を保てるあたり素晴らしいと思います。
  
<del>まぁそれでも保存前にビルドせずコミットする人とか居そうですけど</del>

### パッケージ管理周りは安定してない

**ソースコードだけでパッケージ管理する** 、という謳い文句はすごいと思いますし、ローカルで開発する文には本当にそうでびっくりしています。
  
設定ファイルを書かなくて良いしコマンドも`go get`だけなのでさくさくとライブラリを追加できます。

**ソースコードから依存性を抽出する** ことと前述の **使用していないパッケージをimportしているとエラー** があるので、クリーンな依存性管理だと言えると思います。

ただHerokuにデプロイしたり、といった可搬性とバージョン管理を考えるとGodepとか色々と対応策は出ているようですが、バージョンを固定するにはライブラリのソースコードをリポジトリに入れて管理しなきゃいけない状況はちょっとなぁ、、、と思います。 その点に関しては他のよくあるパッケージ管理のようにGitのTag+semverな管理に寄せてもよいんじゃないかな、と思います。

まとめ
----------------------------------------

ということで入門記事でした。
  
入門直後はちょっとこの言語無理だわ…と思っていましたが、慣れてくると結構いい感じだなと思います。**よくあるスクリプト言語とは別物** と割り切って入門するといいかもしれません。

Tour of Goで読み流してしまっているところとか結構あるのでGoの勉強してきます。では。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>