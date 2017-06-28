---
path: /post/test-backbone-with-sinon/
title: Backbone.js×sinon.jsのテストでspyが上手く動かない時のメモ
date: 2013-03-22T16:13:26+00:00
twitter_id:
  - "315010080506515456"
image: /images/2013/03/20130322_backbone1.jpg
categories:
  - 問題を解決した
tags:
  - Backbone.js
  - JavaScript
  - Mocha
  - sinon.js
---
こんにちは。

最近、[Backbone.js](http://backbonejs.org/)というライブラリを使って、制作をしています。

Backboneいいですね〜。
  
各UIパーツの結合度が下がるので、
  
全体の見通しが良くなり、メンテもしやすくなります。

今作っているものはそこまで規模が大きいものではないのですが、
  
大規模js開発入門ということで。

それに加えて、先日[JavaScript道場](http://connpass.com/event/1664/)に行ってきてから、
  
jsの開発でもテストコードを書くようにしています。

[師範に習った](http://hokaccha.github.com/slides/javascript_design_and_test/)とおり、
  
_<span class="removed_link" title="http://visionmedia.github.com/mocha/">mocha</span>_ + _[expectjs](https://github.com/LearnBoost/expect.js/blob/master/README.md)_ + _[sinonjs](http://sinonjs.org/)_を用いてユニットテストを書いているのですが、
  
そのテストを書いている時に、sinonjsのspyで詰まったのでメモ。

<!--more-->

## sinonjs spyの使い道・使い方

そもそも、**sinonjs**とは何か。 
  
そしてその中の**spy**という機能は何なのかをざっと。

sinonjsとは、テストダブルのライブラリのことです。

> テストダブル (Test Double) とは、ソフトウェアテストにおいて、テスト対象が依存しているコンポーネントを置き換える代用品のこと。ダブルは代役、影武者を意味する。 &#8211; テストタブル &#8211; wikipedia
  
> [フロントエンドJavaScriptにおける設計とテスト](http://hokaccha.github.com/slides/javascript_design_and_test/#page93)

すごくざっくり言うと、**テスト用の便利なライブラリ**です。

そして、そんなsinonjsのspyという機能は、 その名の通り**スパイをしてくれます。**

何のスパイをするかというと、任意の関数に忍び込ませて、

  * その関数が呼ばれたか否か
  * 合計で何回関数が呼ばれているか
  * その引数は何か

などなどを調べることが出来るのが、spyです。

ざっくりした使い方を書くと、

<div>
  

```javascript
 it(&#8216;sinon.spyのテスト&#8217;, function() { var hoge, spy; hoge = { foo: function() { return true; } }; spy = sinon.spy(hoge, &#8216;foo&#8217;); hoge.foo(); return expect(spy.calledOnce).to.be.ok(); }); 
```

</div>

という感じに書けます。

```
spy = sinon.spy( object, 'proterty' );
```

というふうに書くと、object.propertyを監視出来ます。 この感じで、Backboneのon系のコールバックも見れるんじゃないかと思ったら、詰まりました。

これで動くんじゃないの？→動かない
----------------------------------------

動かなかったコードを簡略化したものがこちらです。

少し長いのでCoffeeScriptで書きます。

<div>
  

```coffeescript
 describe &#8216;Backbone * sinon.spy&#8217;, -> Model = Backbone.Model.extend defaults: name: &#8216;hoge&#8217; View = Backbone.View.extend initialize: -> _.bindAll @, &#8216;render&#8217; @model.on &#8216;change:name&#8217;, @render render: -> @$el.html @model.get(&#8216;name&#8217;) before -> @view = new View( model: new Model() ) @spy = sinon.spy( @view, &#8216;render&#8217; ) after -> @spy.restore() it &#8216;Modelモデルが変更された時View.renderが呼ばれる&#8217;, -> @view.model.set(&#8216;name&#8217;, &#8216;leko&#8217;) expect(@spy.calledOnce).to.be.ok() 
```

</div>

実行してみると、通りません。。

<img src="/images/2013/03/mocha_ng.png" alt="Mocha ng" title="mocha_ng.png" border="0" width="600" height="227" />

Backboneを理解されてる方なら
  
「初心者乙」
  
で終わってしまうのかもしれませんが、Backbone初心者だから仕方ない。

先ほどの例のように、

```
spy = sinon.spy(view, 'render')
```

と指定したので、
  
view.renderが呼ばれたらspy.calledOnceはtrueになるはず。
  
console.logなどを挟んで関数が呼ばれているか試したところ、呼ばれていました。 しかし、spy上では呼ばれたことになっていません。ここで詰まりました。

解決策
----------------------------------------

なるべく英語は読みたくない（読めない）ので、 日本語の記事が無いか探してみたんですが、無さそうでした。

英語記事を漁っていると、StackOverFlowに
  
似た悩みを抱えた質問と解答が寄せられていました。

> [javascript &#8211; Backbone.js view tests using Sinon Spies in a browser &#8211; Stack Overflow](http://stackoverflow.com/questions/9623986/backbone-js-view-tests-using-sinon-spies-in-a-browser)

結論を先に書くと、先ほどのコード、惜しい感じでした。

間違っていたのは、spyの設定の仕方でした。

<div>
  

```coffeescript
 # 間違い before -> @view = new View( model: new Model() ) @spy = sinon.spy( @view, &#8216;render&#8217; ) # 合ってる before -> @spy = sinon.spy( View.prototype, &#8216;render&#8217; ) @view = new View( model: new Model() ) 
```

</div>

実行してみると、通ります。

<img src="/images/2013/03/mocha_ok.png" alt="Mocha ok" title="mocha_ok.png" border="0" width="380" height="56" />

このように、インスタンス化したオブジェクトにspyを忍び込ませるのではなく、
  
**コンストラクタ関数のprototypeにspyを設定して、
  
その後にインスタンスを生成するとうまく動くようです。**

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>