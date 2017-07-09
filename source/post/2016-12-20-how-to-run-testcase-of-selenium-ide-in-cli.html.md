---
path: /post/how-to-run-testcase-of-selenium-ide-in-cli/
title: Selenium IDEで作ったテストをCLI環境で動かしてみる
date: 2016-12-20T23:50:29+00:00
dsq_thread_id:
  - "5335830382"
categories:
  - 問題を解決した
tags:
  - CI
  - Selenium
---
この記事は[12/21 クローラー／Webスクレイピング](http://qiita.com/advent-calendar/2016/crawler)の記事です。

最近、自社システムのシナリオテストの実施方法周りの調査をやっているのですが、

  * GUIからテストコードの原型を作成できる
  * テストコードを編集してもGUIで編集できる可逆性が有る
  * CIのためにヘッドレスで実行できる
  * 環境構築が簡単

な手法を調べており、[selenese-runner](https://github.com/vmi/selenese-runner-java)というツールとSeleniumが提供しているSelenium Hubというツールを利用したらいいんじゃないか、という結論になりました。  
この方法なら専門的な技能がなるべく少なくて済むんじゃないか。

と思っている方法を紹介します。

<!--more-->

## Selenium IDE

[Firefoxのアドオン](https://addons.mozilla.org/ja/firefox/addon/selenium-ide/)として配布されています。  
ブラウザでの操作をマクロとして記録する機能があります。  
また、IDE上で記録したマクロを編集したりアサーションを追記したりできます。  
補完とドキュメントが付いているので、Seleniumの機能を熟知していなくても、補完で命名を補いってドキュメントで知識を補いながら書けます。  
IDEからステップ実行もできるので、１手順ずつ動作確認していくことも可能です。

Selenium IDEの詳しい使い方については色んな方が記事書いてくださっていますので割愛します。

> &mdash; [5分でわかるSelenium IDEの使い方 – Qiita](http://qiita.com/naoqoo2/items/90d382cd9370d3526509)  
> &mdash; [これだけはおさえておきたい！Selenium IDEのコマンド – Qiita](http://qiita.com/oh_rusty_nail/items/c59d4345d5372213128f)  
> &mdash; [Selenium IDEでWebページのテストを自動化しよう！｜社員ブログ｜株式会社Qript](http://www.qript.co.jp/blog/technique/1691/)

IDE上でアサーションを書き加える
----------------------------------------

アサーションを書くのはややプログラマ的な視点が必要になるかもしれませんが、  
CSSセレクタとHTMLタグが分かればある程度のテストなら書けるので、  
フロントのマークアッパーとかも十分戦力として計上可能な範囲の専門性だと思います。

HTMLファイルとして保存
----------------------------------------

エクスポート機能を使わずにファイルとして保存すると、HTMLファイル（seleneseという形式らしい）が吐き出されます。  
seleneseという形式は結構冗長なHTMLです。かなしい。  
ただし、ここで重要なのが **可逆性があること** です。  
seleneseの形式を崩さなければ、 **テキストエディタ等で編集した後でも再度Selenium IDEで開き直すことが可能** です。

エクスポート機能を利用すると、様々な形式のコードへエクスポートが可能です。  
**ただし、seleneseという形式以外にエクスポートすると、Selenium IDEで開けなくなります。非可逆です。**  
で、seleneseという形式は結構冗長なHTMLです。かなしい。

可逆性を失うと「エディタが扱えてselenese形式のHTMLが理解できる」エンジニアが必要になってしまうと思います。  
でないとメンテナンスできなくなっちゃうので、できればIDEで何度でも編集できる形にしておきたい。  
ということでエクスポートはselenese形式一択だと現状考えています。

selenese-runnerで実行する
----------------------------------------

お待ちかねのCLI化+ヘッドレス化です。

### selenese-runner とは

[selenese-runner](https://github.com/vmi/selenese-runner-java)自体の使い方については[ご本人が公開されているスライド](https://vmi.jp/software/selenium/StudyingSelenium-01/SeleneseRunner-20140118.html)が参考になると思います。

この便利ツールを使用して、selenese形式のHTMLをコマンドラインから実行できます。

### selenese-runnerをホストで動かす

selenese-runner単体をホスト側実行するとブラウザが起動し、HTMLの内容が実行されます。

  

![selenese-runner](/images/2016/12/selenese-runner.gif)



どうでしょう。いい感じです。

### ヘッドレス環境でselenese-runnerを動作させる

cron等で定期実行したり、CIを回したりするには、GUIのないLinuxサーバで実行する必要があると思います。  
ということで、その動作環境も作ってみました。

> [GitHub – Leko/example-selenese-runner-with-hub: Example of scenario testing used by selenese-runner with Selenium Hub](https://github.com/Leko/example-selenese-runner-with-hub)

動作させると、

  

![compose-selenese-runner](/images/2016/12/compose-selenese-runner.gif)



こんな感じです。いかがでしょうか。  
これならGUI不要なので、cronでもCIでもexecでもいい感じにもらえばいいと思います。

### コンテナの構成

![](http://g.gravizo.com/g?
%20digraph%20G%20%7B%0A%20%20%20graph%20%5B%0A%20%20%20%20%20rankdir%20%3D%20LR%0A%20%20%20%5D%3B%0A%0A%20%20%20selenese%3B%0A%20%20%20hub%20%5Blabel%3D%22selenium%2Fhub%22%5D%3B%0A%20%20%20chrome%20%5Blabel%3D%22selenium%2Fnode-chrome%22%5D%3B%0A%20%20%20firefox%20%5Blabel%3D%22selenium%2Fnode-firefox%22%5D%3B%0A%0A%20%20%20selenese%20-%3E%20hub%20%5Blabel%3D%22%2Fwd%2Fhub%22%5D%3B%0A%20%20%20chrome%20-%3E%20hub%20%5Blabel%3D%22Connect%22%5D%3B%0A%20%20%20firefox%20-%3E%20hub%20%5Blabel%3D%22Connect%22%5D%3B%0A%20%20%20hub%20-%3E%20chrome%20%5Blabel%3D%22Execute%22%5D%3B%0A%20%20%20hub%20-%3E%20firefox%20%5Blabel%3D%22Execute%22%5D%3B%0A%20%7D%0A
)

こんな感じです。  
設定ファイルの中でseleneseコンテナはドライバを`remote`、`remote-url`にhubコンテナのURLを指定してあります。  
その指定をするとselenese-runner側がSelenium hubにテスト実行依頼を投げます。  
依頼を受け取ったhubは、接続済みのchromeかfirefoxを起動しテストを実行します。

Selenium hub使ったことなかったので理解するまでが難しかったですが、実際に動かしてみたら簡単に理解できました。  
Selenium hub自体については公式リポジトリとこちらの記事が参考になりました。

> &mdash; [GitHub – SeleniumHQ/docker-selenium: Docker images for Selenium Standalone Server](https://github.com/SeleniumHQ/docker-selenium)  
> &mdash;  [&raquo; Selenium Gridで複数の実機ブラウザで自動テスト TECHSCORE BLOG](http://www.techscore.com/blog/2015/05/10/selenium-grid/)

### 日本語サポート

Seleniumはデフォルトでは日本語などのマルチバイト文字をサポートしていません。  
なのでスクショを撮る時に□□□みたいな感じに化けるのですが、せっかくスクショ撮るようにしたなら日本語対応したいな、ということでしておきました。  
`selenium/hub`側に日本語対応を入れるのかと思っていましたが、`node-chrome`と`node-firefox`コンテナの方に入れる必要がありました。  
詳しくはUbuntuのドキュメントと公開したリポジトリのDockerfileを御覧ください。

> &mdash; [Ubuntuの日本語環境 \| Ubuntu Japanese Team](https://www.ubuntulinux.jp/japanese)

ちなみに、[中国語のタグ](https://github.com/SeleniumHQ/docker-selenium/pull/339)のPRに対して、

> however not sure if those containers could accept such locale support for general cases

と回答しているので公式のタグとしては登場しなさそうです。

まとめ
----------------------------------------

これをベースに自分たちなりのアレンジで運用してもらえれば、  
スクレイピングもシナリオテストもいい感じに回っていくかな、と思います。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>