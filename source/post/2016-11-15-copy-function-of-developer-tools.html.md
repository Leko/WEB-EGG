---
path: /post/copy-function-of-developer-tools/
title: 開発者ツールで使える便利なcopy関数
date: 2016-11-15T10:50:08+00:00
dsq_thread_id:
  - "5235472647"
categories:
  - 効率化
tags:
  - JavaScript
---

こんにちは。開発者ツールネタです。

Chrome でも Firefox でも Safari でも使える便利な関数が色々あります。  
その中の１つ`copy`関数について紹介したいと思います。

<!--more-->

## copy 関数とは？

クリップボードに渡した文字列をコピーする関数です。  
開発者ツールを起動し、コンソールタブを開く。

```javascript
copy("xxx");
```

と実行した後にペーストしてみてください。xxx がコピーされてると思います。

一点注意なのが、 **この copy 関数は開発者ツール以外では使用できない特殊な関数** です。  
なので.js ファイルとかに copy と記述しても「そんな関数無いよ」と言われてしまいます。

## 便利な使い方

js でごにょった値をコピーして使う、と言ってしまえばそれまでなんですが、  
具体的にどんなケースに使えるんだろうという具体例を考えてみます。

他のブラウザではわかりませんが、少なくとも Chrome では ES6 のメソッド群が色々使えるので、それらを使ったワンライナーを書いてみたいと思います。

### Cookie 周りの操作

[HTTPOnly]属性のついてない Cookie であれば、js から操作できます。

```javascript
copy(
  document.cookie
    .split(";")
    .map(exp => exp.trim())
    .filter(exp => exp.startsWith("_ga="))
)
  .map(exp => `document.cookie = '${exp}';`)
  .join(";");
```

こんな js を実行すると、`_ga`という名前の Cookie を他のタブへ貼り付けるようの js としてコピーできます。

### ページのタイトルと URL をコピーする

```javascript
copy(document.title + "n" + location.href); // 改行区切り
copy(`[${document.title}](${location.href})`); // Markdownのリンク形式
```

記事書くときに、他サイトから引用したり参考リンクとして貼ったり、という作業を効率化できます。

### ページ中のクラス名の一覧を取得する

```javascript
copy(
  Object.keys(
    []
      .concat(
        ...Array.from(document.querySelectorAll("[class]")).map(el =>
          Array.from(el.classList)
        )
      )
      .reduce((acc, cls) => Object.assign(acc, { [cls]: 0 }), {})
  )
    .sort()
    .join("n")
);
```

ちょっと長いですが、こんな感じでページ中に存在する class 属性の値を全て取得できます。

## まとめ

使い方次第で色々な作業を楽にできるので、ぜひ使ってみてください。
