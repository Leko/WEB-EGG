---
title: Import mapsでDenoのパッケージのバージョンを管理したい
date: '2019-12-07T10:21:46.249Z'
featuredImage: ./featured-image.png
tags:
  - TypeScript
  - Deno
---

> この記事は[Deno Advent Calendar 2019 - Qiita](https://qiita.com/advent-calendar/2019/deno)の 7 日目の記事です。

Deno で何かしら 3rd パーティ製のライブラリを利用するコードを書いたことはありますか。例えば以下のようにライブラリを import します。

```ts
import uniq from 'https://deno.land/x/lodash@4.17.15-es/uniq.js'

console.log(uniq([1, 2, 3, 1, 2, 3]))
```

Deno は Node.js とは違い`npm`のようなパッケージマネージャが付属しておらず、パッケージ名で import/require することはありません。Deno はそもそも`npm install`のような事前処理が不要で、実行するときに import 文を解析しながら必要なコードを取得してから実行ます。いわゆる[Zero-install](https://yosuke-furukawa.hatenablog.com/entry/2019/06/10/113111)の１つです。  
Deno では URL やファイルパス などファイルの URI を明示して import します。ここまで聞いて、多くの Node.js ユーザは「コード内に （semver を含む）URL ハードコードしないといけないの、複数のファイルで使用するならその数だけハードコードするの、アップデート辛くないの？」と感じると思います。

この問題を解決するために日本の Deno コミッターの方々が[keroxp/dink](https://github.com/keroxp/dink)や[syumai/dem](https://github.com/syumai/dem)などの Deno のパッケージマネージャを作成しています。  
一方で Deno は現在[WICG](https://github.com/WICG)で策定されている[Import maps](https://github.com/WICG/import-maps)を先行してサポートしています。これを活用すれば semver を含む URL をコード内に出現させることなく、パッケージマネージャに頼らずとも標準機能だけでパッケージのバージョンを管理できるのではないかという点について考察します。

<!--more-->

## Import maps とは

> This proposal allows control over what URLs get fetched by JavaScript import statements and import() expressions. This allows "bare import specifiers", such as import moment from "moment", to work.
>
> The mechanism for doing this is via an import maps which can be used to control the resolution of module specifiers generally. As an introductory example, consider the code
>
> &mdash; [WICG/import-maps: How to control the behavior of JavaScript imports](https://github.com/WICG/import-maps)

Import maps とは、import 文と dynamic import に対して動作する ImportSpecifier と実 URL をマッピングするための設定ファイルの仕様です。策定しているのは WICG というコミュニティグループです。本記事は Import maps の解説記事ではないため必要な文だけかいつまんで説明します。仕様の詳細は原文（リポジトリ）をご確認下さい。

Import maps はこれまでの Node.js や webpack などの module bundler を用いた開発体験のように`import _ from 'lodash'`とパッケージ名だけ指定する import を使い続けつつ ES Modules の世界観に引っ越しできる緩衝材みたいなものだと思えばおおむね合ってると思います。  
設定ファイルの書式は以下のような JSON になっています。キー名が import に使用する名前、値がその import したときに解決されるパスを指定しています。

```json
{
  "imports": {
    "http": "https://deno.land/std/http/server.ts"
  }
}
```

これを利用すると、（実際の API は全く違うけど）Node.js の HTTP モジュールのように名前だけで import できます。

```ts
import { serve } from 'http'

const body = new TextEncoer().encode('Hello World\n')
for await (const req of serve(':8080')) {
  req.respond({ body })
}
```

Import maps が`maps.json`、↑ のコードを`test.ts`としたとき、実行コマンドは`deno run --importmap=maps.json test.ts`になります。`--importmap`オプションで Import maps のファイルパスを指定します。  
なお、現状の Import maps はアプリケーション製作者のための仕様であり、ライブラリ提供者のための仕様ではありません。ライブラリを公開するときに Import maps を含めて提供し、それらを組み合わせるようなユースケースは想定されていません。あくまでアプリケーション製作者が、利用するライブラリ全てに関心を持つように想定されています。

> Import maps are an application-level thing, somewhat like service workers. (More formally, they would be per-module map, and thus per-realm.) They are not meant to be composed, but instead produced by a human or tool with a holistic view of your web application. For example, it would not make sense for a library to include an import map; libraries can simply reference modules by specifier, and let the application decide what URLs those specifiers map to.
>
> &mdash; [WICG/import-maps: How to control the behavior of JavaScript imports](https://github.com/WICG/import-maps#background)

## Deno の Import maps サポート

Import maps はまだ策定中の仕様であり、仕様自体が fix しきっていません。それでもなお採用するということは何かしら解決したい Deno の問題 OR 大きなアドバンテージがあるのではないかと疑っていました。が、先に結論を書くと経緯を読み取ることはできませんでした。

まず公式ドキュメントにはなんと書かれているでしょうか。「Import maps が使えるよ、いくつか制約があるよ」とだけ書かれています。

> Deno supports import maps.
>
> One can use import map with --importmap=<FILE> CLI flag.  
> Current limitations:
>
> - single import map
> - no fallback URLs
> - Deno does not support std: namespace
> - Does supports only file:, http: and https: schemes
>
> &mdash; [deno /std/manual.md](https://deno.land/std/manual.md#import-maps)

これだけでは経緯やモチベーションが分からないので Issue と PR を追ってみます。

> We should consider finding a way to implement import-maps. The WICG proposal has started to be implemented. While it is still an early stage, it would solve several problems we have had with remote modules.
>
> &mdash; [Implement import-maps · Issue #1921 · denoland/deno](https://github.com/denoland/deno/issues/1921)

この前[JSConf JP でもトークしていた](https://jsconf.jp/2019/talk/kitson-kelly)Kitson Kelly が提案しています。PR はこれです。

> &mdash; [feat: Import maps by bartlomieju · Pull Request #2360 · denoland/deno](https://github.com/denoland/deno/pull/2360)

どれを読んでも経緯はわからず「（私が冒頭に書いたような問題を解決しうる仕様だから）入れてみようぜ！」って温度感なのかなと勝手に感じました。  
ということでなぜ Deno に Import maps が入ったのか動機は不明ですが、自分なりの視点から考察していきます。

## Import maps におけるライブラリのアップデート

イメージしやすいようによく使われるであろう lodash を題材に実コードを出します。このような Import maps、Deno のコード、実行結果があったとします。

```json
{
  "imports": {
    "lodash/": "https://deno.land/x/lodash@4.17.15-es/"
  }
}
```

```ts
import uniq from 'lodash/uniq.js'

console.log(uniq([1, 2, 3, 1, 2, 3]))
```

```
$ deno --importmap=importmap.json test.ts
Download https://deno.land/x/lodash@4.17.15-es/uniq.js
...
Download https://deno.land/x/lodash@4.17.15-es/_objectToString.js
[ 1, 2, 3 ]
```

まず、読み込まれるバージョンを固定するために Import maps の URL に semver を指定します。この semver は GitHub の tag 名に対応しています（ex. [lodash のタグ一覧](https://github.com/lodash/lodash/tags)）。  
なお、キー名の末尾を`/`にすることで`lodash/uniq.js`のようにパッケージ名の後に`/`をつけた場合どのディレクトリを見るかを指定できます。

ライブラリをアップデートしたい場合、Import maps の semver を書き換えれば OK です。

```diff
 {
   "imports": {
-    "lodash/": "https://deno.land/x/lodash@4.17.15-es/"
+    "lodash/": "https://deno.land/x/lodash@x.y.z-es/"
   }
 }
```

このように、シンプルな依存を手動で管理するのであれば Import maps でも管理できると思います。ただ、現実的にこれでいいかと言われると、私は ”これだけでは足りない” と思います。

### 悩み：semver range が使えない+自動アップデートは難しい

これは Deno や Import maps の仕様の問題ではなくレジストリの問題です。また、パッケージマネージャを作ったとしても同様の問題が発生します。

npm パッケージをホスティングする[unpkg.com](https://unpkg.com/)では`~0.0.0`のように`~`や`^`、`>=`などの range を指定できます。例えばライブラリにセキュリティパッチが配布された際、毎パッチバージョンごとに手動で semver を書き換えるような手間が発生します。  
Deno は`deno.land/x/`以外の任意の URL を import に使用できるため、指定の自由度が高すぎて URL のどこが semver に相当するのか規則性がありません。そのためアップデートを検知する際にどこからバージョン情報を取得すればいいかについても規則性がなく、何かしらの規約が設けられないと semver range を使えるようにするのは難しいでしょう。

### 悩み：ライブラリの開発体験

そもそも Import maps はライブラリ製作者のための仕様ではないと明言されており、これを Import maps に求めるのは筋違いですが、Import maps だけでは足りないので別のソリューションを組み合わせる必要があると思っています。  
ライブラリを制作するときに、ライブラリが依存するライブラリの semver を URL としてハードコードする必要があります。もし Import maps を利用してライブラリを使用したければ、publish 時に Import maps でマッピングしていた情報をすべてコード上に戻すなど、以下の AST 変換のような事前処理が必要になります。

https://astexplorer.net/#/gist/2ef31923cf9758ae052b01711ea03c0d/131b956bdae82f40e515e84d82d97f41207197a8

補足ですが、Deno は [Batteries Included 志向](https://kt3k.github.io/deno_talk_ginza/#31)でコアが作られているので、Small core を掲げる Node.js よりも 3rd パーティ製のパッケージに頼るケースは多くありません。ただ完全にゼロになることもありえないため、何かしらの 3rd パーティライブラリに頼ることは少なからず発生するでしょう。

## パッケージマネージャは不要になるか？

Import maps によっていくつかのニーズを満たすことはできそうだと思いますが、これさえあれば万事解決ってわけではなく、まだ問題は残っていると思います。  
Import maps を利用するツールやユーザがもっと増えユースケースやフィードバックが増えれば、また変わった体験になっていくのかなと思いました。

個人的に面白い仕様だと思いますし、正しく使えば開発体験が向上すると思うので、もっと使い込んでみます。

## さいごに

Deno のアップデート通知やイベント告知、技術書展に出品する denobook の執筆などの Deno に関するコミュニケーションは deno-ja の Slack にて行われています。参加は以下の資料をご参照下さい。

> &mdash; [Slack の参加方法 - deno-ja](https://scrapbox.io/deno-ja/Slack%E3%81%AE%E5%8F%82%E5%8A%A0%E6%96%B9%E6%B3%95)
