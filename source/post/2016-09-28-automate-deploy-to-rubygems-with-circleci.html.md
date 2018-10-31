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

[ActiveResource で ChatWork の API を叩く gem](/post/knowhow-of-chatwork-api-with-activeresource/)を作ってみました。  
これが初めて作った gem なのですが、手で運用すると色々忘れそうな感じがした。

ライブラリのメンテはただでさえ手がかかるので、パッケージ管理サービスへのデプロイくらい手を抜きたい。  
ということで、Github の master ブランチに push されたら CircleCI を使って自動で gem をデプロイする設定をしてみました。

<!--more-->

## 作ったもの

作った gem のリポジトリを御覧ください。circle.yml にかかれています

> [GitHub – Leko/activeresource-chatwork: ActiveResource classes for ChatWork API](https://github.com/Leko/activeresource-chatwork)

## gem のデプロイ手順

まずは自動化すべきタスクの内容をおさらいします。  
Rake タスクにデプロイコマンドがくっついているので、それを利用します。

1. [rubygems.org](https://rubygems.org/)にユーザ登録
2. ログインして[Edit Profile](https://rubygems.org/profile/edit)へ移動
3. **API ACCESS** という節にコマンドが書かれているので、それを実行

これで公開準備は完了しました。ここまでの操作は最初の 1 回で良いようです。  
デプロイ自体は

```
bundle exec rake build
bundle exec rake release
```

という感じでいけるそうです。こんなフローを自動化してみます。

## CircleCI に user key を追加する

CircleCI と連携したままのだと、read only なデプロイキーが使用されています。  
なのでリポジトリから pull はできるのですが、タグの追加や push ができない。

`bundle exec rake release`は内部的に`git tag`と`git push origin タグ`をやっているので、リポジトリへの write 権限が必要になります。  
ということでまずはそこの準備を整える。

1. CircleCI の対象プロジェクトの **Project Settings** を開く
2. **PERMISSIONS > Checkout SSH keys** を選択
3. **Create and add {ユーザ名} user key** を選択

で、連携しているリポジトリに write 権限を持つキーが作成できます。  
こんな感じの画面になれば OK だと思います。

![スクリーンショッ](/images/2016/09/5aad2dde2722e323044dce1b2cd9bc04.png)

## circle.yml にデプロイ処理を追加する

`deployment`セクションを追加して、`master`ブランチのビルドが走ったときのデプロイ処理を指定します。  
私の場合 RubyGems のユーザも Git(hub)のユーザも`Leko`なので、以下のような内容になると思います。  
パスワードやメールアドレスをリポジトリに載せたくないので、環境変数に切り出して Project settings 画面から設定しています。

```yaml
deployment:
  rubygems: # 任意の名前でよい
    branch: master # master相当のブランチが別名なら変えてください
    commands:
      - curl -u Leko:$RUBYGEMS_PASSWORD https://rubygems.org/api/v1/api_key.yaml > ~/.gem/credentials; chmod 0600 ~/.gem/credentials
      - git config user.name Leko
      - git config user.email $RUBYGEMS_EMAIL
      - bundle exec rake build
      - bundle exec rake release
```

## 試す

CircleCI 上の表示は

![スクリーンショッ](/images/2016/09/e1084e909de8fec85c82e780658b59f3.png)

デプロイした後の RubyGems.org は

![スクリーンショッ](/images/2016/09/4c1c1aa1469d47ee9ae877356b7b87da.png)

はい、OK そうです。

## まとめ

gem 作るのも CircleCI の deployment 機能を使用したのも今回が始めてでした。  
どちらも機能が充実しているもののシンプルに使えるようになっているので、学習コストは安かったと思います。

思っていたよりもさくっとできて安心しました。  
gem も CircleCI のデプロイも色々な方向に活用していきたいです。

いつか npm のデプロイ自動化も記事にしようと思います。
