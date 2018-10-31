---
path: /post/how-to-use-redmine-with-docker-in-japanese/
title: RedmineのDockerコンテナとMySQLで日本語を使えるようにするまで
date: 2016-11-08T11:00:46+00:00
dsq_thread_id:
  - "5287175142"
categories:
  - 問題を解決した
tags:
  - Docker
  - Docker compose
  - MySQL
  - Redmine
---

こんにちは。ドハマりしたので備忘録。  
表題の通り、Docker の[Redmine](https://hub.docker.com/_/redmine/)と[MySQL](https://hub.docker.com/_/mysql/)のコンテナを Docker compose で組み合わせ、日本語が使用するまでのメモです。

<!--more-->

## Redmine の DB を MySQL への切り替える

デフォルトは SQLite になっているので、DB ドライバを MySQL に切り替えます。 [公式コンテナ](https://hub.docker.com/_/redmine/)のドキュメントに書かれています。

- MySQL コンテナ
  - `MYSQL_ROOT_PASSWORD`にパスワードを指定
  - `MYSQL_DATABASE`に`redmine`を指定（固定？ 任意の値に変更可能？）
- Redmine コンテナ
  - `REDMINE_DB_MYSQL`という環境変数に MySQL コンテナの名前を指定
  - `REDMINE_DB_PASSWORD`に MySQL コンテナに指定したパスワードを指定

これで MySQL に切り替わります。Rails サーバが起動し画面でのアクセスも可能です。  
でも管理画面でデフォルト設定をロードしようとすると

```
redmine "Mysql2::Error: Incorrect string value"
```

というエラーが。

## "Mysql2::Error: Incorrect string value"を解消する

エラーメッセージを見る限り、まぁ文字コード系だろうなぁ。という感触。  
調べてみるとやっぱり同様の問題が。

> [rails – Mysql2::Error: Incorrect string value – そういうことだったんですね](http://babiy3104.hateblo.jp/entry/2014/02/13/000219)

ということで MySQL コンテナにエンコーディング周りの設定を追加します。  
設定をまるごと上書きする必要はないと判断し、差分だけ書き足し`/etc/mysql/conf.d`にマウントする方式で対応します。

```
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci
```

MySQL 5.5 から`utf8mb4`に対応していたそうなので、せっかくなので指定してみる。  
UTF-8mb4 は 4 バイト対応の UTF-8 だそうです。絵文字とか特殊文字とか稀に存在する 4 バイトにも対応しているエンコーディング。  
詳しくはこちらが参考になりました。

> [RDS MySQL5.5.33 で『utf8mb4』(4 バイト対応 UTF-8 文字コードセット)を試してみた ｜ Developers.IO](http://dev.classmethod.jp/cloud/aws/utf8mb4-on-rds-mysql/)

これを docker-compose.yml 上でマウントします。

```yaml
# ...
redmine:
  image: "redmine:2.6"
  environment:
    - MYSQL_PORT_3306_TCP=1
    - REDMINE_DB_MYSQL=redmine_db
    - REDMINE_DB_PASSWORD=root
  depends_on:
    - redmine_db
redmine_db:
  image: mysql:5.6
  volumes:
    - ./docker/db/multibyte.cnf:/etc/mysql/conf.d/multibyte.cnf
```

再起動してみるとデフォルト設定をロードできました。  
ということでコンテナを破棄してもう一度マイグレーションからやり直したらこんなエラーが。

## "Mysql2::Error: Specified key was too long"を解消する

結局、恒久的な対応策が見つかりませんでした。

> Fixed by [8744632](https://github.com/rails/rails/commit/8744632fb5649cf26cdcd1518a3554ece95a401b) 😁  
> [MySQL UTF8MB4 breaks ActiveRecord schema setup · Issue #9855 · rails/rails](https://github.com/rails/rails/issues/9855)

Github を探すと ↑ の issue が出てきたのですが、これで治らんということはおそらく Redmine コンテナの Rails にこの修正が当たっていないのだろう。  
MySQL の文字コードを`utf8mb4`から`utf8`に変更したところ治りました。  
暫定的な対応ではなくきれいに直したかったけど、とりあえず治ったのでいいか。  
暇な時に調べてみます。
