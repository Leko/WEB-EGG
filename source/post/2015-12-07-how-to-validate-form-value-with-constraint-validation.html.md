---
path: /post/how-to-validate-form-value-with-constraint-validation/
title: HTML5のConstraint validationでライブラリ要らずならくらくバリデーション
date: 2015-12-07T23:50:56+00:00
dsq_thread_id:
  - "4347537103"
categories:
  - やってみた
tags:
  - Advent Calendar
  - HTML5 Constraint validation
  - JavaScript
---

こんにちは。  
[Hamee Advent Calendar 2015](http://qiita.com/advent-calendar/2015/hamee) 8 日目の記事です。

Chrome の開発者ツールで HTML の要素を眺めていたら`validity`という属性を見つけました  
validity プロパティの中には`patternMismatch`, `tooLong`などそれっぽいプロパティと bool 値。

調べてみたら **フォームのバリデーションはこれだけで十分なのでは**  
と思うほどに便利だったので詳しい機能の紹介と、より便利に扱う小ネタの紹介です。

<!--more-->

## 参考

情報源として主に以下のページを参考にしました。

- [Constraint Validation: Native Client Side Validation for Web Forms](http://www.html5rocks.com/en/tutorials/forms/constraintvalidation/)
- [ValidityState – Web APIs \| MDN](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)
- [4.10.21 Constraints — HTML5](http://dev.w3.org/html5/spec-preview/constraints.html)

## デモ

今回の記事でご紹介する内容をまとめたデモを[こちら](https://jsfiddle.net/leko/nwkLcry5/)に上げました。  
記事の内容を読みつつデモの動きやコードをご参考ください。

## いいこと

### 標準仕様

単に HTML5 の form 周りの属性を使用してタグを書くだけでいいので、ライブラリやフレームワークのようにロックインが発生せず、HTML 構造にも依存せず、「捨てる/捨てない」の話ではなく、最低限がそれです。非常に良いです。  
独自の仕様が存在しないので、HTML の属性や js が汚れずに済みますし、幅広いライブラリを活用できるチャンスが生まれます。

### バリデーション処理のメンテナンス・実装不要

ブラウザ内で入力チェックをしてくれるので、

- input の type 属性や select、textarea による差を吸収して値を取得する
- 取得した値と、オレオレ定義を元にバリデーションする

などの処理が不要になります。  
ちょっとしたバリデーションだし、と個々に自前で実装してしまうこともあるかと思います。そういったオレオレ実装をメンテナンスする手間が不要になります。  
少なくとも自分で書くより、ブラウザ側に入力の検証をしてもらうほうが、手間が減るだけでなく圧倒的にバグのリスクやメンテナンスコストが下がります。

残念ながらエラー内容を表示する処理に関しては現段階では自由度がほぼない（後述）ので、そこは自前で実装する必要があると思います。

### 便利な擬似クラスが利用できる

きちんと属性を定義しておくと、`:valid`, `:invalid`, `:required`, `:optional`といったフォーム周りの擬似クラスの恩恵が受けられるようになります。  
IE10+なら対応しているので、新しいブラウザ向けのサービスを作る際には検討の余地があるかと思います。

## checkValidity と ValidityState

では早速本題に入ります。まずは例から。

```html
<input id="form-text" type="text" required />
```

といった HTML を用意し、以下の様な js を書いてみます。

```javascript
console.log(document.getElementById("form-text").checkValidity()); // false

console.log(document.getElementById("form-text").validity); // ValidityState {}
console.log(document.getElementById("form-text").validity.valueMissing); // true
```

`checkValidity`メソッドの戻り値は false で、`validity.valueMissing`プロパティの値は`true`にっていると思います。  
checkValidity メソッドはその要素のバリデーション全てに通過した場合 true になります。  
validity 以下のオブジェクトは、バリデーションに通過した場合は false、バリデーションに引っかかった場合 true になります。

ちょっとややこしですが名前が肯定形になっているので、そこまで勘違いは起きないだろうと思います。  
`validity.valid`だけやや特殊で、checkValidity メソッドの戻り値と等しくなります。つまりこの値だけ ture/false の意味が逆です。ご注意ください

## willValidate と novalidate、disabled

どんどんいきます。

willValidate というプロパティもあります。  
このプロパティは、その要素のバリデーションが必要か否かを表します。  
候補の場合に true が、候補でない時には false が、そもそも input 系のタグじゃない場合にはプロパティ自体が存在しません。

```html

```

```javascript
console.log(document.getElementById("form-text1").willValidate); // false
console.log(document.getElementById("form-text2").willValidate); // true
console.log(document.getElementById("form-text3").willValidate); // true
console.log(document.getElementById("form-text4").willValidate); // false

console.log(document.getElementById("form-text5").willValidate); // false
console.log(document.getElementById("form-text6").willValidate); // true
console.log(document.getElementById("form-text7").willValidate); // true
console.log(document.getElementById("form-text8").willValidate); // false

document.getElementById("form-text8").readOnly = false;
console.log(document.getElementById("form-text8").willValidate); // true

document.getElementById("form-text1").value = "hogehoge";
console.log(document.getElementById("form-text1").willValidate); // false

console.log(document.forms[0].willValidate); // undefined
```

`disabled`や`readonly`になっている要素は false になるようです。  
js や開発者ツールなどで HTML を書き換え、readonly や disabled を外すと自動的に willValidate の値が変わるようです。

disabled を保ったまま value 属性を書き換えた場合の willValidate の値は`false`になってしまいますが、悪意のある入力はどのみちサーバでも弾かなければならないので、  
あくまで HTML+js でのバリデーションはユーザへのフィードバック速度を向上させること。利便性・使い心地・体感速度を向上させるためのもの、として捉えれば十分だと思います。

ちなみに`novalidate`属性を指定しても willValidate プロパティの値は変わりませんが、ブラウザデフォルトのバリデーションは行われうなくなり、値が空でも送信できるようになります。

## バリデーションエラーの例

## 問題点

参考に上げた記事内の[Current Implementation Issues and Limitations](http://www.html5rocks.com/en/tutorials/forms/constraintvalidation/#toc-current-implementation-issues)がとても参考になりました。

自分でも HTML と js を書いてみて不便に思ったことは以下のあたりでした。

- ブラウザデフォルトのバリデーションエラーの見た目をカスタマイズしたい
- エラー文言をカスタマイズできるようにしたい
- ラベル周りは吸収したい
- エラー一覧を取得する薄ーいライブラリ
- 正規表現をエラー表示用の値に変換する

ブラウザごとのバリデーションエラーの要素は[webkit がベンダープレフィックスつきで提供](http://developer.telerik.com/featured/building-html5-form-validation-bubble-replacements/)はしていますが、標準的な仕様はまだ出ていないようです。  
ということで自由度が低く現状ではゴリ押しもできないので断念。

そして表示するエラー文言を生成する簡易的なテンプレート機構が欲しい。  
カスタムエラーや、各ベンダーごとの独自実装はあるのですが、標準的なエラー文言のテンプレート的なものは存在しないようです。  
簡単に設定できて、必要なら上書きできるようになっているとお手軽さがあるなーと思います。

**バリデーションエラーをどう表示するか** は使用している CSS フレームワークや HTML 構造に激しく依存するので、  
ロックイン率が高くなるようなライブラリは使いたくない。  
なのでエラーの一覧を配列で返してもらい、それを HTML として描画処理は実装する、くらいが抽象化できる落とし所かなと思っています。

エラーを表示するなら例えば「お名前」など label タグの値もメッセージに含めたいこともあると思います。  
Chrome なら input タグに対応する label タグが`labels`プロパティで取れるのですが、他のブラウザにはない模様。  
ということで input に対応する項目名（label）を取得する処理をざっくり吸収したい。

あと、正規表現にマッチしなかった場合に、その正規表現をユーザに見せて理解できるわけがないので、うまいこと日本語にしたい。  
例えば`^[A-Za-z0-9-]+$`だとしたら`半角英数とハイフンのみ`といった具合です。  
自動で名前のマッピングは面倒なので、明示的に表示用の別名が指定できればいいなーという感じです。

## 小ネタ

上記の問題を解消するものをざっくり作ってみました。  
具体的な実装は[前述のデモ](https://jsfiddle.net/leko/nwkLcry5/)にコードが有ります。

`var errors = Validator.getErrors(input);`のように使用できます。  
引数にはバリデーションする input 要素を渡します。  
エラーの一覧を配列で返します。

## まとめ

HTML5 についてはメディア系以外は追っかけているつもりだったのですが、全然知らないことがまだまだあるなーと痛感しました。ValidityState、めっちゃ便利です。

Angular などのでかいフレームワークを使っているとこの辺一切触ることないですが、  
素の React など薄いビュー層を触っているとついバリデーションをオレオレ実装してしまうことがあるので、こういった便利な標準仕様をもっと抑えていこうと思います。
