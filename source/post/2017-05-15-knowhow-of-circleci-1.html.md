---
path: /post/knowhow-of-circleci-1/
title: CircleCI 1.0でDockerやdocker-composeを使用する際の制限と気をつけること
date: 2017-05-15T10:50:12+00:00
meaningless:
  - 'yes'
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
  
かれこれ1年くらい仕事でCircleCI + Dockerを使ってみているのですが、 **とにかくツラい** 。
  
CircleCI + Docker構成でCIしたい方はだいぶマゾいとすら思います。
  
他のCI系のサービスどうなんだろうと調べつつも、これまで戦ってきたノウハウは備忘録として残そうと思います。

なにがツラいかというと、

  * [btrfs（B木ファイルシステム）](https://ja.wikipedia.org/wiki/Btrfs)というファイルシステム上に
  * [独自にforkしたDocker](https://github.com/circleci/docker)を積んでおり
  * のと、CIで使用するイメージに色々カスタマイズが入っている（調べきれていない）

という構成だと、色々なDockerに関する操作が動きません。
  
ローカルでは動くので、基本ドはまりする要素満載です。
  
更にdocker-composeでブラックボックスに包むと、余計にわけがわからなくなります。

ということでハマったことと、CircleCIでDockerを扱うための基本戦術を残します。

<!--more-->

## Tips: ビルドにDocker1.10.0, docker-compose 1.8.0を使用する

新しければエラーが少ないかというと、よく分かりません。。。
  
相性がそもそも合ってないので、どのバージョンでも割り切ったほうが良いです。

```yaml
machine:
  pre:
    - curl -sSL https://s3.amazonaws.com/circle-downloads/install-circleci-docker.sh | bash -s -- 1.10.0
    - sudo pip install docker-compose==1.8.0

```


を足してあげて下さい

基本的な方針
----------------------------------------


  * コンテナの削除に関連するコマンドを実行しない（しても成功しない）
  * docker execしない

これに付きます。
  
意外と上記の制約がキツく、リソースが枯れたり思うようにできなかったりします。

Dockerの制限
----------------------------------------


### run &#8211;rmオプションは使わない

runしたコンテナをrmする時にエラーになります。


```
Error removing intermediate container XXXXXXXXX:
Driver btrfs failed to remove root filesystem XXXXXXXXXXXX Failed to destroy btrfs snapshot: operation not permitted

```


のようなエラーです。
  
色々試してみたものの、結局のところ **&#8211;rmオプションはつけない** ことで回避できます。
  
要らないコンテナを消せないのはなんとも気持ち悪いですが、動かないんじゃ仕方ない

### rmコマンドは使わない

`docker rm`も同様です。使ってはいけません。

### execコマンドは使わない

デフォルトのDockerでも、1.10.0でもどちらもエラーになります。

1.10.0の場合、私の環境では


```
open /proc/self/oom_score_adj: no such file or directory

```


> &mdash; [Exit Code 255 on all Docker exec commands &#8211; Build Environment &#8211; CircleCI Community Discussion](https://discuss.circleci.com/t/exit-code-255-on-all-docker-exec-commands/2506)
    
> &mdash; [Docker 1.10.0 is available (Beta) &#8211; Build Environment &#8211; CircleCI Community Discussion](https://discuss.circleci.com/t/docker-1-10-0-is-available-beta/2100/15)

というエラーが発生しました。

[1.10.0からはLXC(Linuxコンテナ) Driverのサポートが切られている模様 ※記事下部コメント参照](http://qiita.com/sawanoboly/items/c6df7cce870f44ed4aaf)です。
  
色々試してみましたが、結局execは使わない方向に倒さないとどうにもなりませんでした。

### CircleCI上でdocker buildしない

流石に`docker build`はできるかというと、できないこともあります。
  
まだ再現性は不明で、突如訪れます。

> &mdash; [Docker Error removing intermediate container &#8211; Build Environment &#8211; CircleCI Community Discussion](https://discuss.circleci.com/t/docker-error-removing-intermediate-container/70)

リポジトリでDockerfileを管理しており、ビルドが正しく動くかどうかCIしたい、なんてケースでドハマリすることがあります。
  
その場合はもう諦めてDocker hubなどのDockerレジストリに上げておいて、そのイメージをpullして使用する形で回避できます。
  
（もうこの時点でだいぶ無理が来ていると思う）

### CIRCLE_ARTIFACTSをコンテナにマウントしない

色々な厄災を招きます。
  
例えばカバレッジレポートなどの副作用が欲しい場合、dockerコマンド上では適当なローカルのフォルダにマウントしておき、
  
circle.yml上で生成されたファイルを`$CIRCLE_ARTIFACTS`へmvしたりcpしたりした方が安定します。

ここも詳しくは調査が足りていません。

docker-composeの制限
----------------------------------------


Dockerのラッパーであるdocker-composeも当然同様の制約がつきまといます。

  * rmコマンドは使わない
  * execコマンドは使わない

など基本的なことに加え、以下にハマりました。

### up &#8211;force-recreateは使わない

ビルドの過程でイメージから新鮮なコンテナを再生成したい、というケースでハマりました。
  
明示的にrmしなければ大丈夫なのでは？と思いましたが、ダメでした。

`--force-recreate`が内部的にrmするので、当然エラーになります。
  
docker-composeの場合、一度立ち上げたコンテナを削除すること無く新鮮な状態にロールバックする回避策が必要です。
  
こればかりはプロジェクトによると思うので割愛します。
  
**なお、このとき動いているコンテナに対してexecすることはできません**

さいごに
----------------------------------------


rmはダメ、と言いましたができることもあります。
  
コンテナにマウントするフォルダによって変わったりするので、条件が分かり次第明記します。

色々と調査不足が目立つ内容なので、必ずしもこの記事を読んだ方の環境でも同様の減少になるかどうかは分かりません。
  
もしご指摘や補足があればして頂けると幸いです。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>