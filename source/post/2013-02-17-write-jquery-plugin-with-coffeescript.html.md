---
path: /post/write-jquery-plugin-with-coffeescript/
title: CoffeeScriptでjQueryプラグインを書いてみて思ったこと
date: 2013-02-17T18:14:37+00:00
twitter_id:
  - "303072641877684225"
dsq_thread_id:
  - "3132332451"
image: /images/2013/02/20130217_eye11-604x244.jpg
categories:
  - 考えてみた
tags:
  - CoffeeScript
  - JavaScript
  - jQuery
---
<section id="intro">こんにちは。昼夜逆転が一周してやっと普通の生活に戻って来ました。れこです最近、CoffeeScriptというJavaScriptのライブラリにハマっています。半年前くらいに流行った、賛否両論なjsライブラリです。非常にシンプルにjsを書くことができて、Ruby on Railsでも公式採用されています。そのCoffeeScriptでjQueryのプラグインを１つ書いてみてCoffeeScriptで開発していくことについて感じたことをメモします。CoffeeScriptやjQueryプラグインの基礎については特に触れません。ご了承下さい。</p> </section> 

<!--more-->

<section id="learn"> ## CoffeeScriptとは CoffeeScriptについてざっと調べて試したことを発表した時の資料を載せます。 

<div style="margin-bottom:5px">
  <div style="margin-bottom:5px">
    <strong><a href="http://www.slideshare.net/L_e_k_o/lt7-hello-coffee" title="LT#7 Hello coffeeしてきた" target="_blank">LT#7 Hello coffeeしてきた</a></strong> from <strong><a href="http://www.slideshare.net/L_e_k_o" target="_blank">Shingo Inoue</a></strong>
  </div> スライドでも言ってますが、CoffeeScriptはJavaScriptを楽にシンプルに書けるライブラリです。おおまかな特徴は、 1. 文法はRubyやPythonに近い 2. 関数呼び出しの際に引数の括弧を省略できる 3. インデントでループや関数などのブロックを表現する 4. 行末のセミコロンやオブジェクトのリテラルなども省略可能 5. 従来のjsでは扱えない拡張された文法がもろもろ。 など、素のjsでは考えられないほどタイプ数が減ります。そのため、コーディング速度や保守性が高まり、複数人で書いても品質の高く統一されたコードを書くことができます。</section> <section id="demo"> ## 作ったもの あまり簡素なものでは練習にならないので、今回は、[jQuery.masonry][1]のような要素をタイル状に並べるプラグインを作りました。ページの横幅からはみ出さないように横に並べる個数を調整できます。完成品を見てもらったほうが早いのでデモを。[ページ内の要素をタイル上に並べるjQueryプラグイン jQuery.Tile.js][2]プラグインに少し上乗せして、私のtwitterのつぶやきを表示しています。プラグインとは無関係に、一番下までスクロールすると、次のツイートを読み込む無限スクロールも入れてあります。余計なもの盛り込みました。はい。</section> <section id="jquery-plugin"> ## Coffee版jQueryプラグインのテンプレート 普通のjsでjQueryプラグインを作ると、だいたいこのような感じになると思います。 

```javascript
(function($) { $.fn.pluginName = function(config) { var defaults = { option: “オプション” }; option = $.extend(defaults, config); return this.each(function() { //ここにプラグインの処理を書く }); };})(jQuery);
```

すごく、カッコカッコしています。 * コードを書き換えた時に、カッコの対応がズレる * オブジェクトや配列を書くときに、最後の要素にもカンマを入れちゃう など、しょうもないミスを頻発している私は、基本的な文法にもイライラします。ただ初心者なだけですね。はい。で、これをCoffeeScriptで書くと、こうなります。 

```javascript
do ($=jQuery) -> $.fn.pluginName = (config) -> defaults option: “オプション” option = $.extend(defaults, config) @.each -> #ここに処理を記述
```

**非常にシンプル**です。ループや関数の終わりはインデントで表現されるため、閉じカッコが不要です。そのため、非常にシンプルに書くことができます。こっちのほうが書きやすい！見やすい！とおもいます。</section> <section id="feel"> ## 感想、反省 ざっとプラグインを作ってみて思ったことをまとめると、以下の通りです。 ### Coffeeに使われている 今回のプラグインではかなり無理やりCoffeeScriptのclassを使った感がありました。classを使いこなせていないし、並びにオブジェクト指向への理解がまだ足りないと感じました。 ### 設計ミス また、htmlに要素を追加した際に、再描画を行うメソッドを用意しておらず、再度プラグインを呼び出すという記述になってしまっています。そして、今の実装方法だと、横幅の違う要素があるときれいに並びません。 ### 感想 * もっと大規模のjsじゃないと真価を発揮できなさそう * でもすごく書きやすい。 * jsが多少分ければすぐに書けるようになる jsでの面倒な書き方などを上手いこと包み込んでくれています。なので、書く側はロジックに集中することができ、精神衛生上すごく優しいと感じました。 ### 注意点 ただし、CoffeeScriptはjsの面倒は見てくれるけれど、書き手のロジックまでは面倒を見てくれませんので、結局**ウンコードはウンコードのまま**です。</section> <section id="finaly"> ## まとめ Q,今後もCoffeeScriptを使いますか？**A,使いたいけど、タイミングがあまり無さそう。**jsはファイル数増えると読み込み速度が下がるので、結合コンパイルとかは非常にいいと思うのですが、既にjsで書かれているファイルとCoffeeの連結は都合が悪く**一からCoffeeScript100%で書かないと威力を発揮しにくい**と感じました。とは言え、使えるタイミングではとことん使えると思うので、機会があったらガンガン使っていこうと思います。今回の記事で掲載したプラグインはGithubに公開してあります。https://github.com/Leko/jquery.tile.jsまだ実用的では無いので、プラグインの紹介記事はプラグインの修正後に公開します。最後まで読んで下さいまして、ありがとうございました。</section> 
  
  <p>
    [2]:
  </p>
  
  <div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
  </div>