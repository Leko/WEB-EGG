---
path: /post/use-docker-instead-of-dotenv/
title: Docker(compose)使い始めてから.env系のライブラリを使わなくなってた
date: 2016-11-01T10:50:51+00:00
dsq_thread_id:
  - "5268947038"
categories:
  - 効率化
  - 考えてみた
tags:
  - Docker
  - Redis
---
こんにちは。  
一時期はAnsibleにお熱でしたが、最近はDocker(-compose)にお熱です。  
※それぞれ全く別のツールですが、"開発環境を作る"という視点で見れば手段は違えど目的は同じだと思ってます。

Dockerを利用するようになり、環境変数の注入が簡単になったので気づけば.env系のライブラリ要らなくなっているなあと気づきました。  
どんな風に、と言われてもドキュメントの通り使ったらそうなる、としか言い様が無いのですが、  
一応備忘録として残しておこうと思います。

<!--more-->

## docker runコマンド

```
docker run {SOME_CONTAINER} -e SOME_VAR1=SOME_VALUE1 -e SOME_VAR2=SOME_VALUE2
```

というように`e`オプションを与えれば環境変数を指定可能です。

Dockerに.envファイルを読み込ませる
----------------------------------------

```
docker run {SOME_CONTAINER} --env-file .env
```

のように、環境変数が記述されたファイルを指定可能です。  
書式は`.env`でよく使ってるそのままの書式で指定可能です。

**これがdotenv系ライブラリが不要になった要因です**  
わざわざプログラム上から読み込まなくても、コンテナ内の環境変数をあらかじめ設定しておけるので要らなくなりました。

本番サーバでDockerを使わず、更にdotenvを利用したい場合、結局dotenvによせざるを得ないんですが、  
PaaSとか使ってるなら、dotenvを本番で使うケースは稀だろうと思います。

## Docker composeでの利用

Docker composeで指定できるオプションは基本的に`docker run`に渡せるオプションに対応しています。  
環境変数周りに関しても例外ではありません。

```yaml
version: '2'
services:
  app:
    env_file: .env
    links:
      - redis
  redis:
    image: 'redis:latest'
```

というように、.envを読み込ますことが可能です。  
ただ、個人的に気持ち悪いと感じているのが、`docker-compose.yml`内の依存関係のはずなのに.envと別ファイルに依存関係が分離されてしまうことです。

例えば↑の例で言うとappコンテナにはRedisというホスト名のリンクが追加されているので、redisに接続する際のホスト名は`redis`固定のはずです。  
各開発者のローカル設定によらず、同じdocker-compose.ymlを使う以上絶対に固定の値なのに、気持ち悪い。

## Docker composeで固定値と.envを混在させる

ということで現状使っている暫定的な対応策です。

```yaml
version: '2'
services:
  app:
    environment:
      REDIS_URL: 'redis://redis'
    env_file: .env
    links:
      - redis
  redis:
    image: 'redis:latest'
```

`environment`と`env_file`は両立できるので、

  * Git管理されるべき固定値は`docker-compose.yml`の中の`environment`セクションに記述
  * Git管理してはいけない変動地は`.env`にファイルとして外出し

と分けています。  
.envというファイルパスに依存しているだけなので、その中身は何であっても構いません。  
具体的な値を抜いた枠を`.env.example`等として作成しておき、  
環境構築時に`cp .env.example .env`してもらって任意の値を使用する、という方法が無難かなぁ、と思っています。

まとめ
----------------------------------------

Dockerはいいぞ。

Docker composeを使いだすと、コンテナを複数個使うハードルが途端に下がり、  
つい「コンテナ=物理サーバ」という境界線を引いてしまいがちですが、「コンテナ=プロセス」と捉えることを忘れないようにすれば、考えはシンプルなまま便利さを享受できると思います。
