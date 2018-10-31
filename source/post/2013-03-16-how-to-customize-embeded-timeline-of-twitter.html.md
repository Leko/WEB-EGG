---
path: /post/how-to-customize-embeded-timeline-of-twitter/
title: Twitterの埋め込みタイムラインを設置してカスタマイズしてみた
date: 2013-03-16T02:33:47+00:00
sharing_disabled:
  - "1"
twitter_id:
  - "312621240814796800"
meaningless:
  - "yes"
dsq_thread_id:
  - "3132071793"
image: /images/2013/03/20130316_embed1.jpg
categories:
  - やってみた
tags:
  - Twitter
---

こんにちは。 最近はジュエルペットにハマっております。 とても昨今の小学生向けアニメとは思えないほどの、 古いネタ、曲を使ってきます。対象ユーザが不明です。

1 ヶ月ほど前に、

> [Twitter の古い公式ウィジェットが使えなくなるのでご注意を！ [C!]](http://creazy.net/2013/02/old_twitter_widget_depricated.html)
> という記事があったため、そろそろ取り替え作業をしようかと思います。

<!--more-->

## 当記事の目標

当記事は **Twitter の埋め込みタイムラインを設置し、好みによってカスタマイズする** を目標にしています。

## 旧ウィジェットは使えなくなるらしい？

Twitter の API のバージョン移行に伴って、 古い API を利用している Twitter 公式ウィジェットが使えなくなるそうです。

Twitter 公式ウィジェットとは、こんな感じのやつです。 **画像** どこかしらの web ページで見たことあるかと思います。

> [Twitter API 1.1 リリース　開発者の対応リミットは 2013 年 3 月 5 日に – ITmedia ニュース](http://www.itmedia.co.jp/news/articles/1209/06/news038.html)
> とのことらしいのですが、 2013/03/16 現在、私の知る限りでは普通に使えてしまっています。

とはいえ、それに甘んじていてはいけません。 どうせいつか変えなければならないなら、**今対応してしまいましょう。**

旧来のウィジェットが使えなくなると言っても、今までのように **web ページにツイートを埋め込むことが、出来なくなるわけではない** のでご安心下さい。 Twitter 公式が代替手段を提供してくれています。

## 代替手段「埋め込みタイムライン」

**埋め込みタイムライン**とは、 名前が変わっていますが今まで通り、自分のツイートなどを埋め込んで web ページに設置できるウィジェットのことです。

> [埋め込みタイムライン \| Twitter Developers](https://dev.twitter.com/ja/docs/embedded-timelines)
> 1 箇所だけ注意すれば、設定も設置もカスタマイズも簡単です。 さくっとやってしまいましょう。

## 埋め込みタイムラインを作成

まず、Twitter にログインした状態で以下のページを開きます。

> [twitter widgets](https://twitter.com/settings/widgets)

![Twitter Widgets](/images/2013/03/20130313_step2.jpeg) ウィジェット一覧ページを開いたら、「新規作成」をクリックします。

![step2](/images/2013/03/20130313_step3.jpeg) すると、上記画面のように埋め込みタイムラインの設定と、 そのプレビューが表示されると思います。

<span class="line-through">この画面でしか出来ない設定は、<strong>ドメイン</strong>のところのみで、 あとは設置する際に HTML タグから指定出来ます。</span>

<span class="line-through">「ドメイン」には、埋め込みタイムラインを設置するドメインを入力します (<code>http://leko.jp</code>なら<code>leko.jp</code>がドメイン）</span>

<span class="line-through">設置するドメインを入力したら、「ウィジェットを作成」をクリック。</span>

<div class="caution">
  <h2>
    2013/05/21 追記
  </h2>  
  <p>
    ドメインの設定は現在なくなっているようです。
  </p>
</div>

## 埋め込みタイムラインを設置

![step3](/images/2013/03/20130313_step4.jpeg) すると、おそらく上のような文字が 埋め込みタイムラインのプレビューの下に現れると思います。 これをコピーしておく。

コピーしたコードは以下の様な感になっていると思います。

```html
<a class="twitter-timeline" href="https://twitter.com/L_e_k_o" data-widget-id="310714279731019777">@L_e_k_o からのツイート</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
```

このコードを、埋め込みタイムラインを設置したい HTML ファイルに貼り付けて、保存。 これで設置完了です。

設置された埋め込みタイムラインを確認してみて下さい。

## 埋め込みタイムラインをカスタマイズ

埋め込みタイムラインの設定は、HTML の属性で指定します。 難しく考えなくても、あっさりカスタマイズ出来てしまいます。 まず設定可能な項目の一覧を載せます。

### サイズ（width, height）

ウィジェットの表示サイズを設定する。 横幅は<span class="line-through">最小 220px、最大 520px</span>**最小 180px、最大 520px** 高さは**最小 350px**で、**％指定は出来ない**ようです。

### テーマ（data-theme）

ウィジェットの背景色を設定する **"light"**か**"dark"**を指定できる。

### 言語（lang）

ウィジェット内部パーツの言語を設定する lang を指定しても、つぶやきの内容自体が翻訳されるわけではないのでご注意を。 html タグに lang 属性が指定してあるなら、省略可能

### リンクの色（data-link-color）

ツイートにリンクが含まれている場合のカラーを設定する。 **css の#000000**のように RGB を 16 進数で指定をすることが出来る。

### おすすめしたいユーザ（data-related）

返信、リツイート、お気に入り登録の際にユーザーにおすすめしたいユーザーを指定できる。 `data-related="L_e_k_o,endform"`のようにユーザ名をコンマで区切りで指定する。

### インタフェース (※2013/05/21 追記)

ウィジェットのレイアウトやインタフェースをカスタマイズする `data-chrome`属性を利用します。

- `noheader`: タイムラインのヘッダーをなくす
- `nofooter`: タイムラインのフッターやツイートボックスをなくす
- `noborders`: ウィジェットの周りやツイートの間のボーダー(境界線)をなくす
- `noscrollbar`: タイムラインのスクロールバーが表示されないようにする。**※サイトのアクセシビリティが悪くなる場合があるので要注意**
- `transparent`: タイムラインの背景を透明にする

これにより、見た目のカスタマイズ性がかなり向上したと思います。 「Twitter のタイムライン」感をかなり少なくして、自サイト内に組み込めそうです。

設定可能な項目はおおよそこれくらいです。 詳しくは、[公式ドキュメント](https://dev.twitter.com/ja/docs/embedded-timelines)を参照。

## カスタマイズ例

ただ設定可能な項目を羅列してもしょうが無いので、いくつか例を載せます。

script タグは設定を変えても共通なので、a タグの部分だけを載せます。

### 例１

- テーマを白
- L_e_k_o をおすすめユーザに指定
- 横幅を 220px に指定

```html
<a
  class="twitter-timeline"
  href="https://twitter.com/L_e_k_o"
  data-widget-id="310714279731019777"
  width="220"
  data-theme="light" data-related="L_e_k_o">L_e_k_oさんのツイート（返信を除く）</a>
```

### 例２

- テーマを黒に
- 言語を英語に
- リンクの色を#000000 に指定

```html
<a
  class="twitter-timeline"
  href="https://twitter.com/L_e_k_o"
  data-widget-id="310714279731019777"
  data-theme="dark"
  lang="en"
  data-link-color="#000000">L_e_k_oさんのツイート（返信を除く）</a>
```

## 注意事項

埋め込みタイムラインを設置する上で気をつけなければならないことが１つあります。

- **同じウィジェットを、同一ページ内に複数置くことは出来ません。**

1 ページに複数のタイムラインを埋め込みたいなら、 その数だけウィジェットを作らないといけないようです。

## まとめ

カスタマイズの属性を覚えるのに少々手間を要しますが、 慣れれば 1~2 分で全行程完了する程度の軽い作業です。

もし旧ウィジェットを使ったサイトを制作されている方は、 これを機に新ウィジェットへ移行をしてみて下さい。

最後まで読んでくださいまして、ありがとうございました。
