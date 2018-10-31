---
title: lernaでnpmにpublicなscoped packageをpublishする方法
date: 2018-07-03 10:30 JST
tags:
  - JavaScript
  - npm
---

[hothouse](https://github.com/Leko/hothouse)という、package.json を更新して PR を作成する Greenkeeper のような OSS を作る際に、  
プラグイン開発用の内部 I/F を`@hothouse/types`という public なパッケージとして publish しようとしたところ、失敗しました。

> 公開する時は npm publish --access=public とするだけです。(デフォルトが--access=restricted であるため明示する必要がある)
>
> &mdash; [npm で名前空間を持ったモジュールを公開する方法(scoped modules) | Web Scratch](https://efcl.info/2015/04/30/npm-namespace/)

単一の npm package なら`--access`をつければ良いのですが、（少なくとも 2.11.0 時点で）lerna で publish する際に`--access`を指定できる余地がない。  
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

Lerna の Issue にこんなコメントがついており、試してみたところ無事 publish できました。

## publishConfig とはなんなのか

> This is a set of config values that will be used at publish-time. It's especially handy if you want to set the tag, registry or access, so that you can ensure that a given package is not tagged with "latest", **published to the global public registry or that a scoped module is private by default**.
> Any config values can be overridden, but only "tag", "registry" and "access" probably matter for the purposes of publishing.
>
> &mdash; [package.json | npm Documentation](https://docs.npmjs.com/files/package.json#publishconfig)

その名の通り、publish するときの設定を指定するためのフィールドです。  
`access`フィールドに値を指定すれば、publish 時のアクセス設定を変更できるということでした。

lerna の仕様ではなく、npm の仕様だったので、このオプションを安心して使用できます。
