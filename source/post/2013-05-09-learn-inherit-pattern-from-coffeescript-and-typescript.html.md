---
path: /post/learn-inherit-pattern-from-coffeescript-and-typescript/
title: CoffeescriptとTypescriptから学ぶjsでのクラス・継承パターン
date: 2013-05-09T12:30:22+00:00
twitter_id:
  - "332336901405167617"
image: /images/2013/05/20130509_inheritance1.png
categories:
  - 考えてみた
tags:
  - JavaScript
---

こんにちは。  
最近、オライリー・ジャパンの  
「[JavaScript パターン――優れたアプリケーションのための作法](http://www.oreilly.co.jp/books/9784873114880/)」という本を読んでいます。

この本は、JavaScript でのコーディングパターンや、 Javascript に限らず広義の意味での「パターン」を取り扱っている書籍です。

この本の中に、**クラシカルな継承パターン**というものがあります。  
クラシカルな継承パターンとは、ざっくり言うと

> JavaScript にクラスの概念は無いけれど、  
> 長年クラスベースの言語を触ってきた人たちが js を触るときに馴染みやすいように、  
> クラスや継承のような機能を提供するパターン

だと僕は解釈しました。

このクラシカルな継承パターンを読んで、  
**CoffeeScript や TypeScript での class 記法や継承パターンは、js に変換するとどう表現されるのか**  
が気になったため、調査してみました。

<!--more-->

## 目標

当記事の目標は、  
**JavaScript における「クラス」の概念と継承のパターンが分かるようになる**  
ことです。

当記事では、CoffeeScript や TypeScript については、あまり深く触れませんのであらかじめご了承下さい。

## JavaScript には class や継承の概念は無い

当記事を読んでいる方ならご存知かと思いますが、  
JavaScript はプロトタイプベースのオブジェクト指向言語であり、  
**クラスや継承という概念はありません**。

ここが js の癖となる点の１つだと思います。  
しかし、クラスや継承といった技法が実現不可能なわけではなく、  
プロトタイプを上手く用いることで**クラスのようなオブジェクトを作るも**、それらの**継承も可能**です。

ただし、繰り返しになりますが  
言語の概念として、クラスや継承が存在していないので、  
あくまで**それらに似た振る舞いを再現**できる、というだけです。

## 「JavaScript パターン」による"聖杯パターン"

JavaScript パターンから引用すると、  
「クラシカルな継承のパターン」の模範解答は、以下のようになります。

```javascript
// 継承を行う関数
var inherit = (function() {
  var F = function() {};
  return function(C, P) {
    F.prototype = P.prototype;
    C.prototype = new F();
    C.uber = P.prototype;
    C.prototype.constructor = C;
  };
})();
// Personクラス(のようなオブジェクト(以下省略))
function Parent() {}
Parent.prototype.say = function() {
  return this.name;
};
// Childクラス
function Child(name) {
  this.name = name;
  // 親のコンストラクタを拝借する
  Parent.apply(this);
}
// 継承
inherit(Child, Parent);
// インスタンスを作成
var kid = new Child("Bob");
console.log(kid.say()); // 'Bob'
```

上記のように、  
Child クラスは、say メソッドを持っていませんが、  
Child クラスのインスタンスである`kid`は、say メソッドを Parent クラスのプロトタイプから利用できます。

明示的にクラスです！ と宣言する文法がないため、文法は他の言語と大きく異なりますが、  
これでおおよそクラスと継承の機構が再現出来ていると思います。

クロージャを利用すれば、プライベートメンバー・メソッドを定義することも可能です。

それはさておき、ここで重要なのが、継承を行う関数`inherit()`です。

```javascript
var inherit = (function() {
  var F = function() {};
  // CとPのプロキシとなる関数F
  return function(C, P) {
    F.prototype = P.prototype;
    // Fのプロトタイプオブジェクトを親と共有する
    C.prototype = new F();
    // 子のプロトタイプオブジェクトは、Fのインスタンスを設定
    C.uber = P.prototype;
    // スーパークラス(uberという名前にする)には親のプロトタイプを設定
    C.prototype.constructor = C;
    // コンストラクタのポインタを再設定する
  };
})();
```

この inherit()は、

- 親と子のプロトタイプの共有を切りつつ、プロトタイプ連鎖の利点は残す
- 親のメンバー(this.XXX)を継承する

ために、子と親をつなぐプロキシとなる関数 F()を作成します  
この関数 F を利用することで、プロトタイプの共有を切りつつも、親のメンバーを共有することが可能になります。

※当記事は js でのコーディングパターンが主旨なので、  
js のプロトタイプチェインについて詳しくは触れません。  
プロトタイプ連鎖については、以下の記事が参考になるかと思います。

- [JavaScript のプロトタイプチェインをちゃんと理解する – builder](http://builder.japan.zdnet.com/script/sp_javascript-kickstart-2007/20369792/)

## Coffeescript での class と継承

お待たせしました。  
長い前置きを終えて、本題です。

CoffeeScript や Typescript などの言語では、  
これらのややこしくて面倒なことを気にせずに、  
**class~extends という文だけで js でクラス(のようなオブジェクト)を使用出来ます**。

CoffeeScript でクラスと継承を用いた例が、以下となります。  
(CoffeeScript.org の[Classes](http://coffeescript.org/#classes)の説明から持ってきて一部改変)

```coffeescript
class Parent
  constructor: (@name) ->
  move: (meters) ->
    console.log @name + " moved #{meters}m."

class Child extends Parent
  move: ->
    console.log "slithering…"
    super 5

child = new Child()
child.move()
```

ものすごくシンプルです。  
だって`class`とか`extends`って文法が使えるんですもん。

たったこれだけで、クラスの定義と継承を行うことができます。

次は、TypeScript での例を見てみます。

## TypeScript での class と継承

比較しやすいように、CoffeeScript の例と同じものを TypeScript で書き直しました。  
※TypeScript はまだ初心者なので、書き違いがあったらすみません。

TypeScript でのクラスの定義と継承の例は以下となります。

```javascript
class Parent {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  move(meters: number): void {
    console.log(this.name + " moved " + meters + "m.");
  }
}
class Child extends Parent {
  move(): void {
    console.log("slithering… ");
    super.move(5);
  }
}
var child: Child = new Child();
child.move();
```

ややコード量が増えていますが、とても見やすいです。  
TypeScript でも、`class`と`extends`を使用できます。

CoffeeScript や TypeScirpt では、prototype だの継承だのといったややこしい処理は、  
js にコンパイルする際に、**特定の表現と、継承を行う汎用関数を吐き出し**て、それを利用しています。

次に、この`特定の表現`と`汎用関数`がどう実装されているのかを見ていきます。

## 継承を行う汎用関数の比較

### CoffeeScript バージョン

まずは CoffeeScript バージョンを見ていきます。

```javascript
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) child[key] = parent[key];
    }

    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  };
```

`__hasProp`は、安全で確実に`Object.hasOwnProperty()`を呼ぶためのショートカットです。  
肝心の継承を行う関数が、`__extends(child, parent)`です。

JavaScript パターンの聖杯バージョンに出てきた  
`inherit(Child, Parent)`と、順序は違うけれど似ていますね。

inherit()と異なる点は、for 文を用いて**親のメンバーを子にコピーしている**箇所です。

実はこのパターンも、JavaScript パターンで出てきます。  
「プロパティのコピーによる継承」と題されており、  
プロパティのコピーを行う関数`extend()`を実装しています。

書籍のコード少し改造した例が以下となります。

```javascript
function extend(parent, child) {
  var hasProp = {}.hasOwnProperty,
    p;
  child = child || {};
  for (p in parent) {
    if (hasProp.call(parent, p)) {
      child[i] = parent[i];
    }
  }
  return child;
}
```

もうお分かりかと思いますが、Coffee 版に出てくる for 文と同じです。

この**extend()と、inherit()を合体させた関数**が、  
CoffeeScript における継承用の関数`__extends`となっています。

### TypeScript バージョン

では、次に TypeScript バージョンを見てみます。

```javascript
var __extends =
  this.__extends ||
  function(d, b) {
    function __() {
      this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
  };
```

TypeScript の方はややシンプルです。  
ですが、やっていることはほぼ変わりません。

そしてさりげなく、\_\_extends という**関数が未定義の時のみ独自定義を行う**といった気配りが入っています。

TypeScript で継承を行う関数`__extends()`では、  
JavaScript パターンでの`inherit()`を少し簡略化したものとなっています。

## クラスの定義と super オブジェクト

また、クラスの定義や、super(親クラスへの参照)の表現も調査してみました。  
CoffeeScript も TypeScript もほぼ同様の表現になっています。

下記は CoffeeScript の先程の例のクラス部分を js にコンパイルしたコードです。

```javascript
var Parent = (function() {
  function Parent(name) {
    this.name = name;
  }
  Parent.prototype.move = function(meters) {
    console.log(this.name + " moved " + meters + "m.");
  };
  return Parent;
})();
var Child = (function(_super) {
  __extends(Child, _super);

  function Child() {
    _super.apply(this, arguments);
  }
  Child.prototype.move = function() {
    console.log("slithering… ");
    _super.prototype.move.call(this, 5);
  };
  return Child;
})(Parent);
```

まず、`var クラス名 = (function() {})();`とクラスの定義を即時関数に包み、  
その中で`function クラス名()`と関数を**再定義**しています。  
これにより、今後コンストラクタ関数(クラス名)を呼び出す際には、**内側の関数が呼び出されます**。

継承を行う子クラスでは、即時関数の引数に`_super`を取っています。  
この\_super は、親クラスのコンストラクタ関数を指しています。  
この親コンストラクタ関数を、継承を行う関数**extends を通じて、 子クラスの**super\_\_オブジェクトに設定しています。

そして、**super**オブジェクトを経由して、  
子クラスから親クラスのプロトタイプ上に存在するプロパティを利用します。

この書き方は TypeScript でもほぼ同様の表現になっており、

- \_super を**super**等のオブジェクトに格納せずに直接使う
- 用いている変数名が若干異なる

程度の違いがありますが、同様のパターンとみなすことができます。

## まとめ

js で、継承を行うためには、

- 親と子のプロキシとなる関数(CoffeeScript では`ctor()`、TypeScript では`__()`)を定義
- プロキシ関数の prototype に親の prototype を設定
- 子の prototype にプロキシ関数のインスタンスを設定

の３ステップが最低限必要となります。 ここに、上乗せとして

- コンストラクタのポインタを再設定
- 親から子へプロパティのコピー

などが乗っかって来るようです。

また、クラスの表現方法は、  
CoffeeScript、TypeScript 共にほぼ同じなので、 上記のような書き方をしておくのがベターだと思います。

なお、今回は  
**クラスのようなオブジェクトと継承の表現**について書きましたが、

JavaScript には prototype を用いた柔軟な継承の表現が他にもあります。  
今回の例はあくまで**js で"クラス"っぽいことがやりたい人**向けの内容であることをご留意下さい。
