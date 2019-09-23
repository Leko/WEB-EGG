---
title: 「外部パッケージの型定義もインストールし推論できるTypeScript playgroundを作った」という題で登壇してきました＋スライドの補足
date: '2019-06-13T10:25:29.743Z'
featuredImage: ./featured-image.png
tags:
  - TypeScript
  - JavaScript
  - npm
  - WebWorker
  - comlink
---

"外部ライブラリもインストール・型解釈できる TypeScript playground を作った"という題で[俺得フロントエンド (1) LT 会](https://opt.connpass.com/event/130433/)という勉強会で登壇してきました。スライドはこちらです。

> &mdash; [外部ライブラリもインストール・型解釈できる TypeScript playground を作った](https://talks.leko.jp/advanced-typescript-playground/#0)

スライドの内容をそのまま書いても意味がないので詳しくはスライドを読んでいただきたいのですが、発表時間の都合・構成力不足で伝えきれなかった部分の補足・補完的なものを書きます。  
この playground のより詳細な説明、内部で使ってる技術の説明、この playground に限らず汎用的に活用できそうな技術の話をします。

<!--more-->

## 何を作ったの

> &mdash; [TypeScript Playground | The unofficial playground for advanced TypeScript users](https://playground.type-puzzle.org/)

↑ を作りました。

## どうやって使うの

「動かないじゃん！」と言われても悲しいので、これをきちんと伝えておきたいです。  
ちゃんと使えるものにしたいので、何通りかのユースケース用にサンプルを共有し「なるほどこういうことができるのね」のイメージを掴んでいただきたいです。

- [@types/react, @types/react-dom で React の型推論](https://playground.type-puzzle.org?c=H4sIAAAAAAAAA81TXU%2FbMBT9K5YlVJDaNCl0ZSkgPjS0PmxDW5%2B28GCc29bg2JZ9Q%2Bmq%2FPf5phQEmzRte9lD1Pj45Nxzjt01l7YEnnNVOeuRfQYhscvW7MJGwIBB1rCZtxUruKe9go8L80heMw%2BmBL%2BldFpGr7RVpzCFwZUDduWtC%2ByYrQvD2NwDoDLznAX08XdMIC48hIXVZc5MXd2Aj2gzJgGpRQjszDkGDxgnhWdXR63uyUY2oEAlWQkzUWtsd3J2JTwqobfERwcvxmUpQTSroXGbMLtHNHDr9Ljg70FrW3DWP%2Bmy0sq6iuOTOeA7DfR6vpqUux1vLXb29qIU73IM0pqZmvN8HeutnNLgPzlU1gSCbsNDLLztKpKNnVROK6nwzKx4jr6GLqd6JH6stb5YgLwLL%2FHL2khSm8aCX22dK1NeCK1jBv1KjYoAj6uJUVSM%2Bi5IY8t5tjFdqCdRCB9sWWuYGIT4%2BQZumi4vwVFbRipy8G3NjajoGp3SoYf%2BNlwswhHconF9Dz60Q3n2JtlPsn1OUkF65TZmOGX60q7pPBV5jbWxmfWbu0kfCCTNQZod9tKD3mA0TYf5%2Ftv8IEsOh8OvkaGVuWurNq6KzAVivBH9%2FnK5TCJyG5J4Kn0n5J2YQ3%2FnIG3t7QwuN7ZjPFffaBUW4EmkDuAf421zQCWUpnXoRcFeC59WSnob7AxJnlQiyWB8Yui2o78Uum66v%2ByX%2Fmi%2F6zhNhn9cMdt9kt%2F7ue4snWajfJjm6SAZZqN%2FrrtN8f9Vft38AGuDhuQbBQAA)
- [Redux でシンプルなカウンター store の推論](https://playground.type-puzzle.org?c=H4sIAAAAAAAAA41UTVPbMBD9Kzu6EKbgJP0axi0MlNKZdKa0A5xa96DYii2ir5FkQprmv3clO45NOTA5JNp97%2B1q9ykbkuuCkZRwabT1sIHcMurZrdeWwRYWVkvIiGVF%2FZiRD5nKlF8bBrceQXAKm0wB5LpWPgVVyzmziNlGXK6V88AV95yKiE%2BfpU2GhNn15c3Vt6vruxTrcoXtSKZ8RpA1OH%2FYET5f9QgFGxJ650FTbRQxo0M4PYPRBsK90n152B52JTqV%2F%2FFd9Qbfjuci9xyZCL9hvrbqDoMfQ0Yv9sXP4O8z6a7WWa%2FhMP%2Bc2VDeDSfZn%2B8R0Fg33dWPrcZZuxX3eQWjBpCEWodNBvdAHeuNvQkC1gytBUc0e4qFk3iAVzCFsLSOvl%2FCS%2BjHPXrBFrQW%2FikvwiNkO%2FSHi8487ft01I6nWcB4DDMPK22XLlMRnRTcGYr3H3WzHx0G8JNsN%2FomG6WurNU2hbAhOMhIpUuWkQPgDpT2QJ3jpaJzwcDr6IgA6rv279CEB8l%2FVXdO2ok3RiJHxDu88YKXJN3gK5WGC2a%2Fm7jYELp3j%2FhucQq5R7DSM2kEz7m%2FUGuSeluzI%2BK85bm%2FroW4rFi%2BdMP4l1pFN4S7PUl94qq4pEJcGCOeqP2w2jDr17PGePwPDRo7zL6Nu4q7ffQLivnK6rqsLtEvbqZuoyMbxHZ7hEMyTBVM5Tw082tDFJUsXhD%2FevCCOAwTzrWKvwoMPTDrYm3yNpkkUxJEXG65aToiP5CLHcf1RD%2BhF5WnXOFLWmgLX%2BkDvY14oMY45C%2FZGo1ThAa6wq25QgtBA7%2FNXhdPi3aMVOCBS1nvEpUOixH8gUUVI%2Bg6wEVUZUKS39hwUEzJ68n05Hg6OZ6%2BuZu8Td9M08m75P3rk5%2BRr5Zx38pIRFbeG5eOx6vVKsHIvcMnJceG5ktasvGu50pLZjDQEhAfMwnCtS2bdrTjaMR1T7PkvqrnUTDC710nOK9L9wLkmDtX4%2F5wn6aeC%2B4qHBz2Xjtm2316LgttwziZpFzsI%2Bftd1ANAphtl9X4oadB80LwuIqdRhs5l6ylD%2FAlZdRq1cMXVCV0bqnUD%2BdliD1He2Grv%2FHzD%2B4kKd1IBwAA)
- [Lodash でなんのアテもなくただ推論させる](https://playground.type-puzzle.org?c=H4sIAAAAAAAAA52SbWvbMBDHv4rQKCTgJI7XjNUlpVlLWaF0gwUGq%2FtCsZVYjZ6Q5HWZ8XffnZz0ae9KEsKd7v%2B70%2F3V0tJUnOZUKGtcIC1ZCxm4S4hilnRk7YwiBZWmYr4u6GmhCx12lpOvjWKazElbaEI0UzwnPjihN6eYYBuIdaNW3EHcRVlptA9EBK583svv7gFwh%2FXtHlHQG741BU16wvSEdMnr86VRT8dZ%2Bv8xc8%2FybEq6Qt%2B%2F7O4XVSMDtB20WEO6%2FShDMj%2BLibM5YF8oGNbfAt2DCHYyiBcY91sa7HnDBFrjCAUdnh6Uiu1WHK8DwmcKKHU1wFrsiP9jH5gL%2FqcI9QDuDwhk0IQGD6C12NC8BZeUFZK7bzYIoGPqwf8B3xxnZYBiba6VlaIUYaF3NA%2Bu4QlFR8pw20h5UfNy61%2FnrxpdIm0Jfr45%2BgJDXjApF9bKN7Tvzljuwu5aiyCYFH8ZMg41z2Msa7GHdl1CK265rrguBba6a%2BO2YPxzfEx%2B0r8vuAZc2WI%2BpiH%2BzZ2PeHo8nsL3Y0oR5ksnbN%2BX4vg%2FYkwqDtsVcUNkbRy5MaPLnluxgNgsnZ6M0tkoS5fTT3k6y2fZ%2BHM2%2BwUVUuht3Ku2CirrEKzPJ5PHx8cxZB78GCyYWFZu4ZVMjo7TOOFRdvU0em0Ut3D4QrwBT5tVVF72o3G5w3mrt%2FEH8LGCjSRgqDVeBON27wIBYdVs%2FLu0E%2BF9A2sHv2yzksLX3OFGGs%2Fd3q%2BDL1wxITH2I9jOKKbPlSid8WYdsBlSoEgH%2BIGJ0fR3gu7h8w9nd7wjqQQAAA%3D%3D)
- [jQuery などのグローバル変数が生えるパターン](https://playground.type-puzzle.org?c=H4sIAAAAAAAAA51TXW%2FbMAz8K4KQAg7gOF8dtmXo0K5Dge6hGdA%2BbemDKjO2WlnSJHmJE%2FS%2Fj7STGO3jYMSIyOPdkZT3XNoc%2BIIPkmTILr6y%2FcowJq0JkQ28tZFdsEGy4s7Dig8px1gmQ8DQk5Avhbe1yUfSautXPGUr7iHvgbmIApGlLaDLCiH6rHAOTJ50J9bK9NkOEaOneg%2Frrr6M0YXFeOy0aDrtLDYORq7e7TRk1hdvCSJsIxIsUYj1NSfM8MvK0L9BVkD8cb%2B8S3oJ2IrKIae0VW85lmAS6opG1c6nk6DaLESvTKHWTYtImam1TtlsODzNTURZJkC1NGGL7OC99QmcIEJvRBMOuziCtC3Q2HdraAfk%2BZVePOUxIGStCr7Y4x4rpzT4pYsK6yj0HLa4WQ9CRgQbe4sNKanilWn4IvoaUk6eZbxDp9clyJfwNn5TG0lsDzjjd6lvyuTXQusr5%2FQ7tp%2FeOvCxuTUqKqHVThDHEdPbeCjViTR2Cr%2F5858afMMfX19TngNdEDBStbk9N6Kiu3rZoscHKMpKFMR4R5Lyv%2BBDq8jn2TybcmIK0ivX%2BeDUzn17ZjmsFdnEibG19ezEiSskytlk%2Bmk0mY8mnx8mk8X5dDGfZR8%2Bnv9ChFbmpR2zcRUij%2Fdms9lkGHkOdHPGDj8SUcD47HzSujub3RwksD9XP2kVSvDEUgfwh%2F6OfUAllKZzGCHjqA1fVkp6G%2Bw6Ej%2BxIMhE%2FGHT7ZD%2Bk%2BgRn3%2F3SSgwDgQAAA%3D%3D)
  - tsconfig.json に`types`フィールドを足しています
- [jest のアサーション周り](https://playground.type-puzzle.org?c=H4sIAAAAAAAAA51T70%2FbMBD9V06WkFKpTZNStJHBxI8Jxj5sk8anrUgE99oYHNuynRZW%2Br%2Fv7JAW2PgytbWb83vv7p4vK8b1FFnBuCydg3OL6IWaw2qiALhWztuGe20TY8Wi9Ail%2B0RbAWHtwWo9UQE5R99Rk14BxNqIPMlABYfgK%2BHSViElymfdWJf0PrQwMYOkggPYg8dHyN%2FBwSFUvU4DwKJvrIIJO9d6CrhARSkm7Im8BpQONxp5%2Fiaz1vZfzDfQ5cyjVVqrLT5stMTOp%2Bi4FTeYEPyp%2FwnrQ9KDw4%2Bt5DPEM5Negah5T4A2tYPr54Vew7JCBXtFlv3F6rxVeknuKlzGa9k4CuEgdZ3Re33I2u8W0PLn3bW3IpurJPoWivcGuU86bPriznup1yfRhhced%2Bx1%2ByducWF95h0ln4k5K1Y0hLUREu034wVVFEK37p7G0mLJPYGVvqiNFFz4Y%2FXACppK7LMwZtx%2FbaQ8rZDfuZfxs0bxoHb5YPDV0YlQ09NSymNj5Cu171YbtP7hQgkvSil%2Bl0Gjw2zLuKRR7qK%2BzfCL3aLz7Gq97rMpGqTpUFzEkxVTZR1es6OIHUYgpeSUjKKtQJ8t0LqYjY1G6SjdZUEozI9pi2Chlx%2FxmQZrJkKNZBfMtIUvreSUBiDws%2Fz9IBsP8vwy3y%2Fy3SIbp9n%2B%2BCchpFB30WFlakJW3htXDIfL5TKlyK1L6TKGpuR35RyHO%2BMsFrczOos1U2umuZHCVWiDRuPo9Whb65rAuhQyPLsB6Q1i%2BKgW3GqnZz6oBxUCKU8%2F6jj6859CV%2FT5Ax4Dj87EBAAA)
  - tsconfig.json に`types`フィールドを足しています（jest に型ゲーなんてあるのか？ という感じですが色々あるアサーションメソッドの補完が効きます）
- [query-string を適当に使う](https://playground.type-puzzle.org?c=H4sIAAAAAAAAA51SbW%2FTMBD%2BK5b5MlCbtgxGyTTBmIQ0CcHEyhfIPrjJtfHq2J7PXglV%2Fztnpy1tJYSGqqrXx8%2BL73wrXpoKeM5lY43z7AUTyB6QzZxpWMEfAri2j95JPS%2F4eaELXRqNnlnhECp2Qdws1ScFf5fYF7WZQ8Gfn2%2BpCe2YnZGctSerDs4po%2BOzdVTwHvdIspmc83xFd2usVOC%2BWC%2FJK0L3%2BJNu60CUnsjaXDdWyVL6S93y3LsAPR5TSv85KHVVQ7nAQ%2Fxj0GV0m7QWjo4%2BSF1dCaUurVVHbjfOWHC%2BvdbSS6HkLxE9tpw%2F15jUcmO6Xvd4BRZ0BbqUMerHimvRxGHvj5W6oI5thINOVUXQIzhMAfwse5MNefTC0knbxfKbOHMmdMV2M2Xfvn7aDLvDkFQLaJfGVTGdT51ZIjhCE2sXn%2F7xrtMOiEp6VdFsf8EnXXCqQxB2fEqmmnqMexSvuSkQhCvrpEZ%2BRwfCxx5fDkdv%2B8Oz%2FnA8GQ3zV%2BP89HV2Ohp%2FJ4WSepHeWNuGmLX3FvPBYLlcZoTcY0brMLCiXIg5DI5GWJsGLOF7urn0dZgmEdLDOkDj6oAHyme0SFUTr%2BvAGpTe0CSeZkHaaaBZP001kIiBloKWRARfG5f67rbjNonYbVLF2TZCKsL3zd7PIxgzNs9yeLw9oOfemO6fxlQbpkpiDSn4b7x%2FZpMR1drTlxY2rfj%2Fe93R5zeloGfZkAQAAA%3D%3D)
  - @types ではなくパッケージ自体に型定義ファイルが含まれている例です

デモをいくつか見ると気づくかもしれませんが、`react`のように型定義のないパッケージはインストール不要で、代わりに`@types/react`のインストールが必要です。react は型定義を配布していないため、@types のパッケージが必要になります。  
一方でパッケージ自体が型定義を配布している query-string や Redux などのパッケージはそれ自体を入れる必要が有ります。

文字にするとややこしいんですが、「普通に開発するときにインストールすること」と同じように使えば動くはずです。

## なんで作ったの

TypeScript の playground といえば、[TypeScript 公式の playground](https://www.typescriptlang.org/play/)がまっさきに思い浮かぶと思います。主な機能は以下のとおりです。

- １ファイルで完結するくらいの TypeScript の型チェック
- TypeScript のコードを書いて、JavaScript にトランスパイル
- トランスパイルされた JavaScript を実行して動作確認
- tsconfig の一部オプションをトグル可能
- 書いたコードを復元できる URL を生成し共有

"〜をする Conditional Type"みたいな、ちょっとしたクイズとしては十分に活用できますし、TypeScript のようなトランスパイル文化に親しみのない方が具体的にどのような JavaScript が生成されるのかを理解したり、実行して成功体験を少しずつ積んだりと、ひとまず TypeScript に触ってみるものとしてとてもいい作りだと思っています。

ただ、型にフォーカスしたときにやや物足りないと思うことがあります。具体的には以下の問題が挙げられます。

- 型定義を提供している npm パッケージと絡めた型が書けない
- tsconfig でいじれる項目に限りがある
- JSX が使えない
- 使ってる TypeScript のバージョンがわからない

対象ユーザと存在意義が違うので、中途半端に本家に混ぜてどっちつかずになるよりも、とことん自分がほしいものを追求した playground を作ってみよう（その後は実用レベルになってから考えよう）と思いたち制作に至りました。

## 技術的なところ

だいたいはスライドの方に書いたので、書き足りないところ・省略したことについて加筆します。

- monaco-editor の API の調べ方
- ブラウザで文字列の圧縮・解凍
- ブラウザでコードフォーマット（prettier）
- comlink-loader での WebWorker 化がすごい

## monaco-editor の API の調べ方

トーク後に「monaco で〜をするにはどんな API・機能を利用すればいいのか、ドキュメントを見てもいまいちわからない」という話をもらったので補足しますが、特別なことはありません。  
API ドキュメントを隅から隅まで読む、目的から Issue を探してコメントを追う、ソースコード読むなどして泥臭く可能性を探り、monaco 公式の playground にて実験して確証を得てます。

公式ドキュメントはこちらです。

> &mdash; [Monaco Editor](https://microsoft.github.io/monaco-editor/)

公式 playground はこちらです。  
ユースケースごとに boilerplate が用意されており、初期コードを書き換えてだんだん挙動を理解していく形になると思います。  
なお monaco-editor の playground にはシェア機能がありません。付け足したい。

> &mdash; [Monaco Editor Playground](https://microsoft.github.io/monaco-editor/playground.html)

TypeScript に絞って理解を深めるとっかかりを紹介すると、

- TypeScript の Language Service、Compiler API が前提知識として必要です
  - API が確定していないため、これらの情報もドキュメントがありません。公式の Wiki や handbook を手がかりに手探りしましょう
  - [Using the Compiler API · microsoft/TypeScript Wiki](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)
  - [Using the Language Service API · microsoft/TypeScript Wiki](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API)
  - [TypeScript Compiler Internals · TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/docs/compiler/overview.html)
- [`monaco.languages.typescript.LanguageServiceDefaults`](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.typescript.languageservicedefaults.html)に TypeScript の LanguageService を操作するための API が生えています
  - `setCompilerOptions`メソッドで tsconfig.json を読み込ませられます
    - エディタに書かれた tsconfig.json（文字列）から`CompilerOptions`を得るに Compiler API のメソッドを理解する必要があります
    - JSON.parse だとコメントがパースできないので TS API を使うのが楽
  - `addExtraLib`メソッドで「このファルパスにこういう型定義ファイルがある（ことにする）」を LanguageService に通知できます

> &mdash; [How to use addExtraLib in Monaco with an external type definition - Stack Overflow](https://stackoverflow.com/questions/43058191/how-to-use-addextralib-in-monaco-with-an-external-type-definition)

## ブラウザで文字列の圧縮・解凍

公式 playground と同じく、クエリパラメータにアプリの状態（コードや tsconfig、依存パッケージとそのバージョン etc）をすべて載せて共有できるようにし、ページロード時にクエリパラメータから状態を復元する方式を取りました。  
よほど長いコードを書かない限りは愚直に base64 エンコードするだけで十分なのですが、共有可能なデータ量を増やすためにブラウザだけで完結する圧縮・解凍を実現する[pako](https://www.npmjs.com/package/pako)にたどり着きました。

API の互換性はありませんが、Node.js の[zlib](https://nodejs.org/api/zlib.html)モジュールのような感覚で使用できます。  
Brotli には対応してなかったため gzip を使用したところ、本アプリにおける圧縮率はだいたい 30％でした。無圧縮よりも 30％ほど多くのデータ（コード）をシェアできるようになります。

実際のコードはこのあたりです。  
https://github.com/Leko/type-puzzle/blob/61097601b7b35f92b3f611e164731496ffe1d601/packages/playground/src/lib/share.ts

> WebAssembly に port された Brotli 実装の[wasm-brotli](https://github.com/dfrankland/wasm-brotli)というモジュールも試してみました。圧縮率は 40％と高かったのですが、gzip でも十分用途に足りていると判断し、利用ユーザ数が多い pako を採用しました。

## ブラウザでコードフォーマット（prettier）

prettier をブラウザで使うのは非常に簡単で、ドキュメントのとおり書くだけです。

> &mdash; [Browser · Prettier](https://prettier.io/docs/en/browser.html)

WebWorker のサンプルコードも紹介されておりいたれりつくせりなんですが、Off the main thread を実現するにあたって、素の WebWorker のコードを書くよりも、webpack の[worker-loader](https://github.com/webpack-contrib/worker-loader)を使うよりも、[Comlink](https://github.com/GoogleChromeLabs/comlink)を経由して暗黙的に WebWorker を利用するよりも、全力で振り切って[comlink-loader](https://github.com/GoogleChromeLabs/comlink-loader)を使うアプローチが面白かったので紹介します。

## comlink-loader での WebWorker 化がすごい

もはや黒魔術の域を超え闇の魔術ではないか？ とすら思うのですが、GoogleChromeLabs が開発している[comlink-loader](https://github.com/GoogleChromeLabs/comlink-loader)という Webpack loader があります。  
Comlink を生で使っている間は WebWorker の存在を利用者が認識しないといけないのですが、comlink-loader によって **WebWorker の存在がコードからほとんど消失します。**

重たい処理の例として、こんなクラスがあったとします。  
無駄にループを回してメインスレッドを固めます。引数と戻り値を適当に付けておきました。  
この重い処理が例えば圧縮・解凍アルゴリズムだったり、prettier だったりするという前提で適宜重たそうな処理に読み替えてください。

```ts
export class SomeHeavyTask {
  async run(loopCount: number) {
    const startsAt = new Date()
    for (let i = 0; i < loopCount; i++);
    return new Date().getTime() - startsAt.getTime()
  }
}
```

この`SomeHeavyTask`はこのように使います

```ts
import { SomeHeavyTask } from './some-heavy-task'

const task = new SomeHeavyTask()
task.run(1_000_000_000).then(spent => console.log(`spent: ${spent}ms`))
```

この処理を comlink-loader に書き換えるとこうなります。

```ts
import SomeHeavyTask from 'comlink-loader!./some-heavy-task'

new SomeHeavyTask()
  .then(task => task.run())
  .then(spent => console.log(`spent: ${spent}ms`))
```

- コンストラクタが `Promise<SomeHeavyTask>` にかわる
- WebWorker に渡せる値しか渡せない
- WebWorker でできることしかできない（ex. DOM 操作はできない）

という制約はあり、挙動を理解してないとむしろハマりそうな気もしますが、かなり低コストで Off the main thread が実現できるので、カジュアルに重たい処理は worker に逃がすって戦略を取りやすくなります。  
処理が Worker に分けた結果 Code splitting も効くので、「特定用途にしか使ってない、ファイルサイズ的にも処理内容的にもヘビーなライブラリ」は格好の移行対象です。

https://github.com/Leko/type-puzzle/blob/61097601b7b35f92b3f611e164731496ffe1d601/packages/playground/src/playground.tsx#L15

https://github.com/Leko/type-puzzle/blob/61097601b7b35f92b3f611e164731496ffe1d601/packages/playground/src/playground.tsx#L17

余計なテンプレート、グルーコードを増やさず気軽に Off the main thread を推し進められる強い武器（諸刃かもしれない）でした。

## さいごに

スライドにも書いてあるのですが、完成度を上げて本家 playgrond に還元したいと思っています。  
私一人のユースケースでは品質的にもコンセプト的にも甘いと思うので、ぜひ使ってみてフィードバックをいただけると幸いです。
