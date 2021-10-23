---
title: WebAssemblyの形態素解析器GoyaをRustで作った
date: '2021-10-04T08:17:20.265Z'
featuredImage: 2021-10-23-13-31-45.png
tags:
  - JavaScript
  - TypeScript
  - WebAssembly
  - Rust
  - NLP
  - 形態素解析
---

[Goya](https://github.com/Leko/goya)という形態素解析器を Rust で作りました。本記事は利用者目線で Goya の紹介をします。技術的な詳細については別途記事を書きます。

## 形態素解析とは？

（このセクションは形態素解析の基礎の話なので知ってる方は読み飛ばしてください。）

> 形態素解析（けいたいそかいせき、Morphological Analysis）とは、文法的な情報の注記の無い自然言語のテキストデータ（文）から、対象言語の文法や、辞書と呼ばれる単語の品詞等の情報にもとづき、形態素（Morpheme, おおまかにいえば、言語で意味を持つ最小単位）の列に分割し、それぞれの形態素の品詞等を判別する作業である。
>
> &mdash; [形態素解析 - Wikipedia](https://ja.wikipedia.org/wiki/%E5%BD%A2%E6%85%8B%E7%B4%A0%E8%A7%A3%E6%9E%90)

例えば早口言葉の"すもももももももものうち"（スモモも桃も桃のうち）という言葉を形態素解析すると以下のような結果が得られます。スモモや桃が名詞、間にある"も・の"は助詞と解析されました。

```
すもも	名詞,一般,*,*,*,*,すもも,スモモ,スモモ
も	助詞,係助詞,*,*,*,*,も,モ,モ
もも	名詞,一般,*,*,*,*,もも,モモ,モモ
も	助詞,係助詞,*,*,*,*,も,モ,モ
もも	名詞,一般,*,*,*,*,もも,モモ,モモ
の	助詞,連体化,*,*,*,*,の,ノ,ノ
うち	名詞,非自立,副詞可能,*,*,*,うち,ウチ,ウチ
```

この解析結果は日本語として正しいのか？については言語学の専門家に委ねるとして、技術的に重要なことは**単語の境界を機械的に判定できる**ことです。文章を形態素に分解することで全文検索用のインデックスを生成したり、品詞解析や構文解析・係受け解析、キーワード抽出や文章要約など様々な自然言語処理が適用可能になります。よく知られた形態素解析ライブラリとしては[Mecab](https://github.com/taku910/mecab)や[ChaSen](https://chasen-legacy.osdn.jp/)、[Juman++](https://github.com/ku-nlp/jumanpp)、[kuromoji](https://www.atilika.com/ja/kuromoji/)、[kuromoji.js](https://github.com/takuyaa/kuromoji.js/)などが挙げられます。

## Goya とは？

Goya は Rust で実装された形態素解析ライブラリです。形態素解析ライブラリの大御所[Mecab](https://github.com/taku910/mecab) から実装のアイデアを多く頂いています。

- **WebAssembly(WASM) でブラウザや Node.js でも動作**
- WASI がある言語ならなんでも動作する可能性
- Mecab の IPA 辞書を解析に使用
- 未知語を含む解析も可能

WASM 版のオンラインデモはこちらです。

https://goya.pages.dev

（CDN でレスポンス時に動的に Brotli 圧縮をかけてるため初回の読み込みが遅いことがありますが、２回目以降の読み込み・解析は比較的高速です。）

## CLI を試す

CLI からも Goya を利用できます。

1. [Mecab の公式サイト](https://taku910.github.io/mecab/)から IPA 辞書をダウンロードし、解凍します
2. cargo 経由で CLI をインストールします
   ```
   cargo install goya-cli
   ```
3. `goya compile`コマンドで解析に使用する辞書をコンパイルします。（環境によりますが 1-2 分かかります）
   ```
   goya compile /path/to/mecab/ipadic
   ```
4. goya コマンドに標準入力からテキストを与えると形態素解析の結果が出力されます
   ```
   $ echo すもももももももものうち | goya
   すもも	名詞,一般,*,*,*,*,すもも,スモモ,スモモ
   も	助詞,係助詞,*,*,*,*,も,モ,モ
   もも	名詞,一般,*,*,*,*,もも,モモ,モモ
   も	助詞,係助詞,*,*,*,*,も,モ,モ
   もも	名詞,一般,*,*,*,*,もも,モモ,モモ
   の	助詞,連体化,*,*,*,*,の,ノ,ノ
   うち	名詞,非自立,副詞可能,*,*,*,うち,ウチ,ウチ
   EOS
   ```

複数行のテキストを一度に与えることもできます。改行区切りでそれぞれの行を処理します。goya CLI は現状プロセス起動時のバイナリ辞書を読み込むオーバーヘッドが大きいため、１プロセスに複数のテキストをまとめて解析させる方が効率的です。

```
$ cat in.txt
れこと申します
東京特許許可局

$ goya < in.txt
れこ    名詞,一般,*,*,*,*,れこ,レコ,レコ
と      助詞,格助詞,引用,*,*,*,と,ト,ト
申し    動詞,自立,*,*,五段・サ行,連用形,申す,モウシ,モーシ
ます    助動詞,*,*,*,特殊・マス,基本形,ます,マス,マス
EOS
東京    名詞,固有名詞,地域,一般,*,*,東京,トウキョウ,トーキョー
特許    名詞,サ変接続,*,*,*,*,特許,トッキョ,トッキョ
許可    名詞,サ変接続,*,*,*,*,許可,キョカ,キョカ
局      名詞,接尾,一般,*,*,*,局,キョク,キョク
EOS
```

## 用語：素性（feature）

以降の説明に"素性"という用語がたびたび登場します。英語では feature と言います。混乱を避けるために明示しますが、**ここでいう feature は feature request などの feature（機能）や、Rust でコンパイル内容を制御する feature でもなく、言語学の用語です。** 一言で説明するなら「形態素解析の動作には必要ない形態素ごとのメタ情報」です。  
具体例を挙げます。Mecab で形態素解析した結果の一行と、公式ドキュメントにある行の説明が以下です。

```
すもも	名詞,一般,*,*,*,*,すもも,スモモ,スモモ
```

> 左から,
> `表層形\t品詞,品詞細分類 1,品詞細分類 2,品詞細分類 3,活用型,活用形,原形,読み,発音`
> となっています。
>
> &mdash; [MeCab: Yet Another Part-of-Speech and Morphological Analyzer](https://taku910.github.io/mecab/)

"表層形"とは見出し語のことだと解釈して問題ありません。この結果のうち、表層形を除いたその他全ての情報を素性（feature）と呼びます。 Mecab の IPA 辞書にはデフォルトで上記の素性が定義されていますが、仕様としてはユーザが任意個のフィールドを独自に定義可能な任意項目で、全項目が省略可能です。

## プログラムからの利用

CLI 以外では Goya は以下のユースケースを想定しています。

- WebAssembly（npm パッケージ）としての利用
  - `goya-core`: 形態素解析のコア。分かち書きなどの素性が不要なタスクならこれ単独でも使える
  - `goya-features`: 解析結果から品詞や読み仮名などの素性（feature）を得たいときに使用
- Rust の crate としての利用
  - [crates.io で公開しています](https://crates.io/crates/goya)がまだ API が安定してないので紹介しません。CLI のソースコードを参照

`goya-core`と`goya-features`が分かれている理由は WASM のサイズ削減のためです。素性は IPA 辞書に登録された数十万件の語彙のメタデータなのでかなりデータ量が大きいです。分かち書きなどの素性を必要としないユースケースでは core だけ使用し、品詞などの素性が必要なユースケースでは goya-features を併用する想定です。

## WASM での利用

Node.js なら普通の npm パッケージのように使えます。ブラウザでは ES Modules か何かしらの bundler を使用することになると思います。`.d.ts`をパッケージに含めているため TS の型も効きます。

詳しいインストール方法やその他サンプルコードは[リポジトリ](https://github.com/Leko/goya)を参照してください。

### 分かち書き

goya-core を import して `parse` 関数を使用します。parse メソッドの戻り値から各種メソッドを呼べるようにしています。
分かち書きをするなら`wakachi`メソッドを使用します。

```ts
import core from 'goya-core'

const lattice = core.parse('すもももももももものうち')
lattice.wakachi() // => ["すもも", "も", "もも", "も", "もも", "の", "うち"]
```

### 形態素解析

形態素解析の結果を得るには`find_best`メソッドを使用します。find_best は形態素の配列を返します。各形態素はこれらのフィールドを持っています。サイズ削減のためこのオブジェクトは品詞や読み仮名などの素性を持っていません。

- wid: 語彙 ID。goya-features で使用 （後述）
- is_known: 既知後なら true、未知語なら false
- surface_form: 表層体

```ts
lattice.find_best()[0].surface_form // => "すもも"
lattice.find_best()[0].is_known // => true
lattice.find_best()[0].wid // => 次項で説明
```

### 素性（features）の取得

品詞や読み仮名などの素性を得るには`goya-features`パッケージの`get_features`関数を利用します。各形態素が持つ`wid`の配列を渡し対応する素性の配列を得ます。  
戻り値は渡した`wid`ごとに素性（`string[]`）の配列（つまり`string[][]`）となります。素性の各要素は Mecab IPA 辞書を何も改変せず使った場合、その通りの順序（`品詞,品詞細分類 1,品詞細分類 2,品詞細分類 3,活用型,活用形,原形,読み,発音`）になっています。辞書のカスタマイズや容量削減のため不要な素性を削るケースを考慮しているため、あえてプロパティ名を付けず辞書の CSV 通りの順序をそのまま返しています。特定の品詞を取りたいケースでは、お使いの辞書に合わせて添字を定数化しておくと多少なり可読性が増すと思います。ただし、辞書はカスタマイズ可能であり添字は可変のためこの定数は goya としては提供できません。

```ts
import { get_features } from 'wasm-features'

// Mecab IPA辞書のデフォルトでは品詞(Part of Speech)は添字0
const INDEX_POS = 0

const morphemes = lattice.find_best()
// widの配列から素性の配列を得る
const features = get_features(morphemes.map(morph => morph.wid))
// 1要素ずつ取得してもいいが、まとめて取得する方がオーバーヘッドが少なく高速
get_features([morphemes[0].wid])

morphemes.forEach(({ surface_form }, i) => {
  const feature = features[i] // 渡したwid通りの順序で素性が得られる
  const line = surface_form + '\t' + feature.join(',')
  console.log(line) // => "すもも\t名詞,一般,*,*,*,*,すもも,スモモ,スモモ"
  console.log(feature[INDEX_POS]) // => "名詞"
})
```

## 実行速度

最後に実行速度の比較です。動作確認に使用したマシンは以下の通りです。  
実行環境によってパフォーマンスは変わると思うので、ご自身の環境でも試してもらえればと思います。

```
MacBook Pro (13-inch, 2020, Four Thunderbolt 3 ports)
2.3 GHz Quad-Core Intel Core i7
32 GB 3733 MHz LPDDR4X
Intel Iris Plus Graphics 1536 MB
```

### CLI

まず Goya CLI と Mecab CLI の速度を比較します。[ITA コーパスの文章リスト公開用リポジトリ](https://github.com/mmorise/ita-corpus/tree/fece1d56bacb942b9c30ef01179243847cd65fbc)にて掲載されている 424 文を整形してテキストファイルに書き出し、１プロセスで 424 文全て解析した時の実行時間を比較してみました。

Mecab は 25ms くらいです。

```
time mecab < ita-corpus.txt > /dev/null

real    0m0.024s
user    0m0.014s
sys     0m0.007s
```

Goya は 165ms くらいでした。遅い。

```
time goya < ita-corpus.txt > /dev/null

real    0m0.165s
user    0m0.104s
sys     0m0.064s
```

Goya が遅い主な原因はプロセス起動時のバイナリ辞書の読み込みです。辞書を全てメモリ上に展開する処理が初期化にて発生するため、空のテキストファイル（初期化だけして何もせず終了）でも 140ms ほどかかっています。特に素性はデータ量がかなり大きいのでこれの復元が遅いです。

```
touch empty.txt
time goya < empty.txt

real    0m0.140s
user    0m0.075s
sys     0m0.063s
```

例えば Rust の軽量 KVS の[sled](https://github.com/spacejam/sled)などを用いて、辞書をメモリ上に復元しないアプローチで初期化コストを削れば Mecab に近いパフォーマンスが出せそうです。ただ、sled は WASM で動作しないので、あくまで CLI や Rust での使用に限った改善案ですが。

### Node.js (WASM)

次に Node.js での速度比較です。ベンチマークとして kuromoji.js と速度を比較します。まずはプロセスの起動から終了までを含めたプロセス全体の速度の比較です。測定に使うテキストは CLI と同じです。ベンチマークのコードは[リポジトリにあげてるのでそちらを参照](https://github.com/Leko/goya/blob/main/benchmarks)、検証に使用した Node.js のバージョンは `v16.11.1` です。

```
$ time node goya.js < ita-corpus.txt
$ time node kuromoji.js < ita-corpus.txt
```

- goya:
  - time: 609ms (SD: 50ms)
  - memory: 203 MiB (SD: 1 MiB)
- kuromoji.js:
  - time: 714ms (SD: 63ms)
  - memory 402 MiB (SD: 6 MiB)

この条件なら Goya の方が高速で、メモリ使用量も kuromoji.js と比較して 50%程度に抑えられています。どちらもバイナリの辞書をランタイムで復元するアプローチでかつ Mecab の IPA 辞書をベースにしています。ただし Goya ではバイナリ辞書の構造をデータを損なわない範囲で最適化をしており、バイナリサイズをかなり小さくできています（未圧縮時で Goya 36 MB、kuromoji 95 MB）。これが初期化コスト及びメモリ使用量に効いてると思います。

kuromoji.js の作者の方が MAST というアルゴリズムの可能性について言及しており、これを実装すれば初期化のコストをさらに大きく削れるかもしれません。

> 現在は Double-Array Trie というトライ木の一種を使っていますが、Minimal Acyclic Subsequential Transducer という FST の一種を使うことで、サイズを 1/10 くらいにできるという報告を聞いています。FST の実装については、Go で FST を書いた @ikawaha さんのエントリが参考になります。実装手法も面白いので、ぜひ fst.js を実装してみたいと思っています。  
> [Lucene で使われてる FST を実装してみた（正規表現マッチ：VM アプローチへの招待） - Qiita](https://qiita.com/ikawaha/items/be95304a803020e1b2d1)
>
> &mdash; [stop-the-world: ブラウザで自然言語処理 - JavaScript の形態素解析器 kuromoji.js を作った](http://stp-the-wld.blogspot.com/2015/01/javascriptkuromojijs.html)

次に初期化コストを無視して形態素解析だけの速度で比較してみます。bench.js も[同リポジトリにあるのでそちらを参照](https://github.com/Leko/goya/blob/main/benchmarks/bench.js)してください。

```
$ node bench.js < ita-corpus.txt
goya x 0.80 ops/sec ±11.92% (6 runs sampled)
kuromoji x 21.37 ops/sec ±3.45% (39 runs sampled)
Fastest is kuromoji
```

Goya の惨敗です。Goya も 424 文 x 0.80 = 339 文/秒 くらいパースできていますが、kuromoji.js に 20 倍以上差をつけられています。形態素解析の速度で見ると kuromoji.js の方が圧倒的に早いです。これは単純に形態素解析アルゴリズムの良し悪しの差なので、形態素解析だけでみても kuromoji.js に負けないよう改良していきたいです。

## おわりに

以上、Goya の紹介でした。最後にリンクを再掲して終わります。Rust の方も JS の方も WASM の方も NLPer の方も試していただいて何かあれば GitHub issue などでフィードバックいただけたら幸いです。

- [GitHub リポジトリ](https://github.com/Leko/goya)
- [オンラインデモ](https://goya.pages.dev)
