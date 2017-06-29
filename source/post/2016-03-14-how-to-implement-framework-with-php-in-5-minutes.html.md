---
path: /post/how-to-implement-framework-with-php-in-5-minutes/
title: 5分で作るPHPフレームワーク（技術調査、設計編）
date: 2016-03-14T23:10:30+00:00
dsq_thread_id:
  - "4661775608"
categories:
  - やってみた
tags:
  - Framework
  - Nodejs
  - PHP
  - PSR
---
こんにちは。  
突然ですが、PHPのフレームワークを作ろうと思います。

大層なタイトルを掲げてしまいましたが、制作自体は全く5分ではありません。けっこう時間かかりました
  
じっくり時間を書けて調査した結果、記事に倣って書けば5分くらいで完成する、という意味での5分です

記事は２本立ての構成で、今回は技術選定・設計編です。

<!--more-->

完成品
----------------------------------------

  * [Githubのリポジトリ](https://github.com/Leko/rush)
  * [公式ページ](https://rushframework.herokuapp.com)

↑を作っていく過程を記事に残します。

この記事の目的
----------------------------------------

  * PSRの可能性、ありがたみを感じてもらう
  * ピンポイントながらいい感じのライブラリを紹介する
  * フレームワークをブラックボックスではなく「ただのPHPコード」として身近に感じる

数年前から動いている[PHP-fig](http://www.php-fig.org/)という団体が提唱するPSRという仕様のうち、[6(Caching Interface)](http://www.php-fig.org/psr/psr-6/)、[7(HTTP Message Interface)](http://www.php-fig.org/psr/psr-7/)の登場に、衝撃が走りました
  
**これはPHPのフレームワークもライブラリも変わるぞ** 、と
  
特にPSR-7が強力で、 _HTTPミドルウェア_ という概念が、フレームワーク依存のオレオレ仕様ではなくやっと標準的な形になったと言えます

PSR7の登場により、ほんの1~2年前くらいに誕生した比較的新しいフレームワークですら、 **PSR-7に追従していなければもはやレガシー** と言っても過言ではないと思います
  
そんな変化の激しい世界ですが、流行り廃りに依らない記事が書ければと思っております

この記事を書くに至ったきっかけのもう一つが、「PSR登場以後に流行ってるライブラリ」を全く追っていなかったので、
  
私自身の知見をアップデートするいい機会だなと思ったことが挙げられます

また、明示的に記事のコンテンツにはしませんが、裏目的として「フレームワークはただのPHPコードの塊だ」と感じてもらうことも狙っています
  
小さなパーツを組み上げていくことで、ブラックボックスなものではなく「ただのPHPじゃん」と身近に感じてもらいたいと思っています

なお、今回の記事ではOSSコミュニティやグロースなどはスコープ外とし、
  
単にPHPのコードやWAFといった仕様や技術的な箇所について書きます。

名前を決める
----------------------------------------

フレームワークの名前は **Rush** にしました
  
被ってなくて、言いやすくて、読みが明確で、短くて、覚えやすくて、さり気なく意味がこもっている名前です
  
[Rush job](http://ejje.weblio.jp/content/rush+job)（突貫工事、やっつけ仕事）から取っています

あまり良い意味の名前ではないですが、5分というテーマを掲げるならちょうど良い自嘲かなと思います

インスパイア元
----------------------------------------

[Adonis](http://adonisjs.com/)というNodejsのフレームワークと、
  
[Slim v3](http://www.slimframework.com/)にインスパイアされています

ちなみにAdonisはLaravelにインスパイアされています

欲しい要件・要素の洗い出し
----------------------------------------

  * 実装は最小限。ニーズを満たせない所だけ作る
  * PHP5.5以上対応
  * HTTPリクエスト/レスポンスはPSR7準拠
  * ルーティング
  * HTTPミドルウェア
  * DB操作のモデル
  * DIコンテナ
  * テンプレートエンジン
  * 設定ファイルを扱う仕組み
  * ファイルパス操作
  * フロントエンドは色々な構成がありすぎるので何も手を入れない

### PHPのバージョン

[PHPのサポート状況](http://php.net/supported-versions.php)から対応すべきバージョンを決定しました
  
PHP5.4のサポートって既に終了していたんですね。 <del>知りませんでした</del>

### ルーティング

[thephpleague/route](https://github.com/thephpleague/route)ではなく[nikic/FastRoute](https://github.com/nikic/FastRoute)を採用 thephpleague/routeのPSR-7対応版は[まだrc](https://github.com/thephpleague/route/pull/73)なので、時期尚早だと判断した

### HTTPリクエスト/レスポンスはPSR7準拠

[zend-diactoros](https://github.com/zendframework/zend-diactoros)を採用
  
他にいい感じのライブラリがなかったのと、古に伝わりしZendブランドがPSRとか標準化に貢献していることに好感を感じるので採用しました

ブラウザにレスポンスを返す処理が見当たらなかったので、[Slimのコード](https://github.com/slimphp/Slim/blob/3.x/Slim/App.php#L354)からそのまんまな処理をパクってきます。

### HTTPミドルウェア

[oscarotero/psr7-middlewares](https://github.com/oscarotero/psr7-middlewares)を採用
  
Slimと互換性があることと、色々種類が揃っているため便利そうなので採用しました
  
色々な種類のミドルウェアが入っているので、実装者が取捨選択する感じにしようと思います。

強いてあげるなら[Generator](http://php.net/manual/ja/language.generators.overview.php)を使用して第三引数がなくなると、よりシンプルだなと思います
  
しかしPHPはほぼ全てが同期APIなので、Nodejs(Adonis)のような必然性、メリットが特にないため流行る将来が見えません。
  
ということでジェネレータ非対応ですがこのライブラリを採用します。

  * 採用する 
      * これらのミドルウェアはフレームワーク内に組み込みます。
  
        とはいえ依存しているのはルーティングくらいなのであとは取捨選択可能です。
      * [FastRoute](https://github.com/oscarotero/psr7-middlewares#fastroute) 
          * ルーティングで採用しているFastRouteのミドルウェアがありました
  
            ルーティングはHTTPミドルウェアの1つとして動作させます
      * [ClientIp](https://github.com/oscarotero/psr7-middlewares#clientip) 
          * 主な想定はHerokuですが、PHPなら自前で組むとしてもFastCGIサーバが手前に噛む構成が多いと思います。そんな時にも使いやすいミドルウェアです 
          * ちなみにHerokuの場合だと以下のヘッダがアプリケーションサーバへ渡ってくるそうです。 [参照](https://devcenter.heroku.com/articles/http-routing) 
              * `X-Forwarded-For`: the originating IP address of the client connecting to the Heroku router
              * `X-Forwarded-Proto`: the originating protocol of the HTTP request (example: https)
              * `X-Forwarded-Port`: the originating port of the HTTP request (example: 443)
              * `X-Request-Start`: unix timestamp (milliseconds) when the request was received by the router
              * `X-Request-Id`: the Heroku HTTP Request ID
              * `Via`: a code name for the Heroku router
      * [Csrf](https://github.com/oscarotero/psr7-middlewares#csrf) 
          * 言わずもがなCSRFプロテクションです
          * アプリケーションの仕様上これを入れることにで都合が悪くなることもあるので、付け外し出来る前提で組み込みます
      * [LanguageNegotiation](https://github.com/oscarotero/psr7-middlewares#languagenegotiation) 
          * 多言語化の文言管理、取得の仕組み自体は色々有りますが、 _何の言語で表示したら良いのか_ は地味に面倒で、かつついオレオレ仕様で書いてしまいがちです
          * PHPのドキュメントのように言語情報をパスに込めることも可能です
          * 原則はHTTPの仕様通り、最悪Cookieで上書きできる、という形で組み込もうと思います
      * [ErrorHandler](https://github.com/oscarotero/psr7-middlewares#errorhandler) 
          * エラーハンドリングもミドルウェアとして提供されています。 **その手があったか！** と感動したし便利なので採用
      * [Whoops](https://github.com/oscarotero/psr7-middlewares#whoops) 
          * Railsで言うところの[better_errors](https://github.com/charliesome/better_errors)のようなデバッグ用エラー画面です
          * 開発環境ではこれ使うのが捗るので居れておきます
  * 紹介するだけ 
      * これらのミドルウェアは便利そうなのですが入れると余計なロックインが起きそうだったので見送りました。紹介までにとどめます。
      * [Csp](https://github.com/oscarotero/psr7-middlewares#csp) 
          * [Content Security Policy](https://developer.mozilla.org/ja/docs/Web/Security/CSP)の設定を提供してくれるミドルウェア
  
            まだブラウザの対応状況が微妙なのでフレームワークでの採用は見送り。要件や対応ブラウザによっては使えそうです
      * [GoogleAnalytics](https://github.com/oscarotero/psr7-middlewares#googleanalytics) 
          * 言わずと知れたGoogle Analyticsのトラッキングコードを仕込むミドルウェア
          * テンプレート自体が共通化されていればPHPでやることはないので、見送り
      * [Minify](https://github.com/oscarotero/psr7-middlewares#minify) 
          * 出力するファイルを圧縮して送信できるミドルウェア
          * HTTPミドルウェアの責務ではなくて、静的ファイル(gzipなど)ならWebサーバやビルドツール、動的文字列ならテンプレートエンジンの役割だと思っているため見送り
      * [Rename](https://github.com/oscarotero/psr7-middlewares#rename) 
          * ルーティングの上書きができるミドルウェア
          * 必要なケースが限定的なので見送り

### DB操作のモデル

Laravelの[Illuminate\Eloquent](https://github.com/illuminate/database)を採用しました
  
最もAPIが直感的だと思います。また、Laravelで使用されていることも有り、大規模な構成になっても耐えられそうなため採用しました

ちなみに内部ではDoctrineが使用されている箇所があります。

他に検討したライブラリだと、
  
[fuel/orm](https://github.com/fuel/orm)や[idiorm](https://github.com/j4mie/idiorm)や[paris](https://github.com/j4mie/paris)、[doctrine/orm](https://github.com/doctrine/doctrine2)はAPIがイケてないと言った感じでした

### DIコンテナ

phpdiを採用しました。

複雑なビジネスロジックを組んでいるとテストできないような膨大な化物ができあがってしまうことが良くあります
  
焼け石に水で、そもそも論はいくらでも言えますが、 **明示的に意識させ、化物を産まれくくできる** 点で、実装者のスキル差を軽減できるパターンの一つだと思います
  
モックをさらっと当ててテストが出来る点は一度覚えてしまうとやめられない快感です

そんな訳でDIコンテナの仕組みは入れておきたいです。でもSymfonyほど大袈裟なものは要らない
  
どれを採用するかとても迷いました。Githubでの人気具合だと

  * [Pimple](https://github.com/silexphp/Pimple): スター数 1225 
      * 人気だけど連想配列っぽく扱うのがあまり好きではない。こんな記事もあったり
  
        [Dependency Injection Containers with PHP. When Pimple is not enough.](http://gonzalo123.com/2012/09/03/dependency-injection-containers-with-php-when-pimple-is-not-enough/)
  * [phpdi](https://github.com/PHP-DI/PHP-DI): スター数 658
  * [Aura.DI](https://github.com/auraphp/Aura.Di): スター数 213

という感じでした
  
中くらいの人気度、コードベースでなく設定ベースなところからphpdiを採用します

> 蛇足。悩んだのでSlimを調べてみたところ、[container-interop/container-interop](https://github.com/container-interop/container-interop)
    
> というライブラリが使われていました。幅広く抽象的なインタフェースだと思います。要メモ

### テンプレートエンジン

**自前で実装します。**
  
といってもテンプレートエンジン自体を実装するのではなく、 **複数のテンプレートエンジンを切り替えられる仕組み** を作ります

ということで作りました

> [PHPのテンプレートエンジンについて調べて共通インタフェースを作った](http://leko.jp/archives/840)

### 設定ファイルを扱う仕組み

自前で作っても簡単ですが、自前ではなく[hassankhan/config](https://github.com/hassankhan/config)を採用しました

JSON, YAML, PHP, Iniに対応しているようです
  
こういった小さくて抽象的なライブラリ非常に好きです

### ファイルパス操作

[webmozart/path-util](https://github.com/webmozart/path-util)を採用

PHP組み込み定数の`DIRECTORY_SEPARATOR`は名前が長い。長過ぎます
  
とはいえFuelPHPのように`DS`といった略称を作っても仕方ないので、もっと根本的な解決策を探った結果、見つけました

更に言えば、PHPのファイル操作関数は命名に統一性がなくバラバラで分かりにくいです
  
nodeでいう[path](https://nodejs.org/api/path.html)モジュールのようなのがほしいな～と探して見つけたのがこのライブラリです

なんだかんだでファイルパス操作はよく行うので、予め入れておくとコア層でもアプリ層でもいい感じになるだろう。と見込んで採用しました

ディレクトリ構成
----------------------------------------

アプリケーションのディレクトリ構成は以下のようにしようと思います。

```
.
├── bootstrap.php
├── config
│   ├── database.php
│   ├── middlewares.php
│   ├── providers.php
│   ├── routes.php
│   └── view.php
├── public
│   └── index.php
├── resouces
│   ├── storage
│   └── views
└── app
    ├── Http
    │   ├── Controller
    │   └── Middleware
    └── Model
```

Adonisを真似ました。このディレクトリ構成気に入っています
  
コントローラは居るのか？という自問自答に対しては、「無名関数はユニットテストしにくい」という結果から採用しました
  
コントローラを使わなければならないわけではないので、その辺のお手軽さも柔軟にやれればと思います。

まとめ
----------------------------------------

いかがだったでしょうか。
  
これらのライブラリを組み合わせて、次回実装編でフレームワークを組み上げます。

この記事の中で、1つでも知らなくて役に立つライブラリが見つかっていれば、してやったりです。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>