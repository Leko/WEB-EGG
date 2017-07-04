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
表題の通り、Dockerの[Redmine](https://hub.docker.com/_/redmine/)と[MySQL](https://hub.docker.com/_/mysql/)のコンテナをDocker composeで組み合わせ、日本語が使用するまでのメモです。

<!--more-->

RedmineのDBをMySQLへの切り替える
----------------------------------------

デフォルトはSQLiteになっているので、DBドライバをMySQLに切り替えます。 [公式コンテナ](https://hub.docker.com/_/redmine/)のドキュメントに書かれています。

  * MySQLコンテナ 
      * `MYSQL_ROOT_PASSWORD`にパスワードを指定
      * `MYSQL_DATABASE`に`redmine`を指定（固定？ 任意の値に変更可能？）
  * Redmineコンテナ 
      * `REDMINE_DB_MYSQL`という環境変数にMySQLコンテナの名前を指定
      * `REDMINE_DB_PASSWORD`にMySQLコンテナに指定したパスワードを指定

これでMySQLに切り替わります。Railsサーバが起動し画面でのアクセスも可能です。  
でも管理画面でデフォルト設定をロードしようとすると

```
redmine "Mysql2::Error: Incorrect string value"
```

というエラーが。

## "Mysql2::Error: Incorrect string value"を解消する

エラーメッセージを見る限り、まぁ文字コード系だろうなぁ。という感触。  
調べてみるとやっぱり同様の問題が。

> [rails – Mysql2::Error: Incorrect string value – そういうことだったんですね](http://babiy3104.hateblo.jp/entry/2014/02/13/000219)

ということでMySQLコンテナにエンコーディング周りの設定を追加します。  
設定をまるごと上書きする必要はないと判断し、差分だけ書き足し`/etc/mysql/conf.d`にマウントする方式で対応します。

```
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci
```

MySQL 5.5から`utf8mb4`に対応していたそうなので、せっかくなので指定してみる。  
UTF-8mb4は4バイト対応のUTF-8だそうです。絵文字とか特殊文字とか稀に存在する4バイトにも対応しているエンコーディング。  
詳しくはこちらが参考になりました。

> [RDS MySQL5.5.33 で『utf8mb4』(4バイト対応UTF-8文字コードセット)を試してみた ｜ Developers.IO](http://dev.classmethod.jp/cloud/aws/utf8mb4-on-rds-mysql/)

これをdocker-compose.yml上でマウントします。

```yaml
# ...
  redmine:
    image: 'redmine:2.6'
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

Githubを探すと↑のissueが出てきたのですが、これで治らんということはおそらくRedmineコンテナのRailsにこの修正が当たっていないのだろう。  
MySQLの文字コードを`utf8mb4`から`utf8`に変更したところ治りました。  
暫定的な対応ではなくきれいに直したかったけど、とりあえず治ったのでいいか。  
暇な時に調べてみます。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>