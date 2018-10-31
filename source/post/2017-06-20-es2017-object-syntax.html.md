---
path: /post/es2017-object-syntax/
title: シンプルすぎて難解？昨今のNode.jsのオブジェクト周りの構文をまとめてみた
date: 2017-06-20T11:30:02+00:00
dsq_thread_id:
  - "5915681286"
categories:
  - 効率化
tags:
  - JavaScript
  - Nodejs
---

こんにちは。  
たまには基礎に返ってみるのも良いじゃないか、ということで

今回は、`{ a, b, c }`とか昨今の Node.js のオブジェクト周りの構文は難解だと知人に言われたのでまとめてみます。

<!--more-->

## （たぶん）昔書いていたオブジェクト定義

```javascript
function getProfile() {
  var obj = {
    name: "Leko",
    age: 25,
    getName: function() {
      return this.name;
    },
    setName: function(name) {
      this.name = name;
    },
    isAdult: function() {
      return this.age >= 20;
    }
  };

  for (var i = 1; i <= 10; i++) {
    obj["metadata_" + i] = "あああ";
  }

  return obj;
}
```

中身は適当ですが、構文的にはこんな感じのを書いていたような気がします

## キー名の省略

まず、変数名とキー名が一致する場合、キー名が省略可能になりました。  
以下の return の結果は`{ name: name, age: age }`と等価です。  
いちいち冗長な書き方をせずとも済むようになりました。

```javascript
const name = "Leko";
const age = 25;
return { name, age };
```

## メソッド定義

class の登場によってメソッド定義もなにやら簡素になりました  
書き方は class のメソッド定義と同等の構文だと思えば良いと思います

```javascript
return {
  // こんなリテラルが登場。
  getName() {
    return this.name;
  }
  // 以下と等価
  // getName: function () {
  //     return this.name
  // }
};
```

## get, set

これも class からの輸入品だと思いますが、ゲッタセッタが定義できるようになっています  
ゲッタセッタ自体は割と昔から書けた気がするので、昨今と表現するのはやや古いかもしれません。

```javascript
return {
  get name() {
    return this.name;
  },
  // 以下とだいたい等価
  // getName: function() {
  //     return this.name
  // },

  set name(name) {
    this.name = name;
  }
  // 以下とだいたい等価
  // setName: function(name) {
  //     this.name = name
  // },
};
```

## キー名を変数や式にする

js のオブジェクトのキー名は`[]`で囲うと式が使えます  
それだけ単体で見ると変な構文に思えますが、今まで動的にキー名を指定したい場合、  
一度変数にとってから`[]`でアクセスする必要がありました。その歴史から来ていると考えると割と自然な気がします。

```javascript
const keyName = "name";
return {
  [keyName]: "Leko",
  ["hoge_" + 1]: 123
};

// こう書かなくて良くなった
const ret = {};
ret[keyName] = "Leko";
ret["hoge_" + 1] = 123;
return ret;
```

## キー名に template literal を使う

`[]`の中には式が書けるので temprate literal も使用可能です  
キー名にプレフィックスつけたりサフィックスつけたりするときに便利です

`` js const i = 0 return { [`metadata_${i}`]: 'Hogehoge' } ``

## 分割代入

これまではオブジェクトの作成時に使う構文の話でしたが、オブジェクトを利用するの構文も変化してます。  
オブジェクト名を削りたい場合に、これまではいちいち`xxx.prop`を代入していく必要がありましたが、新しい構文が増えて便利になりました。

```javascript
const obj = { name: "Leko", age: 25 };
const { name, age } = obj;

// 以下と等価
const name = obj.name;
const age = obj.age;
```

ちなみにこの構文は関数の引数にも利用できます

```javascript
// と等価
// function cheapClone (original) {
//     return { name: original.name, age: original.age }
// }
const cheapClone = ({ name, age }) => {
  return { name, age };
};
const obj = { name: "Leko", age: 25 };
const obj2 = cheapClone(obj);
console.log(obj === obj2); // false
```

## ブラウザ互換

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment>

MDN によると、（2017/06/16 現在）Chrome と Firefox は素で動きます。その他は動きません。  
なので用法用量をお守りのうえ上記構文をお楽しみ下さい。  
とはいえ、Babel や Webpack を使わない例も減ってきていると思うので、あまり互換性とか気にしなくて良いのかなぁ、なんて思ってます

## さいごに

いかがでしたでしょうか。  
色々な構文が増えてどんどんシンプルに記述できるようになっている一方、古い js しか知らない人たちとの知識レベルの差がどんどん広がっています。

少しでも情報格差が減っていき、JSer の人と非 JSer の人が手を取り合える世界がくることを願ってます
