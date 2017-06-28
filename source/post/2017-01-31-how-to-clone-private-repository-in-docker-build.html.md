---
path: /post/how-to-clone-private-repository-in-docker-build/
title: Dockerのビルド時にGithubのプライベートリポジトリをcloneする
date: 2017-01-31T11:35:05+00:00
dsq_thread_id:
  - "5500842174"
categories:
  - 問題を解決した
tags:
  - Docker
  - Git
  - npm
---
表題についてざっと調べると、

  * [Using SSH Private keys securely in Docker build](http://blog.cloud66.com/using-ssh-private-keys-securely-in-docker-build/)
  * [Forward ssh key agent into container · Issue #6396 · docker/docker](https://github.com/docker/docker/issues/6396)

などの情報が出てくるのですが、そんな大げさな話じゃなく単にcloneがしたいだけなんです。
  
調べても意外と出てこなかったので`docker build`の待ち時間に記事として残しておきます。
  
なお、記事のタイトルは非正確で、厳密にはプライベートリポジトリをnpm installする話です。



<!--more-->



やりたいこと
----------------------------------------


npmでは、

```json
{
  "dependencies": {
    "some_package": "my/private-repo#0.8.0"
  }
}
```


のように、`ユーザ名/リポジトリ名#タグ`形式でGithubのリポジトリを指定可能<sup id="fnref-931:1"><a href="#fn-931:1" rel="footnote">1</a></sup>です。
  
npmにprivate packageを公開するのは有料<sup id="fnref-931:2"><a href="#fn-931:2" rel="footnote">2</a></sup>なので、なんとか無料で運用したい。

Githubのprivateリポジトリをcloneしてくるには、事前にSSH鍵の登録が必要です。
  
「デプロイキー使えば良いのでは？」と思って試したら行けたので、その方法が安牌だと思います。

clone用の鍵を生成してGithubに登録
----------------------------------------



```
ssh-keygen -t rsa -C Githubのメールアドレス
```


> &mdash; [お前らのSSH Keysの作り方は間違っている &#8211; Qiita](http://qiita.com/suthio/items/2760e4cff0e185fe2db9)

でSSH鍵を生成します。
  
念のため動作確認。


```
$ ssh -o StrictHostKeyChecking=no -i 生成した鍵のパス -T git@github.com
Warning: Permanently added 'github.com,192.30.253.112' (RSA) to the list of known hosts.
Hi blockenio/domain! You've successfully authenticated, but GitHub does not provide shell access.
```


生成した鍵をコピーし、cloneしたいリポジトリの設定の「Deploy keys」に貼り付けます。
  
貼り付ける際に、「Allow write access」のチェックはOFFにしてください。不要です。

貼り付けたら、 **生成した鍵をGithubのリポジトリにコミット** します。
  
コミットせずに開発メンバー全員が同様の方法を行う、とかでも対処可能ですが、
  
このリポジトリにしか影響がないし読み取り専用にしてあるので、大した影響はないだろうということでコミットしちゃっています。

Dockerfileで使う
----------------------------------------


カレントディレクトリ以下に鍵が手に入れば、あとはなんとでもなります。
  
Dockerfileはこんな感じ。


```
FROM node:6.9.4

RUN mkdir /app /root/.ssh
WORKDIR /app

ADD ./package.json /app/package.json
ADD ./certs/readonly.pub /root/.ssh/id_rsa.pub
ADD ./certs/readonly /root/.ssh/id_rsa
RUN ssh -o StrictHostKeyChecking=no -T git@github.com || true
RUN npm set progress=false \
    && npm -q install
```


`certs`に鍵のファイルを入れてある場合の書き方です。
  
ホスト側で作った鍵だと警告が出てしまったので事前に警告を無視してknown_hostsに書き加えてからnpm installしています

まとめ
----------------------------------------


ググっても出てこない情報は、自分が知っている情報の組み合わせで解消することがまれにある。 この方法が正しいのかどうか確証がもてませんが、実現はできたし考える限り大きなリスクはなさそうと判断します。

<li id="fn-931:1">
  <p>
    <a href="https://docs.npmjs.com/files/package.json#github-urls">GitHub URLs &#8212; package.json | npm Documentation</a>&#160;<a href="#fnref-931:1" rev="footnote">&#8617;</a>
  </p>
</li>

<li id="fn-931:2">
  <p>
    <a href="https://www.npmjs.com/pricing">Pricing &#8212; npm</a>&#160;<a href="#fnref-931:2" rev="footnote">&#8617;</a>
  </p></fn></footnotes> 
  
  <div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
  </div>