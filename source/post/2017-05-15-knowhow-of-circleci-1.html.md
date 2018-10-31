---
path: /post/knowhow-of-circleci-1/
title: CircleCI 1.0でDockerやdocker-composeを使用する際の制限と気をつけること
date: 2017-05-15T10:50:12+00:00
meaningless:
  - "yes"
dsq_thread_id:
  - "5794626636"
categories:
  - 問題を解決した
tags:
  - CI
  - CircleCI
  - Docker
  - Docker compose
---

こんにちは。  
かれこれ 1 年くらい仕事で CircleCI + Docker を使ってみているのですが、 **とにかくツラい** 。  
CircleCI + Docker 構成で CI したい方はだいぶマゾいとすら思います。  
他の CI 系のサービスどうなんだろうと調べつつも、これまで戦ってきたノウハウは備忘録として残そうと思います。

なにがツラいかというと、

- [btrfs（B 木ファイルシステム）](https://ja.wikipedia.org/wiki/Btrfs)というファイルシステム上に
- [独自に fork した Docker](https://github.com/circleci/docker)を積んでおり
- のと、CI で使用するイメージに色々カスタマイズが入っている（調べきれていない）

という構成だと、色々な Docker に関する操作が動きません。  
ローカルでは動くので、基本ドはまりする要素満載です。  
さらに docker-compose でブラックボックスに包むと、余計にわけがわからなくなります。

ということでハマったことと、CircleCI で Docker を扱うための基本戦術を残します。

<!--more-->

## Tips: ビルドに Docker1.10.0, docker-compose 1.8.0 を使用する

新しければエラーが少ないかというと、よく分かりません。。。  
相性がそもそも合ってないので、どのバージョンでも割り切ったほうが良いです。

```yaml
machine:
  pre:
    - curl -sSL https://s3.amazonaws.com/circle-downloads/install-circleci-docker.sh | bash -s -- 1.10.0
    - sudo pip install docker-compose==1.8.0
```

を足してあげて下さい

## 基本的な方針

- コンテナの削除に関連するコマンドを実行しない（しても成功しない）
- docker exec しない

これに付きます。  
意外と上記の制約がキツく、リソースが枯れたり思うようにできなかったりします。

## Docker の制限

### run –rm オプションは使わない

run したコンテナを rm する時にエラーになります。

```
Error removing intermediate container XXXXXXXXX:
Driver btrfs failed to remove root filesystem XXXXXXXXXXXX Failed to destroy btrfs snapshot: operation not permitted
```

のようなエラーです。  
色々試してみたものの、結局のところ **–rm オプションはつけない** ことで回避できます。  
要らないコンテナを消せないのはなんとも気持ち悪いですが、動かないんじゃ仕方ない

### rm コマンドは使わない

`docker rm`も同様です。使ってはいけません。

### exec コマンドは使わない

デフォルトの Docker でも、1.10.0 でもどちらもエラーになります。

1.10.0 の場合、私の環境では

```
open /proc/self/oom_score_adj: no such file or directory
```

> &mdash; [Exit Code 255 on all Docker exec commands – Build Environment – CircleCI Community Discussion](https://discuss.circleci.com/t/exit-code-255-on-all-docker-exec-commands/2506)  
> &mdash; [Docker 1.10.0 is available (Beta) – Build Environment – CircleCI Community Discussion](https://discuss.circleci.com/t/docker-1-10-0-is-available-beta/2100/15)

というエラーが発生しました。

[1.10.0 からは LXC(Linux コンテナ) Driver のサポートが切られている模様 ※記事下部コメント参照](http://qiita.com/sawanoboly/items/c6df7cce870f44ed4aaf)です。  
色々試してみましたが、結局 exec は使わない方向に倒さないとどうにもなりませんでした。

### CircleCI 上で docker build しない

流石に`docker build`はできるかというと、できないこともあります。  
まだ再現性は不明で、突如訪れます。

> &mdash; [Docker Error removing intermediate container – Build Environment – CircleCI Community Discussion](https://discuss.circleci.com/t/docker-error-removing-intermediate-container/70)

リポジトリで Dockerfile を管理しており、ビルドがきちんと動くかどうか CI したい、なんてケースでドハマリすることがあります。  
その場合はもう諦めて Docker hub などの Docker レジストリに上げておいて、そのイメージを pull して使用する形で回避できます。  
（もうこの時点でだいぶ無理が来ていると思う）

### CIRCLE_ARTIFACTS をコンテナにマウントしない

色々な厄災を招きます。  
例えばカバレッジレポートなどの副作用が欲しい場合、docker コマンド上では適当なローカルのフォルダにマウントしておき、  
circle.yml 上で生成されたファイルを`$CIRCLE_ARTIFACTS`へ mv したり cp したりした方が安定します。

ここも詳しくは調査が足りていません。

## docker-compose の制限

Docker のラッパーである docker-compose も当然同様の制約がつきまといます。

- rm コマンドは使わない
- exec コマンドは使わない

など基本的なことに加え、以下にハマりました。

### up –force-recreate は使わない

ビルドの過程でイメージから新鮮なコンテナを再生成したい、というケースでハマりました。  
明示的に rm しなければ大丈夫なのでは？ と思いましたが、ダメでした。

`--force-recreate`が内部的に rm するので、当然エラーになります。  
docker-compose の場合、一度立ち上げたコンテナを削除すること無く新鮮な状態にロールバックする回避策が必要です。  
こればかりはプロジェクトによると思うので割愛します。  
**なお、このとき動いているコンテナに対して exec することはできません**

## さいごに

rm はダメ、と言いましたができることもあります。  
コンテナにマウントするフォルダによって変わったりするので、条件が分かり次第明記します。

色々と調査不足が目立つ内容なので、必ずしもこの記事を読んだ方の環境でも同様の減少になるかどうかは分かりません。  
もしご指摘や補足があればして頂けると幸いです。
