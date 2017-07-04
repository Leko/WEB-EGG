---
path: /post/how-to-install-nodegit-with-electron/
title: Electronにnodegitが入らない
date: 2015-09-24T12:30:52+00:00
meaningless:
  - 'yes'
dsq_thread_id:
  - "4158165250"
twitter_id:
  - "646889724657799168"
categories:
  - 問題を解決した
tags:
  - Electron
  - Git
  - Nodejs
---
Electronでnodegitを使おうとして、どの参考記事も助けにならなかったので記事を残します。  
今回はこの原因だっただけでまた将来的には別の原因でどハマりする可能性があります。

<!--more-->

結論：助けにならなかった情報
----------------------------------------

* [electron/docs/tutorial/using-native-node-modules.md](https://github.com/atom/electron/blob/master/docs/tutorial/using-native-node-modules.md)
* [Doesn't work with Electron](https://github.com/nodegit/nodegit/issues/574)
* [ElectronにNodeGitをインストールしようとしてハマった](http://b.amberfrog.net/post/119528788216/electron%E3%81%ABnodegit%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%97%E3%82%88%E3%81%86%E3%81%A8%E3%81%97%E3%81%A6%E3%83%8F%E3%83%9E%E3%81%A3%E3%81%9F)

これらの情報は古くなっているのか、そのままの方法でやっても全くうまくいく気配がありませんでした。  
手元のNodeが4なので0.12に戻してみたり、色々やってみたのですが結局ダメ。

結論：助けになった情報
----------------------------------------

* [Nodegit build fails with Electron 0.31.x / 0.32.x](https://github.com/nodegit/nodegit/issues/686)

> Upgrade notice: (from the above link)
    
> Most native modules are broken because of io.js upgrade, modules writers need to use NAN v2 to rewrite the modules.

これが答えでした。  
Electronで後方互換のないバージョンアップが行われたようです。

原因まとめ
----------------------------------------

1. [Electronの0.31.0でiojs2からiojs3へバージョンアップされた](https://github.com/atom/electron/releases/tag/v0.31.0) 
    * 「Most native modules are broken because of io.js upgrade, module writers need to use NAN v2 to rewrite the modules」

      とのことで、多くのネイティブモジュールとの互換性を失ってしまった（[NAN](https://github.com/nodejs/nan)というパッケージの互換性がなくなった）
2. nodegitも例にもれず互換性がなくなったモジュールの１つだった 
    * 現在リリースされている最新の[0.4.1ではnanの1に対応している](https://github.com/nodegit/nodegit/blob/v0.4.1/package.json#L73)

      なので「nan2に対応しなければ動かないよ」に該当し、動かない。

      この互換性の差が具体的にどうビルドの失敗に繋がるのかは未調査。現状そこまで追る気がしない。
3. [Bump nan to v2](https://github.com/nodegit/nodegit/pull/702)のPRによって[対応するnanのバージョンが2.0.9になった](https://github.com/nodegit/nodegit/commit/9bc60984f8765049b70eb6f84a3276dc96aad419#diff-b9cfc7f2cdf78a7f4b91a753d10865a2)
4. ただしこのコミットはまだリリースされているバージョンには入っていない。
5. Gitのタグではなくコミットで`npm install`する方法を探る
6. `npm i -S https://github.com/nodegit/nodegit/tarball/ece6f2413073f4033316a7c36006a586b7bd94ce`

で解決しました。

起承転結
----------------------------------------

Issueにまとめてあります。 <span class="removed_link" title="https://github.com/Leko/revy/issues/16">このような感じ</span> になっていました。

バージョン
----------------------------------------

手元の環境はこのような感じです。

```
$ node -vv0.12.7$ npm -v2.11.3$ $(npm bin)/electron -vv0.32.3
```

nodejsのバージョンは`4.1.1`でも試してみましたが、問題なくビルドできました。  
なのでnodejsのバージョンは今回の件に関係ないようです。

Electronの0.31.*以降を使っている場合、nodegitはリリースされているバージョンではダメで、  
まだリリースされていないmasterのコミットを引っ張ってこないとダメなようです。  
このコミットの入ったリリースが楽しみです。

以上、備忘録でした。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>