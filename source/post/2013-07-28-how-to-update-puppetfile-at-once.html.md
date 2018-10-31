---
path: /post/how-to-update-puppetfile-at-once/
title: boxenのPuppetfileを一発更新するスクリプトを書いた
date: 2013-07-28T23:02:42+00:00
twitter_id:
  - "361489740773593089"
dsq_thread_id:
  - "3160884107"
image: /images/2013/07/BOXEN1.jpg
categories:
  - 効率化
tags:
  - Boxen
  - PHP
---

こんにちは。  
今使っている MacBook Air の容量がほぼ一杯になってしまったので、  
クリーンインストールをしようと思っています。

Time machine から復旧してしまうと何も変わらないので、  
[boxen](http://boxen.github.com/)という Github 社が提供しているセットアップツールを使おうと思います。
詳しい使い方は上記リンクをご参照ください。

Boxen では`Puppetfile`という設定ファイルで色々とアプリを読み込んだり出来るのですが、  
**このバージョンをいちいち更新するのがひどく面倒くさい**。 でも、出来れば常にメンテされた最新版でありたい。

そんな悩みを解消するため、  
**Pupeetfile で読み込んでいる Resources のバージョンを全て更新するスクリプト**を書きました。

とてもピンポイントですが、  
同じ悩みを抱える方には需要のある内容だと思います。

<!--more-->

## boxen とは、基本的な使い方

繰り返しになりますが、  
boxen とは、Github 社が提供している Mac のセットアップツールです。

基本的な知識や導入方法についてはこちらのリンクを御覧ください。  
先に下記リンクを読んで boxen について軽く抑えておくといいと思います。

- [Boxen 使わなくても許されるのは 2012 年までだよね](http://qiita.com/yuku_t/items/c6f20de0e4f4c352046c)
- [boxen を導入した話 – diary](http://trapezoid.hatenablog.com/entry/2013/04/21/005524)
- [github boxen 使ってみてハマったところ – おみブロ Z](http://akiomik.hatenablog.jp/entry/2013/05/12/013923)

## Puppetfile とは

Puppetfile とは、

> 外部の resource を使う場合はここで指定する。現在主に仕えるのは[boxen](https://github.com/boxen)にある boxen-\* という名前のリポジトリに入っているもの。設定自体は~/src/my-boxen にある Puppetfile に書く。  
> Puppetfile には初期状態で何個か設定がある。こいつらは Boxen 自体が使ったりするので消さないこと。  
> [Boxen 使わなくても許されるのは 2012 年までだよね](http://qiita.com/yuku_t/items/c6f20de0e4f4c352046c)

とあるように、外部の resources(アプリやツールなど)を読み込むための設定ファイルです。  
４行くらい例を出してみます。

```
github "dropbox",     "1.0.0"
github "mysql",       "1.0.0"
github "iterm2",      "1.0.0"
github "chrome",      "1.0.0"
```

このように、`dropbox`や`chrome`、他にも`imagemagick`などがあって、  
自分の作りたい環境に合わせて組み合わせることができます。

resource 名の後ろにある数字は、**バージョン**です。

このバージョンはどこから取得するかというと、  
例えば`dropbox`の場合なら、

1. <https://github.com/boxen/puppet-dropbox>にアクセスして
2. `Releases`をクリック、表示されたページにある`Tags`をクリックして、
3. 表示されたバージョンのいずれかを指定

![結構めんどい手順](/images/2013/07/65ac0ccf93991a1bcddf1ec41ae71778.png)

という結構めんどい手順が必要です。

読み込むファイルが 10 個くらいならまだ良いのですが、  
色々欲しがってしまう僕は 30 個以上読み込んでいます。

**これらの resource 全てを最新版に保つのはあまりにめんどい！**  
**面倒なのもあるけど、見間違え、打ち間違えが出そう！**

と思ったので、このバージョンを自動更新するスクリプトを書きました。

## Github API について

**resource は Github で公開されているなら、  
Github の API を使えばタグも取れんじゃない？**

と思ったので、調べてみたらありました。 とあるリポジトリのタグ一覧を取得するには、

> GET /repos/:owner/:repo/tags  
> [Repos \| GitHub API](http://developer.github.com/v3/repos/#list-tags)

とアクセスすればいいようです。

これなら、別途設定ファイルを作らずに、  
Puppetfile を読み込んで更新かけられそうです。

## 自動更新するスクリプト

ということで php で実装してみました。  
ソースコードは最後に載せます。

このスクリプトを動かす前に**少しだけ準備**があります。

boxen が必須としている部分を書き換えてしまうのは怖いので、  
自動アップデートをかける範囲を指定できるようにしました。

Puppetfile の中にこんな感じで指定します。

```
# ---auto update---
github "osx",            "1.3.2"
github "alfred",         "1.1.1"
github "wunderlist",     "1.0.0"
…
# ---/auto update---
```

この`# ---auto update---`という部分は php の中で定数化しているので、  
ダウンロードして各自お好みにカスタマイズして下さい。

そして自動更新の php ファイルを、**自分の boxen リポジトリ直下に配置**します。  
php ファイルを設置したら、ターミナルでそのリポジトリを開いて、

```
$ cd /path/to/my-boxen/
$ php autoUpdate.php
```

と実行すると、  
Puppetfile のコメントで指定した範囲内がアップデートされます。

ちなみに、アップデートした resource は、標準出力で通知します。

![標準出力で通知](/images/2013/07/4018a98968aaa5eb5e0c0b4df27bf5cd.png)

こんな感じ

## まとめ

ソースコードはこちらになります。

<script src="https://gist.github.com/Leko/6098584.js"></script>
