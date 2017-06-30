---
path: /post/knowhow-of-chatwork-api-with-activeresource/
title: ActiveResourceでChatworkのAPIクライアントを作る際にハマったところと解決策
date: 2016-09-26T12:00:15+00:00
meaningless:
  - 'yes'
dsq_thread_id:
  - "5173509051"
dsq_needs_sync:
  - "1"
categories:
  - 問題を解決した
tags:
  - ActiveResource
  - Chatwork
  - Ruby
---
れこです。  
久々にRubyの記事です。

仕事でよくChatworkを使用するので、いい加減オレオレAPIクライアントじゃなくてちゃんとしたのを作ろう  
ということで、[ActiveResourceを利用したAPIクライアント](https://github.com/Leko/activeresource-chatwork)を作ってみました。

ActiveResourceは基本的にRuby on Railsで作られたアプリケーション用のAPIクライアントなのですが、汎用的に作られているのでChatworkのAPIにも対応できました。  
ということで他のAPIにもActiveResourceを利用するために備忘録を残しておきます

<!--more-->

作ったもの
----------------------------------------

gem化してGithubに上げてあります。

> [GitHub – Leko/activeresource-chatwork: ActiveResource classes for Chatwork API](https://github.com/Leko/activeresource-chatwork)

gemの作り方については、[こちら](http://masarakki.github.io/blog/2014/02/15/how-to-create-gem/)の記事がとても参考になりました。

リクエスト/レスポンスの共通部分
----------------------------------------

ChatworkのAPIは、リクエストは`x-www-form-urlencoded`に対しレスポンスは`application/json`という特殊な要件なので、  
`ActiveResource::Formats::JsonFormat`を拡張したフォーマッタを作成しました。

リポジトリの[lib/chatwork/base.rb](https://github.com/Leko/activeresource-chatwork/blob/master/lib/chatwork/base.rb)に定義してます。コードはこんな感じ。

```ruby
class FormToJsonParser
  include ActiveResource::Formats::JsonFormat

  def mime_type
    'application/x-www-form-urlencoded'
  end

  def decode(json)
    ActiveSupport::JSON.decode(json)
  end
end

class Base &lt; ActiveResource::Base
  self.format = FormToJsonParser.new

  # ...

  def to_json(options = {})
    json = if include_root_in_json
             super({ root: self.class.element_name }.merge(options))
           else
             super(options)
           end
    hash = JSON.parse(json)

    URI.encode_www_form(hash)
  end
end
```

URL末尾から.json等のフォーマットを消したい
----------------------------------------

[ActiveResource::Base#format_extension](https://github.com/rails/activeresource/blob/master/lib/active_resource/base.rb)を読んでいたら発見。

```ruby
class Base &lt; ActiveResource::Base
  self.include_format_in_path = false
end
```

で対応できました。

ネストしたリソースを扱いたい
----------------------------------------

Chatworkは`/v1/rooms/:room_id/messages/:message_id`のように、ネストしたルーティングが必要になります。  
ActiveResourceにはActiveRecordのように[リレーション](https://github.com/rails/activeresource#associations)の機能があるようですが、一部要件を満たせなかった(※後述)ので、下記の記事も参考にしつつ試してみました。

> [ActiveResource : Passing prefix options](http://blog.revathskumar.com/2013/12/activeresource-passing-prefix-options.html)
    
> ちなみに情報が古いのか`update_attributes`に関しては上手く動きませんでした。

リポジトリの[lib/chatwork/message.rb](https://github.com/Leko/activeresource-chatwork/blob/master/lib/chatwork/message.rb)に実装例が有りますが、大枠としては

  * `prefix`プロパティに`:hoge_id`のように:付きのパスを定義する
  * `params`に`hoge_id`を指定する

has_many的なものは

```ruby
has_many :members, class_name: 'chatwork/member'
```

で定義できます。  
`class_name`オプションを渡さないと、クラスが定義されている名前空間によらずトップレベルの名前空間が指定されてしまうので注意です。  
**注意点として、この方法ではクエリパラメータを渡すことが出来ません** 解決方法は後述します。

belongs_to的なものは、残念ながらChatworkでは意図したとおりに動きません。  
これも後述します。

利用方法は[テスト](https://github.com/Leko/activeresource-chatwork/tree/master/spec/chatwork)を見ていただくほうが早いと思います。

クエリパラメータが必要なhas_manyを作りたい
----------------------------------------

`has_many`はオプション引数を受け取ってくれないので、クエリパラメータが必要な場合、has_manyを利用することが出来ません。  
ということでリレーションが使えないならメソッドを自作します。  
実装にあたり、下記の記事がとても参考になりました。

> [wholemeal: Active Resource - Associations and Nested Resources](http://wholemeal.co.nz/blog/2010/03/08/active-resource-associations-and-nested-resources/)

[lib/chatwork/room.rb](https://github.com/Leko/activeresource-chatwork/blob/master/lib/chatwork/room.rb)に定義してます。

```ruby
def messages(params = {})
    Message.all(params: subroute_params(params))
  end
```

という感じに、リレーションっぽいメソッド名で`.all`や`.find`、`.first`等を使用してそれっぽく見せてます。  
ちなみに多用すると **N+1のHTTPリクエスト** という甚大なボトルネックが生まれます。  
まぁHTTP+ActiveResourceではSQL+ActiveRecordのような柔軟さは実現できないので、性能に難が出ない程度にすっぱり諦めた方が良いと思います。。。

レスポンスに主キーがなくてもbelongs_toしたい
----------------------------------------

おそらくActiveResourceは

```ruby
# /users/1.json
{ id: 1, name: 'xxx' }

# /users/1/comments.json
{ id: 100, user_id: 1, content: 'xxx' }
```

のようなものを想定しているため、レスポンスの中に`user_id`に相当するフィールドがないとcommentsからuserを見ることが出来ません。

Chatworkでの例に置き換えると、  
`/rooms/:room_id/members`のレスポンスに`room_id`が含まれていないので、belongs_toでは紐付けが出来ません。  
`belongs_to`はパスを生成する時にレスポンスの中身しか見てくれないないようです。なぜか`prefix_options`を見てくれません。  
ということでメソッドを自作します。

[lib/chatwork/nest_of_room.rb](https://github.com/Leko/activeresource-chatwork/blob/master/lib/chatwork/nest_of_room.rb)に定義してます。

```
module Chatwork
  module NestOfRoom
    def room
      Room.find(prefix_options[:room_id])
    end
  end
end

module Chatwork
  class Member &lt; Base
    include Chatwork::NestOfRoom
  end
end
```

という感じで、`prefix_options`を使ってRoom.findすれば、レスポンスにroom_idが無くてもなんとかできます。

Railsのルーティングに反するURLに対応したい
----------------------------------------

`/v1/my/tasks`のように、Railsのルーティングに対応してないURLもなんとかしたい。  
ActiveResourceには[カスタムメソッド](http://api.rubyonrails.org/v3.2.6/classes/ActiveResource/CustomMethods.html)の機能があります。

```ruby
# {ActiveResource::Baseを継承したクラス}.{HTTPメソッド(小文字)}(:パス, オプション)
Chatwork::My.get(:tasks, status: 'open')
```

という感じで、ただのHTTPクライアント的な使い方もできるようです。  
戻り値が配列だったら`Array`、戻り値がオブジェクトなら`Hash`のインスタンスが返るようです。  
このままではActiveResourceのメソッド郡が使えないのでなんとかしたい。。。

カスタムメソッドでもActiveResource::Baseのインスタンスを返したい
----------------------------------------

カスタムメソッドを使うとHashかArrayになってしまうので、なんとかしたい。  
ActiveResource::Base.newはHashを受け取るので、受け取ったレスポンスをそのまま渡せます。  
つまりゴリ押しです。もしかしたら相当するオプションが有るのかもしれません。

[lib/chatwork/my.rb](https://github.com/Leko/activeresource-chatwork/blob/master/lib/chatwork/my.rb)に定義してます

```ruby
def self.tasks(params = {})
      get(:tasks, params).map { |t| Chatwork::Task.new(t, true) }
    end
```

これを応用すれば、レスポンスを任意のクラスに変換することができそうです。  
件数の多いAPIだと.newのオーバーヘッドが地味にありそうなので、ご利用は計画的に。

主キーに相当するフィールド名を上書きしたい
----------------------------------------

デフォルトだとレスポンス内の`id`というフィールドを主キーと見なす、という作りになっています。  
Chatworkでいえば、`/rooms`のレスポンス内の主キーは`room_id`というフィールド名になっています。  
このままではフィールド名が噛み合わず`save`や`destroy`の挙動に支障をきたします。

これを上書きするには、`primary_key`というプロパティを変更します。

```ruby
self.primary_key = 'room_id'
```

こうすれば、レスポンス内部にidというキーがなくてもマッピングしてくれました。

まとめ
----------------------------------------

やはりRailsでないアプリケーションにActiveResourceを対応させるのは少々無理が生じるようです。  
それでもChatworkのURL構造はだいぶRailsにRESTfulな感じなので、比較的軽度に収まりました。  
もしオレオレ全開なAPIに対応するとしたら、カスタムメソッドを多用することになりそうだなぁ、、、と感じました。

この内容が、少しでもActiveResourceでRails以外のAPIクライアントを作るときの助けになれば幸いです。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>