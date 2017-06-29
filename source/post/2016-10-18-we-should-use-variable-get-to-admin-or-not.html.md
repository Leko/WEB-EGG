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
WEB EGGではじめてのDrupalネタです。  
Drupalを触っててふと気になったのが、 **指定したユーザが管理者ロールか否か** を判定しようとしたものの、  
調べてもベストプラクティスが見つからず、ソースコードを追ったらやっと正解を見つけたという話の備忘録です。

<!--more-->

はじめに
----------------------------------------

Drupal7を対象にした記事です。  
Drupal自体のことはじめ等の記事ではありません。Drupalの事前知識があるものとします。

結論
----------------------------------------

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

という感じに`variable_get('user_admin_role')`を利用すればOKでした。  
**INSERTの順序的に3だろうと決め打ちしたり、administratorという名前でSELECTしてくるのは間違い** と認識しています。  
結論に至るまでに調べた事項は

  * ロール一覧テーブルににAdmin相当か否かという情報がない 
      * なので"特定のロールをAdminだとみなす"という概念になる
  * AdminのロールIDに相当する定数が存在しない
  * AdminのロールIDは3固定らしい（？）
  * [user\_has\_role](https://api.drupal.org/api/drupal/modules!user!user.module/function/user_has_role/7.x)関数はロールIDが必要なのでなのでロールIDを隠蔽してくれない
  * ロール名は編集可能なので[user\_role\_load\_by\_name](https://api.drupal.org/api/drupal/modules%21user%21user.module/function/user_role_load_by_name/7.x)関数を使うとどハマりする恐れがある
  * ソースを追ってたら初期化処理と正解を見つけた

という感じでした。

ロール一覧テーブルににAdmin相当か否かという情報がない
----------------------------------------

[modules/user/user.install](https://github.com/drupal/drupal/blob/7.x/modules/user/user.install#L93)にテーブル定義が書いてありました。

ロール一覧テーブルには`ロールのID, 名前, 表示順序`カラムしかないので、  
「このロールはAdmin相当か否か」を判断する材料がありません

ということはデフォルトで挿入されているロール一覧のうち「これがAdmin相当のロールだ」と見なす必要がありそうです。

AdminのロールIDに相当する定数が存在しない
----------------------------------------

ならそのロールのIDに対応する定数があるのでは。と思ったのですが、ない。 **なぜかAdminのロールだけありません。**

それ以外の初期状態で入ってるロールは[includes/bootstrap.inc](https://github.com/drupal/drupal/blob/7.x/includes/bootstrap.inc#L160)に定数が定義されています。  
`DRUPAL_ANONYMOUS_RID`と`DRUPAL_AUTHENTICATED_RID`はあるのに、なぜAdminのロールだけない。  
動的に変わるから定数としてハードコードできないとか、なんかありそう。怪しい気がする。

roleテーブルの初期値を探してコードを追ってみると

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
どうやらAdminロールは`Built-in roles`に該当しないようです。

AdminのロールIDは3固定らしい（？）
----------------------------------------

Drupalのロール一覧テーブルには管理者フラグ的なものもないし、Drupalが提供しているロールIDに相当する定数もないならどないせえっちゅうねん。という感じなんですが、どうやらAdminのロールIDは3で固定らしい（？）という情報が出てきました。

> unless you install Drupal in your custom installation profile and modify the administrator role there, the rid or administrator will be always 3.
    
> &mdash; <http://drupal.stackexchange.com/a/44735>

本当・・・？それ本当なら定数が提供されてるものじゃない・・・？

user\_has\_role関数はロールIDが必要なのでなのでロールIDを隠蔽してくれない
----------------------------------------

[user\_has\_role](https://api.drupal.org/api/drupal/modules!user!user.module/function/user_has_role/7.x)関数というものがあるらしい。  
これじゃん！と思ったんですが、引数にロールIDが必要でした。

つまりAdmin相当のロールIDを知っていない限りこれを利用できません。  
あと無駄にSELECT走るのでN+1が余裕で起きそう。

ロール名は編集可能なのでuser\_role\_load\_by\_name関数を使うとどハマりする恐れがある
----------------------------------------

> One liner would be:
    
> `$rid = array_search('administrator', user_roles());`
    
> &mdash; <http://drupal.stackexchange.com/a/50437>

IDが駄目なら名前で探せって、結局マジックナンバー解消してないじゃん・・・  
user_rolesの戻り値はDBからSELECTしてきた`[ロールID => ロール名]`の連想配列なので、ロール管理画面からロール名を変えれば余裕でバグります。

**ロールの名前は変えるな** って運用で縛れば無理な話ではないんですが、  
画面から正常系の機能として編集できてしまう以上、ロール名を決め打ちするのは汎用性を失うし、なによりキモい。

ソースを追ってたら初期化処理と正解を見つけた
----------------------------------------

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
Built-in rolesとは別枠で、Drupalの初期化を行うときにAdminのロールは作成されるようです。

`user_role_save`でロールをINSERTしたあと、セットされたridを使用して`variable_set`していました。  
variable_setは内部的にDBを使用しているので、永続化される値の１つなようです。  
`variable_set`されているなら`variable_get`で値を取得できるので、

```
variable_get('user_admin_role')
```

でAdmin相当のロールIDを入手することができました。  
`user_role_save`を呼ぶよりも前でridに相当する値をハードコートしてないことからわかるように、 **AdminロールのIDは3とは限りません**  
コードを読んでおいて良かった・・・

まとめ
----------------------------------------

野良の情報を調べていて思ったのは、やっぱPHPだわ。という感想でした。  
PHPの野良情報はかなりの確実で外れだったり、不確実だったり、バッドノウハウをドヤ顔で語ってたりする（ブーメラン）という感触があり、Drupalも例に漏れず"PHPの情報"にあふれているなぁ、と感じました。

特にDrupalはWordpressと同様にライトな人でもシステム作れちゃうYO的なやつなので、  
誤った理解・浅い理解の情報が溢れやすい傾向にあるんじゃないかと思っています。

Drupalについて調べるときは、公式ドキュメントとソースコード以外信じないことにしました。  
もしかしたら、公式ドキュメントすら信じられずにソースコードしか信じないときがくるかもしれません。笑

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>