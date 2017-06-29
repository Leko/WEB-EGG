---
path: /post/how-to-implement-dirty-check-and-method-missing-with-nodejs/
title: Node.jsのProxyでdirty checkとmethod missingを実現してみる
date: 2017-06-07T11:30:39+00:00
dsq_thread_id:
  - "5884530955"
categories:
  - やってみた
tags:
  - JavaScript
  - Nodejs
  - Proxy
  - Ruby
---
過去に[phpのマジックメソッドを使ってRailsのfind\_all\_by_*メソッドを実装してみる \| WEB EGG](/post/how-to-implement-find-all-by-with-php-magic-method/)という記事を書いたのですが、Node.jsでも[Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)の登場により、似たようなことができるのでは？と思ったので試してみました。

今回の題材は、同じくRailsのActiveRecordから、[ActiveModel::Dirty](http://api.rubyonrails.org/classes/ActiveModel/Dirty.html)モジュールです。

```ruby
person = Person.new
person.changed? # => false

person.name = 'Bob'
person.changed?       # => true
person.name_changed?  # => true
person.name_was       # => nil
person.name_change    # => [nil, "Bob"]
person.name = 'Bill'
person.name_change    # => [nil, "Bill"]
```

こんな感じに変更を検知するためのマジックメソッド、ユーティリティが加わるモジュールだそうです。

昔であれば[Backbone.jsのモデル](http://backbonejs.org/#Model-changed)が似たような仕組みを提供していました。  
ですが、あれば独自のセッタを提供しており、それを利用しているから変更が検知できるという仕組みです。 **いわば白魔術です**

今回は、 **独自のセッタ** を提供せず、普通にオブジェクト操作しているだけで変更検知ができちゃう機能の実装を目指します。  
白魔術に対して言うなれば、黒魔術です。

ちなみに使用しているNode.jsのバージョンはv6.1.0です。

<!--more-->

簡単な設計
----------------------------------------

モジュールは高階関数として作成し、使用する際はdecoratorとして利用できるようにします。  
なので継承関係によらず、任意のクラスに対して適応可能です。  
ざっくりしたイメージとしてはPHPでいうところの`trait`、Rubyでいうところの`include`相当だと思ってもらえればいいと思います

```javascript
@DirtyCheckable
class Profile {
  constructor (name) {
    this.name = name
  }
}
```

コンストラクタの形式は問いません。thisに何かセットされていればそれを利用できるようにします。 こんな感じで利用できる`DirtyCheckable`関数を実装していきます

完成済みのコードは[gist](https://gist.github.com/Leko/36dd864f87d0e2e61745f7869e2a8731)に上げてあります。

decoratorの挙動
----------------------------------------

decoratorはReactで[High Order Components](https://facebook.github.io/react/docs/higher-order-components.html)なんて言われて流行ってますが、要は昔からある関数型言語のアプローチのひとつ、高階関数です。

> &mdash; [【エンジニア初心者向け】高階関数入門(Javascript) – Qiita](http://qiita.com/To_BB/items/c9ce3391495f2ea9eb31)

一応、先程のコードをjsのコードにするとこんな感じになります

```javascript
const Profile = DirtyCheckable(class {
  constructor (name) {
    this.name = name
  }
})
```

DirtyCheckableの要件は、クラスを受け取りクラスを返す関数になります。 実装イメージとしては、以下のような感じになります。

```javascript
function DirtyCheckable (cls) {
  return class extends cls {
    // ...
  }
}
```

継承の逆？と言えば伝わるんでしょうか。  
渡されたクラスを親クラスにとる無名クラスを作成して返す感じです。

Proxyの挙動
----------------------------------------

Proxy自体の説明は[MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)を見ればだいたいわかると思います。

```js
const obj = new Proxy({}, { set (instance, prop, value) { console.log(`${prop}=${JSON.stringify(value)}`) instance[prop] = value } })

obj.hoge = 1
```

実行すると`hoge=1`と出力されたと思います。  
こんな感じで、ただのオブジェクト操作をフックすることが可能になります。

setの中身を実装することで、dirty checkを実装できます。 同様にgetの中身を実装することで、method missingも実装できます。

クラスをProxyする
----------------------------------------

  * コンストラクタの形式を制限しないように可変長で受け取って可変長で渡す
  * Proxyのインスタンスを返す

コードは以下のような感じです。

```javascript
// dirty checkするためのクラス
class DirtyChecker {
  // TODO: Implement dirty check
}
// get, setをフックするもの
const observer = {
  get (instance, prop) {
    // TODO: Implement method missing
  },
  set (instance, prop, value) {
    // TODO: Implement dirty check
  },
}
// 与えられたオブジェクトに応じてDirtyCheckerのインスタンスを作成する
export function createDirtyCheckers (obj) {
  const dirties = {}
  for (let prop of Object.getOwnPropertyNames(obj)) {
    dirties[prop] = new DirtyChecker(obj[prop])
  }
  return dirties
}
export default function DirtyCheckable (cls) {
  return class extends cls {
    constructor (...args) {
      super(...args)
      this.dirties = createDirtyCheckers(this)
      return new Proxy(this, observer)
    }
  }
}
```

上記のコードをベースに実装を続けます。

## Node.jsでdirty check

早速実装します。`DirtyChecker`はただのユーティリティなので実装は[gist](https://gist.github.com/Leko/36dd864f87d0e2e61745f7869e2a8731#file-dirtycheckable-js-L39)を御覧ください。  
先述のコードの`observer`のsetを実装します。  
`instance`は呼び出し元のインスタンスを指します。

なので、`this.dirties` = `instance.dirties`です。  
ということで、`DirtyChecker#set`をコールするだけです。

`instance[prop] = value`を忘れるとインスタンスに値が反映されないのでご注意下さい。

```javascript
set (instance, prop, value) {
  instance.dirties[prop] = instance.dirties[prop] || new DirtyChecker()
  instance.dirties[prop].set(value)
  instance[prop] = value
}
```

これで変更検知の仕組みは完成したので、後はユーティリティを実装します。

```javascript
export default function DirtyCheckable (cls) {
  return class extends cls {

    // ...

    changed () {
      for (let prop in this.dirties) {
        if (this.dirties[prop].changed()) {
          return true
        }
      }
      return false
    }

    changes () {
      const changes = {}
      for (let prop in this.dirties) {
        if (this.dirties[prop].changed()) {
          changes[prop] = this.dirties[prop].changes()
        }
      }
      return changes
    }
  }
}
```

試してみます。

```javascript
@DirtyCheckable
class Profile {
  constructor (name) {
    this.name = name
  }
}

const hoge = new Profile('John')

console.log('hoge.name:', hoge.name)
console.log('changes:', hoge.changes())
console.log('changed:', hoge.changed())

hoge.name = 'Tom'

console.log('hoge.name:', hoge.name)
console.log('changes:', hoge.changes())
console.log('changed:', hoge.changed())
```

実行結果は

```
$ babel-node index.js
hoge.name: John
changes: {}
changed: false
hoge.name: Tom
changes: { name: [ 'John', 'Tom' ] }
changed: true
```

いい感じです。  
各プロパティごとの`*Was`, `*Changed`, `*Change`メソッドはmethod missingを利用して実装します。

## Node.jsでmethod missing

今度は`observer`のgetを実装していきます

  * もし定義済のプロパティならそれを返す
  * 未定義の値が来たらmethod missingのフォールバック処理へ以降
  * 余計なサフィックスを除去し、本来のプロパティ名をフォールバック処理へ渡す

という感じです。

```javascript
const fallbackSuffixes = {
  Changed (instance, prop) {
    return instance.dirties[prop].changed()
  },

  Change (instance, prop) {
    return instance.dirties[prop].changes()
  },

  Was (instance, prop) {
    return instance.dirties[prop].was()
  },
}

const observer = {
  get (instance, prop) {
    if (typeof instance[prop] !== 'undefined') {
      return instance[prop]
    }

    for (let suffix in fallbackSuffixes) {
      if (prop.endsWith(suffix)) {
        const propName = prop.slice(0, -suffix.length)
        if (instance[propName]) {
          return fallbackSuffixes[suffix].bind(null, instance, propName)
        }
      }
    }
  },

  // ...
}
```

完成です。ここまでのコードを纏めて実行してみると、

```javascript
@DirtyCheckable
class Profile {
  constructor (name) {
    this.name = name
  }
}

const hoge = new Profile('John')

console.log('hoge.name:', hoge.name)
console.log('nameWas:', hoge.nameWas())
console.log('nameChanged:', hoge.nameChanged())
console.log('nameChange:', hoge.nameChange())

hoge.name = 'Tom'

console.log('hoge.name:', hoge.name)
console.log('nameWas:', hoge.nameWas())
console.log('nameChanged:', hoge.nameChanged())
console.log('nameChange:', hoge.nameChange())
```

```
$ babel-node index.js
hoge.name: John
nameWas: John
nameChanged: false
nameChange: [ 'John', undefined ]
hoge.name: Tom
nameWas: John
nameChanged: true
nameChange: [ 'John', 'Tom' ]
```

いい感じです。これでdirty checkとmethod missingの実装が完了しました。

パフォーマンス測定
----------------------------------------

最後に気になるパフォーマンスですが、[こんなコード](https://gist.github.com/Leko/36dd864f87d0e2e61745f7869e2a8731#file-benchmark-js)で比較してみます

100,000回同じ処理をしてみてどれくらいコスト差があるか比べてみました。

| メソッド       | ProfileWithDirty | Profile |
| ---------- | ---------------- | ------- |
| new        | 244 ms           | 6 ms    |
| set        | 29 ms            | 5 ms    |
| get        | 35 ms            | 1 ms    |
| methodCall | 63 ms            | 3 ms    |

newが激遅いです。  
他も優位な差が出ているものの、10万回で数十ms程度の差なら無視しても良いレベルではないでしょうか。

まとめ
----------------------------------------

かなり愚直な方法で実装しているので、もっと早い実装がたくさんあると思います。 使いみちが色々あって面白いので、ぜひProxy利用してみて下さい。 ただしよほど丁寧に書かないと黒魔術化は必至なので、用法用量をお守りのうえお楽しみ下さい。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>