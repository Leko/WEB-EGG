---
title: Algoliaを利用してサイト内検索機能を実装する
date: 2017-08-17 10:30 JST
image: /images/2017/08/eyecatch-implement-site-search-with-algolia.png
tags:
  - Algolia
  - JavaScript
  - Ruby
  - Middleman
  - React
  - Almin
  - DDD
---

こんにちは。  
当ブログのサイト内検索をしたことある方はお気づきかもしれませんが、サイト内検索に[Algolia](https://www.algolia.com/)を利用しています。  
（後述の事情により月初に使えなくなることがたまにありますが）動作速度もかなり早く、安定して稼働してます。

運用コストもゼロで、記事書いて PR をマージすれば記事公開日に勝手にコンテンツが検索対象に一手間加えてあります。  
Algolia を１ヶ月実運用してみたので、**Algolia はいいぞ**という紹介記事を書きたいと思います。

また、CQRS・DDD の勉強のために、フロントは React と[Almin](https://github.com/almin/almin)で実装してみました。  
Almin、CQRS、Flux の小さな実装例の１つとしても参考になるかと思います。

<!--more-->

## Algolia とは

https://www.algolia.com/

Algolia は、検索機能を提供する API と管理用 API と公式ライブラリ、そして周辺ツール群にて構成されています。  
私なりの「Algolia のここがすごい！」は、

- 検索がとにかく早い
- プランが柔軟
- カスタマイズ性が高い
- １ヶ月利用して１回も落ちてない
- 検索 API の気が利いてる
- 自動でタイポの名寄せをしてくれる（Noed を Node として解釈可能）
- バックエンド、フロントエンド共にライブラリが充実
- フィールドの重み付けなどのパラメータ調整をコード変えずに対応可能

あたりです。  
大きな導入事例もあり、Alt GoogleSiteSearch のデファクトなのでは!? と思うほどのクオリティと感じています。

## DocSearch とは

今回は Algolia のすごさを全力アピールするため、周辺ツールも紹介します。  
Algolia が提供する周辺ツールのうち、ぜひ知って欲しいのが[DocSearch](https://community.algolia.com/docsearch/)です。

DocSearch は Algolia のコミュニティが提供する、ドキュメントに特化した検索機能用のツールです。  
Algolia のバックエンドを利用する点は同じですが、**タグを数行書けばサイト内をクローリングして検索対象を自動収集**してくれます。  
今は亡き Google Site Search のような使い勝手で、使い心地はこちらの方が高いと感じました。

> グーグルは、サイト内検索サービスの Google Site Search を 2018 年に終了することを決定しました。
>
> &mdash; [Google Site Search が終了へ、サイト内検索は 2018 年までに他のサービスに乗り換えを | 編集長ブログ―安田英久 | Web 担当者 Forum](http://web-tan.forum.impressrd.jp/e/2017/03/28/25352)

導入例はかなり強力で、その界隈の開発者にとっては馴染み深いドキュメントで広く活躍してます。
もしかしたらこれらのドキュメントを読んでる過程で、サイト内検索を利用し、Algolia のロゴに出会ったりしていないでしょうか。

- [React Native](https://facebook.github.io/react-native/)
- [Babel](https://babeljs.io/)
- [Middleman](https://middlemanapp.com/basics/install/)
- [Vue.js](http://vuejs.org/v2/guide/)
- [Scala](http://docs.scala-lang.org/)

なお、今回は自前で実装して Almin、DDD、CQRS について実践したかったので、DocSearch ではなく Algolia を利用しています。

## Algolia の導入例

周辺ツールの１つである DocSearch に話が逸れましたが、Algolia 本家の話に戻します。

先述の通り Algolia は一部開発者にとっては馴染み深いドキュメントで利用されていますが、  
他にも有名な Web サービスでも利用されているようです。

- [Twitch](https://www.twitch.tv/)
- [Periscope](https://www.pscp.tv/)
- [Stripe](https://stripe.com/jp)

DocSearch のように、だいたいサイト内検索系のサービスの対象は静的サイトだと思いますが、  
Algolia が恐ろしいのは**動的な Web サービスでも利用されている**という点です。  
それも Amazon(Twitch)や Twitter(Periscope)などすでに巨大な検索エンジンを持ってそうな企業が採用している点は脅威です。

自分で使ってみても、それくらい検索性・速度の面で圧倒的に良いと思いますし、  
何より、複雑になりがちな検索機能のクエリ処理を実装しなくていいというのはかなりのアドバンテージなのではないでしょうか。  
試してはないですが、Algolia はバックエンドの API がかなり整っているので、動的サイトでも大きな遅延なく検索機能を代替できそうなイメージがあります。

## Algolia の料金・制限

[Algolia の料金ページ](https://www.algolia.com/pricing)

Algolia は無料で始められます。  
また、小規模なサイトであれば無料のまま使い続けられます。

- 検索対象になるマスタデータ 1 万件まで
  - 当ブログに置き換えると 1 万記事まで OK
- Algolia API を月 10 万回まで実行可能
  - 記事の登録も 1 回、記事の検索も 1 回
- Algolia を用いている箇所に Algolia のロゴを表示すること

で用途として足りていれば、無料のまま継続利用できます。  
月 10 万回というのがとても絶妙な数でして、月 1 万 PV ほどの当ブログで 1 ヶ月試した結果、ギリギリアウトでした（残３日にて回数上限オーバー）。  
なお、**上限オーバーすると、検索もコンテンツの追加もできなくなります。**

![上限超えた時の図](/images/2017/08/algolia-search-limit-exceeded.png)

このブログにおいて検索はさほどクリティカルな機能ではないし、無料で提供しているので、まぁ数日くらい検索できなくてもいいやくらいの温度感でやってます。  
もしプラン上げたくなったら、管理画面から手続きすればプランの分だけ上限は復活するので、最悪そうします。

概要、メリット、費用面について整理できたので早速 Algolia で検索機能の実装を始めます

## 記事を JSON 化して Algolia に登録する

当ブログは Middleman(Ruby)を使用しているので、[algolia/algoliasearch-client-ruby](https://github.com/algolia/algoliasearch-client-ruby)を使用します。  
おそらく大体の言語の公式クライアントライブラリがあるので、言語に合わせて読み替えてください。

使用するメソッドは`Algolia::Index#save_objects!`です。ソースは[こちら](https://github.com/algolia/algoliasearch-client-ruby/blob/5062d7b6fff7d58694731c7c294d82677620a07b/lib/algolia/index.rb#L295)  
記事を検索できるように、記事データを登録するために、記事データを JSON 化する必要があります。

Middleman の場合、幸い.json のついたファイルを作っておくだけで勝手に JSON を吐いてくれるので、とても楽でした。  
**なんて美味い話はなくて**、多少は楽だったんですが、多少の工夫が必要でした。  
記事データを JSON 化しているのは[このファイル](https://github.com/Leko/WEB-EGG/blob/master/source/posts.json.erb)で、以下の通りです。

```erb
<%= all_articles.select{|a| a[:published]}.to_json %>
```

ここはとてもシンプル。公開されている記事だけフィルタして JSON 化してます。  
ここで出てくる`all_articles`は自作のヘルパです。[このファイル](https://github.com/Leko/WEB-EGG/blob/master/config.rb)に記述しており、以下の通りです。

```ruby
helpers do
  # ...
  def all_articles
    blog.articles.map{|post|
      {
        objectID: Digest::MD5.hexdigest(post.slug),
        title: post.title,
        date: post.date,
        body: strip_tags(post.body),
        summary: strip_tags(post.summary),
        tags: post.tags,
        published: post.published?,
        locale: post.locale,
        slug: post.slug,
        path: post.data.path,
      }
    }
  end
  # ...
end
```

- objectID という一位なキーが Algolia に必要
- 記事の本文や冒頭文は HTML になってるので、HTML を剥がす必要がある

という手を加えています。

> &mdash; [Middleman で strip_tags を使ってサマリーを plain text にする方法](http://webfood.info/middleman-how-to-strip-tag-to-plain-text/)

という感じで Middleman なら簡単に記事データを JSON 化できたので、あとはそれをクライアントライブラリに渡すだけです。
記事データの登録に成功すると、記事データが Algolia に登録されて、検索可能な状態になります。

## 検索機能を実装する

検索対象を登録したので、早速記事データを検索してみます。  
実装の全体像は[こちら](https://github.com/Leko/WEB-EGG/tree/master/source/javascripts/SearchApp)を見るといいかと思います。

React と、[Almin](https://github.com/almin/almin)というユースケース駆動、CQRS、DDD と相性の良い Flux 実装を使って実装してます。  
Algolia を使って検索する、という点はオリジナルですが、実装の雛形は Almin 公式の TODO MVC のチュートリアルがほぼ全てです。  
データの取得方法と、取って来たデータの見せ方を変えただけ、という感じです。

> In this guide, we’ll walk through the process of creating a simple Todo app.
>
> &mdash; [Todo App · Almin.js](https://almin.js.org/docs/tutorial/todomvc/)

上記チュートリアルで`MemoryDB`というオンメモリの値を DB かのように振る舞うインフラレイヤのアダプタを参考に、[Algolia 用のインフラレイヤのアダプタ](https://github.com/Leko/WEB-EGG/blob/master/source/javascripts/infra/adapter/Algolia.js)を実装してあります。  
Almin 自体の詳細はもっとノウハウを貯めて別の記事にて書ければと思います。

## 記事を書いたら自動で Algolia にコンテンツが登録されるようにする

当ブログは Travis CI で事前にビルドしたものをデプロイしているので、  
サイトのビルド・デプロイ時に自動的に記事データを Algolia に登録する処理を入れてみました。

```ruby
configure :build do
  after_build do
    def update_search_index(path)
      Algolia.init application_id: ENV['ALGOLIA_APP_ID'], api_key: ENV['ALGOLIA_API_KEY']
      index = Algolia::Index.new(ENV['ALGOLIA_INDEX'])
      batch = JSON.parse(File.read(path))
      index.save_objects!(batch)
      File.delete(path)
    end
    update_search_index('./build/posts.json')
  end
end
```

`build/posts.json`は、先ほどの JSON 化するためのファイルが出力される場所です。  
Algolia に登録したらもう JSON データは使わないので消してあります。

これで`middleman build`すれば自動的に Algolia に記事データが登録されます。  
差分更新にするには記事の追加だけでなく変更や削除まで対応する必要があり、面倒だったので全件更新にしてます。  
何か問題が起きたら差分更新にすると思います。

## 検索対象のデータと、レスポンスに含めるフィールドを調整する

記事の本文も検索対象に含めたかったのですが、記事本文が丸ごとレスポンスに入っているとデータ量が多くてパフォーマンスが出なかったので、調整をしました。

検索する側のパラメータは

```js
  async find (keyword: string): Promise<PostList> {
    const algoliaOptions = {
      query: keyword,
      hitsPerPage: 1000,
      attributesToRetrieve: [
        'title',
        'summary',
        'tags',
        'path',
        'objectID',
        'date',
        'published',
        'locale',
        'slug',
      ]
    }
    const response: AlgoliaResponse = await this.index.search(algoliaOptions)
    // ...
  }
```

`attributesToRetrieve`を指定すると、レスポンスに含めるフィールドを指定できます。  
記事本文をレスポンスから除外したら、かなりパフォーマンスが上がりました。

## 検索にマッチした箇所をハイライト表示

![ハイライト](/images/2017/08/algolia-search-highlight.png)

当サイトの検索機能はキーワードにマッチしたところがハイライトされるようにしてるのですが、  
これは実装したわけではなく、Algolia 側が勝手にやってくれてます。まじすごい。

レスポンスの中に`_highlightResult`というキーが入っており、ここにハイライト済みの HTML が格納されています。  
HTML 文字列をそのまま表示させるので普通に React は使えなくなってしまうのですが、[dangerouslySetInnerHTML](https://facebook.github.io/react/docs/dom-elements.html#dangerouslysetinnerhtml)という prop を使うとお茶を濁せます。

## まとめ

- Algolia はすごい
- Algolia で検索するときはレスポンスのデータ量を最小限にすると早い
- Almin とても可能性を感じる、手に馴染む

他にも検索可能なフィールドを絞ったり、検索結果の優先度設定などパラメータをいじっているのですが、  
それだけで一本記事書けるレベルに量が多くなると思うので、この記事では割愛します。

ぜひ Algolia と Almin 試してみてください。
