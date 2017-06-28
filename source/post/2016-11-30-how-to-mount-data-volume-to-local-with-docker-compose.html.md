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
この記事は[12/1のDocker2 Advent Calendar](http://qiita.com/advent-calendar/2016/docker2), [12/3のHamee Advent Calendar](http://qiita.com/advent-calendar/2016/hamee)の記事です。

こんにちは。
  
docker composeめちゃくちゃ便利ですよね。
  
Chef, Vagrant, Puppet, Ansible, Fabric…とプロビジョニングツールとか仮想化ツールを色々触ってきましたが、
  
それらよりずば抜けて扱いやすいと思っているツールです。

で、ローカルで開発している時に困るのが、 **MySQLをはじめDBにデータを持ってもコンテナを破棄するとデータがすっ飛ぶ** 問題です。
  
軽量なアプリの場合ならDB破棄してシード流して、、、という構成でもイケるかも知れませんが、多くの場合オーバーヘッドが大きすぎてまともに開発できなくなると思います。

Docker for Macを使用している場合はこの問題は難なく解消できるのですが、
  
docker-machineを使用している場合に恐らくドハマリするので、備忘録として残しておきます。

<!--more-->

まえおき
----------------------------------------

冒頭にも書きましたが、docker-compose + docker-machineでの話です。
  
ただ、互換性のためにDocker for Macでも動作確認はしております。

基本戦術
----------------------------------------

```yaml
version: '2'
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
  
volumesでローカルのディレクトリとMySQLコンテナのデータ領域をマウントしています。
  
これで、何かデータが書き込まれればローカルのファイルとして残るので、コンテナが消えてもデータが永続化されそうです。

何度でも書きますが、Docker for Macならこの書き方で問題になりません。意図したとおり動きます。 ですが、docker-machine環境においては、以下の問題が発生します。

問題：コンテナ内のパーミッション・オーナー
----------------------------------------

docker-machineでvolumesを利用すると、

  * ローカルのパーミッション・オーナー・グループが無視される 
      * uid=1000のユーザがオーナーになる。上記Yamlの場合はftpユーザがオーナーになってました。
  * mysqlの実行ユーザでは権限が足りず、Permission deniedや…not writable的なエラーが起きる
  * マウントした時に発生するので、Dockerfile内でごにょっておく等の事前準備は不可能
  * MySQLの実行ユーザを無理やりuid=1000にすることでも解消できそうですが、MySQLと関係のないユーザでMySQLを操作するのはキモい…

という感じです。
  
かなりのゴリ押しで、自分でも汚いと思っているハックですが、こんな解消方法で突破できました。

```yaml
version: '2'
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
  
コンテナ起動時にデータ領域のパーミッション・オーナー・グループを書き換えてからmysqldを起動しています。

`command`セクションに指定できる値はシェルではなく、
  
実行可能ファイルが1つめ、それ以降は全て引数という形式にエスケープされてしまいます。
  
単純に複数コマンドを書くことができません。なので`bash -c ...`と書いて複数行のシェルを実行しています。

Docker for Macでも動作確認しましたが、この構成で動いてくれました。

まとめ
----------------------------------------

**docker-compose使うならDocker for Mac使いましょう。色々つらくない。圧倒的に楽**
  
もしチーム内に１人でもdocker-machineの人が居たら、上記のハックを使ったら良いと思います。

ベンチマーク取ってないので分かりませんが、
  
Docker for Macの方が主にマウント・ファイルIO周りの速度が向上しているように感じます。
  
まだdocker-machineとDocker for Macの違いを体系的に理解できていないので、また別途記事を書きます。

おまけ：エンコーディング問題
----------------------------------------

上記の対応だけでは、エンコーディングの問題が解消していないので、マルチバイト周りでハマります。
  
こちらの記事も併せてご参照ください。

> [RedmineのDockerコンテナとMySQLで日本語を使えるようにするまで \| WEB EGG](http://leko.jp/archives/884)

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>