---
path: /post/learn-multi-thread-and-multiplexing/
title: シングルスレッドな言語の並列化・マルチプロセス化についての暫定的な理解をまとめる
date: 2016-07-23T19:59:50+00:00
dsq_thread_id:
  - "5008114104"
categories:
  - やってみた
tags:
  - Nodejs
  - Performance
  - PHP
---

たまにはまとまってない情報を書いてもいいじゃないかということで、表題の通り暫定版です。

## まえおき

Nodejs の[cluster](https://nodejs.org/api/cluster.html)モジュールのドキュメントを読んでいて、  
「ほぉ、並列化って簡単にできるんだなぁ」と感じつつ、関連記事をいろいろ調べてみると、

- 並列化すればスループットが上がる
- マルチコアの場合は有用。CPU のコア数と同じにすると良い
- ワーカーやアプリケーションサーバなどは横に並べとけ

的な記述が色々あり、違和感を感じました。  
Go などのマルチスレッドができる言語でやる"並列化"と私が調べているものは別物なのでは？ と。

ということで、身近な頼れる方々へ聞いて調べて考えた結果の暫定的な理解を書き留めておきます。 理解に誤りがあったら指摘もらえると喜びます。

パフォーマンスチューニングや[スレッドセーフであるための 4 条項](https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E3%82%BB%E3%83%BC%E3%83%95#.E3.82.B9.E3.83.AC.E3.83.83.E3.83.89.E3.82.BB.E3.83.BC.E3.83.95.E3.81.8B.E3.81.A9.E3.81.86.E3.81.8B.E3.81.AE.E5.88.A4.E6.96.AD.E5.9F.BA.E6.BA.96)とかそういう込み入った話ではなく、浅い話です。

<!--more-->

## 用語の整理。多重化と並列化とマルチプロセス化は別物である

たとえば、Go で並列処理をする場合、[goroutine](https://tour.golang.org/concurrency/1)を使用すると思います。  
js で複数の非同期処理を同時に行おうとした場合、[Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)を使用すると思います。  
[Heroku の記事](https://devcenter.heroku.com/articles/node-concurrency)によると、Node でワーカーの並列度を最適化するには、[throng](https://github.com/hunterloftis/throng)などのクラスタリングマネージャを使用して、マルチプロセス化したら良いと思う的なことが書かれています。

**一体なにがどれにあたるんだ、違いがわからん** と思っていたのですが、  
JavaScript(Nodejs)はマルチコアな筐体で動作させたとしても、あくまで **シングルスレッド** な言語であるという点から整理すると、

- 多重化
  - 1 つの CPU を複数のタスクでシェアし、待ち時間を減らしマルチスレッドかのように振る舞うこと
  - js の非同期処理や、PHP の[curl_multi](http://php.net/manual/ja/function.curl-multi-exec.php)はこれ
  - シングルコアで動く goroutine もこれ
- 並列化
  - 複数の CPU を使用し、それぞれに異なる計算をさせること
  - マルチコアで動く goroutine はこれ
- マルチプロセス
  - プログラム中のある処理ではなく、プロセス自体を横に並べること。多重化や並列化とは別枠というか、比べる対象ではない
  - [PHP-FPM](http://php-fpm.org/)や Node の cluster モジュールがこれ

と理解しました。 多重化と並列化は置いといて、マルチプロセスについてより詳細にまとめていきます。

## マルチプロセスの数はいくつが良いのか

<blockquote class="twitter-tweet" data-conversation="none" data-cards="hidden" data-lang="ja">
  <p lang="ja" dir="ltr">
    <a href="https://twitter.com/L_e_k_o">@L_e_k_o</a> 何をやろうとしてるかわからんけど、node なら 1 core 1 proc で Load Average がコア数に近似する性能を目指せばいいと思う。使ったことないけど rxjs-cluster っての見つけた。<a href="https://t.co/QjSFZfg1K9">https://t.co/QjSFZfg1K9</a>
  </p>&mdash; けん⚡ (@ken_zookie)   
  <a href="https://twitter.com/ken_zookie/status/753847655789309952">2016年7月15日</a>
</blockquote>

<blockquote class="twitter-tweet" data-lang="ja">
  <p lang="ja" dir="ltr">
    <a href="https://twitter.com/L_e_k_o">@L_e_k_o</a> top コマンドで見える LoadAverage の値がCPUの数と同じであればちょうどCPUの性能を使いきれている、という見方ができる。過負荷試験とかで、どのプロセス数のパターンが最も優れているかの指標になる。
  </p>&mdash; けん⚡ (@ken_zookie)   
  <a href="https://twitter.com/ken_zookie/status/753849205827919872">2016年7月15日</a>
</blockquote>

頼れるパイセンがアドバイスをくれた。  
なんとなーく CPU のコア数と同じって理解だったのが、  
`LoadAverage`という値が CPU のコア数と同じになるように調整すれば良いと判明。

なのでプロセスの数自体は CPU のコア数と必ずしも一致しない模様。

## ロードアベレージって何

> load average とは ロードアベレージはシステム全体の負荷状況を表す指標。  
> 「1CPU における単位時間あたりの実行待ちとディスク I/O 待ちのプロセスの数」で表される。  
> システムのスループットを上げたい場合はロードアベレージを下げることを目標にする。 [load average を見てシステムの負荷を確認する – Qiita](http://qiita.com/k0kubun/items/8065f5cf2da7605c8043)

この引用部分だけでは **低ければ低いほど良い** ように見えますが、  
CPU コア数より LoadAverage が高い場合は処理待ちが発生しており、逆に低すぎると CPU パワーを余らせていることになる

なので CPU のコア数より高い場合は下がるように改善を。  
低すぎる場合は、余ってるマシンパワーを活かすようにプロセス増やしたり CPU 負荷が高いけど高速な処理に変えたりと性能改善が可能

## マルチプロセスはどのレイヤが担うべきなのか

最後。Nodejs には cluster や child_process などのモジュールが組込みモジュールとして提供されている。  
これはもう「アプリケーションをマルチプロセス化して下さい」と言っているようなものなのではないか…？  
Heroku も throng という簡易クラスタリング用のライブラリを使った例を出していたりする。

php にも[pcntl](http://php.net/manual/en/book.pcntl.php)というプロセス制御の拡張機能がある。 シングルスレッドの言語でもプロセスを並べれば、スレッドをロックするような sleep 関数等もプロセスマネージャが多重化してくれるので、他の処理を行える。 ただし、PHP には PHP-FPM などのプロセスマネージャもある。

実装は、たかだか 15 行程度のコードで可能。でも実装が必要で、メンテも必要。 **これってプログラム言語のレイヤが担うべき責務なのか？ ？ 言語でやらずにプロセスマネージャを別途利用したほうが良いのか??** というのが最後の疑問。

ちなみに Nodejs のサンプルコードはこちら:

```javascript
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("hello world\n");
    })
    .listen(8000);
}
```

会社のパイセンに聞いてみたところ、  
「並列処理とマルチプロセスは違う、マルチプロセスをやりたいなら言語レベルではなく、より上位でプロセスマネージャを利用したほうが良い。  
なぜなら、本気でクラスタリングしたいなら、Node のサンプルコードのような簡素な実装ではままならず、とても複雑な考慮や制御が必要になるのでコストとリスクが高すぎるから」

と回答を得た。  
「え、これ実装しなきゃ早くならないの？ ？ 実装汚れるなぁ…」と不安に思っていたので、独自実装はすべきでないという同じ方向性で良かった。

現時点で理解したことは以上です。
