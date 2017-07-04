---
path: /post/automate-deploy-to-rubygems-with-circleci/
title: RubygemsへのデプロイをCircleCIで自動化してみた
date: 2016-09-28T12:00:46+00:00
dsq_thread_id:
  - "5179351901"
image: /images/2016/09/e1084e909de8fec85c82e780658b59f3.png
categories:
  - やってみた
tags:
  - CircleCI
  - Ruby
  - Rubygems
---
[ActiveResourceでChatworkのAPIを叩くgem](/post/knowhow-of-chatwork-api-with-activeresource/)を作ってみました。  
これが初めて作ったgemなのですが、手で運用すると色々忘れそうな感じがした。

ライブラリのメンテはただでさえ手がかかるので、パッケージ管理サービスへのデプロイくらい手を抜きたい。  
ということで、GithubのmasterブランチにpushされたらCircleCIを使って自動でgemをデプロイする設定をしてみました。

<!--more-->

作ったもの
----------------------------------------

作ったgemのリポジトリを御覧ください。circle.ymlにかかれています

> [GitHub – Leko/activeresource-chatwork: ActiveResource classes for Chatwork API](https://github.com/Leko/activeresource-chatwork)

gemのデプロイ手順
----------------------------------------

まずは自動化すべきタスクの内容をおさらいします。  
Rakeタスクにデプロイコマンドがくっついているので、それを利用します。

  1. [rubygems.org](https://rubygems.org/)にユーザ登録
  2. ログインして[Edit Profile](https://rubygems.org/profile/edit)へ移動
  3. **API ACCESS** という節にコマンドが書かれているので、それを実行

これで公開準備完了です。ここまでの操作は最初の1回で良いようです。  
デプロイ自体は

```
bundle exec rake build
bundle exec rake release
```

という感じでいけるそうです。こんなフローを自動化してみます。

## CircleCIにuser keyを追加する

CircleCIと連携したままのだと、read onlyなデプロイキーが使用されています。  
なのでリポジトリからpullはできるのですが、タグの追加やpushができない。

`bundle exec rake release`は内部的に`git tag`と`git push origin タグ`をやっているので、リポジトリへのwrite権限が必要になります。  
ということでまずはそこの準備を整える。

  1. CircleCIの対象プロジェクトの **Project Settings** を開く
  2. **PERMISSIONS > Checkout SSH keys** を選択
  3. **Create and add {ユーザ名} user key** を選択

で、連携しているリポジトリにwrite権限を持つキーが作成できます。  
こんな感じの画面になればOKだと思います。

<img src="/images/2016/09/5aad2dde2722e323044dce1b2cd9bc04.png" alt="スクリーンショット 2016-09-25 4.21.40" width="1182" height="348" class="alignnone size-full wp-image-873" />

circle.ymlにデプロイ処理を追加する
----------------------------------------

`deployment`セクションを追加して、`master`ブランチのビルドが走ったときのデプロイ処理を指定します。  
私の場合RubyGemsのユーザもGit(hub)のユーザも`Leko`なので、以下のような内容になると思います。  
パスワードやメールアドレスをリポジトリに載せたくないので、環境変数に切り出してProject settings画面から設定しています。

```yaml
deployment:
  rubygems:        # 任意の名前でよい
    branch: master # master相当のブランチが別名なら変えてください
    commands:
      - curl -u Leko:$RUBYGEMS_PASSWORD https://rubygems.org/api/v1/api_key.yaml > ~/.gem/credentials; chmod 0600 ~/.gem/credentials
      - git config user.name Leko
      - git config user.email $RUBYGEMS_EMAIL
      - bundle exec rake build
      - bundle exec rake release
```

試す
----------------------------------------

CircleCI上の表示は

<img src="/images/2016/09/e1084e909de8fec85c82e780658b59f3.png" alt="スクリーンショット 2016-09-25 4.25.59" width="1175" height="303" class="alignnone size-full wp-image-875" />

デプロイした後のRubyGems.orgは

<img src="/images/2016/09/4c1c1aa1469d47ee9ae877356b7b87da.png" alt="スクリーンショット 2016-09-25 4.26.54" width="814" height="342" class="alignnone size-full wp-image-874" />

はい、OKそうです。

まとめ
----------------------------------------

gem作るのもCircleCIのdeployment機能を使用したのも今回が始めてでした。  
どちらも機能が充実しているもののシンプルに使えるようになっているので、学習コストは安かったと思います。

思っていたよりもさくっとできて安心しました。  
gemもCircleCIのデプロイも色々な方向に活用していきたいです。

いつかnpmのデプロイ自動化も記事にしようと思います。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>