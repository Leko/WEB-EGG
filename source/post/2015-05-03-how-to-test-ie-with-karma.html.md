---
path: /post/how-to-test-ie-with-karma/
title: Karmaを使ってIEのテストをMacから行う
date: 2015-05-03T21:28:02+00:00
meaningless:
  - 'yes'
dsq_thread_id:
  - "3732464626"
twitter_id:
  - "594843696488525825"
image: /images/2015/05/ae46b1f460ee46f789c27b264a6cb421.png
categories:
  - 効率化
tags:
  - ES5
  - Jasmine
  - JavaScript
  - Karma
---
久々の更新です。  
社会人になってからいつの間にか１年が経過していました。時が立つのは早いものです。。。

最近はインプットを増やしてばかりで全然アウトプットできていなかったので、少しずつアウトプットできればと思います。 ここんところ業務の都合でPHPネタばかりだったので、そろそろ本来のフロントエンドの話に切り替えようと思います。

さて本題ですが、Angularのチームが開発した[Karma](http://karma-runner.github.io/)というツールを使用して、  
**MacでIEのテスト** を実行してみようと思います。

<!--more-->

今回のゴール
----------------------------------------

  * MacでIE8, IE9のテストができる
  * nodejsのコードでブラウザ上のテストができる
  * es5-shimを入れてes5依存の処理でもIE8で動けるようにする

今回の記事の内容を反映したリポジトリも作成しました。  
記事だけではわからない箇所はそちらも合わせてご覧下さい。

> Leko/karma-ievm-seed
    
> <https://github.com/Leko/karma-ievm-seed>

使うもの
----------------------------------------

  * [Virtualbox](https://www.virtualbox.org/)
  * [Jasmine](http://jasmine.github.io/)
  * [Karma](http://karma-runner.github.io/)
  * [Browserify](http://browserify.org/)
  * [karma-ievms](https://www.npmjs.com/package/karma-ievms)
  * その他各種Karma用アダプタ

さり気なくBrowserifyが出てきていますが、下記参考資料を見つつ情報を保管してもらえればと思います。  
JasmineはMochaと書き方がほとんど変わらないのでどちらか知っていれば大丈夫だと思います。

参考リンク
----------------------------------------

> Browserify: それはrequire()を使うための魔法の杖
    
> <http://qiita.com/cognitom/items/4c63969b5085c90639d4>

<!---->

> power-assertでJavaScriptのテストをする ブラウザ編
    
> <http://efcl.info/2014/0411/res3820/>

今自分が使っている環境ではSauceLabsやpower-assertなどモリモリなのですが、  
今回はあくまで **Karma x MacでIE** にフォーカスするため本題から逸れる話はなるべく割愛します。

リポジトリをつくる
----------------------------------------

では早速進めていこうと思います。  
調べが足りずに最近知ったのですが、`npm install --save-dev`は`npm i -D`と略すことができるようです。便利。  
以降の手順でもバシバシ使っています。

```shell
cd /path/to/work
mkdir karma-ievm-seed && cd karma-ievm-seed
git init
hub create # see https://github.com/github/hub#installation
npm init   # 適当に内容を入力
git add package.json
git commit -m "initial commit"
npm i -g karma-cli # インストール済みなら不要
npm i -D karma
karma init
```

`karma init`すると色々と聞かれると思います。  
テストの構成を聞かれるので、テストフレームワークは`Jasmine`。`requirejs`は使わない。対象ブラウザは`Chrome`あたりを選んでおけばよいと思います。  
この対話CLIで設定するより、どうせ後で直接設定ファイルをいじるのでこの段階では正直なんでもよいです。

（蛇足）dotenvを使用する
----------------------------------------

私の環境は`Firefox`を[brew-cask](http://caskroom.io/)で入れてしまっているので、通常のパスとはズレています。  
Karmaでそのようなブラウザを起動する場合、`FIREFOX_BIN`という環境変数を指定する必要があります。  
`.bash_profile`などに環境変数を書いておいても良いのですが、  
のちのち`SauceLabs`の接続情報を入れたりと、環境変数をいじれるようにしておくと何かと都合が良いので`dotenv`を使用します。

[dotenv](https://www.npmjs.com/package/dotenv)はプロジェクト直下の`.env`というファイルを読み取り環境変数に自動的にセットしてくれるツールです。

```shell
npm i -D dotenv
echo "FIREFOX_BIN=/opt/homebrew-cask/Caskroom/firefox/latest/Firefox.app/Contents/MacOS/firefox-bin" > .env
```

あとはこの定義ファイルを読み込むために、`karma init`で作成された`karma.conf.js`の先頭にも以下の処理を追加しておきます。

```javascript
require('dotenv').load();
```

IE8で落ちるテストを記述する
----------------------------------------

まだIEの準備はしていませんが、まずはIE8では落ちるテストを記述してみようと思います。  
IE8で使用できないメソッドとして、`Array#reduce`を採用しました。

テスト用のソースコードとテストコードは[こちら](https://github.com/Leko/karma-ievm-seed/commit/f63090c8f020d90e326a9a9cee3f7d4e438555fe?diff=unified)になります。

ソースコードに`module.exports`、テストコード内に`require`を使用しているので、 **このままではブラウザで動作しません。**  
かと言ってブラウザで動かすためにわざわざグローバルを汚染したくもありません。  
ということで、Browserifyを使用してnodeで動くコードをブラウザでも動くように変換します。

Karmaの設定を変更してローカルのChromeで結果を確認
----------------------------------------

```shell
npm i -D karma-browserify brfs
```

Karmaの設定ファイルは[こちら](https://github.com/Leko/karma-ievm-seed/commit/bc2d9fd2d8f2c43ac14e9fc40c62e05d9edaaef9)のように変更して下さい。

概要だけ抜き出すと、

  * `karma-browserify`と`brfs`を追加
  * `frameworks`に`browserify`の指定を追加
  * `preprocessors`でテストコードを`browserify`で変換する指定を追加
  * `browserify`の変換設定を追加

です。`brfs`は同期的にBrowserifyのビルドが行えるツールです。  
以上の設定をしたらテストを実行してみます。

```shell
karma start
```

![Karma result without IE](/images/2015/05/5ac7135e55fda451dcc7ad8d69ae344d.png)

設定ファイルの`browsers`に指定されたブラウザが立ち上がりテストが実行されたと思います。  
ソースコードを編集しても、テストコードを編集しても、保存すると自動でテストが再実行されたと思います。  
**Karmaまじ便利。ちょう便利。**

Karmaでテストコードが動いたのも確認できたので、IEでもテストを実行できるようにしていきます。

IEのVMを入れる
----------------------------------------

若干話が逸れてしまいましたが、続きです。

この記事を読むということは[Modern IE](https://www.modern.ie/ja-jp)からIE用のVMを既にダウンロード済みの方が多いと思います。  
が、今回は **IEのVMを新規インストールしてそいつをテスト用に使う** ための手順を書いていきます。  
インストール済みのVMは使用しないので、ディスク容量に余裕が無い方は既に入っているVMを消して頂いてから次へ進んで下さい。

<http://xdissent.github.io/ievms/>

このツールを使用します。  
今回はIEの8, 9だけが欲しい（IE10, 11は容量がでかいので入れない）ので、このようなコマンドになると思います。  
ディスク容量は`20GB`くらい空きがあればインストール出来ると思います。

> インストール中は`ダウンロードしてきたVM`と`Virtualboxに取り込んだVM`で **本来の約２倍の容量を食う** ので、だいたい20GBくらい、としています。

```shell
curl -s https://raw.githubusercontent.com/xdissent/ievms/master/ievms.sh | env IEVMS_VERSIONS="8 9" bash
find ~/.ievms -type f ! -name "*.vmdk" -exec rm {} \;
```

けっこう時間がかかるので、回線の太い環境で気長にお待ちください。

`IEVMS_VERSIONS`という環境変数にインストールしたいIEのバージョンを指定しています。  
インストール後に、ダウンロードしてきたVMは不要なのでクリーンアップしています。  
ついでにゴミ箱も空にしておくと容量がだいぶ空きます。

インストールが終わり、Virtualboxで下記のように表示されていればOKです。

![After Installed IE VMS](/images/2015/05/e9e5157275790571849ed8e701768f1c.png)

IE用にKarmaの設定を変更
----------------------------------------

やっとIEを使う準備が整いました。  
Karmaの設定を変更し、VM内のIEでテストコードを実行できるようにします。

まずはIE9を追加した差分が[こちら](https://github.com/Leko/karma-ievm-seed/commit/704371e153609f8aff2ebffaf15173489a05e49c)です。  
念のためコマンドも載せておきます。

```shell
npm i -D karma-ievms
```

`browsers`にVirtualboxでの表示名をそのまま指定しています。  
この値は変更可能なのかどうか試していません。設定をいじっていなければこれで動きます。

先ほどと同じく`karma start`してみると、VMが起動して自動的にKarmaのテストページが開かれテストが実行されます。  
ちなみに`ctrl+c`などでKarmaを終了すると自動でVMのシャットダウンまでやってくれます。  
**どんだけ便利なんだよ。凄すぎる。**

IE9で動くことを確認したので、本題のIE8も追加します。  
差分は[こちら](https://github.com/Leko/karma-ievm-seed/commit/898219f2f6cb982651396498e30aaa34e39741fd)です。

`karma start`して **IE8だけテストに失敗すれば成功です**。  
ただのIE8ならArray#reduceは使えないはずなのでエラーになります。まずは失敗させることから始めましょう。

動かないことが確認できたところで、es5のshimを入れてIE8でもテストが通るようにしてみます。

karma-es5-shimを入れてIE8のテストを通す
----------------------------------------

**IE8は非対応、と言いづらいけどes5使えないのはつらみなので、shim入れれば動くよ** 程度にIE8対応をしたい方向けの対応です。  
es5-shimは、ざっくり言うとIE8などes5のメソッドに対応していないブラウザ向けのpolyfillです。

```shell
npm i -D karma-es5-shim
```

Karmaの設定ファイルも合わせて[こちら](https://github.com/Leko/karma-ievm-seed/commit/1b3ccd382332b7f7b5d0e3d1b4d46640a99a6cc1)のように編集しておきます。

改めて`karma start`してみると、IE8もテストに通ったと思います。  
これでIE9以上が対象だけど、shimを入れればIE8対応、とうたえるようになりました。

まとめ
----------------------------------------

最近のjsの開発ツール周りの進化速度が早すぎて全然ついていけていない私ですが、  
少しずつインプットしつつアウトプットしつつ時代に食らいついています。

この速度でのツールの進化はjsの需要が高まっているからこそだと思うので、jsが必要とされていることに嬉々としています。

ちなみに、本格的に色々なブラウザ・OS・バージョンでテストを行いたい場合には[SauceLabs](https://saucelabs.com/)を使ったほうが良いと思います。  
ただし、ちょろっと試しに使ってみた感じだと **ものすごく遅い** ので、CI回したり、確実な品質担保をしたいとき向けといった印象があります。

とりあえずIEに最低限対応していることをテスト駆動で書いていくだけなら、今回の記事のようにローカル環境を活用したほうがスピーディにことが済みそうです。 SauceLabsでのテストに慣れてきたら、TravisCIと組み合わせて、PR時に各ブラウザのテストを走らせる方法を書きたいと思います。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>