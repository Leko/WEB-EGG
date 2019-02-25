---
title: Intl.NumberFormatを使えばゼロ埋めもカンマ区切りも％表記もできる
date: '2019-02-25T08:50:30.552Z'
tags:
  - JavaScript
  - Node.js
---

Number#toFixed や Math.round/floor/ceil を駆使して表示用の値を整形することってないでしょうか。カンマ区切りをオレオレユーティリティ関数で実装したりそういったことを実現するライブラリを探したことはないでしょうか。

ほとんどの JavaScript の実行環境には`Intl`という i18n のためのオブジェクトが組み込まれており、その中の１つに[Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)というクラスがあります。
オプションが色々あり、かなり便利で多機能なんですが整理された情報が少なく、身の回りで使用してる人も少ないと感じました。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Do you use Intl.NumberFormat?</p>&mdash; れこ (@L_e_k_o) <a href="https://twitter.com/L_e_k_o/status/1099975432059809792?ref_src=twsrc%5Etfw">February 25, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
（2019/03/04あたりに結果表示されると思います。途中経過を見る場合元ツイートに飛んでください。）

「それ自前で実装しなくても NumberFormat 使えば一発だよ」とレビューし続ける bot は人間がやるべきではないので、Intl.NumberFormat を布教するための記事を書きます。  
私的ユースケースごとにまとめて紹介します。

## 動作環境

さほど新しい機能でもないので、IE10 以外のブラウザ、0.12 以上の Node.js、多くのスマートフォンで Intl.NumberFormat が利用できます。  
「多くの」と表記しているように使えない環境ももちろんあります。

- [Can I use](https://caniuse.com/#feat=internationalization)
- [ECMAScript Internationalisation compatibility table](https://kangax.github.io/compat-table/esintl/)

また、Node.js では英語以外の言語を使う場合はビルド時のオプションが影響します。[公式のガイド](https://nodejs.org/api/intl.html)を確認してください。  
full-icu でビルドされてない Node.js で英語以外にも対応するには[full-icu](https://www.npmjs.com/package/full-icu)モジュールを install し`node --icu-data-dir=./node_modules/full-icu`オプションを指定するか、環境変数`NODE_ICU_DATA`に同様の値を指定すれば OK です。わざわざ再ビルドする必要はありません。

React Native に関しては[古い Android/iOS で使えないという Issue](https://github.com/facebook/react-native/issues/15382#issuecomment-320499665)があるようです。どのバージョンからなら対応しているかというきちんとしたソースは見つけられませんでした。  
代わりに簡易的な動作確認ができる Expo snack プロジェクトを作っておいたので、気になる方は下記リンクから動作確認してください。

> &mdash; [Intl.NumberFormat playground | Snack](https://snack.expo.io/@leko/intl.numberformat-playground)

ただ、仮に動かない環境があったとしても polyfill という選択肢もあります。

## polyfill

サポートしてない環境でも利用したい場合は[andyearnshaw/Intl.js](https://github.com/andyearnshaw/Intl.js/)を使うか、[polyfill.io](https://polyfill.io/v3)から polyfill を利用できます。

以上で Intl.NumberFormat を利用する前提条件は整ったので、ユースケース別の紹介に移ります。

## ユースケース：ゼロ埋め

ゼロ埋めは、よくオレオレしがちな処理の代表格だと思います。  
`String(num).padStart(2, '0')`とか`const zeroPad = (n, digits) => ('0'.repeat(digits) + n).slice(-digits)`みたいな。  
NumberFormat で一撃です。`minimumIntegerDigits`で整数部の最小桁数を指定できます。桁数が足りない場合はゼロ埋めされます。

```js
const zeroPad3Digits = new Intl.NumberFormat('ja', { minimumIntegerDigits: 3 })

zeroPad3Digits.format(1) // => '001'
zeroPad3Digits.format(54) // => '054'
zeroPad3Digits.format(100) // => '100'
```

## ユースケース：カンマ区切り

桁数の多い数値をカンマ区切りで表示することはよくあると思います。  
useGrouping を ON にすることでカンマ区切りで整形できます。  
デフォルトは ON なので、useGrouping に明示的に false を指定すればそのまま表示もできます。

```js
const commaFormatter = new Intl.NumberFormat('ja')
const rawFormatter = new Intl.NumberFormat('ja'), { useGrouping: false })

commaFormatter.format(1234567890) // => '1,234,567,890'
rawFormatter.format(1234567890) // => '1234567890'
```

## ユースケース：％表記

`0 <= N <= 1`な値を％表記にするために`(N * 100).toFixed(2) + '%'`みたいな処理をしたことないでしょうか。
NumberFormat には`style`オプションがあり、これを`percent`に変更することで％表記になります。

```js
const percentFormatter = new Intl.NumberFormat('ja', { style: 'percent' })

percentFormatter.format(0.5) // 50%
percentFormatter.format(0.12345) // 12%
```

小数点以下をどう扱いたいかもオプションで指定可能です。  
`minimumFractionDigits`で最小桁数（足りない場合は 0 で埋める）、`maximumFractionDigits`で最大桁数（超える場合はこの桁数に収まるよう四捨五入）を指定できます。

```js
const fraction2 = new Intl.NumberFormat('ja', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

fraction2.format(0) // => '0.00%'
fraction2.format(0.12345) // => '12.35%'
```

また、有効数字も指定できます。

```js
new Intl.NumberFormat('ja', {
  style: 'percent',
  maximumSignificantDigits: 1,
}).format(0.1234) // => '10%'

new Intl.NumberFormat('ja', {
  style: 'percent',
  maximumSignificantDigits: 2,
}).format(0.1234) // => '12%'

new Intl.NumberFormat('ja', {
  style: 'percent',
  maximumSignificantDigits: 3,
}).format(0.1234) // => '12.3%'
```

## ユースケース：通貨の表記

EC や暗号通貨周りでありそうなユースケースだと思いますが、使い心地は「要件による」かなと思います。

`style`に`currency`を指定し、`currency`に表示したい通貨を指定し、`currencyDisplay`で表示方法を指定します。
為替をもとに通貨の変換をしてくれるわけではなく、あくまで渡された値の表示方法を整形してくれるだけなので、難しく考えることはないと思います。

```js
new Intl.NumberFormat('ja', {
  style: 'currency',
  currency: 'JPY',
  currencyDisplay: 'symbol',
}).format(1000) // => '¥1,000'

new Intl.NumberFormat('ja', {
  style: 'currency',
  currency: 'JPY',
  currencyDisplay: 'code',
}).format(1000) // => 'JPY 1,000'

new Intl.NumberFormat('ja', {
  style: 'currency',
  currency: 'JPY',
  currencyDisplay: 'name',
}).format(1024) // => '1,024 円'
```

currencyDisplay が`symbol`（デフォルト）の場合はどの言語でも表記は固定（通貨の記号）ですが、`name`の場合は第一引数のロケールによって表記も変わります。  
また、Node.js の場合はビルド設定（もしくは full-icu モジュールの有無）の影響を受けます。

```js
new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'JPY',
}).format(1000) // => '¥1,000'

new Intl.NumberFormat('zh', {
  style: 'currency',
  currency: 'JPY',
  currencyDisplay: 'name',
}).format(1024) // => '1,024 日元'

new Intl.NumberFormat('ja', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'name',
}).format(1000) // => '1,000.00 米ドル'
```

通貨ごとに表示桁数のデフォルト値は異なります。オプションを渡すことで変更可能ですが、[ISO 4217 によって規定されている通貨ごとの最小桁数](https://www.currency-iso.org/en/home/tables/table-a1.html)を下回る指定はエラーになります。

```js
new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'JPY',
  minimumFractionDigits: 2,
}).format(1000) // => '¥1,000.00'

// RangeError: maximumFractionDigits value is out of range.
new Intl.NumberFormat('ja', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(1000)
```

また、カンマ区切りを OFF にすれば非カンマ区切りな値も作れます。

```js
new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'JPY',
  useGrouping: false,
}).format(1000) // => '¥1000'
```

## ユースケース：単位、通貨、％、カンマや小数点を数値とは別スタイルにしたい

さらに、デザインに合わせて`%`や通貨に色を付けたりフォント変えたりサイズ変えたいなどもあると思います。そういうときは`formatToParts`を利用できます。

```jsx
// React想定で書いてます
function Price({ price, locale, currency }) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  })
  const [symbol, ...others] = formatter.formatToParts(price)

  return (
    <span>
      <span className="currency">{symbol.value}</span>
      <span>{others.map(({ value }) => value).join('')}</span>
    </span>
  )
}

;<Price price={1000} locale={'en'} currency={'USD'} />
```

https://codesandbox.io/s/km4z3o460v?autoresize=1&fontsize=14&hidenavigation=1&view=preview

[デモ（codesandbox）](https://codesandbox.io/s/km4z3o460v?autoresize=1&fontsize=14&hidenavigation=1&view=preview)

`type`プロパティの値は種類が豊富なので[formatToParts のドキュメント](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat/formatToParts)をご覧ください。

## 策定中の仕様

tc39 の[proposal-unified-intl-numberformat](https://github.com/tc39/proposal-unified-intl-numberformat)にて NumberFormat の追加 API について議論されています。

+-を常に表示する`signDisplay`や、単位（`m/s`）の表記、特定領域の表現力を増すための`notation`オプションなどが議論されています。

## Number.prototype.toLocaleString

Intl.NumberFormat クラスを利用する他に、[Number.prototype.toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString)という Number のメソッドからも利用可能です。

実質的には Intl.NumberFormat のコンストラクタと同じ引数を取ります。好みに合わせて使い分けるといいと思います。  
インスタンス自体を別ファイルに分けて再利用したいので、個人的には Intl.NumberFormat の方をよく使います。

```ts
export const percentFormatter = new Intl.NumberFormat('en', {
  style: 'percent',
  maximumFractionDigits: 2,
})

// ---

import { percentFormatter } from './formatters'

percentFormatter.format(0.34567) // '34.57%'
```

## さいごに

Intl には他にも色々な Format クラスがあるのですが、自然言語に寄りすぎた処理は言葉尻が微妙に要件と合わないってことが多く、活用しきれていません。

一方 NumberFormat クラスは「数値表現」だけにフォーカスされているので、汎用的で強力な API だと思います。使えるところではここぞとばかりに使っていきましょう！
