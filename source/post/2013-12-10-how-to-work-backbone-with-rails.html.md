---
path: /post/how-to-work-backbone-with-rails/
title: Backbone.jsとRuby on Railsを連携させる際のメモ
date: 2013-12-10T12:30:06+00:00
twitter_id:
  - "410250144081141761"
image: /images/2013/12/backbone-rails.jpg
categories:
  - 問題を解決した
tags:
  - Backbone.js
  - JavaScript
  - Ruby
  - Ruby on Rails
---

Ruby on Rails はシンプルな API だけ構えておいて、  
Backbone.js を API クライアントとして連携させる際に

Rails でコントローラを scaffold しただけでは上手く動かなかったため、  
対処したことをメモしておきます。

<!--more-->

## 各ライブラリのバージョン

使用している言語やライブラリのバージョンは以下のようになっています。

| 項目          | バージョン |
| :------------ | ---------: |
| Backbone.js   |      1.1.0 |
| jQuery        |      2.1.0 |
| Ruby          |      1.9.3 |
| Ruby on Rails |      3.2.8 |

Backbone 側をあまりゴリゴリといじらず、  
設定だけ書いておけば Ajax 出来る状態にしたいので、Rails 側を調整していきます。

## API にアクセスする際に拡張子を省略

Backbone.Sync のデフォルトだと、  
Ajax の叩き先が`GET /[name]s`となったり`POST /[name]s`等になっており、  
scaffold したままの Rails のコントローラでは、**拡張子を指定しないとレスポンスが返って来ません**。

どちらかを修正すれば済むので、今回は Rails 側を修正します。

まず、Web API が返すレスポンスのフォーマットは、  
`respond_doブロック`の中に入っている`format.*`という指定で決まります。

`format.*`がアクセスする際の拡張子、  
`render *`がレスポンスとして返されるフォーマットです。

scaffold されたコードは、こんな感じになっていると思います。

```ruby
class TasksController < ApplicationController
  def index
    @tasks = Task.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @tasks }
    end
  end
  # ...
end
```

この指定だと、URL に`.html`と`.json`の拡張子をつけると、 それぞれそのフォーマットで返してくれるようになっています。

ただし、**それ意外の拡張子（指定なしを含む）を指定した場合、何も返って来ません。**

ということで、全ての拡張子にマッチする指定してあげれば、うまくいきます。

## Rails の Web API のデフォルトフォーマットを指定する

> respond_to でデフォルトフォーマットを指定する - The Second Longest Day in My Life...  
> http://d.hatena.ne.jp/tnksaigon/20110124/1295839007

こちらの記事によると、respond_do の中に、`format.any`という指定ができるそうです。

any を指定すると、any 以前に書いてあるフォーマット(`.html`, `.json`)にマッチしない全てのフォーマットに適用されます。  
つまり、拡張子を省略した場合はこの any で返されるフォーマットが適用されることになります。

先ほどのコードに any で json を返すコードを追加するとこうなります。

```ruby
class TasksController < ApplicationController
  def index
    @tasks = Task.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @tasks }
      format.any { render json: @tasks }
    end
  end
  # ...
end
```

これで、`/hoge/1`のような拡張子の無い URL で json を取得できるようになりました。

## レスポンスの日付文字列を Date オブジェクトに変換する

created_at や updated_at、その他日付時間を Date オブジェクトとして受けとりたいときの対処法です。

DATETIME 型を表す JSON 文字列は、  
レスポンスとしては String で帰って来てしまうので、Backbone は文字列として解釈してしまいます。

比較や計算をするため Date オブジェクトに変換したい場合には、  
`Backbone.Model.prototype.parse`でパースしてあげます。

```javascript
var Task = Backbone.Model.extend({
  urlRoot: "/tasks",

  parse: function(res) {
    if (_.isString(res.created_at)) {
      res.created_at = new Date(res.created_at);
    }
    if (_.isString(res.updated_at)) {
      res.updated_at = new Date(res.updated_at);
    }
    return res;
  }
});
```

送信時は、明示的に文字列に再変換しなくとも文字列化して送信してくれます。
