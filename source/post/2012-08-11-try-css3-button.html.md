---
path: /post/try-css3-button/
title: 'CSS3のボタンを今更ながら今更ながらやってみた &#8211; 1'
date: 2012-08-11T22:47:05+00:00
dsq_thread_id:
  - "3142622419"
---
諸事情でスマフォ用のwebページを作る機会があり、

スマフォではIEという魔物がいないのでCSS3がフルに使えると。

&nbsp;

ということでいい機会だしボタンをCSS3で作ってみました。

まず完成目標はこちら（Photoshopで作成）

<!--more-->

色が微妙とかセンスがないとか言わないで！！

レイヤー効果でちゃちゃーっと作りました。

これらをCSS3に書き起こしましょう。

&nbsp;

１，青いボタン
  
最初に、完成品がこちら。
  
&nbsp;
  
ベーシックなグラデーションのボタンです。
  
押すとちょこっとだけ押し込みがあって小気味いいと思います。

ちなみに、CSSは（IE以外の）だいたいのメジャーブラウザ に対応するよう書きます。

ではいきましょう。

まずHTMLはこんな感じ。

```
<a href="#" class="btn-a">BUTTON</a>
```


まんまですね。次に、まず基本的な装飾。

```
.btn-a{
	color: #fff;
	display: block;
	text-decoration: none;
	text-align: center;
	width: 130px;		/* ここと */
	padding: 10px 30px;	/* ここはお好みで */
}
```


これ以降のCSSは全部.btn-aの中に記述しますが、はしょります。
  
最後にまとめた物を書いておくので時間の無い方はそちらを参照で。

次に、角丸も指定しときます。
  
ここから各ブラウザ用のプレフィックスが登場します。
  
現在のブラウザの実装状況がわかりませんが、プレフィックスありと無しを付けておけばいいやと。適当です。

```
-moz-border-radius: 2px;	/* Firefoxなど */
-ms-border-radius: 2px;	/* IE系（たぶん未実装） */
-webkit-border-radius: 2px;	/* Chrome,Safariなど */
border-radius: 2px;	/* Operaやプレフィックス不要ブラウザに */
```


ここまでのサンプルがこんな感じ。

で、いざグラデーション。
  
webkitとmozilla系では書き方が違うようなので注意。
  
あとOperaもmozilla系の書き方なようです。

```
background: -o-linear-gradient(top, #0dbfc1, #09b7b1);
background: -moz-linear-gradient(top, #0dbfc1, #09b7b1);
background: -webkit-gradient(linear, left top, left bottom, from(#0dbfc1), to(#09b7b1));
```


あとは、それっぽさを出すために輪郭線と、光を入れます。
  
あと、テキストを浮き上がらせるために文字にはシャドウを入れます。これはお好みで。

```
text-shadow: 0px -1px 0px #000;
border: 1px solid #08b1ab;
box-shadow: 0px 1px 0px #fff inset;
```


では改めてサンプルを見てみましょう。こんな感じ。
  
&nbsp;
  
さて、これで置くだけならだいぶ完成目標に近づきましたが、
  
どうせCSSでやるならマウスを載せたり
  
クリックしたときのアクションまでしていしちゃいましょう！
  
&nbsp;
  
まずはマウスを載せた時の装飾。ボタンをへこんだ感じに見せます。
  
これは、平常時のグラデーションと色を逆にするだけです。簡単。
  
もし違和感があったら微調整してみて下さい。

&nbsp;

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>