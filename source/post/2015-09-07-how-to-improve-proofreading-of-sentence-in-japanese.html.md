---
path: /post/how-to-improve-proofreading-of-sentence-in-japanese/
title: Rubyで日本語解析API(+α)を使用して日本語の文書校正を効率化してみる
date: 2015-09-07T11:30:08+00:00
dsq_thread_id:
  - "4097895022"
twitter_id:
  - "640713640409075712"
categories:
  - やってみた
tags:
  - API
  - Ruby
  - Thor
  - Yahoo Developer Network
---
こんにちは。  
ブログを書く際に、 **自分の日本語が怪しい** と思うことが多々あるため、日本語の文書の自動補正がほしいなと思いました。  
思い立ったが吉日ということでYahooの日本語解析APIを使用して実装してみました。

<!--more-->

完成物
----------------------------------------

Githubに公開しています。  
ざっくり作ったものなのでPRや機能追加などお待ちしております。

[Leko/jp-validate](https://github.com/Leko/jp-validate)

Yahooのアプリケーションを作成
----------------------------------------

[こちら](https://e.developer.yahoo.co.jp/register)からYahooのアプリケーションを作成してください。  
APIを利用するためにYahooのアプリケーションIDが必要です。

アプリケーションを登録したら、`.env`に`YAHOO_APP_ID`という名前でキーを登録しておきます。

  * [テキスト解析:校正支援 – Yahoo!デベロッパーネットワーク](http://developer.yahoo.co.jp/webapi/jlp/kousei/v1/kousei.html)
  * [テキスト解析:ルビ振り – Yahoo!デベロッパーネットワーク](http://developer.yahoo.co.jp/webapi/jlp/furigana/v1/furigana.html)

の２APIに対して共通のキーとして使用できます。

実装する
----------------------------------------

実装に関してはリポジトリを御覧ください。  
Goで作ろうと思ったのですが、ローカルの環境を整えるのが面倒だったのでちゃちゃっとRubyで済ませてしまいました。  
CLIツール化については[Thor](http://whatisthor.com/)を使用しました。

表外漢字を常用漢字に変換する
----------------------------------------

まず表外漢字とは、ざっくり言うと「常用漢字でないもの」だそうです。

> 表外漢字字体表によって、印刷文字における印刷標準字体及び簡易慣用字体を定めたことは、表外漢字使用における字体の混乱を軽減し、常用漢字とともに表外漢字を使用していく場合の字体選択のよりどころとなるものである。  
> &mdash; [表外漢字字体表：文部科学省](http://www.mext.go.jp/b_menu/shingi/old_bunka/kokugo_index/toushin/1325296.htm)

Yahooの校正支援APIだけでは、表外漢字が含まれていた場合に指摘はしてくれますが、変換候補が出てきません。  
サンプルの「遙か」は「●か」と変換されてしまいます。なんでやねん。

できれば「遙か」などの表外漢字は「遥か」と常用漢字に変換する[こちら](http://homepage3.nifty.com/jgrammar/ja/tools/tradkan0.htm)のようなWeb APIを探したのですが、見つかりませんでした。  
APIは見つかりませんでしたが、代わりに素敵なgemが見つかりました。

> Convert japanese from itaiji(異体字) to seijitai(正字体) and also reverse convert.  
> [camelmasa/itaiji](https://github.com/camelmasa/itaiji)

今回の目的そのままなgemだったので、有りがたく使用させていただきました。

使い方
----------------------------------------

導入については同じくリポジトリの情報を御覧ください。

```
$ echo '遙か彼方に小形飛行機が見える。' | bundle exec ruby jp-validate.rb list
2 errors
line:1, column:1: '遙か' to '遥か'(表外漢字あり)
line:1, column:5: '小形飛行機' to '小型飛行機'(誤変換)

$ echo '遙か彼方に小形飛行機が見える。' | bundle exec ruby jp-validate.rb fix
遥か彼方に小型飛行機が見える。

$ echo '遙か彼方に小形飛行機が見える。' | bundle exec ruby jp-validate.rb fix --diff
-遙か彼方に小形飛行機が見える。
+遥か彼方に小型飛行機が見える。
```

まとめ
----------------------------------------

公開されているAPIを組み合わせるだけで、簡単に自然言語解析を使用したツールを作れるもんだなぁと思いました。  
APIを公開して頂いているYahooと依存ライブラリの作者さまに感謝感激雨あられです。

本格的に解析するなら形態素解析、係り受け解析やら助詞落ち補完（現状だと指摘はするものの補完はしていない）に伴う機械学習 etcetc…と色々と知識が必要ですが、ごく簡素な校正くらいならこんなもんかな、と思います。

ちなみにこの記事を書いて校正ツールに食わせてみた結果以下のようになりました。

```
$ bundle exec ruby jp-validate.rb list /var/folders/b3/ghssxbs57rzb1gt02wk6mfxr0000gn/T/ODBEditor-com.red-sweater.marsedit.macappstore-0000004.md
20 errors
line:33, column:11: 'ルビ振り' to ''(助詞不足の可能性あり)
line:39, column:1: 'Goで' to ''(助詞不足の可能性あり)
line:39, column:42: 'Rubyで' to ''(助詞不足の可能性あり)
line:44, column:7: '遙か' to '遥か'(表外漢字あり)
line:46, column:6: '遙か' to '遥か'(表外漢字あり)
line:46, column:11: '遥か' to '遥か'(表外漢字あり)
line:46, column:55: 'nifty' to '@nifty（サイト名の場合）'(固有名詞)
line:59, column:9: '遙か' to '遥か'(表外漢字あり)
line:59, column:14: '小形飛行機' to '小型飛行機'(誤変換)
line:61, column:20: '遙か' to '遥か'(表外漢字あり)
line:61, column:28: '遥か' to '遥か'(表外漢字あり)
line:62, column:20: '小形飛行機' to '小型飛行機'(誤変換)
line:64, column:9: '遙か' to '遥か'(表外漢字あり)
line:64, column:14: '小形飛行機' to '小型飛行機'(誤変換)
line:65, column:1: '遥か' to '遥か'(表外漢字あり)
line:67, column:9: '遙か' to '遥か'(表外漢字あり)
line:67, column:14: '小形飛行機' to '小型飛行機'(誤変換)
line:68, column:2: '遙か' to '遥か'(表外漢字あり)
line:68, column:7: '小形飛行機' to '小型飛行機'(誤変換)
line:69, column:2: '遥か' to '遥か'(表外漢字あり)
```

これらを全部直されてしまうと記事内で意図的に書いている「遙か」まで置換されてしまいます。  
今回の場合はサンプルに意図的に表外漢字や誤変換を使用しているため、そこの指摘が多いですね。

日本語の校正についてすべてを委ねることは難しそうですが、いちいち目grepしなくて良くなったので捗りそうです。 次回以降のブログの内容を食わせつつ、どう調整していくか検討してみます。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>