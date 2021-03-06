---
path: /post/codeiq-fizzbuzz-dungeon/
title: CodeIQのFizzBuzzダンジョンLV1~4を解いた
date: 2013-12-09T15:25:42+00:00
categories:
  - やってみた
tags:
  - fizzbuzz
  - JavaScript
---
こんにちは。  
[CodeIQ](https://codeiq.jp/)というプログラミングの問題を解くサービスで面白そうな問題を見つけました。

> <span class="removed_link" title="https://codeiq.jp/ace/yanai_masakazu_fizzbuzz/">挑戦者求む！クロノス・クラウン合同会社 柳井 政和@FizzBuzzダンジョンさん｜CodeIQ</span>

よくあるFizzBuzzモノなのですが、段階的に縛りが強くなっていくという問題です。  
この問題を4問解いてみました。

<!--more-->

LV1
----------------------------------------

| 字数制限 | 禁止文字 |
| ---- | ---- |
| 100  | なし   |

禁止文字もなく字数制限も甘いので愚直な三項演算。  
見た目がちょっと綺麗になるよう整えました

下で38文字、スペースを削除すれば20文字です。

```javascript
i % 15 ? i % 5 ? i % 3 ? 0 : 1 : 2 : 3
```

LV2
----------------------------------------

| 字数制限 | 禁止文字                                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------------------- |
| 30   | `?`, `:`, `&`, `|`, `,` ,`$` ,`eval` ,`function`, `Function`, `if`, `switch`, `for`, `while`, `return` |

ifや三項演算での分岐が使えなくなってしまいました。  
3の倍数のときに1になって、5の倍数のとき2になって、15の倍数のとき3になるには。

  * `!(i % 3)` 
      * 3の倍数なら1、違うなら0
  * `!(i % 5) * 2` 
      * 5の倍数なら2、違うなら0

15の倍数は3,5の倍数であれば良いので、上を足します。

```javascript
!(i % 5) * 2 + !(i % 3)
```

  * 15の倍数(3と5の倍数)なら`3`
  * 5の倍数なら`2`
  * 3の倍数なら`1`
  * いずれでもなければ``

とうまくいきます。

LV3
----------------------------------------

| 字数制限 | 禁止文字                                                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 40   | `?`, `:`, `&`, `|`, `,`, `$`, `eval`, `function`, `Function`, `if`, `switch`, `for`, `while`, `return`, `!`, `^`, `~`, `<`, `>`, `=`, `Math` |

今度は`!`が封じられました。  
が、1,0を反転するだけなら1引いて-1かければ良いのでそんなに難しくもないです

  * `(Boolean(i % 5) - 1) * -2` 
      * 5の倍数なら2、違うなら0
  * `(Boolean(i % 3) - 1) * -1` 
      * 3の倍数なら1、違うなら0

とさっきの形に落とし込むことができました。あとは足すだけです。

スペースを消して、39文字。ギリギリです。

```javascript
(Boolean(i%5)-1)*-2+(Boolean(i%3)-1)*-1
```

LV4
----------------------------------------

| 字数制限 | 禁止文字                                                                                                                                                        |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 70   | `?`, `:`, `&`, `|`, `,`, `$`, `eval`, `function`, `Function`, `if`, `switch`, `for`, `while`, `return`, `!`, `^`, `~`, `<`, `>`, `=`, `Math`, `%` |

さらに`%`が封じられました。ただ制限文字数が増えてます。

％は、切り捨てでごり押します。  
~~での切り捨ても禁止文字なのでparseIntを使います。

`(1%5)`としていた部分を、`(i-parseInt(i/5)*5)`と置き換えます。 これで5で割った余りが取れるので、後はLV3と同じです。

`i%3`についても同様なので省略します。

スペースを消して、67文字に収まりました。

```javascript
(Boolean(i-parseInt(i/5)*5)-1)*-2+(Boolean(i-parseInt(i/3)*3)-1)*-1
```

もっとスマートに解ける方法がありましたら教えていただけると幸いです。
