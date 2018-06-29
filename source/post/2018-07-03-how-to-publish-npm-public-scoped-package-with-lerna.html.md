---
title: lernaでnpmにpublicなscoped packageをpublishする方法
date: 2018-07-03 10:30 JST
tags:
- JavaScript
- npm
---

[hothouse](https://github.com/Leko/hothouse)という、package.jsonを更新してPRを作成するGreenkeeperのようなOSSを作る際に、  
プラグイン開発用の内部I/Fを`@hothouse/types`というpublicなパッケージとしてpublishしようとしたところ、失敗しました。

> 公開する時はnpm publish --access=publicとするだけです。(デフォルトが--access=restrictedであるため明示する必要がある)
>
> &mdash; [npmで名前空間を持ったモジュールを公開する方法(scoped modules) | Web Scratch](https://efcl.info/2015/04/30/npm-namespace/)

単一のnpm packageなら`--access`をつければ良いのですが、（少なくとも2.11.0時点で）lernaでpublishする際に`--access`を指定できる余地がない。  
ということで調べてみました。

<!--more-->

## 対応策

> ```js
> "publishConfig": {
>   "access": "public"
> }
> ```
>
> &mdash; [No docs on how to publish public scoped packages · Issue #914 · lerna/lerna](https://github.com/lerna/lerna/issues/914#issuecomment-318497928)

LernaのIssueにこんなコメントがついており、試してみたところ無事publishできました。

## publishConfigとはなんなのか
> This is a set of config values that will be used at publish-time. It's especially handy if you want to set the tag, registry or access, so that you can ensure that a given package is not tagged with "latest", **published to the global public registry or that a scoped module is private by default**.
> Any config values can be overridden, but only "tag", "registry" and "access" probably matter for the purposes of publishing.
>
> &mdash; [package.json | npm Documentation](https://docs.npmjs.com/files/package.json#publishconfig)

その名の通り、publishするときの設定を指定するためのフィールドです。  
`access`フィールドに値を指定すれば、publish時のアクセス設定を変更できるということでした。

lernaの仕様ではなく、npmの仕様だったので、このオプションを安心して使用できます。
