---
path: /post/how-to-extend-chatwork-in-google-chrome/
title: Chrome拡張を作ってweb版ChatWorkを改造してみた
date: 2014-08-05T13:04:34+00:00
meaningless:
  - "yes"
twitter_id:
  - "496507236571561984"
dsq_thread_id:
  - "3131838400"
image: /images/2014/07/Untitled-2.png
categories:
  - やってみた
tags:
  - cheet.js
  - Chrome extension
  - JavaScript
  - jQuery
  - ChatWork
---

こんにちは。  
とても今更ながら、Chrome 拡張機能が HTML と CSS と js で作れるらしいので、作ってみました。

よくあるサンプルの、「ただ alert 出すだけ」だと芸がないので、  
web 版の ChatWork を改造しつつ、拡張機能について学んだメモです。

<!--more-->

## 注意

この記事を執筆したのは 2014/07/20 です。

ChatWork の HTML 構造に激しく依存するため、  
HTML や js の回収があった場合には動作しなくなる可能性が非常に高いです。  
情報が古くなり動かなくなる可能性があることを、あらかじめご了承ください。

## 制作するもの

[コナミコマンドを実装する js](http://namuol.github.io/cheet.js/)を利用して、

ChatWork のページ内で、  
**コナミコマンド（↑↑↓↓←→←→ba）が入力されたら、マイチャットにグラディウスの AA を投稿する**

というしょうもない小ネタをやってみたいと思います。  
ちなみに完成した物は<span class="removed_link" title="https://github.com/Leko/chrome-ext-gradius">こちら</span>になります。

## 前提

ライブラリの導入に bower を使用します。  
インストールされている前提で話を進めます。ご了承下さい。

## まずは alert

とりあえず動作確認のために、  
ChatWork のドメイン（`https://www.chatwork.com`）なら alert を出すようにしてみます。

```shell
cd /path/to/work
mkdir chrome-ext-gradius && cd chrome-ext-gradius
bower init # 適当に入力()
bower install --save cheet.js jquery
touch manifest.json main.js chatwork-util.js
echo "bower_components" >> .gitignore
git init
git add .
git commit -m "initial commit"
```

コナミコマンドを実現する js、jQuery は bower で配布されています。  
あとは拡張機能に必要な`manifest.json`と、自作する js ファイルを生成します。

manifest.json は以下の内容にします。

```json
{
  "version": "1.0.0",
  "manifest_version": 2,

  "name": "CONAMI command for ChatWork",
  "description": "コナミコマンドを入力するとChatWorkに何かが起こる・・・！",

  "content_scripts": [
    {
      "matches": ["https://www.chatwork.com/*"],
      "js": [
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/cheet.js/cheet.min.js",
        "chatwork-util.js",
        "main.js"
      ]
    }
  ]
}
```

そして、main.js にアラートだけ書きます。

```javascript
alert("ChatWorkです");
```

この状態で、Chrome 拡張機能として Chrome にインポートして動作確認します。

## 拡張機能を Chrome にインポート

ストアで販売してない拡張機能でもインポートできます。

メニューから拡張機能のページを開き、

![Step01](/images/2014/07/step01.png)

「パッケージ化されていない拡張機能を読み込む…」ボタンをクリックします。  
選択するファイルは、先ほど作成した chrome-ext-gradius フォルダです。

フォルダを選択すると、下記の画面のように拡張機能の一覧に現れます。

![Step02](/images/2014/07/step02.png)

なお、一度取り込みを行ってしまえば、  
ファイルを変更した時に拡張機能のページをリロードするだけで再読込されます。

**リロードしないと拡張機能の再読み込みがされない**ので、  
**あれ動かない？**と思ったら拡張機能のページをリロードしてみてください。

次に、Chrome 拡張機能の`content scripts`についての理解を深めます。

## content scripts

content scripts は任意の web ページに対して任意の js を実行できますが、いくつか制限があります。

> コンテント・スクリプトは "Isolated World"(隔離空間) と呼ばれる特殊な環境で実行される。ここでは読み込まれたページの DOM にはアクセスできるが、該当ページの JavaScript の変数や関数には出来ない。そのため、各コンテンツ・スクリプトからは、あたかも他の JavaScript が全く実行されていないページで自分が実行されるように見える。逆もまた真なりで、各ページのスクリプトからもコンテンツ・スクリプトで定義した変数や関数にアクセスすることは出来ない。  
> &mdash; <span class="removed_link" title="http://dev.screw-axis.com/doc/chrome_extensions/guide/content_script/">コンテント・スクリプト | Chrome Extensions API リファレンス</span>

このように、そのページで読み込まれている js には一切アクセスできず、  
拡張機能で定義した機能についてもそのページの js からはアクセスできません。

ただし、DOM を介してデータのやりとりを行うことができます。

「DOM を書き換えることができて、どんな命名をしても対象ページ内の js と衝突することはない」

と捉えるとかなり幸せに思いますが、  
特定のページ用（今回なら ChatWork 専用）の拡張機能を作る場合には、  
ChatWork で動作している js にアクセスできないため、**いちいち各操作を自前で実装する必要があります。**  
例えば、チャットルームの切り替えは、タイミング制御まで合わせるとなかなかの鬼門です。

不幸中の幸いながら、  
ChatWork の HTML には属性として各種パラメータが埋め込まれているので、パース処理や値の取得自体は簡単です。

では早速実装していきます。

## コナミコマンドを有効化

基本的には`cheet`関数を使用してショートカットを設定するだけなのですが、

キーボードイベントに関して要注意なのは、ChatWork の js と衝突して、  
↑ キーと ↓ キーが奪われてしまい、**しかも握りつぶされています。**

cheet.js は`window`にイベントを設定しているので、  
`document`で止められてしまうと反応できません。

つらい。これはつらい。

と思って心が折れかけましたが、無理やりイベントを先取りすることが出来ました。

```javascript
// 握りつぶされる前にkeydownイベントをwindowオブジェクトに伝播させる
$(document).on("keydown", function(e) {
  var ev = new Event("keydown");
  ev.keyCode = e.keyCode;

  window.dispatchEvent(ev);
});

cheet("U U D D L R L R b a", function() {
  alert("コナミコマンド発動!");
});
```

カスタムイベントを作り window へぶん投げるようにしました。

拡張機能をリロードし、ChatWork もリロードし、  
「↑ ↑ ↓ ↓ ← → ← → B A」と入力してみると、以下のようになります。

![Step03](/images/2014/07/step03.png)

cheet.js 側が反応するようになったので OK です。次へ進みます。

## ユーティリティを作成

- チャットルームを切り替える
- チャットに投稿する
- [ChatWork 記法](http://developer.chatwork.com/ja/messagenotation.html)を使う

などの部分を直接書くと煩雑になるため、  
DOM 操作や記法のユーティリティは、作成しておいた`chatwork-util.js`のほうに記述していきます。

### [info]タグ記法のテキストを生成するユーティリティ

ChatWork では、`[info]`というタグが使えます。  
AA など等幅にしてほしいテキストを送る場合に便利です。

使用するのでユーティリティ化します。

```javascript
(function(global) {
  "use strict";

  var util = {
    /**
     * 指定されたテキストをChatWork記法の[info]タグへ変換する
     * @param string body    [info]タグの本文にあたる部分
     * @param string [title] 指定されたら[title]タグも使用する。省略された場合使用しない
     * @return string [info]...[/info]で囲われた文字列
     */
    toInfomation: function(body, title) {
      var info = "[info]";

      // titleが指定されていたらtitleタグを使用
      if (typeof title !== "undefined") info += "[title]" + title + "[/title]";

      info += body + "[/info]";
      return info;
    }
  };

  global.util = util;
})(this);
```

### マイチャットの HTML 要素を取得するユーティリティ

ChatWork の左側にあるチャットルーム一覧は、  
頻繁に DOM の書き換えが行われるため、変数にキャッシュすると期待通りの動作になりません。  
なのでメソッド化して、毎度 HTML に問い合わせて取得します。

なお、全体を記述すると長くなってしまうので、  
ファイル全体ではなく必要な箇所のみ記述します。

```javascript
var util = {
  /**
   * マイチャットの名前。もし名前を変更している人がいたらここを書き換えてください。
   */
  MYCHAT_NAME: "マイチャット",

  /**
   * マイチャットへのリンクを表す要素を取得する
   * NOTE: チャット一覧のDOMは頻繁に書き換わるため変数にキャッシュすると期待道理に動かない。
   *       なので変数にキャッシュせずに毎回取得を行う
   * NOTE: MYCHAT_NAMEに設定されている名前のチャットをマイチャットとみなす
   * @return jQuery マイチャットを表すjQueryオブジェクト
   */
  getMyChat: function() {
    // チャットルーム名がMYCHAT_NAMEのチャットを返す
    var selector = 'li[aria-label="' + this.MYCHAT_NAME + '"]';
    return $("#_roomListItems").find(selector);
  }

  // ...
};
```

マイチャットを取得出来ました。  
何らかのフラグではなく、チャットルームの名前と`MYCHAT_NAME`という変数の値に依存してしまっているので、治せる方法があれば治したいです。

### マイチャットへ切り替えるユーティリティ

マイチャットの要素を取得できたので、マイチャットへ切り替えるユーティリティも作成しておきます。

実装は簡単で、単に`click`イベントを発行するだけです。

```javascript
var util = {
  /**
   * 現在のチャットをマイチャットへ切り替える
   * @return void
   */
  changeMyChat: function() {
    this.getMyChat().trigger("click");
  }

  // ...
};
```

これだけです。

**…なわけありません。**  
チャットルームの切替時に非同期で Ajax が走り、  
切り替え先のチャットのメッセージ一覧を取得しメッセージ一覧画面をかきえます。  
このチャットルームの切り替え完了を検知するタイミングの制御が、なかなか難しいです。

制御に失敗すると、チャットへ投稿するときに、別のチャットへ投稿してしまうことが起こります。  
ですが、詳細までお話していると今回本筋から大きくそれるため触れません。  
`MutationObserver`というオブジェクトを利用しています。詳しくは<span class="removed_link" title="https://github.com/Leko/chrome-ext-gradius">リポジトリ</span>を御覧ください。

### チャットに投稿するユーティリティ

前述のタイミング制御の問題さえなければごくシンプルです。

```javascript
var util = {
  /**
   * 現在のチャットへ発言する
   * @param string body 発言内容
   * @return void
   */
  send: function(body) {
    util.$chatText.val(body);
    util.$sendBtn.trigger("click");
  }
};

$(function() {
  // チャット内容入力フォーム、送信ボタンを変数にキャッシュ
  util.$chatText = $("#_chatText");
  util.$sendBtn = $("#_sendButton");
});
```

チャット内容入力フォームと送信ボタンの HTML は、  
書き換えられることがないので、速度のため変数にキャッシュしています。

動作確認をしてみます。

```javascript
$(function() {
  util.send("hogehoge");
});
```

![Scree](/images/2014/07/Screen-Shot-2014-07-20-at-5.30.13-PM.png)

OK です。

さて、マイチャットに切り替えられるようになり、発言もできるようになったので、  
早速 AA を投稿してみたいと思います。

## AA を投稿する

今回使用する AA はこちら。

```
　　　　　　　　　_ _
　　　　　　　　（_ _ ）―――――――――――
　　　ぴちゅーん
　　　　　　　　　　　　　　　　　　　_ _
　　　　　　　　　　　　　　　　　　（_ _ ）―――――――――――
　　 _
　 _ヽ ヽ.__________
≡] _三 ,. ヽ_ 丶-｀ﾞ__=-　―――――――――――
　　　 ∥_,"===￣￣
　　　　　　　　　　　　　　　　　　ぴちゅーん
　　　　　　　　　　　　　　　　　　　　　　　　　　　_ _
　　　　　　　　　　　　　　　　　　　　　　　　　　（_ _ ）―――――――――――
　　　　　　　　　　　　　　ぴちゅーん
　　　　　　　　　_ _
　　　　　　　　（_ _ ）――――――――
```

はい。ビックバイパーです。<del>グラディウスやったことないけど。</del>

**ナメてんのか**って感じの良い AA ですね。  
[こちら](http://bhdaa.sakura.ne.jp/gradius/gradius-asciiart.html)のサイト様に掲載されていた AA を少し改変させていただきました。

あまり複雑な AA だと分かりにくいと思ったので、シンプルな AA で行きます。

ユーティリティは揃えらので、  
あとはもうコナミコマンドのコールバックを仕上げるだけです。

main.js の内容は以下の通りになります。

```javascript
(function(global) {
    'use strict';

    var AA = util.toInfomation("　　　　　　　　　_ _\n\
　　　　　　　　（_ _ ）―――――――――――\n\
　　　ぴちゅーん\n\
　　　　　　　　　　　　　　　　　　　_ _\n\
　　　　　　　　　　　　　　　　　　（_ _ ）―――――――――――\n\
　　 _\n\
　 _ヽ ヽ.__________　\n\
≡] _三 ,. ヽ_ 丶-｀ﾞ__=-　―――――――――――\n\
　　　 ∥_,\"===￣￣\n\
　　　　　　　　　　　　　　　　　　ぴちゅーん\n\
　　　　　　　　　　　　　　　　　　　　　　　　　　　_ _\n\
　　　　　　　　　　　　　　　　　　　　　　　　　　（_ _ ）―――――――――――\n\
　　　　　　　　　　　　　　ぴちゅーん\n\
　　　　　　　　　_ _\n\
　　　　　　　　（_ _ ）―――――――――――", 'コナミコマンドが入力されました')\;\

    // 握りつぶされる前にkeydownイベントをwindowオブジェクトに伝播させる
    $(document).on('keydown', function(e) {
        var ev = new Event('keydown');
        ev.keyCode = e.keyCode;

        window.dispatchEvent(ev);
    });

    // コナミコマンドが入力されたらマイチャットへ切り替えて発言を行う
    cheet('U U D D L R L R b a', function() {
        util.changeMyChat(function() {
            // 切り替わったらAAを投稿
            util.send(AA);
        });
    });
}(this));
```

コナミコマンドを入力してみます。

![Scree](/images/2014/07/Screen-Shot-2014-07-20-at-5.46.36-PM1.png)

OK です。

どのチャットに居てもマイチャットへ移動し、AA が投稿されます。  
**動作がとても重い環境だと投稿しそこねたり、マイチャット以外へ投稿してしまうこともあるのでご注意ください。**

ということで拡張機能が完成しました。  
拡張機能では CSS を読み込んだりすることもできるようなので、  
もっと深めてみたら面白いことになりそうです。

完成したファイルはこちらからご覧になることができます。

> &mdash; <span class="removed_link" title="https://github.com/Leko/chrome-ext-gradius">Leko/chrome-ext-gradius · GitHub</span>

## 参考

> &mdash; [Google Chrome 拡張機能入門 (全 20 回) – プログラミングならドットインストール](http://dotinstall.com/lessons/basic_chrome_v2)

<!---->

> &mdash; <span class="removed_link" title="http://dev.screw-axis.com/doc/chrome_extensions/guide/content_script/">コンテント・スクリプト | Chrome Extensions API リファレンス</span>

<!---->

> &mdash; [グラディウス AA 集　（ボスのアスキーアート）](http://bhdaa.sakura.ne.jp/gradius/gradius-asciiart.html)
