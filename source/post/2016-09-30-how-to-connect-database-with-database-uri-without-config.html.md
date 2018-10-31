---
path: /post/how-to-connect-database-with-database-uri-without-config/
title: Railsでconfig/database.ymlを使わずURL文字列でDB接続したい
date: 2016-09-30T12:15:07+00:00
dsq_thread_id:
  - "5184699843"
categories:
  - 問題を解決した
tags:
  - Go
  - Nodejs
  - Ruby
  - Ruby on Rails
---

れこです。今回は Rails ネタです。  
作ったアプリを Heroku にデプロイするときに、各種アドオンで

```
XXX_URL=pg://xxx:yyy@zzz/hoge
```

のような文字列を環境変数で指定して使うというパターンが有ると思うのですが、  
**config/database.yml に一切触らず** に、この文字列で DB 接続したい…

と思ったので Rails のソースやドキュメントを読み漁ってみました。

<!--more-->

## 結論

先に結論を書くと、何もせずとも`DATABASE_URL`という名前の環境変数を定義すれば OK でした。  
config/database.yml を書き換えたり消したりする必要はなく、環境変数が優先されます。

以下はこの結論に至った経緯とおまけです。

## ドキュメントを読んでみる

まずは何事にも公式ドキュメント。

> You can connect to the database by setting an environment variable `ENV['DATABASE_URL']` or by using a configuration file called `config/database.yml`.  
> [3.14 Configuring a Database](http://edgeguides.rubyonrails.org/configuring.html#configuring-a-database)

とあるように、`DATABASE_URL`という環境変数が使用可能らしいということがわかりました。  
ここで気になったのは、 **config/database.yml と環境変数どちらが優先されるのか** 。  
ドキュメントだけでは解消しないので詳しく追ってみます。

## 記事を探してみる

試してみた系記事ないかなーと探してみたらこんな記事が。

> [John Griffin: Rails 4.1: Database URLs](http://www.johng.co.uk/2014/04/29/rails-41-database-urls/)

結局どっちなのかわからん。

## Rails のソースを読んでみる

まずはそれっぽいテストがないか確認。  
[Github の Rails のソースを検索してみた](https://github.com/rails/rails/search?utf8=%E2%9C%93&q=DATABASE_URL)。

[このテスト](https://github.com/rails/rails/blob/b326e82dc012d81e9698cb1f402502af1788c1e9/railties/test/application/initializers/frameworks_test.rb#L251)と[このファイルのテスト](https://github.com/rails/rails/blob/3fc0bbf008f0e935ab56559f119c9ea8250bfddd/activerecord/test/cases/connection_adapters/merge_and_resolve_default_url_config_test.rb)をみる限り、config/database.yml よりも環境変数が優先されそうな気がする。

ソースを読んでみるとそれっぽい（？）記述が。

```ruby
# Returns fully resolved connection hashes.
# Merges connection information from `ENV['DATABASE_URL']` if available.
def resolve
  ConnectionAdapters::ConnectionSpecification::Resolver.new(config).resolve_all
end

private
  def config
    @raw_config.dup.tap do |cfg|
      if url = ENV["DATABASE_URL"]
        cfg[@env] ||= {}
        cfg[@env]["url"] ||= url
      end
    end
  end
```

該当ファイルは[rails/activerecord/lib/active_record/connection_handling.rb](https://github.com/rails/rails/blob/bb1ecdcc677bf6e68e0252505509c089619b5b90/activerecord/lib/active_record/connection_handling.rb#L76)。  
もし DATABASE_URL という環境変数があれば設定ファイルでいうところの

```yaml
development: # ※ここは実行時の環境による
  url: <%%= ENV['DATABASE_URL'] %>
```

に相当する処理を内部でやってくれる模様。  
ただ、設定ファイルを見てみると

```yaml
# On Heroku and other platform providers, you may have a full connection URL
# available as an environment variable. For example:
#
#   DATABASE_URL="postgres://myuser:mypass@localhost/somedatabase"
#
# You can use this database configuration with:
#
#   production:
#     url: <%%= ENV['DATABASE_URL'] %>
#
```

と[設定ファイルを書き換えるようコメントが書かれていたり](https://github.com/rails/rails/blob/3df3d80ade705dd096ec481845ff0fc2d70427b0/railties/lib/rails/generators/rails/app/templates/config/databases/postgresql.yml)、いまいちどっちを信じればよいのかわからない。

## 実験してみる

英語と Ruby 力が足らず決定打が見つからなかったので試してみました。  
[参考記事](http://www.johng.co.uk/2014/04/29/rails-41-database-urls/)のコマンドをお借りして試してみます。

- config/database.yml 上では SQLite で接続するよう設定(gem 等も入れとく)
- ローカルに PostgreSQL は入っていない

という状態で下記コマンドを実行して、ポスグレで接続しようとすれば接続エラーになるはず。  
もし config/database.yml が優先されるなら SQLite の接続になるので正しく接続できてしまう

```
# 接続エラー（ポスグレで接続しようとしている）
DATABASE_URL=postgresql://localhost/app_development bundle exec rails s

# 接続できた（config/database.ymlは間違ってない）
bundle exec rails s
```

ということで試してみた結果、  
**config/database.yml が存在しようと、環境変数が指定されていればそちらが優先される**  
ということがわかりました。

## まとめ

この形式は環境変数１個で事足りるし、.env 等に逃がせば接続情報を Git 管理しなくて良くなるので、とても好きです。  
データベースにかぎらず、Redis や SMTP サーバなんかもこの書式で表現できます。  
各 DB ドライバによって必要な設定のキー名が変わるとか面倒くさくて覚えたくないので、接続系の処理はこの書き方に統一されてしまえばいいのに、なんて思ってます。

Rails アプリは Heroku にデプロイされることが多いからなのか、デフォルトで対応してくれていて助かりました。  
さすが Rails。といったところなんでしょうか。

ちなみにこの書き方ってなんて名称なんでしょう。  
私は`url string`とか`connection string`なんて検索をしているのですが、正しい名前があれば知りたい。。。

## おまけ：多言語の対応状況

私がよく触る言語たちの対応状況を調べてみました。

### PHP

CakePHP だと対応している模様。  
http://book.cakephp.org/3.0/en/development/configuration.html#environment-variables

Laravel だと、この形式で DB 接続するのに対応してないので、  
[この記事](http://www.easylaravelbook.com/blog/2015/01/31/deploying-a-laravel-application-to-heroku/)のように設定ファイルに PHP の処理を書き加えて Laravel の設定に互換性があるようにパース処理を自前で実装しなきゃいけなかったりクソ面倒です。

FuelPHP も探してみたものの、それらしい記事が見つからず。

### Nodejs

新進気鋭のフレームワーク[Adonis](http://www.adonisjs.com/)や個人的に好きな O/R マッパーの[objection](https://github.com/Vincit/objection.js)が内部で使用している[knex](http://knexjs.org/)はもちろん対応しています。

Node はフルスタックなフレームワークが少ない（流行ってない）ので、内部的に knex を使ってれば OK くらいの認識で居ます

### Go

Go は別格です。  
あらゆる DB のドライバの根っこになっている[database/sql](https://golang.org/pkg/database/sql/#Open)パッケージがデフォルトで対応しています。  
なので database/sql パッケージを使わずにオレオレ実装でもしていない限り対応してます。

昔に作った[Go のデモアプリ](https://github.com/Leko/godemo/blob/master/database/postgres.go#L40)でもこの方式を利用しています。
