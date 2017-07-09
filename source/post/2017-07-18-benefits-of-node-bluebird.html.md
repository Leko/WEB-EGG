---
title: ネイティブのPromiseより早いbluebirdのPromiseの便利機能をまとめてみた
date: 2017-07-18T11:30:00+00:00
image: /images/2017/07/eyecatch-benefits-of-node-bluebird.png
tags:
  - Nodejs
  - JavaScript
---

こんにちは。  

[ES6のPromiseはBluebirdの４倍遅いらしい](http://qiita.com/kuniken/items/d0583b31941f15a0ecb9)PromiseのライブラリBluebirdが提供するAPIのうち、個人的に便利だと思ったものについてまとめます。  
なお、標準のPromiseにも搭載されている機能については割愛します。

<!--more-->

Promise#finally
------------------------------------------
[Document](http://bluebirdjs.com/docs/api/finally.html)

`.then(fn, fn)`や`.then(fn).catch(fn)`と等価のメソッドです。  
「成功しても失敗してもどちらにせよ実行したい処理」を意味づけして書けるようになります。

```js
// 素のjs（書き方１）
Promise.resolve().then(someCallback, someCallback)

// 素のjs（書き方２）
Promise.resolve().then(someCallback).catch(someCallback)

// Bluebird
import Promise from 'bluebird'
Promise.resolve().finally(someCallback)
```

Promise.join
------------------------------------------
[Document](http://bluebirdjs.com/docs/api/promise.join.html)

`Promise.all`と似たようなメソッドですが、こちらは可変長引数でPromiseを渡します  
さらに、コールバック関数では、配列ではなく渡したPromiseが１つずつ引数として渡ってきます。  
いちいちバベって`.then(([a, b, c]))`のように引数を展開する必要が無いので、あらかじめ決まっている複数個のPromiseを待つ処理に便利です

```js
import Promise from 'bluebird'
Promise.join(
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
    // 配列じゃなくて引数として渡ってくる
    (one, two, three) => console.log(one, two, three)
)
```

Promise.props
------------------------------------------
[Document](http://bluebirdjs.com/docs/api/promise.props.html)

同じく複数のPromiseを待つユーティリティですが、こちらはオブジェクトを渡せます  
オブジェクトの値すべてがPromiseである必要がなく、一部だけPromiseだったとしてもよしなに処理してくれます

```js
import Promise from 'bluebird'
Promise.props({
    one: 1,
    two: 2,
    three: Promise.resolve(3),
}).then(function({ one, two, three }) {
    console.log(one, two, three)
})
```

Promise.map
------------------------------------------
[Document](http://bluebirdjs.com/docs/api/promise.map.html)

`Promise.all(list.map(fn))`の略です。  
ループ処理してPromiseを待つ処理で、上記のような処理がよく登場してくるかと思いますが、  
若干ネスト（インデント）とタイプ数を削ることができます

Promise.mapは**同時実行数を指定できます**。第３引数に`{concurrency: 3}`と渡すと同時に実行する数を3に絞って実行してくれます  
さらに、**インスタンスメソッドとしても実行可能**なので、Promiseベースのパイプラインを作りたいときなどにとても流暢に書けるようになります

```js
import Promise from 'bluebird'
Promise.map(list, fn, { concurrency: 3 })

// Promiseのインスタンスメソッドとしても実行可能
Promise.map([1, 2, 3], n => n)
    .map(n => n + 1)
    .map(n => n * 100)
    .then(list => console.log(list))
```

Promise.mapSeries
------------------------------------------
[Document](http://bluebirdjs.com/docs/api/promise.mapseries.html)

`Promise.mapSeries`はPromise.mapとはちょっと違う動きをします。  
何らかの副作用を持つ処理などで、「先頭から順番に処理する、Promiseが完了したら次へ」という処理が実現できます  

`Promise.all`とも違います。あればPromiseのインスタンスを渡してしまうので順序や実行数の指定は不可能です。  
Promise.mapSeriesなら配列とPromiseを返す関数を渡すので、先頭から１つずつ処理が可能になります。

```js
import Promise from 'bluebird'

const articles = [
    '記事A',
    '記事B',
    '記事C',
]
const publish = (article) => {
    // 何らかの手段で記事データを公開する非同期処理
}

Promise.mapSeries(articles, publish)
```

Promise#catchReturn
------------------------------------------
[Document](http://bluebirdjs.com/docs/api/catchreturn.html)

`Promise#catchReturn`は、正常系としてrejectされうる処理で、`.catch(() => value)`などとしたい場合に使えます。

```js
import Promise from 'bluebird'

function hoge () {
    return Promise.reject(new Error('エラーだけど正常系'))
}

hoge().then('OK').catchReturn('WARNING')
```

Promise#tap
------------------------------------------
[Document](http://bluebirdjs.com/docs/api/tap.html)

Promiseの数珠つなぎの途中で`console.log`などを挟み込みたいときに便利です。

jsのconsole.logはRubyの[p](http://ref.xaio.jp/ruby/classes/kernel/p)とは異なり戻り値がないので、.thenなどにそのまま渡すことができません。  
なので、最短でも`.then(n => {console.log(n); return n})`という処理になってしまいますが、それを解消してくれます

```js
import Promise from 'bluebird'

Promise.resolve(1)
    .tap(console.log.bind(console)) // => 1
    .then(n => n + 1)
    .tap(console.log.bind(console)) // => 2
    .then(n => n + 1)
    .tap(console.log.bind(console)) // => 3
    .then(n => n + 1)
```

Promise#timeout
------------------------------------------
[Document](http://bluebirdjs.com/docs/api/timeout.html)

標準のPromiseは途中キャンセルのできないですが、Bluebirdならできます。  
ただし、**タイムアウトした処理自体は生きてるいる**のでエラーハンドリングに注意です  
例：タイムアウトすればPromiseはrejectされるが、タイムアウトしたHTTPリクエスト自体は明示的に切断するまで継続する

```js
import Promise from 'bluebird'

function connect () {
    // なんかに接続する処理
}

connect()
    .timeout(100)
    .then(() => 'OK')
    .catch(() => 'Timeout')
    .then(console.log)
```

Promise#delay
------------------------------------------
[Document](http://bluebirdjs.com/docs/api/delay.html)

リトライ処理に便利です。

```js
import Promise from 'bluebird'

// 素のjsならこう
const delay = n => {
    new Promise((resolve) => setTimeout(resolve, n))
}

// Bluebirdならこう
Promise.delay(n)
```

Promise.promisify
------------------------------------------
[Document](http://bluebirdjs.com/docs/api/promise.promisify.html)

Bluebird自体にPromisifyが備わっていたんですね。  
いままで[es6-promisify](https://www.npmjs.com/package/es6-promisify)とかわざわざ別のpromisifyライブラリを使ってました。

```js
import fs from 'fs'
import Promise from 'bluebird'

const readFile = Promise.promisify(fs.readFile)
readFile('hoge.json', 'utf-8')
    .then(content => console.log(content))
```

インスタンスメソッドとしても実行可能
------------------------------------------
他にも色々便利な機能もあるのですが、最後にBluebirdの恐ろしいところを。  
これまで紹介した`Promise.*`と使うクラスメソッドのほとんどは、インスタンスメソッドとしても実行可能です

```js
import Promise from 'bluebird'

Promise.all([1, 2, 3])
    .map(n => n - 10)
    .mapSeries(n => n * 10)
    .then(nums => console.log(nums))
```

などなど。  
`await`の登場によってかなり書きやすくなっては居ますが、async/awaitは見やすいんですが個人的には手続き型っぽくなるのが嫌いで、  
bluebirdで関数型寄りの書き味な非同期ベースのパイプラインを作ってみるのも良いかもしれません。
