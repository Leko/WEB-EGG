---
path: /post/es2017-arrow-func-syntax/
title: 条件付きな構文が多い昨今のNode.jsのアロー関数の構文をまとめてみた
date: 2017-06-27T11:30:02+00:00
categories:
  - 効率化
tags:
  - JavaScript
  - Nodejs
---

[シンプルすぎて難解？昨今のNode.jsのオブジェクト周りの構文をまとめてみた](http://leko.jp/archives/961)に続いて、今度はアロー関数編です。
おそらく今まではこんな感じで関数を書いてたと思います

```js
function hoge (options) {
    return 1
}
```

それがアロー関数の構文を使用すると、`const hoge = options => 1`なります  
めちゃくちゃ短くて楽、特に高階関数とか書き出すと欠かせない書き方なんですが、構文のルールが結構複雑なので纏めてみようと思います

ちなみに、アロー関数におけるthisやスコープの話はしません。あくまで構文の話だけにとどめます。

<!--more-->

中身が一行の場合
----------------------------------------

まずはベーシックなケースから。  
中身の処理が１行しかない場合、

- `{}`が不要
- 自動的に式の値が戻り値になる
- returnはつけたら構文エラー。なお戻り値がないvoid的な関数は作れない

```js
// と等価
// function hoge () {
//     return 1 + 1
// }
const hoge = () => 1 + 1
```

処理が複数行に渡る場合にはルールがちょっと変わります

1文で戻り値がオブジェクト定義式の場合
----------------------------------------

ただし、戻り値でオブジェクト定義式（ex. `return { age: 25, ... }`）を利用する場合、書き方が変わります
戻り値がオブジェクトの場合、`()`で囲う必要があります

```js
// NG
const map = ({ name, age, gender }) => { name, age, gender }

// OK
const map = ({ name, age, gender }) => ({ name, age, gender })
```

中身が複数行の場合
----------------------------------------

中身の処理が複数の文に渡る場合、書き方が変わります  
複数行になるともともとの書き方とあまり大差なくなります

- `{}`が必要。`{}`なしに複数の文を書こうとすると構文エラー
- 明示的な`return`が必要。returnしない場合戻り値はundefined

```js
// と等価
// function hoge () {
//     const prefix = 'hoge'
//     return `${prefix}_foo_bar`
// }
const hoge = () => {
    const prefix = 'hoge'
    return `${prefix}_foo_bar`
}
```

引数が一つの場合
----------------------------------------

引数が１つの場合、基本的には引数の`()`を省略可能です

```js
const increment = n => n + 1
increment(1) // 2

const prefixer = prefix => str => prefix + str
const log = prefixer('log: ')
log('hoge') // 'log: hoge'
log('foo') // 'log: foo'
log('bar') // 'log: bar'
```

ただし、以下の場合には`()`を付ける必要があります

引数にデフォルト引数を使用する場合
----------------------------------------

引数にデフォルト値を与えたい場合は、引数が１こだったとしても、`()`を付ける必要があります

```js
// NG
// const hoge = n = 1 => n + 1

// OK
const hoge = (n = 1) => n + 1
hoge()  // 2
hoge(2) // 3
```

引数がない場合、複数の場合
----------------------------------------

引数がない場合、引数が２こ以上の場合も`()`が必要です

```js
// NG
// const hoge = => 1
// const hoge = n, a => 1

// OK
const hoge = () => 1
const hoge = (n, a) => 1
```

引数で分割代入する場合
----------------------------------------

Reactの[Stateless Functional Component](https://hackernoon.com/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc)なんかでよく登場する書き方だと思います。  
引数を分割代入で受け取る場合もまた、`()`が必要です。

```js
// NG
// const sum = { a, b, c } => a + b + c
// const sum = [ a, b, c ] => a + b + c

// OK
const sum = ({ a, b, c }) => a + b + c
const sum = ([ a, b, c ]) => a + b + c
```

さいごに
----------------------------------------

アロー関数の構文が最も楽に使えるのは、

- 引数が１つ（かつ分割代入なし）
- 処理が１行

のときなので、「なるべく小さくシンプルな関数をたくさんつくれ」という言語設計者からのメッセージなのかもしれません
