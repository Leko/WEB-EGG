---
path: /post/introduction-of-emmet/
title: Emmetを始めるのに、とりあえずこれだけ覚えておけば大丈夫
date: 2013-06-27T10:03:48+00:00
twitter_id:
  - "350060043443515393"
dsq_thread_id:
  - "3131429759"
dsq_needs_sync:
  - "1"
image: /images/2013/06/2013062711.jpg
categories:
  - 効率化
tags:
  - CSS
  - Emmet
  - HTML
---
バイト先で「新ゆとり世代」と言われました。れこです。

HTML、CSSを省略して書けるZen-Codingの後見、  
**Emmet**について書こうと思います。

やれCoffeeだTypeScriptだSassだ〜と手をつける前に、  
もっと簡単に、**デメリット無く**作業効率をあげられます。

CoffeeScriptやSassなどのプリプロセッサ系とは違い、  
CoffeeやSassの**知識を開発メンバー全員が持ってないとならず**、  
**結局自由が効かなくなる、ということはありません**。

個人から使えて、チームで使ってもなお良し。

さらに、**展開後のカーソルの位置**がいい感じだったりと、  
**細かい気配りまで完璧**です。

そんなEmmetを  
僕が頻繁に使っている機能に焦点を当てて、紹介したいと思います。

<!--more-->

Emmetの導入
----------------------------------------

Emmetは各種エディタ・IDEのプラグイン形式で配布されています。  
お値段は**無料**です。

Web系の人が使ってそうなエディタについて  
導入方法をざっくり説明します。

### SublimeText2

Package Controlは入っている前提で、  
Ctrl + Shift + Pを押し、Install Packageを選択。  
出てきたリストの中からEmmetを選ぶだけです。

数秒待てばインストールが完了し、もう準備完了です。

> [【便利ツール】Emmetで、ちょっと気持ちいいコーディング with sublime text 2・上巻 ｜ Developers.IO](http://dev.classmethod.jp/tool/emmet-sublimetext2-1/)

### Coda

プラグインページからCoda用プラグインを落としてきて、 それをダブルクリックするだけで準備完了です。

> [もっとコーディングが早くなる「Emmet」の環境設定（coda2）](http://tamshow.com/199)

### Web Storm

**最強**と呼ばれるWeb Stormですが、  
使ったこと無いので導入方法はイマイチわかりません。

> [Enabling Emmet Support](http://www.jetbrains.com/webstorm/webhelp/enabling-emmet-support.html)

### Dreamweaver

> [コーディングが4倍早くなる「zen-coding」をDreamweaver　CS5に導入してみる « WeBridge](http://www.myu-zin.com/webridge/archives/663.html)

### Eclipse

> <span class="removed_link" title="http://www.yuhei-tsukahara.com/2012/11/eclipsezen-coding.html">EclipseにZen Codingをインストールする</span>

基本的な使い方
----------------------------------------

Emmetの使い方は、  
各エディタやOS、設定によって微妙にショートカットが変わる可能性があるので、 もし展開がされなかったら、ググってみてください。

ショートカットは、基本的に`Ctrl + e`になっていると思います。

Emmetのコードを入力して、その行末でショートカット押せば  
カーソル以前のEmmetコードが展開されます。

HTML編
----------------------------------------

EmmetでHTMLを書く際最低限知っておくと便利なのは、

  * HTMLのひな形を一瞬で作れる
  * idは`#`、classは`.`
  * タグを表すための`<`と`>`は不要。タグ名だけでいい
  * 入れ子にする際には`A>B`のように`>`を使う
  * 展開した時に連番にしたいときは`$`を使う
  * 属性を表すときは、`[属性名=値]`と書く。値に`"`は不要
  * 各タグにいい感じにデフォルト属性をつけてくれる

基本これだけで恩恵を受けられます。  
CSSやjQueryを使ったことが有る方なら、すぐ馴染めると思います。

他にも`()`でグループ化したり、`^`で階層を上に戻ったりできますが、  
そこら辺は割愛します。

### 基本形

ごくごくベーシックな例を出すと、

```
link
```

headタグ内に必ず入れると思います。  
これを展開すると、

```html
<link rel="stylesheet" href="">
```

と、`rel="stylesheet"`、`href=""`を付加した状態にしてくれます。

### メニュー

よくあるメニューは、こんな感じになると思います。

```
nav>ul#menu>li*5>a[href=#]
```

`nav`の中に`idがmenu`の`ul`を入れて…という具合です。  
これを展開するとこんな感じになります。

```html
<nav>
    <ul id="menu">
        <li><a href="#"></a></li>
        <li><a href="#"></a></li>
        <li><a href="#"></a></li>
        <li><a href="#"></a></li>
        <li><a href="#"></a></li>
    </ul>
</nav>
```

liに`*5`とついていますが、タグ名の後ろに`*数字`を入れることで、  
**そのタグを指定した数字分繰り返しますよー**  
とうい指定をできます。

### 連番

最近は連番を使う機会があまりないのですが、  
たまに使う時でもあると便利です。 連番を利用するには`$`を使います。

```
.thumb{サンプル$}*6
```

今回はタグ名がありません。  
タグ名を省略すると、デフォルトでは`div`になります。  
ulの中でタグ名を省略すると`li`になったり、だいたいいい感じになります。

```html
<div class="thumb">サンプル1</div>
<div class="thumb">サンプル2</div>
<div class="thumb">サンプル3</div>
<div class="thumb">サンプル4</div>
<div class="thumb">サンプル5</div>
<div class="thumb">サンプル6</div>
```

連番って、行コピー&ペーストする際に、  
さりげなくも、かなり面倒な作業だと思います。

そんなときも、連番にしたい所に`$`を一つ置くだけで連番に出来ます。  
ちなみに`$$`と$を２つ並べると、`01`、`02`、`03`…と２桁の連番になります。

### HTMLのひな形

僕がよく使うDOCTYPE宣言は、`HTML4.01 transitional`と`HTML5`なので、  
とりあえずそれだけ説明します。

```
!
```

なんと1文字です。びっくり。  
これを展開するとHTML5のひな形が出来ます。

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>

</body>
</html>
```

**文字コード指定のmetaタグまで入れてくれます!!！**

デフォルトだと英語なのでlangがenになってしまいますが、  
設定ファイルを数文字書き換えるだけでjaにできます。

> [新規テキスト ドキュメント (128).txt: Sublime Text 2 ： Emmet プラグインが出力する HTML の言語を修正する](http://128txt.blogspot.com/2012/12/sublime-text-2-emmet-html.html)

次に、HTML 4.01 transitionalはこうです。

```
html:4t
```

これがやや覚えにくいのですが、  
IEが居る限り4.01と戦わざるを得ません。**何とか覚えましょう**。  
展開すると以下のようになります。

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>Document</title>
</head>
<body>

</body>
</html>
```

XHTML transitionalにしたい場合は、`html:xt`です。

CSS編
----------------------------------------

Emmetの記事はHTMLについて書かれている場合が結構多いのですが、  
個人的には**Emmetの真価はCSSにある**と思ってます。

EmmetでCSSを書く時に意識すべきことは、

* 複数行まとめて展開は出来ない
* 基本的に`-`で繋がるプロパティ名は、**頭文字**を打てばOK
* 先頭に`-`を打つと、**ベンダープレフィックス**を適切に入れてくれる

です。

慣れるまでは「むしろ面倒」と思うかもしれませんが、  
慣れると、いちいちプロパティ名をフルで打つのがアホらしくなってきます。

### 基本形

EmmetのCSSの基本形は、こんな感じです。

```
tac
```

唐突すぎてわけがわかりませんね。展開してみます。

```css
text-align: center;
```

**t**ext-**a**lign: **c**enter; と、  
頭文字をつないだ文字列になっています。

他にも例を出していきます。

```
db => display: block;
m:a => margin: auto;
tdn => text-decoration: none;
posl => position: relative;
poa => position: absolute;
pf => position: fixed;
w100 => width: 100px;
fsz12 => font-size: 12px;
fsz12pt => font-size: 12pt;
```

このように、被るプロパティ名が多い頭文字は  
少し長めに打たないと行けないのですが、**たかだか5文字**程度です。

単位は、多くの場合  
省略しても`px`を入れてくれるので数字だけ打てばOK。

他の単位を利用したい場合、明示的に書いてあげればそちらが優先されます。

### +を最後につける書き方

僕も最近知りました。  
上記の指定に`+`を組み合わせられるものがあります。  
backgroundなどを一括指定する場合に使うことが多いかと思います。

```
bg+ => background: #fff url() 0 0 no-repeat;
f+ => font: 1em Arial,sans-serif;
bd+ => border: 1px solid #000;
```

### ベンダープレフィックス

CSS3を使うのがやや億劫な理由の一つ、  
ベンダープレフィックスさんにもしっかり対応しています。

Sublime Text2のように、複数カーソルに対応したエディタなら、  
**値を一度に指定**できます。

ただでさえ捗るのに、**さらに捗ります**。

#### box-sizing

```css
-bx

-webkit-box-sizing: border-box;
-moz-box-sizing: border-box;
box-sizing: border-box;

-bxc

-webkit-box-sizing: content-box;
-moz-box-sizing: content-box;
box-sizing: content-box;
```

#### box-shadow

```css
-bxs

-webkit-box-shadow: inset hoff voff blur color;
-moz-box-shadow: inset hoff voff blur color;
box-shadow: inset hoff voff blur color;
```

#### transition

```css
-trans

-webkit-transition: prop time;
-moz-transition: prop time;
-ms-transition: prop time;
-o-transition: prop time;
transition: prop time;
```

#### border-RADIUS

```css
-dbrs

-webkit-border-radius: ;
-moz-border-radius: ;
border-radius: ;

-bdrs10

-webkit-border-radius: 10px;
-moz-border-radius: 10px;
border-radius: 10px;
```

などなど。  
お分かりだと思いますが、全部が全部に付けるのではなく、  
**必要な分だけプレフィックスを付け**てくれます。

これは、ブラウザの進化ごとに、  
Emmetもアップデートする形で変更されると思うので、 ちょくちょくアップデートをかけたほうが良さそうです。

自分なりの使い方
----------------------------------------

Emmetを覚えて使うようになってから、 気にしているやEmmetが有効なタイミングも書いておきます。

### 展開するときに、展開前のEmmetコードを残しておく

これはコーディングする際かなり重宝しています。

htmlに展開してみて、「**あ、ここの構造ミスったな**」と思った時に、  
展開前のEmmetコードを残しておくと、修正が非常に容易です。

特に、繰り返しのliタグの中身なんかを修正した際、  
いちいち修正後をコピーして、１行ずつ貼り付け  
なんてことをしなくて済みます。

### スニペット管理

素のhtmlは、**見ればわかるのに、やたらと行数を取ります。**  
**Emmetのコードとして１行で残いておいて、貼り付けて、展開**  
とすると、管理もしやすいし、**何よりかさばりません**。

### ちょっとした説明に

htmlやjsの話をチャットなどでしている時に、  
html構造やclass、idさえ伝われば良いのに、  
いちいちhtmlを書くのは冗長です。

そんなときにEmmetのコードで表現すると、  
**簡潔かつ要所を的確に**伝えることができます。

「メニューののhtmlどうなってる？」  
「`nav>ul>li*3>a[href=#]`だよー」  
と言った具合に。

まとめ
----------------------------------------

ほぼ100％使用する機能しか触れていないので、  
紹介がけっこう浅くなってしまいました。

「こういうのないの!?」と思われたら、[公式のチートシート](http://docs.emmet.io/cheat-sheet/)を見てみて下さい。  
めちゃくちゃな数があります。とても覚えきれません。  
要所要所見て覚えてみて下さい。

formやinputタグ回りや、CSSの面白い省略記法などアリアリです。

あと、日本語化で少し触れましたが、  
自分流の**カスタマイズも手軽**にできるので、  
チームで共有したりなんだりして、コーディングの効率をあげましょう!!！
