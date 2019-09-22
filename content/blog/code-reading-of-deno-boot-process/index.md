---
title: Dive into Deno：プロセス起動からTypeScriptが実行されるまで
date: '2019-01-19T05:51:40.196Z'
featuredImage: ./featured-image.png
tags:
  - JavaScript
  - TypeScript
  - Rust
  - Deno
---

[Deno](https://github.com/denoland/deno)のコードを読んでみました。  
Rust に入門したばかりで基礎知識が足らず四苦八苦していますが、Deno のプロセスが起動してから TypeScript のコードが実行されるまでの仕組みについて愚直に読んでみたメモです。

## 想定読者

- Deno の内部挙動に興味がある
- Node.js、TypeScript、C++（と V8）のコードがドキュメントを参照しつつ読める
- Rust で Hello world したことある程度の経験がある

## 参考情報

コア内部を理解するには非公式ガイド（以下ガイド）がとても参考になります。

> &mdash; [A Guide to Deno Core - A Guide to Deno Core](https://denolib.gitbook.io/guide/)

Deno のディレクトリ構成やレイヤー分けについては[Repo Structure](https://denolib.gitbook.io/guide/codebase-basics/repo-structure)と[Infrastructure](https://denolib.gitbook.io/guide/codebase-basics/infrastructure)を一読し、リポジトリの構造をざっくり把握してからコードを読み始めるとより捗ると思います。

また、すでに[mizchi](https://twitter.com/mizchi)さんが[Deno のコードを読んだメモ](https://gist.github.com/mizchi/31e5628751330b624a0e8ada9e739b1e)を上げてました。そちらもとても参考になりました。

## Deno のビルドツール

まず Deno のビルドツールについて軽く触れます。  
Deno では[gn](https://chromium.googlesource.com/chromium/src/tools/gn/+/48062805e19b4697c5fbd926dc649c78b6aaa138/README.md)という Node.js でおなじみの [gyp](https://gyp.gsrc.io) の次期バージョンをビルドツールに用いています。

> What is GN?
> GN is a meta-build system that generates NinjaBuild files. It's meant to be faster and simpler than GYP. It outputs only Ninja build files.
>
> &mdash; [What is GN?](https://chromium.googlesource.com/chromium/src/tools/gn/+/48062805e19b4697c5fbd926dc649c78b6aaa138/README.md)

コードを読む上でビルド設定のすべてを理解する必要はありませんが、これを読まないと次に実行されるコードがわからない、このコードがどこから出現したかわからないってことが結構あるので、必要に応じてビルド設定も併せて読むと読み進められると思います。

## src/main.rs の main 関数のアウトライン

`deno`コマンドを実行したときに真っ先に実行されるファイルは[src/main.rs](https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/main.rs)です。ビルドツールで`deno`コマンドを生成する際のエントリポイントとして`src/main.rs`が指定されています。

https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/BUILD.gn#L127-L129

main.rs の詳細に入る前に[`main`](https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/main.rs#L62)関数のアウトラインを整理し、用語の補足をしてから次に進みます。またガイドの[Rust main() Entry Point](https://denolib.gitbook.io/guide/advanced/process-lifecycle#lifecycle-example)にも説明があるので併せてご覧ください。

1. ロガーをセット
1. コマンドライン引数をパース
1. `--help`オプションをチェックし、あればヘルプを表示して終了
1. コマンドライン引数に応じてログレベルを設定
1. コマンドライン引数をもとに`Arc<IsolateState>`インスタンスを生成
1. `snapshot::deno_snapshot`で V8 スナップショットを取得
1. V8 スナップショットから V8 Isolate（以下 Isolate）インスタンスを生成
1. `tokio_util::init`で Tokio を初期化
1. 生成した Isolate で JS のコード`denoMain();`を評価する
1. コマンドライン引数で与えられたファイルパスを評価する（もしくは REPL を起動）
1. イベントループを開始

という流れになっています。用語を補足してから詳細を読み進めます。すでに知ってる方は先へお進み下さい。

ロガーや`--help`周りはコード量も少ないしシンプルなので解説は割愛します。またイベントループに関してはかなり長くなると判断したので本記事では割愛します。イベントループについてはガイドの[isolate.event_loop()](https://denolib.gitbook.io/guide/advanced/process-lifecycle#isolate-event_loop)にて詳しく説明されているのでそちらを参照して下さい。

### [補足] Isolate とは

Isolate は V8 が提供している API の１つです。  
Deno にこれをラップした isolate.rs などがありますが、末端までコードを読むと結局は V8 の Isolate を操作しています。

> Isolate
> An isolate is a concept of an instance in V8. In Blink, isolates and threads are in 1:1 relationship. One isolate is associated with the main thread. One isolate is associated with one worker thread. An exception is a compositor worker where one isolate is shared by multiple compositor workers.
>
> &mdash; [Design of V8 bindings](https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/bindings/core/v8/V8BindingDesign.md)

> &mdash; [VM よりコンテナよりもさらに軽量な分離技術、V8 の Isolate を用いてサーバレスコンピューティングを提供する Cloudflare Workers － Publickey](https://www.publickey1.jp/blog/18/vmv8isolatecloudflareworkers.html)

### [補足] V8 スナップショットとは

V8 には生成された Isolate Context の状態をシリアライズしておき、それをデシリアライズして利用することでオーバーヘッドを削減し Isolate Context の生成を高速化する スナップショットの機能があります。

Node.js でも V8 スナップショットを使用してプロセスの起動を高速化する RFC が[#17058](https://github.com/nodejs/node/issues/17058)にて議論されています。  
その Issue のより詳細な資料[Speeding up Node.js startup using V8 snapshot](https://docs.google.com/document/d/1YEIBdH7ocJfm6PWISKw03szNAgnstA2B3e8PZr_-Gp4/edit#)によると V8 スナップショットを使うことで、プロセスの起動時間を最大で２桁倍高速化できる見立てがあるようです。

> 「このタイプの callback 関数があるから、この Object を用意して、この値を設定して」とやっていくのは効率が良くありません。「一通り定義したらこれだけのメモリが必要で、こんなレイアウトになってるから」という感じにできないでしょうか？
> そこで我々は V8 が用意してくれていた Snapshot の機能を使って効率化することにしました。ちなみに純粋な V8 でも同様に Context を作る度に Math などの Built-in object を作るのが非効率ということで、この Snapshot 機能を作ったという背景があります。
>
> &mdash; [V8 Context の作成を Snapshot を使って高速化した話 - Qiita](https://qiita.com/peria/items/eb4e39b975fd0cb148c3)

### [補足] Arc とは

Arc って名前から全くピンとこなかったのですが、Atomically Reference Counted の略だそうです。  
Atomic がついてないシングルスレッド版の[rc](https://doc.rust-lang.org/std/rc/)という crate もあるようです。

> A thread-safe reference-counting pointer. 'Arc' stands for 'Atomically Reference Counted'.
>
> &mdash; [std::sync::Arc - Rust](https://doc.rust-lang.org/std/sync/struct.Arc.html)

> スレッドをまたいで参照を共有するために、Rust は `Arc<T>` というラッパ型を提供しています。
>
> &mdash; [並行性](https://doc.rust-jp.rs/the-rust-programming-language-ja/1.6/book/concurrency.html#sync)

### [補足] tokio とは

私もきちんと理解できていないので引用だけにとどめます。  
tokio 周りは読み飛ばしてもコードの流れは追えます。どの処理で・どんな単位で並列化/多重化してるかについてしっかり読む場合は tokio と Futures の理解が必要になります。

> Tokio is an event-driven, non-blocking I/O platform for writing asynchronous applications with the Rust programming language.
>
> &mdash; [tokio-rs/tokio: A runtime for writing reliable, asynchronous, and slim applications with the Rust programming language.](https://github.com/tokio-rs/tokio)

> futures::{Future, Stream} で実装された非同期かつゼロコストなグリーンスレッドを使ってネットワークプログラミングするためのフレームワーク
>
> &mdash; [Tokio と Future のチュートリアルとかのまとめ+α - かっこかり(仮)](https://raskr.hatenablog.com/entry/2018/07/16/214420)

## コマンドライン引数のパース

それでは main のアウトラインに沿って詳細を読んでいきます。  
まずコマンドライン引数のパース周りの処理は[src/flags.rs](https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/flags.rs)にあります。  
パース処理は、まず V8 用のオプションのパースから実行されます。`v8_set_flags`関数です。この関数で V8 用のオプションとそれ以外（Deno の引数）を分離し、V8 用の引数は[libdeno/api.cc の`deno_set_v8_flags`](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/api.cc#L103-L105)に渡し、Deno 用の引数は後続の処理に引き継ぎます。  
`libdeno::deno_set_v8_flags` が定義されているのは[libdeno/api.cc](https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/libdeno/api.cc#L103-L105)です。

https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/libdeno/api.cc#L103-L105

C++で定義された関数を Rust から呼び出すための FFI の定義が[src/libdeno.rs](https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/libdeno.rs#L129-L132)に書かれています。

https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/libdeno.rs#L129-L132

V8 のオプションか否かを判定する方法は[コメント](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/flags.rs#L301-L303)によると`libdeno::deno_set_v8_flags`内部で呼び出されている`v8::V8::SetFlagsFromCommandLine`の内部に書かれており、引数で渡したコマンドラインオプションのうち、V8 が解釈できたオプションだけ取り除かれるという破壊的操作になってるようですようです。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/flags.rs#L301-L303

V8 が解釈できなかった残りのオプションのパース処理は Rust の[getopts](https://docs.rs/getopts/0.2.18/getopts/)という crate をラップした独自関数を用いています getopts は予期しないオプションが渡されたときにエラー扱いになるのですが、そのエラーを自前でハンドルするためにラップした`set_recognized_flags`という関数を使用しています。"better solution welcome!"だそうです。なお Deno に指定可能なオプションは`set_flags`関数を読めばわかります。

https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/flags.rs#L62-L64

## コマンドライン引数から`Arc<IsolateState>`インスタンスを生成

`isolate::IsolateState::new`は[src/isolate.rs](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/isolate.rs#L79-L94)に定義されていますが、これ自体はただの構造体を初期化してるだけだったので詳細を割愛。

## V8 スナップショットを取得

`snapshot::deno_snapshot`は[src/snapshot.rs](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/snapshot.rs#L4-L14)に定義されています。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/snapshot.rs#L4-L14

`{GN_OUT_DIR}/gen/snapshot_deno.bin`というファイルから V8 スナップショットを取得しています。このファイルは gn でビルドする時に生成されているようです。環境変数`GN_OUT_DIR`の値はデバッグビルドした環境では`target/debug`になってました。

スナップショットを生成するビルドタスクは
[BUILD.gn の`snapshot("snapshot_deno")`](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/BUILD.gn#L233)に定義があります。`snapshot`というテンプレートは[libdeno/deno.gni](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/deno.gni#L12)に定義されていました。`.gni`は GN のビルド設定を別ファイルに定義して import できるようにしたものだそうです。

> You can import .gni files into the current scope with the import function.
>
> &mdash; [GN Language and Operation](https://chromium.googlesource.com/chromium/src/tools/gn/+/48062805e19b4697c5fbd926dc649c78b6aaa138/docs/language.md#imports)

`libdeno/deno.gni`の中に`tool = "//libdeno:snapshot_creator"`と指定があるように、V8 スナップショットを生成するファイルは[libdeno/snapshot_create.cc](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/snapshot_creator.cc#L13)です。main 関数に渡される引数は[ビルド定義](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/deno.gni#L22-L30)を読んでみると第一引数が出力先（`gen/snapshot_deno.bin`）のパス、第二引数が スナップショットを取りたい js（`bundle/main.js`）のパスになっていました。
main 関数の内部処理としては、[`deno_execute`](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/api.cc#L116)で与えられた js（`bundle/main.js`）を実行した結果の Isolate Context の スナップショットを[`deno_get_snapshot`](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/api.cc#L80)で取得し、指定されたパス（`gen/snapshot_deno.bin`）に保存するという感じです。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/deno.gni#L22-L30

なお前触れなく登場した`bundle/main.js`とは[rollup](https://rollupjs.org/guide/en)で生成された Deno の TypeScript のコード bundle した生成物です。

```
$ head -n5 target/debug/gen/bundle/main.js
var denoMain = (function () {
  'use strict';

  var runner = /*#__PURE__*/Object.freeze({
    get Runner () { return Runner; }
```

ここからさらにビルド周りを深追いしていくと submodule になっている[denoland/chromium_build](https://github.com/denoland/chromium_build/blob/1e3840b6d9c3fd3dc7be4fc2c1a2de7798d63df6/compiled_action.gni#L75)などの別リポジトリにたどり着くのですが、ビルドプロセスを深堀りしすぎると本筋から逸脱するのでこれぐらいにします。

## V8 スナップショットから Isolate インスタンスを生成

`isolate::Isolate::new`も`IsolateState`と同じく[`src/isolate.rs`](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/isolate.rs#L162)に定義されています。  
渡している引数は上の行で生成した V8 snapshot、２つ上の行で生成した IsolateState、`opt::dispatch`の３つです。`opt::dispatch`に関してはひとまずこちらを参照。後々`denoMain`関数を実行するあたりでまた出てきます。

> 第三引数の dispatch ってなんだ、と思ったらコメントに色々書いてある。  
> js からの来る諸々を Rust で捌いてる部分っぽく見える。
>
> &mdash; [deno_code_reading.md](https://gist.github.com/mizchi/31e5628751330b624a0e8ada9e739b1e)

`isolate::Isolate::new`のアウトラインは、

1. （プロセス中で１回だけ）`libdeno::deno_init()`で初期化
1. 引数で受け取った スナップショットを使って`libdeno::deno_config`のインスタンスを生成
1. 生成した`deno_config`を`deno_new`に渡して`libdeno_isolate`のインスタンスを生成
1. 並列処理のメッセージングに使うチャネルを生成
1. Isolate インスタンス作って返却

という感じになっています。

[`libdeno::deno_init()`](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/api.cc#L93)は V8 の初期化をしています。

`deno_new`は[libdeno/api.cc](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/api.cc#L40)に定義されています。  
先程の[スナップショットを生成する処理](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/snapshot_creator.cc#L26-L27)でも登場しており、そのときは`will_snapshot`が 1、`load_snapshot`が`deno::empty_buf`になっていました。今回は`deno_new`に`will_snapshot`を 0、`load_snapshot`に生成された スナップショットを指定しています。それぞれの値の違いによる処理の分岐はこのあたりを見れば明らかかと思います。

https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/libdeno/api.cc#L40-L51

スナップショットを用いて`V8::Isolate`のインスタンスを作ってスコープ設定して...とわちゃわちゃやってますが、このあたりは V8 自体の説明になってしまうので割愛します。この記事とガイドにて丁寧な解説されているので理解の助けになると思います。

> &mdash; [V8 の基本的な API を学ぶ - Qiita](https://qiita.com/komukomo/items/316afadd04f95808f338)

> There are 2 important functions/constructors used in deno_new that might not be immediately clear: DenoIsolate and InitializeContext. It turns out DenoIsolate serves more or less as a collection of Isolate information. Instead, InitializeContext is the more interesting one.
>
> &mdash; [Interaction with V8 - A Guide to Deno Core](https://denolib.gitbook.io/guide/advanced/interaction-with-v8)

## 生成した Isolate で`denoMain`関数を実行

https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/main.rs#L89-L92

ここですね。[`isolate.execute`](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/isolate.rs#L227-L254)自体はごくシンプルで、内部で`ibdeno::deno_execute`を読んでるだけです。

> CString って C にわたす FFI 呼ぶときによく見るやつだ。 実質 `libdeno::deno_execute()` へのファサードになっている。
>
> &mdash; [deno_code_reading.md](https://gist.github.com/mizchi/31e5628751330b624a0e8ada9e739b1e)

> The only interesting function we care in this section is libdeno::deno_execute. We can find its actual definition in libdeno/api.cc again:
>
> &mdash; [Interaction with V8 - A Guide to Deno Core](https://denolib.gitbook.io/guide/advanced/interaction-with-v8#executing-code-on-v8)

[`deno_execute`](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/api.cc#L116-L127)は スナップショット作るところで１度登場していますが、そこでは読み飛ばしたので詳しく読んでみます。V8 Context を作って`deno::Execute`に渡してます。

`deno::Execute`は[libdeno/binding.cc](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/binding.cc#L636)に定義されています。  
おおまかな流れとしては渡された文字列を`v8::Script::Compile`でコードをコンパイルし、エラーがなければ`Local<Script>->Run(context)`でコードを実行して、エラーチェックして終わりです。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/binding.cc#L636-L667

まとめると、`isolate.execute("denoMain();")`は`denoMain();`という文字列（JavaScript のコード）を V8 でコンパイルして実行しています。  
いきなり`denoMain`関数を呼び出してますが`denoMain`とはどこから来たのでしょうか。これまでのコードでは denoMain 関数を定義するようなコードは登場しませんでした。おそらく V8 スナップショットから復元されています。  
あらかじめ`denoMain`の関数定義を含んだ bundle/main.js を実行した結果をスナップショットとして保存し、それを使って Isolate を復元しているので`denoMain`関数が呼べるようになっています。

> 前触れなく登場している`bundle/main.js`とは、js の bundler の１つである[rollup](https://rollupjs.org/guide/en)で生成された`denoMain`関数を含む deno の js レイヤのコードです。

引用したこのあたりです。demoMain 関数を呼び出せる仕組みがわかったので denoMain について詳しく読んでみます。

## demoMain 関数

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/js/main.ts#L59

> 要はここまでやって v8 が起動していることがわかった。じゃあどういうスクリプトが起動しているのか。
>
> &mdash; [deno_code_reading.md](https://gist.github.com/mizchi/31e5628751330b624a0e8ada9e739b1e)

やっと Deno の TypeScript のレイヤにたどり着けました。といっても実際には rollup で bundle された JavaScript が実行されており TypeScript を直接実行しているわけではありません。

`denoMain`関数が定義されている[js/main.ts](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/js/main.ts#L59)は大きく分けて３パートに分かれています。

1. denoMain
1. sendStart
1. compilerMain

`denoMain`は（コマンドライン）引数を処理して、`sendStart`をコールするなどの然るべき初期化を行います。  
`sendStart`は`sendSync`という関数を用いて js レイヤの初期化が開始したことを C++レイヤへ通知しています。  
`compilerMain`はここでは呼び出されていません。関数定義だけして window オブジェクトのプロパティにセットしています。この関数は後々 ts をコンパイルするところで再び登場します。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/js/main.ts#L60

denoMain 関数の冒頭にある`libdeno.recv`と`handleAsyncMsgFromRust`は、イベントリスナとイベントハンドラのようなものです。

### [補足] `libdeno`オブジェクト

> First, we tell libdeno, which is the exposed API from the middle-end, that whenever there is a message sent from the Rust side, please forward the buffer to a function called handleAsyncMsgFromRust. Then, a Start message is sent to Rust side, signaling that we are starting and receiving information including the current working directory, or cwd. We then decide whether the user is running a script, or using the REPL. If we have an input file name, Deno would then try to let the runner, which contains the TypeScript compiler, to try running the file (going deep into its definition, you'll eventually find a secret eval/globalEval called somewhere). denoMain only exits when the runner finish running the file.
>
> &mdash; [Process Lifecycle - A Guide to Deno Core](https://denolib.gitbook.io/guide/advanced/process-lifecycle#denomain)

denoMain の中に`libdeno`という名前空間的なオブジェクトが登場しますが、このオブジェクトの定義は[js/libdeno.ts](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/js/libdeno.ts)には存在しません。どこかで事前に作られています。  
libdeno オブジェクトは[`libdeno/api.cc`の`deno_new`関数の内部処理](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/api.cc#L65-L69)で読み飛ばした[`InitializeContext`](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/binding.cc#L669)にて C++から V8 を直接操作して生成されています。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/binding.cc#L675-L676

これで`libdeno`という空オブジェクトを作成し、その中に`print`, `recv`, `send`メソッドの実装をセットしています。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/binding.cc#L678-L688

見ての通りこの３つの実装は C++で定義されており、V8 を操作して C++の関数ポインタを js 側に露出しています。  
`print`は[ここ](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/binding.cc#L255)で定義されており、ざっくりまとめると`STDOUT`もしくは`STDERR`のどちらかに渡された引数を fwrite している。要は printf 的なものです。  
`recv`は[ここ](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/binding.cc#L330)に定義されており、ざっくりまとめると渡された引数を関数としてキャストし、DenoIsolate の`recv_`プロパティにコールバック関数としてセットしています。  
`send`は[ここ](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/binding.cc#L349)に定義されています。[`src/isolate.rs`の中で`deno_new`関数の中で渡している`deno_config`の`recv_cb`](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/isolate.rs#L174)が[DenoIsolate](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/internal.h#L22)に渡っており、結果的に[pre_dispatch](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/isolate.rs#L425)という Rust の関数が呼び出されます。  
という C++（Rust）レイヤとやりとりするための`libdeno`オブジェクトが定義されていました。

Send に関してはガイドの説明も併せて参照してください。

> The Send function get args and invoke the recv*cb* . Notice that the recv*cb* is defined in the Rust code.
>
> &mdash; [Under the call site's hood - A Guide to Deno Core](https://denolib.gitbook.io/guide/advanced/under-the-call-site-hood#c-converter)

## （ファイルパスが与えられていたら）それをモジュールとして実行

`denoMain`が実行され、Deno ランタイムの準備が整いました。  
再び Rust の main 関数に話題を戻し、次はファイルパスがコマンドライン引数として与えられてるとき`isolate.execute_mod`が呼び出されるあたりを読みます。  
これまでも FFI で C++, Rust, js と複数レイヤをまたぐコードが多かったですが、ここから先も複雑かつ長いので、休憩しつつ読まれるといいと思います。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/main.rs#L94-L100

`isolate.execute_mod`は[src/isolate.rs](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/isolate.rs#L256)に定義されています。  
`isolate.execute`と同じ要領で`deno_execute(filename, ファイルの中身)`と実行するのかと思いましたが、違いました。内部で呼び出されている`code_fetch_and_maybe_compile`という関数と`libdeno::deno_execute_mod`が気になります。まず`code_fetch_and_maybe_compile`から読んでみます。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/isolate.rs#L256-L286

`code_fetch_and_maybe_compile`は[src/isolate.rs](https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/isolate.rs#L375)に定義されています。

https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/isolate.rs#L375-L380

１行目の`state.dir.code_fetch`は[型定義](https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/isolate.rs#L70)を読んでみると`deno_dir::DenoDir`というメソッドです。[src/deno_dir.rs](https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/deno_dir.rs#L276)に定義されています。`DenoDir#code_fetch`のアウトラインとしては、

1. [`resolve_module`](https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/deno_dir.rs#L360)でモジュールのファイルパス（か URL）を解決
1. [`get_source_code`](https://github.com/denoland/deno/blob/f9b167deb07a650590b7f1eef8fe86bf9e22d211/src/deno_dir.rs#L228)で`/https?/`で始まるなら`fetch_remote_source`、それ以外なら`fetch_local_source`を使用して TypeScript のコードを取得
1. `filter_shebang`で shebang を取り除いて
1. `load_cache`でコンパイル後の JavaScript とその Source Map を手に入れる

となっております。  
ここから先`resolve_module`やそれ以外の箇所で`specifier`、`referrer`という変数がよく登場します。`specifier`はモジュールの名前・パス解決の処理全般で、`import from`に記載した文字列（もしくはコマンドライン引数で与えたファイルパス）を現しています。`referrer`は import が記載されているファイルの絶対パス（もしくは URL）と念頭に置いておくとコードが読みやすいと思います。  
`get_source_code`にてローカルかリモートかにかかわらず返却されている`CodeFetchOutput`型の構造は以下のとおりです。

- `module_name`: specifier
- `filename`: 解決できたファイル名（もしくは URL）
- `media_type`: `msg::MediaType::TypeScript`、`msg::MediaType::JavaScript`、`msg::MediaType::Json`、`msg::MediaType::Unknown`のいずれか
- `source_code`: ファイル内容
- `maybe_output_code`: （`fetch_local_source`の場合常に None）
- `maybe_source_map`: （`fetch_local_source`の場合常に None）

ローカルのファイルパスを解決する`fetch_local_source`の面白い挙動としては、`ファイル名.mime`というファイルがもし置かれていれば、そのメディアタイプとして解釈する挙動になっています。ローカルファイルでこれをわざわざやる必要は無さそうですが、リモートのファイルとを取ってくるときに Content-Type ヘッダの値を格納しておくという使い方をしています。  
なお`.mime`ファイルがなければファイルの拡張子ごとにあらかじめ定義されているタイプとして解釈します。例えば`.ts`は TypeScript として解釈します。

リモートの URL を解決する`fetch_remote_source`ではソースを HTTP GET してきて、URL 末尾の拡張子に対応するメディアタイプと、レスポンスヘッダの`Content-Type`ヘッダを比較し、もし食い違っていたら前述の`.mime`タイプを作成し拡張子よりも`Content-Type`の値をリスペクトするという処理になってます。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/deno_dir.rs#L152-L175

コードを取得するための HTTP クライアントは[hyper](https://github.com/hyperium/hyper)というものを利用していました。低レベルだけど高速に動作する HTTP クライアントのようです。例えばリダイレクトのフォローを自前で書かないといけないくらいシンプルなクライアントです。コードにも TODO が書かれているんですが、現在のコードでは最大リダイレクト数が設定されておらず、リダイレクトループが発生するとハングするコードになってます。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/src/http_util.rs#L61-L62

TypeScript のコードの取得は完了しました。次に V8 で実行できるように JavaScript にコンパイルする必要があります。
`code_fetch_and_maybe_compile`の`DenoDir::code_fetch`を読みきったので続きを読んでいきます。

https://github.com/denoland/deno/blob/77114fbda49382e397095d8214bd76996b0cfb57/src/isolate.rs#L375-L390

わかりやすくログが出てますが、`compile_sync`が ts を js にコンパイルする関数ですね。`compile_sync`の中身も追います。

https://github.com/denoland/deno/blob/77114fbda49382e397095d8214bd76996b0cfb57/src/compiler.rs#L101-L118

内部で呼び出されている`lazy_start`と、更にその中でコールされている`worker::spawn`も追います。

https://github.com/denoland/deno/blob/77114fbda49382e397095d8214bd76996b0cfb57/src/compiler.rs#L82-L90

https://github.com/denoland/deno/blob/77114fbda49382e397095d8214bd76996b0cfb57/src/workers.rs#L53-L87

worker::spawn の中`worker.execute`にて`denoMain()`, `workerMain()`, `引数で渡されたコード`を実行するようになっています。引数で渡されたコードは何かというと`lazy_start`を見ての通り`compilerMain()`です。  
Worker は main 関数で生成された V8 Isolate とは隔離された別の Isolate を生成しています。この Isolate もまたスナップショットから復元されているので高速です。
これら３つの関数が実行されたあとに、req 関数で生成した`specifier`と`referrer`を worker に送信し、TypeScript のコンパイルを実行します。

次に`compilerMain`の定義を追ってみます。

https://github.com/denoland/deno/blob/ee9c627cc5f92898d104e9359059b57354c9f83c/js/compiler.ts#L526-L544

Compiler の compile メソッドは[js/compiler.ts](https://github.com/denoland/deno/blob/ee9c627cc5f92898d104e9359059b57354c9f83c/js/compiler.ts#L235-L318)に定義されています。コードがやや長いので引用はしません。  
大まかな処理内容としては、`typescript`モジュールを使ってコンパイルしたり型検査したりしてます。JSON に関しては[`jsonEsmTemplate`](https://github.com/denoland/deno/blob/ee9c627cc5f92898d104e9359059b57354c9f83c/js/compiler.ts#L122)という薄いラッパーを噛ませて独自コンパイルしています。それ以外（TypeScript, JavaScript）に関しては、LanguageService の`getEmitOutput`を用いてソースマップとコンパイル後の JavaScript を入手し、その後に型検査 etc を実行しもしエラーがあれば異常終了、エラーがなければ JavaScript にソースマップをくっつけてキャッシュに書き込んで完了という処理になっています。  
検査する項目は独自に絞って処理の高速化を図っています。このやり方のほうが 3 倍ほど通常の検査より高速だそうです。

https://github.com/denoland/deno/blob/ee9c627cc5f92898d104e9359059b57354c9f83c/js/compiler.ts#L262-L274

なお TypeScript の LanguageService の詳しい説明は[公式の wiki](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API)にあったのでそちらを参照して下さい。

JavaScript へのコンパイルが完了し、ようやく指定されたモジュールを実行できるようになりました。最後に`libdeno::deno_execute_mod`を読みます。`libdeno::deno_execute_mod`は[libdeno/api.cc](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/api.cc#L129)に定義されています。実質的な処理は`deno::ExecuteMod`に書いてあります。`deno::ExecuteMod`は[libdeno/binding.cc](https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/binding.cc#L592)に定義されています。V8 で JavaScript のコードを実行するくだりは`deno::Execute`のときに書いた説明を参照して下さい。

https://github.com/denoland/deno/blob/c870cf40823a4900278f8ddf03489338c169878b/libdeno/binding.cc#L603-L624

ここまでの内容で、deno コマンドを実行し、TypeScript が実行されるまでの処理が追えたと思います。

```shell
$ cat tests/002_hello.ts
console.log("Hello World");

$ ./target/debug/deno tests/002_hello.ts
Hello World
```

## さいごに

実行されるすべての行を網羅したわけではありませんが、ビルドプロセスも含めて一連の流れを追えたと思います。Rust、C++、TypeScript とレイヤをまたぐ処理がかなり多いので、わかってしまえばすんなり読めますが、初見はかなり大変でした。  
C++は V8 以外の処理をなるべく書かず意図的に Rust 側に寄せているように感じました。Rust で書いたほうが自分の足を撃ちにくいプログラムになると思うので、これが功を奏すのかどうか、1~2 年後が楽しみです。

記事内ではあまり触れてませんが、コードを読んでる過程で TODO や FIXME コメントが大量に見つかったので、Deno コアに対するコントリビュートのネタは、コード読むとたくさん見つかると思います。

他にも Worker の実装、セキュリティモデルの実装、TypeScript 製の外部モジュールの依存解決、イベントループや TaskQueue 関連の Node.js との差異、ビルドプロセスの詳細など、まだまだ読みたい Deno のコードがあるので、読んで理解できたら記事書きます。
