---
path: /post/dockerize-friends-lang/
title: すごーい！きみはフレンズ言語をDockerizeできるフレンズなんだね！
date: 2017-03-06T08:20:51+00:00
dsq_thread_id:
  - "5601930388"
featuredImage: ./featured-image.gif
categories:
  - やってみた
tags:
  - Docker
  - 'F#'
  - Github
  - Mac
---
> [すごーい！ きみはプログラミング言語を実装できるフレンズなんだね – Qiita](http://qiita.com/vain0/items/6d3b75f667d3ec7f1d2a)

こちらの記事と勢いに感銘を受け、フレンズ言語を動かそうとしてみたのですが、  
リポジトリを覗いてみるとF#。Releaseで配布されているのはexe。  
**Windowsだ！ たーのしー！**

ということでDockerizeしてフレンズ言語をLinuxでもMacでも手軽に動かせるようにしてみました。わーい！

<!--more-->

結論
----------------------------------------

[PR出してみました](https://github.com/vain0/VainZero.Friends/pull/1)。  
2017/03/04 追記：マージされました。

すごーい！ 最終的なDockerfileはリポジトリをみてね！

大まかな処理の流れ
----------------------------------------

F#のプロジェクトのインストールは初めてだったので右も左もわからぬ状態から手探りしてました。  
何から何まで初めて触るツールばかりで新鮮でした。

  * [mono](https://ja.wikipedia.org/wiki/Mono_(%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2))というツールでLinux上からも.exeが実行可能
  * [Paket](https://fsprojects.github.io/Paket/)というツールで依存関係の解決をしている 
      * Paketはインストーラからインストールするのではなく`.paket/paket.bootstrapper.exe`を実行して入手する
  * [xbuild](http://www.mono-project.com/docs/tools+libraries/tools/xbuild/)というツールでプロジェクトをビルドする 
      * [tagomoris/xbuild](https://github.com/tagomoris/xbuild)とは別物なので注意

で、動作結果はこのような感じに。


![l3rEWRHgyB](./l3rEWRHgyB.gif)



すごーい！ Macでも簡単に実行できるんだね！

Dockerizeたーのしー！
----------------------------------------

コンテナの技術的な面白みもあるんですが、  
「一度苦労してしまえば、同じ手間に苦しむ人は居なくなる」 というプロビジョニング系ツールの思想あるあるとしても魅力を感じています。

わー！ IQが溶けて無くなりそうなのでこれくらいで終わります。
