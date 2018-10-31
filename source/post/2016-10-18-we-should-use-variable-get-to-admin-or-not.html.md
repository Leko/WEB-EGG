---
path: /post/we-should-use-variable-get-to-admin-or-not/
title: Drupal7で指定したユーザが管理者ロールか否かを判断したいときはvariable_getを使いましょう
date: 2016-10-18T11:30:35+00:00
dsq_thread_id:
  - "5231598680"
categories:
  - 問題を解決した
tags:
  - Drupal
  - PHP
---

Web EGG ではじめての Drupal ネタです。  
Drupal を触っててふと気になったのが、 **指定したユーザが管理者ロールか否か** を判定しようとしたものの、  
調べてもベストプラクティスが見つからず、ソースコードを追ったらやっと正解を見つけたという話の備忘録です。

<!--more-->

## はじめに

Drupal7 を対象にした記事です。  
Drupal 自体のことはじめ等の記事ではありません。Drupal の事前知識があるものとします。

## 結論

```php
<?php

// $uidは何かしらのノードから取ってくる
$account = user_load($uid);
if (array_key_exists(variable_get('user_admin_role'), $account->roles)) {
    // 管理者
} else {
    // 管理者じゃない
}
```

という感じに`variable_get('user_admin_role')`を利用すれば OK でした。  
**INSERT の順序的に 3 だろうと決め打ちしたり、administrator という名前で SELECT してくるのは間違い** と認識しています。  
結論に至るまでに調べた事項は

- ロール一覧テーブルにに Admin 相当か否かという情報がない
  - なので"特定のロールを Admin だとみなす"という概念になる
- Admin のロール ID に相当する定数が存在しない
- Admin のロール ID は 3 固定らしい（？）
- [user_has_role](https://api.drupal.org/api/drupal/modules!user!user.module/function/user_has_role/7.x)関数はロール ID が必要なのでなのでロール ID を隠蔽してくれない
- ロール名は編集可能なので[user_role_load_by_name](https://api.drupal.org/api/drupal/modules%21user%21user.module/function/user_role_load_by_name/7.x)関数を使うとどハマりする恐れがある
- ソースを追ってたら初期化処理と正解を見つけた

という感じでした。

## ロール一覧テーブルにに Admin 相当か否かという情報がない

[modules/user/user.install](https://github.com/drupal/drupal/blob/7.x/modules/user/user.install#L93)にテーブル定義が書いてありました。

ロール一覧テーブルには`ロールのID, 名前, 表示順序`カラムしかないので、  
「このロールは Admin 相当か否か」を判断する材料がありません

ということはデフォルトで挿入されているロール一覧のうち「これが Admin 相当のロールだ」と見なす必要がありそうです。

## Admin のロール ID に相当する定数が存在しない

ならそのロールの ID に対応する定数があるのでは。と思ったのですが、ない。 **なぜか Admin のロールだけありません。**

それ以外の初期状態で入ってるロールは[includes/bootstrap.inc](https://github.com/drupal/drupal/blob/7.x/includes/bootstrap.inc#L160)に定数が定義されています。  
`DRUPAL_ANONYMOUS_RID`と`DRUPAL_AUTHENTICATED_RID`はあるのに、なぜ Admin のロールだけない。  
動的に変わるから定数としてハードコードできないとか、なんかありそう。怪しい気がする。

role テーブルの初期値を探してコードを追ってみると

```php
// Built-in roles.
  $rid_anonymous = db_insert('role')
    ->fields(array('name' => 'anonymous user', 'weight' => 0))
    ->execute();
  $rid_authenticated = db_insert('role')
    ->fields(array('name' => 'authenticated user', 'weight' => 1))
    ->execute();
```

という処理を[modules/user/user.install](https://github.com/drupal/drupal/blob/7.x/modules/user/user.install#L320)に見つけました。  
どうやら Admin ロールは`Built-in roles`に該当しないようです。

## Admin のロール ID は 3 固定らしい（？）

Drupal のロール一覧テーブルには管理者フラグ的なものもないし、Drupal が提供しているロール ID に相当する定数もないならどないせえっちゅうねん。という感じなんですが、どうやら Admin のロール ID は 3 で固定らしい（？）という情報が出てきました。

> unless you install Drupal in your custom installation profile and modify the administrator role there, the rid or administrator will be always 3.  
> &mdash; <http://drupal.stackexchange.com/a/44735>

本当…？ それ本当なら定数が提供されてるものじゃない…？

## user_has_role 関数はロール ID が必要なのでなのでロール ID を隠蔽してくれない

[user_has_role](https://api.drupal.org/api/drupal/modules!user!user.module/function/user_has_role/7.x)関数というものがあるらしい。  
これじゃん！ と思ったんですが、引数にロール ID が必要でした。

つまり Admin 相当のロール ID を知っていない限りこれを利用できません。  
あと無駄に SELECT 走るので N+1 が余裕で起きそう。

## ロール名は編集可能なので user_role_load_by_name 関数を使うとどハマりする恐れがある

> One liner would be:  
> `$rid = array_search('administrator', user_roles());`  
> &mdash; <http://drupal.stackexchange.com/a/50437>

ID が駄目なら名前で探せって、結局マジックナンバー解消してないじゃん…  
user_roles の戻り値は DB から SELECT してきた`[ロールID => ロール名]`の連想配列なので、ロール管理画面からロール名を変えれば余裕でバグります。

**ロールの名前は変えるな** って運用で縛れば無理な話ではないんですが、  
画面から正常系の機能として編集できてしまう以上、ロール名を決め打ちするのは汎用性を失うし、なによりキモい。

## ソースを追ってたら初期化処理と正解を見つけた

なかば諦めムードで`define('DRUPAL_ADMINISTRATOR_RID', 3);`とか書き始めていたのですが、  
どうしても納得行かなくてソースを眺めていたら正解を見つけました。

```
// Create a default role for site administrators, with all available permissions assigned.
  $admin_role = new stdClass();
  $admin_role->name = 'administrator';
  $admin_role->weight = 2;
  user_role_save($admin_role);
  user_role_grant_permissions($admin_role->rid, array_keys(module_invoke_all('permission')));
  // Set this as the administrator role.
  variable_set('user_admin_role', $admin_role->rid);
```

[profiles/standard/standard.install](https://github.com/drupal/drupal/blob/7.x/profiles/standard/standard.install#L406)に書かれていました。  
Built-in roles とは別枠で、Drupal の初期化を行うときに Admin のロールは作成されるようです。

`user_role_save`でロールを INSERT したあと、セットされた rid を使用して`variable_set`していました。  
variable_set は内部的に DB を使用しているので、永続化される値の１つなようです。  
`variable_set`されているなら`variable_get`で値を取得できるので、

```
variable_get('user_admin_role')
```

で Admin 相当のロール ID を入手できました。  
`user_role_save`を呼ぶよりも前で rid に相当する値をハードコートしてないことからわかるように、 **Admin ロールの ID は 3 とは限りません**  
コードを読んでおいて良かった…

## まとめ

野良の情報を調べていて思ったのは、やっぱ PHP だわ。という感想でした。  
PHP の野良情報はかなりの確実で外れだったり、不確実だったり、バッドノウハウをドヤ顔で語ってたりする（ブーメラン）という感触があり、Drupal も例に漏れず"PHP の情報"にあふれているなぁ、と感じました。

特に Drupal は Wordpress と同様にライトな人でもシステム作れちゃう YO 的なやつなので、  
誤った理解・浅い理解の情報が溢れやすい傾向にあるんじゃないかと思っています。

Drupal について調べるときは、公式ドキュメントとソースコード以外信じないことにしました。  
もしかしたら、公式ドキュメントすら信じられずにソースコードしか信じないときがくるかもしれません。笑
