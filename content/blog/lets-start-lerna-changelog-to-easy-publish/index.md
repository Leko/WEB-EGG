---
title: lerna-changelogで始める頑張りすぎないリリースノート自動生成
date: 2018-07-17T10:30:00+0900
tags:
- npm
- JavaScript
- monorepo
- Lerna
---

[hothouse](https://github.com/Leko/hothouse)というpackage.jsonとlockfileを更新してPR出すツールを公開するときに、  
「リリースノート頑張りたくないな」と思い、なるべく楽にそれなりのリリースノートを残せる方法を探った結果、  
[lerna-changelog](https://github.com/lerna/lerna-changelog)というLerna公式のツールが良さそうだったので、採用しました。

hothouseではlerna-changelogで自動生成されたリリースノートを公開してます。  
https://github.com/Leko/hothouse/releases  
規模が大きくなったり、需要が高まったらしっかり書こうと思いながら、  
**何も書かないのは嫌だし、とは言えまだこの規模でリリース作業に苦労をしたくない**。  
そんな温度感にちょうどマッチしてくれるツールです。  

あまり使ってるリポジトリを見かけないので、紹介してみようと思います。

<!--more-->

## lerna-changelogとは

> &mdash; [lerna/lerna-changelog: PR-based changelog generator with monorepo support](https://github.com/lerna/lerna-changelog)

リポジトリのdescriptionからも分かる通り、GitHubのpull requestをベースにリリースノートを作成するツールです。  
「PRベース」が他のツールと異なる点は、コミットメッセージやPRに命名規約を設けないことです。  
PRにつけたラベルごとにグルーピングし、PR１つ≒リリースノートの１行としてリリースノートを生成します。

GitHubのトークンさえ渡せば、最後に打ったタグからHEADまでに含まれるPRを自動で収集・リリースノート化してくれる点も非常にありがたいです。  
使い方の流れとしては、

1. PR出す（誰かから出される）
1. PRに分類用のラベルを何か１つ以上つける
1. マージする
1. lerna-changelogを実行し、リリースノートを生成

のようになります。  
追加で必要なオペレーションはラベルつけるだけで、かつ私はラベルをつける癖がついているので、特に手間だと思っていません。  
ほとんど追加の手間なしに、リリースノートを生成できています。

## セットアップ
lerna-changelogを使うためのセットアップはざっくり2つあります。

1. PR収集用のトークン生成（[ガイド](https://github.com/lerna/lerna-changelog#github-token)）
1. PR分類用のラベルのマッピングを定義（[ガイド](https://github.com/lerna/lerna-changelog#configuration)）

ラベルのマッピングを設定し忘れていると、**PRはあるはずなのにリリースノートが空**という現象が発生します。リポジトリに合わせてしっかり設定しましょう。  
hothouseではラベルのマッピングをこのように指定しています。

https://github.com/Leko/hothouse/blob/3f7f51a7045be8d47c8ef1764094a99929715e77/package.json#L32-L40

なおラベルはデフォルトではなく、azuさんのこのツールを使用させてもらいました。

> &mdash; [GitHubのラベルをいい感じにセットアップするツール | Web Scratch](https://efcl.info/2017/05/17/github-label/)

## ベンチマークとの対比
リリース系で個人的に代表的だと思っているのは、[semantic-release](https://github.com/semantic-release/semantic-release)と[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)あたりかなと思っています。  
conventional-changelog形式でコミットしておくと、lerna publish時に`--conventional-commits`というオプションが使えるので、monorepoでの黄金パターンの１つなんだろうと思っています。

コミットメッセージを縛るタイプはとても良く見るのですが、  
長年使ってる[gitmoji](https://gitmoji.carloscuesta.me/)がつい手癖で出てcommit --amendするの面倒なのと、  
**コミットメッセージの分類適切じゃない問題**が絶対的にあると思っており。分類は基本的に人力かつルールベースなので確実じゃないor間違うので、あまり信頼できないなと思っています。  
例えば`chore`って書かれてるのにbreaking changesだったりすることがあるので。

一方lerna-changelogはPRにタグをつけるだけなので、コミットのたびに分類に頭を使う必要がなく、精神衛生がとても良いです。  
ただしPRの粒度を小さくしないと分類が難しいのはどちらも変わりませんし、分類が簡単になるわけでもありません。  
ただ、ラベルは後から簡単に付け消しできるので、マージした後には弄りにくいコミットメッセージよりは、ミスに優しいと思います。

**そもそも、「これ見やすいか？」**と言われると、好みが分かれそうな気もします。  
さらに私のPRのタイトルの書き方が下手なので、何が起こったかギリギリわかるかな、ぐらいだと思います。  
中身は仕組みの問題ではなく、私の問題なので、書式としてはいい感じなんじゃないだろうか、と思っています。

## より使いやすくする一手間
hothouseでは、

- npmへのpublish
- Gitのタグ打ち
- GitHubへのタグpush
- リリースノートの生成
- GitHubのリリースの作成

を全て一撃で倒すべく、こんなシェルを組んでます。
ほとんどの処理は`lerna publish`と`lerna-changelog`で自動化されており、それらをつなぎ合わせるちょっとした手間をシェルで埋めて使っています。

https://github.com/Leko/hothouse/blob/3f7f51a7045be8d47c8ef1764094a99929715e77/scripts/release

リリース作業のハードルが下がると、リリースの頻度が上がり、結果的に早くバグ修正や機能追加が届けられるので、効果あると思います。  
楽だし気に入っているので、問題が出るまではこのままのやり方で進めてみようと思います。  
