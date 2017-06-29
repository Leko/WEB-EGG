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
  
「[JavaScriptパターン――優れたアプリケーションのための作法](http://www.oreilly.co.jp/books/9784873114880/)」という本を読んでいます。

この本は、JavaScriptでのコーディングパターンや、 Javascriptに限らず広義の意味での「パターン」を取り扱っている書籍です。

この本の中に、**クラシカルな継承パターン**というものがあります。
  
クラシカルな継承パターンとは、ざっくり言うと

> JavaScriptにクラスの概念は無いけれど、
  
> 長年クラスベースの言語を触ってきた人たちがjsを触るときに馴染みやすいように、
  
> クラスや継承のような機能を提供するパターン

だと僕は解釈しました。

このクラシカルな継承パターンを読んで、
  
**CoffeeScriptやTypeScriptでのclass記法や継承パターンは、jsに変換するとどう表現されるのか**
  
が気になったため、調査してみました。

<!--more-->

目標
----------------------------------------

当記事の目標は、
  
**Javascriptにおける「クラス」の概念と継承のパターンが分かるようになる**
  
ことです。

当記事では、CoffeeScriptやTypeScriptについては、あまり深く触れませんので予めご了承下さい。

Javascriptにはclassや継承の概念は無い
----------------------------------------

当記事を読んでいる方ならご存知かと思いますが、
  
JavaScriptはプロトタイプベースのオブジェクト指向言語であり、
  
**クラスや継承という概念はありません**。

ここがjsの癖となる点の１つだと思います。
  
しかし、クラスや継承といった技法が実現不可能なわけではなく、
  
プロトタイプを上手く用いることで**クラスのようなオブジェクトを作るも**、それらの**継承も可能**です。

ただし、繰り返しになりますが
  
言語の概念として、クラスや継承が存在していないので、
  
あくまで**それらに似た振る舞いを再現**できる、というだけです。

「Javascriptパターン」による”聖杯パターン”
----------------------------------------

JavaScriptパターンから引用すると、
  
「クラシカルな継承のパターン」の模範解答は、以下のようになります。

```javascript
 // 継承を行う関数 var inherit = (function() { var F = function() {}; return function(C, P) { F.prototype = P.prototype; C.prototype = new F(); C.uber = P.prototype; C.prototype.constructor = C; } })(); // Personクラス(のようなオブジェクト(以下省略)) function Parent() {} Parent.prototype.say = function() { return this.name; }; // Childクラス function Child(name) { this.name = name; // 親のコンストラクタを拝借する Parent.apply(this); } // 継承 inherit(Child, Parent); // インスタンスを作成 var kid = new Child('Bob'); console.log(kid.say()); // 'Bob' 
```

上記のように、
  
Childクラスは、sayメソッドを持っていませんが、
  
Childクラスのインスタンスである`kid`は、sayメソッドをParentクラスのプロトタイプから利用することができます。

明示的にクラスです！と宣言する文法がないため、文法は他の言語と大きく異なりますが、
  
これでおおよそクラスと継承の機構が再現出来ていると思います。

クロージャを利用すれば、プライベートメンバ・メソッドを定義することも可能です。

それはさておき、ここで重要なのが、継承を行う関数`inherit()`です。

```javascript
 var inherit = (function() { var F = function() {}; // CとPのプロキシとなる関数F return function(C, P) { F.prototype = P.prototype; // Fのプロトタイプオブジェクトを親と共有する C.prototype = new F(); // 子のプロトタイプオブジェクトは、Fのインスタンスを設定 C.uber = P.prototype; // スーパークラス(uberという名前にする)には親のプロトタイプを設定 C.prototype.constructor = C; // コンストラクタのポインタを再設定する } })(); 
```

このinherit()は、

  * 親と子のプロトタイプの共有を切りつつ、プロトタイプ連鎖の利点は残す
  * 親のメンバ(this.XXX)を継承する

ために、子と親をつなぐプロキシとなる関数F()を作成します
  
この関数Fを利用することで、プロトタイプの共有を切りつつも、親のメンバを共有することが可能になります。

※当記事はjsでのコーディングパターンが主旨なので、
  
jsのプロトタイプチェインについて詳しくは触れません。
  
プロトタイプ連鎖については、以下の記事が参考になるかと思います。

  * [JavaScriptのプロトタイプチェインをちゃんと理解する – builder](http://builder.japan.zdnet.com/script/sp_javascript-kickstart-2007/20369792/)

Coffeescriptでのclassと継承
----------------------------------------

お待たせしました。
  
長い前置きを終えて、本題です。

CoffeeScriptやTypescriptなどの言語では、
  
これらのややこしくて面倒なことを気にせずに、
  
**class~extendsという文だけでjsでクラス(のようなオブジェクト)を使用出来ます**。

CoffeeScriptでクラスと継承を用いた例が、以下となります。
  
(CoffeeScript.orgの[Classes](http://coffeescript.org/#classes)の説明から持ってきて一部改変)

```coffeescript
 class Parent constructor: (@name) -> move: (meters) -> console.log @name + ” moved #{meters}m.” class Child extends Parent move: -> console.log “slithering…” super 5 child = new Child() child.move() 
```

ものすごくシンプルです。
  
だって`class`とか`extends`って文法が使えるんですもん。

たったこれだけで、クラスの定義と継承を行うことができます。

次は、TypeScriptでの例を見てみます。

TypeScriptでのclassと継承
----------------------------------------

比較しやすいように、CoffeeScriptの例と同じものをTypeScriptで書き直しました。
  
※TypeScriptはまだ初心者なので、書き違いがあったらすみません。

TypeScriptでのクラスの定義と継承の例は以下となります。

```javascript
 class Parent { name: string; constructor(name: string) { this.name = name; } move(meters: number): void { console.log(this.name + ” moved ” + meters + “m.”); } } class Child extends Parent { move(): void { console.log(“slithering…”); super.move(5); } } var child: Child = new Child(); child.move(); 
```

ややコード量が増えていますが、とても見やすいです。
  
TypeScriptでも、`class`と`extends`を使用することができます。

CoffeeScriptやTypeScirptでは、prototypeだの継承だのといったややこしい処理は、
  
jsにコンパイルする際に、**特定の表現と、継承を行う汎用関数を吐き出し**て、それを利用しています。

次に、この`特定の表現`と`汎用関数`がどう実装されているのかを見ていきます。

継承を行う汎用関数の比較
----------------------------------------

### CoffeeScriptバージョン

まずはCoffeeScriptバージョンを見ていきます。

```javascript
 var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }; 
```

`__hasProp`は、安全で確実に`Object.hasOwnProperty()`を呼ぶためのショートカットです。
  
肝心の継承を行う関数が、`__extends(child, parent)`です。

JavaScriptパターンの聖杯バージョンに出てきた
  
`inherit(Child, Parent)`と、順序は違うけれど似ていますね。

inherit()と異なる点は、for文を用いて**親のメンバを子にコピーしている**箇所です。

実はこのパターンも、JavaScriptパターンで出てきます。
  
「プロパティのコピーによる継承」と題されており、
  
プロパティのコピーを行う関数`extend()`を実装しています。

書籍のコード少し改造した例が以下となります。

```javascript
 function extend(parent, child) { var hasProp = {}.hasOwnProperty, p; child = child || {}; for ( p in parent ) { if ( hasProp.call(parent, p) ) { child[i] = parent[i]; } } return child; } 
```

もうお分かりかと思いますが、Coffee版に出てくるfor文と同じです。

この**extend()と、inherit()を合体させた関数**が、
  
CoffeeScriptにおける継承用の関数`__extends`となっています。

### TypeScriptバージョン

では、次にTypeScriptバージョンを見てみます。

```javascript
 var __extends = this.__extends || function (d, b) { function __() { this.constructor = d; } __.prototype = b.prototype; d.prototype = new __(); }; 
```

TypeScriptの方はややシンプルです。
  
ですが、やっていることはほぼ変わりません。

そしてさりげなく、__extendsという**関数が未定義の時のみ独自定義を行う**といった気配りが入っています。

TypeScriptで継承を行う関数`__extends()`では、
  
JavaScriptパターンでの`inherit()`を少し簡略化したものとなっています。

クラスの定義とsuperオブジェクト
----------------------------------------

また、クラスの定義や、super(親クラスへの参照)の表現も調査してみました。
  
CoffeeScriptもTypeScriptもほぼ同様の表現になっています。

下記はCoffeeScriptの先程の例のクラス部分をjsにコンパイルしたコードです。

```javascript
 var Parent = (function () { function Parent(name) { this.name = name; } Parent.prototype.move = function (meters) { console.log(this.name + ” moved ” + meters + “m.”); }; return Parent; })(); var Child = (function (_super) { __extends(Child, _super); function Child() { _super.apply(this, arguments); } Child.prototype.move = function () { console.log(“slithering…”); _super.prototype.move.call(this, 5); }; return Child; })(Parent); 
```

まず、`var クラス名 = (function() {})();`とクラスの定義を即時関数に包み、
  
その中で`function クラス名()`と関数を**再定義**しています。
  
これにより、今後コンストラクタ関数(クラス名)を呼び出す際には、**内側の関数が呼び出されます**。

継承を行う子クラスでは、即時関数の引数に`_super`を取っています。
  
この_superは、親クラスのコンストラクタ関数を指しています。
  
この親コンストラクタ関数を、継承を行う関数\_\_extendsを通じて、 子クラスの\_\_super__オブジェクトに設定しています。

そして、\_\_super\_\_オブジェクトを経由して、
  
子クラスから親クラスのプロトタイプ上に存在するプロパティを利用します。

この書き方はTypeScriptでもほぼ同様の表現になっており、

  * \_superを\\_\_super\_\_等のオブジェクトに格納せずに直接使う
  * 用いている変数名が若干異なる

程度の違いがありますが、同様のパターンとみなすことができます。

まとめ
----------------------------------------

jsで、継承を行うためには、

  * 親と子のプロキシとなる関数(CoffeeScriptでは`ctor()`、TypeScriptでは`__()`)を定義
  * プロキシ関数のprototypeに親のprototypeを設定
  * 子のprototypeにプロキシ関数のインスタンスを設定

の３ステップが最低限必要となります。 ここに、上乗せとして

  * コンストラクタのポインタを再設定
  * 親から子へプロパティのコピー

などが乗っかって来るようです。

また、クラスの表現方法は、
  
CoffeeScript、TypeScript共にほぼ同じなので、 上記のような書き方をしておくのがベターだと思います。

なお、今回は
  
**クラスのようなオブジェクトと継承の表現**について書きましたが、

JavaScriptにはprototypeを用いた柔軟な継承の表現が他にもあります。
  
今回の例はあくまで**jsで”クラス”っぽいことがやりたい人**向けの内容であることをご留意下さい。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>