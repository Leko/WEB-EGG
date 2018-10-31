---
path: /post/how-to-mount-data-volume-to-local-with-docker-compose/
title: docker composeでMySQLのデータ領域をローカルにマウントする
date: 2016-11-30T23:50:39+00:00
dsq_thread_id:
  - "5319858042"
categories:
  - 問題を解決した
tags:
  - Docker
  - Docker compose
  - MySQL
---

この記事は[12/1 の Docker2 Advent Calendar](http://qiita.com/advent-calendar/2016/docker2), [12/3 の Hamee Advent Calendar](http://qiita.com/advent-calendar/2016/hamee)の記事です。

こんにちは。  
docker compose めちゃくちゃ便利ですよね。  
Chef, Vagrant, Puppet, Ansible, Fabric…とプロビジョニングツールとか仮想化ツールを色々触ってきましたが、  
それらよりずば抜けて扱いやすいと思っているツールです。

で、ローカルで開発している時に困るのが、 **MySQL をはじめ DB にデータを持ってもコンテナを破棄するとデータがすっ飛ぶ** 問題です。  
軽量なアプリの場合なら DB 破棄してシード流して、、、という構成でもイケるかも知れませんが、多くの場合オーバーヘッドが大きすぎてまともに開発できなくなると思います。

Docker for Mac を使用している場合はこの問題は難なく解消できるのですが、  
docker-machine を使用している場合に恐らくドハマリするので、備忘録として残しておきます。

<!--more-->

## まえおき

冒頭にも書きましたが、docker-compose + docker-machine での話です。  
ただ、互換性のために Docker for Mac でも動作確認はしております。

## 基本戦術

```yaml
version: "2"
services:
  db:
    image: mysql:5.6
    volumes:
      - ./db/mysql_data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=app
```

大枠このような感じになると思います。  
volumes でローカルのディレクトリと MySQL コンテナのデータ領域をマウントしています。  
これで、何かデータが書き込まれればローカルのファイルとして残るので、コンテナが消えてもデータが永続化されそうです。

何度でも書きますが、Docker for Mac ならこの書き方で問題になりません。意図したとおり動きます。 ですが、docker-machine 環境においては、以下の問題が発生します。

## 問題：コンテナ内のパーミッション・オーナー

docker-machine で volumes を利用すると、

- ローカルのパーミッション・オーナー・グループが無視される
  - uid=1000 のユーザがオーナーになる。上記 Yaml の場合は ftp ユーザがオーナーになってました
- MySQL の実行ユーザでは権限が足りず、Permission denied や…not writable 的なエラーが起きる
- マウントした時に発生するので、Dockerfile 内でごにょっておく等の事前準備は不可能
- MySQL の実行ユーザを無理やり uid=1000 にすることでも解消できそうですが、MySQL と関係のないユーザで MySQL を操作するのはキモい…

という感じです。  
かなりのゴリ押しで、自分でも汚いと思っているハックですが、こんな解消方法で突破できました。

```yaml
version: "2"
services:
  db:
    image: mysql:5.6
    command: bash -c 'usermod -o -u 1000 mysql; groupmod -o -g 500 mysql; chown -R mysql:root /var/run/mysqld/; /entrypoint.sh mysqld --user=mysql --console'
    volumes:
      - ./db/mysql_data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=app
```

`command: ...`の行を足しました。  
コンテナ起動時にデータ領域のパーミッション・オーナー・グループを書き換えてから mysqld を起動しています。

`command`セクションに指定できる値はシェルではなく、  
実行可能ファイルが 1 つめ、それ以降は全て引数という形式にエスケープされてしまいます。  
単純に複数コマンドを書くことができません。なので`bash -c ...`と書いて複数行のシェルを実行しています。

Docker for Mac でも動作確認しましたが、この構成で動いてくれました。

## まとめ

**docker-compose 使うなら Docker for Mac 使いましょう。色々つらくない。圧倒的に楽**  
もしチーム内に１人でも docker-machine の人が居たら、上記のハックを使ったら良いと思います。

ベンチマーク取ってないので分かりませんが、  
Docker for Mac の方が主にマウント・ファイル I/O 周りの速度が向上しているように感じます。  
まだ docker-machine と Docker for Mac の違いを体系的に理解できていないので、また別途記事を書きます。

## おまけ：エンコーディング問題

上記の対応だけでは、エンコーディングの問題が解消していないので、マルチバイト周りでハマります。  
こちらの記事も併せてご参照ください。

> [Redmine の Docker コンテナと MySQL で日本語を使えるようにするまで \| WEB EGG](/post/how-to-use-redmine-with-docker-in-japanese/)
