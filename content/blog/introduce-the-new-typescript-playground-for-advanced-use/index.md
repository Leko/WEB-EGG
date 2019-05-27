---
title: 外部パッケージの型定義もインストールし推論できるTypeScript playgroundを作った
date: '2019-05-30T10:25:29.743Z'
featuredImage: ./featured-image.png
tags:
  - TypeScript
  - npm
  - AST
  - WebWorker
---

TypeScript で開発をするときに、型エラーをミニマムで再現できるコードを作ったり、型パズルを出題・回答したり、型 Tips を共有するのに何を使っていますか。

[TypeScript 公式の playground](https://www.typescriptlang.org/play/)は、ちょっとした型パズルを試すのにとても便利です。  
公式 playground の中で使用されているエディタ（[monaco-editor](https://microsoft.github.io/monaco-editor/)）には TypeScript の LanguageService が組み込まれており、サーバを介さずにブラウザだけで完結する型チェックを可能にしています。

ただし、HoC の型付けや、webpack-loader の推論、組み込みライブラリと npm パッケージでの推論結果の比較（Lodash とか）、tsconfig.json のカスタマイズ製などの観点から、ちょっと複雑な型パズルを試したいときに物足りなさを感じていました。

- :cop: ブラウザ完結で型検査できる
- :package: DefinitelyTyped や.d.ts が提供されているの npm パッケージをインストール+推論できる
- :wrench: tsconfig.json をフルカスタマイズできる
- :link: サーバを介さずに URL でシェアできる

な TypeScript playground を作ったので内部の技術的な仕組みについて詳しく書きます

<!--more-->

## 作ったもの

こちらです。

> &mdash; [TypeScript Playground | The unofficial playground for advanced TypeScript users](https://playground.type-puzzle.org/)

例えばこんなことができます。

- [@types/react, @types/react-dom で React の型推論]()
- [↑ に redux を足して connect の型推論]()
- [Lodash でなんのアテもなくただ推論させる]()
- [lens.ts]()
- [typeorm という OR マッパー]()

注意事項として、この playground は**「型検査」はできますが実行環境は持ちません**。書いたコードを動かしたいときは手元で動かしてください。  
サジェストやフィードバックなどありましたら [Twitter](https://twitter.com/L_e_k_o) にいただけると喜びます。

## 技術的に面白いと思っているところ

すべてを説明すると量が多すぎるので、個人的に面白いと思っているところだけを抜粋して詳しく書きます。

- ブラウザで文字列の圧縮・解凍
- monaco-editor 内部の TypeScript の LanguageService
- monaco-editor に npm パッケージの型定義を読み込ませる
- npm パッケージの検索
- npm パッケージ（型定義ファイル）のインストール
- comlink-loader での WebWorker 化がすごい

## ブラウザで文字列の圧縮・解凍

クエリパラメータにアプリの State をすべて載せて、ページロード時にクエリパラメータから State を復元する方式を取りました。  
よほど長いコードを書かない限りただ base64 エンコードするだけでも十分なのですが、せっかくなのでブラウザ完結で圧縮解凍できるライブラリを知っておこうと思い、[pako](https://www.npmjs.com/package/pako)にたどり着きました。

API の互換性はありませんが、Node.js の[zlib](https://nodejs.org/api/zlib.html)モジュールのような感覚で使用できます。  
Brotli には対応してなかったため gzip を使用しています。圧縮率はだいたい 30％でした。無圧縮よりも 30％ほど多くのデータをシェアできるようになります。

WebAssembly で port された Brotli 実装の[wasm-brotli](https://github.com/dfrankland/wasm-brotli)というモジュールも試し、圧縮率は 40％と高かったのですが、gzip でも十分用途に足りていると判断し、利用ユーザ数が多い pako を採用しました。

## monaco-editor に npm パッケージの型定義を読み込ませる

ライブラリの型推論をさせるために必須の機能です。  
ドキュメントや内部実装を読んでいたら[LanguageServiceDefaults#addExtraLib](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.typescript.languageservicedefaults.html#addextralib)というメソッドが生えていたので、ここに型定義ファイルの中身(string)を与えてみたらうまくいきました。  
実際にローカルにあるファイルパスを参照しているわけではないのですが`file://`を使用し、LanguageService に仮想的なファイル構造とファイルの中身を教え、現在のパス（`/index.tsx`）から見て`/node_modules/xxx/yyy.d.ts`が存在するつもりにさせてあげると推論が効きました。

https://github.com/Leko/type-puzzle/blob/61097601b7b35f92b3f611e164731496ffe1d601/packages/playground/src/models.ts#L5-L9

https://github.com/Leko/type-puzzle/blob/61097601b7b35f92b3f611e164731496ffe1d601/packages/playground/src/lib/npm/installer.ts#L22-L25

> &mdash; [How to use addExtraLib in Monaco with an external type definition - Stack Overflow](https://stackoverflow.com/questions/43058191/how-to-use-addextralib-in-monaco-with-an-external-type-definition)

## npm パッケージの検索

[CodeSandbox](https://codesandbox.io)や[Babel REPL](https://babeljs.io/en/repl)のパッケージ検索のように、扱いが簡単で高速な Algolia を使いたかったのですが、[algolia/npm-search](https://github.com/algolia/npm-search)を使って npm registry のレプリカを構築するときのプランがよくわからず、諦めて登録や準備不要で速度も遜色ない npm の公式 API（[Public Registry API](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#get-v1search)）を使用しました。

Registry API はなぜか Exact match なパッケージだけレスポンスに含まれないことがあったので[unpkg.com](https://unpkg.com/)を使用して検索結果をマージするというチョコザイを加えています。

https://github.com/Leko/type-puzzle/blob/61097601b7b35f92b3f611e164731496ffe1d601/packages/playground/src/lib/npm/searcher.ts#L86-L98

## npm パッケージ（型定義ファイル）のインストール

最初に圧縮・解凍の話をしたので、npm registry から tarball を落としてきて解凍するんでしょ？ と思ったかもしれませんが、違います。**私もそうしたかったです。**

Issue にある bcoe 氏のコメントの通り、npm registry は過去に DDoS を食らっている背景から tarball の URL には CORS 制限がかかっており、ブラウザからは取得できません。  
npm registry のミラーのうち１つくらい CORS 許可してないかと探してみたものの、残念ながらそれらしきものは見つけられませんでした。

> &mdash; [add support for CORS headers · Issue #108 · npm/npm-registry-couchapp](https://github.com/npm/npm-registry-couchapp/issues/108#issuecomment-174095040)

同様の背景なのか、単に未実装なのか、unpkg.com でも同様にパッケージの tarball は参照できません。

> &mdash; [API for Retrieving Package Tarball · Issue #69 · unpkg/unpkg.com](https://github.com/unpkg/unpkg.com/issues/69)

CORS 突破用のプロキシサーバを立てる手段もあると思いますが、そこが DDoS の対象になる可能性を考慮し別アプローチに切り替えました。

### 必要最低限の型定義だけ取得する npm install もどき

**「必要最低限の型定義だけ取得する npm install もどき」**を実現するために[TypeScript Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API) と AST の理解が必要になります。

TypeScript Compiler API に関しては過去の登壇資料で触れているので、概要やことはじめはそちらを参照して下さい。

> &mdash; [.d.ts を解析して破壊的変更を検知する](https://talks.leko.jp/semver-detection-on-typescript/#0)

型定義を探索するアプローチは以下のとおりです。

1. unpkg.com からライブラリの package.json を入手
1. main や types, typings などのメタ情報から型のエントリポイントを導出
1. そのファイルを起点に参照されているファイルたちを再帰的に探索

型のエントリポイントの導出はとても泥臭く書いてあります。  
LanguageService の挙動などをもっと理解すれば改善できそう。

https://github.com/Leko/type-puzzle/blob/61097601b7b35f92b3f611e164731496ffe1d601/packages/playground/src/lib/npm/resolver.ts#L19-L31

参照されているファイルの書き方は 3 通りあります。  
１つ目が DefinitelyTyped でよく登場する昔からの書き方である Type reference（`/// <reference path="./common/common.d.ts" />`）と、

```ts
/// <reference path="./common/common.d.ts" />
```

２つ目が[typeorm](https://github.com/typeorm/typeorm)のように元から TypeScript で書かれており型定義ファイルも tsc コマンドで生成しているパターンの import 文、３つ目が`export ... from ...`文です。

```ts
import { ConnectionManager } from './connection/ConnectionManager'

// ...

export * from './decorator/options/IndexOptions'
```

Type reference に関しては ts.SourceFile を生成するときに自動的にパースされて`referencedFiles`プロパティに保持されるので、それを見るだけです。

https://github.com/Leko/type-puzzle/blob/61097601b7b35f92b3f611e164731496ffe1d601/packages/playground/src/lib/npm/resolver.ts#L83-L85

import/export 文に関しては AST 解析が必要だったのでオレオレ visitor を書いて参照されているファイルを解析しました。

https://github.com/Leko/type-puzzle/blob/61097601b7b35f92b3f611e164731496ffe1d601/packages/playground/src/lib/npm/resolver.ts#L87-L109

### 泥臭く書かずに LanguageService 独自実装とかでスマートに行けなかったのか

現時点での TypeScript では無理で、将来的には実現可能性があります。

LanguageService には getFile など、ファイルパスを与えるからファイルの中身を string で返してくれなどのファイルシステムを抽象化するインタフェースがあります。  
ただし現在の LanguageService は非同期に対応してないので、要求に応じて動的にファイルの中身を fetch するような実装はできません。  
現時点では無理だったのでかなりゴリ押しですが npm install もどきを実装するに至りました（とても楽しかった）。

> &mdash; [Make the Compiler and Language Service API Asynchronous · Issue #1857 · microsoft/TypeScript](https://github.com/Microsoft/TypeScript/issues/1857)

## comlink-loader での WebWorker 化がすごい

最後に、もはや黒魔術の域を超え闇の魔術ではないかとすら思うのですが、GoogleChromeLabs が開発している[Comlink](https://github.com/GoogleChromeLabs/comlink)もそれを webpack-loader 化する[comlink-loader](https://github.com/GoogleChromeLabs/comlink-loader)はすごいです。  
Comlink を生で使っている間は WebWorker の存在を利用者が認識しないといけないのですが、comlink-loader によって WebWorker の存在はコードから完全に消失します。  
メソッドをあらかじめ Promise ベースの API にしておき、Worker 化したいときは import 文に`comlink-loader!`を足すだけで Comlink 対応が完了します。

https://github.com/Leko/type-puzzle/blob/61097601b7b35f92b3f611e164731496ffe1d601/packages/playground/src/playground.tsx#L17

コンストラクタが Promise になったり、メモリは共有してないのでインスタンスは渡せないなど WebWorker の制限を受けますし、型が効かなくなるので declare module +型アサーションが必要になるなどの手間はありますが、プリミティブ+配列+プレーンオブジェクト+ ArrayBuffer などの WebWorker に渡せる値で閉じていればコードベースにグルーコードが蔓延せず容易に Off the main thread を推し進められます。

## 今後の展望

コードはあまり綺麗ではないので、リファクタも徐々に入れていきたいです。  
他には、

- フィードバックもらって完成度あげたい
- 公式 playground に貢献したい
- unpkg.com、かなり重要なポジションを占めていることがわかり貢献意欲が湧いた
- Hooks だけで書ききってみたけど Redux に書き直したい
- import の補完が効かないので、CompletionProvider について詳しくなってインストール済みのライブラリが保管されるようにしたい
- webpack の loader の型定義（`declare module "xx-loader:*"`）のテストもしたいので、複数ファイルの編集をサポート

ぜひ使ってフィードバック下さい！
