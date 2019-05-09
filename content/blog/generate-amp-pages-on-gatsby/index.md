---
title: （ゴリ押しで）Gatsby製ブログをAMP対応させた
date: '2019-05-08T10:20:00.000+0900'
tags:
  - JavaScript
  - Gatsby
  - Node.js
  - AMP
---

[AMP Conf 2019](https://amp.dev/events/amp-conf-2019)の配信や、2019/04 に開催された[React Tokyo with ZEIT](https://www.meetup.com/ReactJS-Tokyo/events/260331790/)で ZEIT チームによる Next.js の AMP 対応の話を聞いて「今更ながらこのブログも AMP 対応してみるか」と思い、記事のみ AMP 版ページを作りしました。  
PWA などを強く意識している Gatsby なので簡単に AMP 化できるんじゃないかと思っていましたが全くそんなことはなく、超絶ゴリ押しの上なんとかギリギリ AMP のバリデーションに通過するページが生成できました。

参考になるかは自信がないですが、AMP 版記事を作るためにやったことを残しておきます

<!--more-->

## はじめに

同じ Gatsby サイト同士であれば共通点もあると思いますが、記事の中身や使ってるプラグインなどの文脈依存が多々含まれます。  
この通りやればうまくいくっていう確実な方法論ではありません。あくまで「当サイトはこれで AMP 化できた」程度の参考にしていただければ幸いです。

導入すれば簡単に AMP 対応できるようなプラグインなども作っておりません。万人が使えるプラグインを作るのはおそらく無理だと思います。。。

## できたもの、デモ

例えばこの記事の AMP 版ページは[こちら](/amp/post/generate-amp-pages-on-gatsby/)です。  
Google にキャッシュされたページは[こちら（Google のクローリング待ち）](TODO)です。

AMP 版ページと非 AMP 版の記事を見比べてみてもほとんど見た目に差はないと思います。とはいえ、このサイトは速度重視のためほとんどスタイルがあたっておらず複雑なレイアウトもないので、見た目を調整するのは非常に簡単でした。  
たくさん CSS を書いていたり重量級の CSS フレームワークを使用している場合は見た目の再現に苦労するかもしれません。

## 事前調査：Gatsby サイトの AMP 化に必要なこと

手を動かす前に、AMP を何も考慮してない Gatsby サイトが AMP 対応するためのギャップと、解決策の技術的可能性を調べてまとめます。

### Gatsby 自身が AMP 対応を提供するロードマップはある？

[Next.js の AMP 対応](https://nextjs.org/blog/next-8-1#amp-first-pages)のように Hooks API などを提供したり、`gatsby-amp.js`みたいなプラグイン機構を用いて AMP 用ページが簡単に生成できるってロードマップがあるのか調べてみた。

結論としては{{TODO}}

### AMP 化の役に立ちそうなプラグインはあるか？

Gatsby AMP などで調べると以下の情報が出てくると思うんですが、どちらもユーザは少なく、確立された手段があるわけでは無さそうです。  
であればゴリ押し力を上げるためにプラグインには依存せずに

### Gatsby で自動生成される script タグを消すことは可能か？

### html タグに amp 属性を足すには？

### meta タグ、link タグを操作する方法は？

### Service worker をインストールできるか？

AMP to PWA という言葉があるくらいだし、AMP ページを表示している間に Service worker のインストールを済ませておいて非 AMP ページに回遊したときにはインストールが完了しているってこともできるんだろうなーと調べてみたらまさにそのための AMP コンポーネントがあった。

## 実装方針

- すべての記事がもれなく AMP 化**できない**ことを許容する
  - 埋め込みコードや iframe とか使っちゃってる記事と、ただの文字＋画像の記事では対応コストが全然違う
- AMP 化できなかった記事によって他の記事までエラーにならないようにする
- Gatsby の機能だけでやりきるのは無理だと判断し、ビルド成果物である HTML を JS から操作し無理やり AMP 用 HTML に変換する

## AMP 対応の Tips

### AMP のバリデーションと AMP ページの生成の大枠

### amp 用の分岐が書けるようにする

### html タグに amp 属性を追加する

### AMP boilerplate を追加する

### script タグを消す

### CSS を style タグにまとめてインライン化する

### gatsby-plugin-canonical-urls を消して自前で canonical url を設定する

### gatsby-image を AMP 化する

### iframe を AMP 化する

### audio を AMP 化する

### Google Analytics を追加する