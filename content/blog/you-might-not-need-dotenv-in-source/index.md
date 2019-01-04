---
title: プログラム内でdotenvを読み込むのをやめた話
date: 2019-01-05T10:30:00+0900
tags:
- Node.js
- JavaScript
---

[dotenv](https://github.com/bkeepers/dotenv)というRuby発のOSSがあります。  
`.env`って名前のファイルに環境変数を列挙してライブラリを読み込むと、それらの値をプロセス内の環境変数として値を展開してくれるというツールです。
もちろん[Node.js版](https://github.com/motdotla/dotenv)の実装も存在します。

Herokuを愛用していた時期によく使っていたのですが、何年か使ってみた結果プロセスの中で`require('dotenv').config()`と書くのではなく、そのプロセスを起動するときに`node --require dotenv/config`とrequireオプションを用いてdotenvとプログラムの依存をなくす方向に落ち着きました。  
なぜそちらの方がいいのか考えていることを残しておく。

## コードがコミットされてない（はずの）ファイルに依存している
当然ですが、dotenvがソースに書かれているということは`.env`という名前のファイルが存在していることに依存しています。
しかし.envはコミットすべきではないファイルなので、基本的にignoreされているはずです。

> Should I commit my .env file?
> No. We strongly recommend against committing your .env file to version control.
>
> &mdash; [motdotla/dotenv: Loads environment variables from .env for nodejs projects.](https://github.com/motdotla/dotenv#should-i-commit-my-env-file)

公式のREADMEにも.envはコミットしないことを強く推奨しています。  
CIやデプロイ先でcheckoutしたときに.envって名前のファイルを作らないといけないのでプログラム内で読み込む方法は汎用的でないと思います。
例えば以下のように環境変数を見たりして回避できますが、わざわざ環境別のifを書かずに済みます。

```js
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}
```

## いずれ.envがコミットされ始める
> Should I have multiple .env files?
> No. We strongly recommend against having a "main" .env file and an "environment" .env file
>
> &mdash; [motdotla/dotenv: Loads environment variables from .env for nodejs projects.](https://github.com/motdotla/dotenv#should-i-have-multiple-env-files)

公式のREADMEにも.env.testなどのように環境別の.envは作成しないことを強く推奨しています。  
`.env.test`、`.env.production`のように環境別のファイルが次々登場してもはや設定ファイル化しているdotenvのプロジェクトを多く見かけたことがあります。
以下のようなファイル名を環境ごとにずらして読み込むコード見たことないでしょうか。私はあります。

```js
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({
        path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
    })
}
```

そしてテンプレート化した設定ファイルをメンバーが増えるたびにいちいち手動で作るのも面倒なので、便宜上の理由からコミットしてしまうパターンもよく見ます。
Git管理する設定ファイルとしてdotenvはかなり質素なので、設定ファイルとして扱いたいならそもそも.envをやめて別の仕組み（AWSのKMSやHashicorpのVaultなど）を使ったほうがいいと思います。

## dotenvをコードから追い出す
`node -r dotenv/config hoge.js`のように、nodeの`-r(--require)`オプションを利用すると、プログラム本体からdotenvを切り離せるようになります。
上記のコマンドだと先にdotenvが読み込まれてprocess.envに環境変数がセットされ手から`hoge.js`が実行されます。`DATABASE_URL=xxx node hoge.js`のようにシェルから環境変数を指定してプロセスを起動した時と実質的には同じになります。

requireオプションは、[@babel/register](https://babeljs.io/docs/en/babel-register)や[ts-node/register](https://github.com/TypeStrong/ts-node#programmatic)などでもrequireオプションは使うので馴染み深い方もいると思います。

プログラムからdotenvの依存を剥がしておけばCIやデプロイ先では管理画面から環境変数を設定し、開発中はローカルにある.envを参照するなどの使い分けが容易になります。
