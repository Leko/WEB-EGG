---
path: /post/setup-alone-developing-environment-with-github-slack-circleci-codeclimate-and-ci-bundle-update/
title: GithubとSlackとCircleCIとCodeClimateとci-bundle-updateでぼっち開発環境を作ってみた
date: 2015-09-14T12:35:47+00:00
meaningless:
  - 'yes'
dsq_thread_id:
  - "4119072651"
twitter_id:
  - "643267131832864769"
image: /images/2015/09/ae46b1f460ee46f789c27b264a6cb421.png
categories:
  - やってみた
tags:
  - CI
  - CircleCI
  - Code Climate
  - Git
  - Github
  - Ruby
  - Slack
---
先日公開した[日本語解析API(+α)を使用して日本語の文書校正を効率化してみる](/post/how-to-improve-proofreading-of-sentence-in-japanese/)にて、

  * [Slack](https://slack.com/)
  * [CircleCI](https://circleci.com/)
  * [Code Climate](https://codeclimate.com/)
  * [ci-bundle-update](https://github.com/masutaka/ci-bundle-update)

と色々なツールを試してみたので、そのまとめを残したいと思います。

<!--more-->

完成図
----------------------------------------


![完成図](/images/2015/09/d8885565b3dd45e3fbc0abc752d159d8.png)



雑ですがアイキャッチ画像に書き足してみました。  
Slackに通知を飛ばすのは書くまでもなく、矢印が煩雑になるだけなので割愛しました。

やりたいことは目次に分割しているので、１つずつお話したいと思います。

リポジトリを作る
----------------------------------------

大前提です。ちゃちゃっと作ってしまいます。  
リポジトリの作成には[hub](https://github.com/github/hub)コマンドを使用しています。

```shell
cd /path/to/work
mkdir repo-name && cd repo-name
echo '# Repo name' > README.md
git init
git add README.md
git commit -m 'initial commit'
hub create
git push origin master
hub browse
```

ついでに連携する各サービスのアカウントも作成しておきます。

Githubの通知をSlackに送る
----------------------------------------

`https://{slackのチーム名}.slack.com/services/new`  
を開くと、各種サービスとの連携ができます。


![スクリーンショッ](/images/2015/09/a375213d384a7b683e3b9f4704cbe945.png)



Githubの設定を行います。  
特に詰まることはなく、画面に従えば問題なく設定できるかと思います。

## Pull Requestが来たらCircle CIのテストを走らせる

Circle CIは、テストを走らせたりデプロイしたりするCI系サービスです。 似たサービスとして[Travis CI](https://travis-ci.org/)、[Wercker](http://wercker.com/)がありますが、  
それらは使ったことがあったので、今回は使ったこと無いCircle CIを使ってみました。

Circle CIにログインし、Githubに登録したリポジトリをCI対象として登録します。

そしてリポジトリにCircle CIの設定を行います。  
ドキュメントは[こちら](https://circleci.com/docs/language-ruby-on-rails)です。

YAMLファイルでもRubyのバージョンを指定できるそうなのですが、`.ruby-version`の方が汎用的かと思いそちらを使用しています。

```shell
git checkout -b feat/circle-ci
rbenv local 2.2.2
git add .ruby-version
git commit -m 'Add .ruby-version'
echo 'gem "rspec"' >> Gemfile
bundle install --path=vendor/bundle
git add Gemfile*
git commit -m 'Add rspec gem'
git push origin feat/circle-ci
```

連携が完了していると、pullリクエストを作成した時に以下のようになると思います。


![スクリーンショッ](/images/2015/09/aa6524b9ba48606ea27c160b6fc9cee5.png)



少し待って


![スクリーンショッ](/images/2015/09/6ba1a268d2bfba7053226520cc58cb5e.png)



となればビルドに成功した、ということになります。

今後Circle CIとの連携を増やしていきますが、基本はこれです。  
ビルドに通らない場合はだいたいが設定ミスです。

ついでにSlackとの連携も済ませておきます。


![スクリーンショッ](/images/2015/09/ee193825a3bffe1ef11bdae8117b3555.png)



## masterにマージされたらCode climateのチェックを走らせる

Code climateはコードの静的解析ツールです。  
連携しているGithubのリポジトリ内のコードに静的解析をかけ、問題が有れば指摘してくれます。  
対応している言語はRuby, PHP, Python, jsです。

Code climateにログインし、対象のリポジトリを有効にしておきます。  
初回起動までが結構長いので、先にやっておくと良いです。


![スクリーンショッ](/images/2015/09/8487259c49da7defc179d4e0202d5e0a.png)



初回の分析が終わるとこのような画面になります。  
<del>1ファイルD評価取って急いで直した履歴は見なかったことにして下さい。</del>

全ファイルがA、GPAが4.0なら指摘事項なし、という意味になります。

次に、GithubのPull requestと連携させます。  
まず[GithubのPersonal access tokens](https://github.com/settings/tokens)を開き、Code climate用のアクセストークンを生成します。  
名前は自分で分かる適当な名前、スコープは`repo:status`が選ばれていれば問題ないです。

生成されたトークンをコピーしておきます。  
トークンが表示されている画面から **別画面に行くと２度とコピーできなくなる** ので注意が必要です。

settingsの中にある「Integrations」タブを開き、「GitHub Pull Requests」を選択します。


![スクリーンショッ](/images/2015/09/ae0b48fb75da31a8be3a203df45c2f33.png)



コピーしておいたアクセストークンを貼り付けて貼り付けて設定完了。  
これでCircle CIのようにPull request時にコードのチェックがかかります。

**と思ったのですが** 、オープンソースのリポジトリは常にポーリングしているのでPR連携は提供してませんよ、とのこと。

> Note: If you added your repository by clicking Add Open Source Repo, Code Climate will always check for new commits based a poll or when you manually trigger a refresh. We don't yet support service hooks for these types of repositories.  
> &mdash; [GitHub Pull Request Integration](http://docs.codeclimate.com/article/213-github-pull-request-integration)  
> &mdash; [How do I install Code Climate's Github service hook?](http://docs.codeclimate.com/article/222-how-do-i-install-code-climates-github-service-hook)

ついでにCode climateもSlackと連携させます。


![スクリーンショッ](/images/2015/09/fb65dada8776ca82d73bf6ff177bd56a.png)



## Circle CIで走らせらせたテストのカバレッジをCode climateに送る

ここまでの設定で、

  * pushした内容がテストに通ること
  * 静的解析で判別可能な良くないコード

は判定可能になりました。ついでなのでテストのカバレッジも出力してみたいと思います。


![スクリーンショッ](/images/2015/09/86f5823b3a5d2f30434dc16f2685d6ae.png)



Code climateのsettingsを開き、「Test Coverage」を選択します。  
ドキュメントが出てくるので手順通りに進めます。

マニュアル内の`CODECLIMATE_REPO_TOKEN=....`となっている箇所をCircle CI側にも指定する必要があるのでコピーして貼り付けます。  
Circle CIのプロジェクト設定の、「Environment variables」に設定します。


![スクリーンショッ](/images/2015/09/aa56c553c600d6ad9d8ba37416434eef.png)



Githubにプルリクエストを作ってマージし、Code climateにカバレッジが出れば成功です。


![スクリーンショッ](/images/2015/09/457b301edc06959d1515de8c92e9ba06.png)



さりげなく２重の丸に変わっているのがおしゃれでよいですね。

## ci-bundle-updateで毎日bundle updateを実行してPull Requestを送る

[YAPC::Asia Tokyo 2015](http://yapcasia.org/2015/)にて[esa.io](http://esa.io/)の中の人の素敵なプレゼンをお聞きし、  
プレゼン中に出てきた[ci-bundle-update](https://github.com/masutaka/ci-bundle-update)がとても良いと思いました。

**これから毎日bundle updateしようぜ？**

ということで早速導入。  
[解説記事](http://masutaka.net/chalow/2015-07-28-1.html)の内容でハマったところがあったので、あらためて記事として手順を残します。

> このように circle.yml の deployment section を変更します。  
> https://github.com/masutaka/masutaka-29hours/commit/0ba9ef03348568baaa5cf271d4f6e41305f8fdfe

とありますが、ここでハマりました。  
`./script/deploy-circleci.sh`なんて無いぞ…？ Circle CIでのお決まりなのかな…？  
と思いながらそのまま書いたら、案の定ビルドにコケました。なので以下のように修正

```diff
+      - |
+        if [ -n "${BUNDLE_UPDATE}" ] ; then
+          gem update bundler --no-document
+          gem install circleci-bundle-update-pr
+          circleci-bundle-update-pr CircleCI circleci@example.com
+        fi
```

これでビルドが通るようになりました。 もう１個ハマりました。

> 環境変数 BUNDLE_UPDATE が指定されていたら、circleci-bundle-update-pr gem をインストールして、同コマンドを実行しています。この環境変数は後述するトリガーが設定してきます。

とあったので、Circle CI側にも環境変数の設定が必要なのか…？  
と思って指定したらビルド通らなくなりました。

**日本語読めよ** という話なのですが、Circle CI側にはこの環境変数の指定は不要です。

他は特に詰まることは無かったので、解説記事さまを呼んでいけば設定完了すると思います。 これで毎日bundle updateして何かアップデートがあればPRが飛ぶようになりました。

ちなみに、Rubyのプロジェクトだけでなくnpm(Nodejs)やcomposer(PHP)など幅広く対応している[tachikoma.io](http://tachikoma.io/)というサービスもあるようです。  
しかし今回はRubyのプロジェクトなので、tachikoma.ioよりRubyに関して高機能なci-bundle-updateを使用しました。

tachikomaについては別途Nodeのプロジェクトで試している最中なので、また記事を書きます。

<del>そういえば、npmのci updateはDavidではなく<a href="https://docs.npmjs.com/cli/shrinkwrap">shrinkwrap</a>使わないんですかね…、bowerにも<a href="https://github.com/bower/bower/issues/505">shrinkwrapの機能が検討されている</a>ようなので、そちらも対応されたら対応するのかなー、なんて思っています。</del>

まとめ
----------------------------------------

全部設定するとSlackがだいぶ賑わってきます。


![スクリーンショッ](/images/2015/09/87fe328607615af11722bfe947725838.png)



**一人じゃんけん感はんぱねぇ…！**

自分でPull request作ってマージしてブランチ消した途端Slackの通知が  
**スポポポポッ** ってなって **「うん、知ってる」** ってなる！ ！

意識高そうな感じでやってる感はすごく出るので、一人でも比較的モチベは保ちやすいかなと思います。  
ぼっち開発環境の第一弾、ひとまず完成です。


![スクリーンショッ](/images/2015/09/9c7139b6049070cfdfb72271aed71dea.png)



<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>