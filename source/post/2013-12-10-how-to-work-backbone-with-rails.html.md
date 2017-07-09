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
Ruby on RailsはシンプルなAPIだけ構えておいて、  
Backbone.jsをAPIクライアントとして連携させる際に

Railsでコントローラをscaffoldしただけでは上手く動かなかったため、  
対処したことをメモしておきます。 

<!--more-->

各ライブラリのバージョン
----------------------------------------

使用している言語やライブラリのバージョンは以下のようになっています。

| 項目            | バージョン |
|:------------- | -----:|
| Backbone.js   | 1.1.0 |
| jQuery        | 2.1.0 |
| Ruby          | 1.9.3 |
| Ruby on Rails | 3.2.8 |

Backbone側をあまりゴリゴリといじらず、  
設定だけ書いておけばAjax出来る状態にしたいので、Rails側を調整していきます。

APIにアクセスする際に拡張子を省略
----------------------------------------

Backbone.Syncのデフォルトだと、  
Ajaxの叩き先が`GET /[name]s`となったり`POST /[name]s`等になっており、  
scaffoldしたままのRailsのコントローラでは、**拡張子を指定しないとレスポンスが返って来ません**。

どちらかを修正すれば済むので、今回はRails側を修正します。

まず、Web APIが返すレスポンスのフォーマットは、  
`respond_doブロック`の中に入っている`format.*`という指定で決まります。

`format.*`がアクセスする際の拡張子、  
`render *`がレスポンスとして返されるフォーマットです。

scaffoldされたコードは、こんな感じになっていると思います。

```ruby
class TasksController &lt; ApplicationController
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

この指定だと、URLに`.html`と`.json`の拡張子をつけると、 それぞれそのフォーマットで返してくれるようになっています。

ただし、**それ意外の拡張子（指定なしを含む）を指定した場合、何も返って来ません。**

ということで、全ての拡張子にマッチする指定してあげれば、うまくいきます。

RailsのWeb APIのデフォルトフォーマットを指定する
----------------------------------------

> respond_to でデフォルトフォーマットを指定する - The Second Longest Day in My Life...  
> http://d.hatena.ne.jp/tnksaigon/20110124/1295839007

こちらの記事によると、respond_doの中に、`format.any`という指定ができるそうです。

anyを指定すると、any以前に書いてあるフォーマット(`.html`, `.json`)にマッチしない全てのフォーマットに適用されます。  
つまり、拡張子を省略した場合はこのanyで返されるフォーマットが適用されることになります。

先ほどのコードにanyでjsonを返すコードを追加するとこうなります。

```ruby
class TasksController &lt; ApplicationController
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

これで、`/hoge/1`のような拡張子の無いURLでjsonを取得できるようになりました。

レスポンスの日付文字列をDateオブジェクトに変換する
----------------------------------------

created_atやupdated_at、その他日付時間をDateオブジェクトとして受けとりたいときの対処法です。

DATETIME型を表すJSON文字列は、  
レスポンスとしてはStringで帰って来てしまうので、Backboneは文字列として解釈してしまいます。

比較や計算をするためDateオブジェクトに変換したい場合には、  
`Backbone.Model.prototype.parse`でパースしてあげます。

```javascript
var Task = Backbone.Model.extend({
    urlRoot: '/tasks',

    parse: function(res) {
        if(_.isString(res.created_at)) {
            res.created_at = new Date(res.created_at);
        }
        if(_.isString(res.updated_at)) {
            res.updated_at = new Date(res.updated_at);
        }
        return res;
    }
});
```

送信時は、明示的に文字列に再変換しなくとも文字列化して送信してくれます。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>