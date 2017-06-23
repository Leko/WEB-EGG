---
path: /post/how-to-fix-export-error-in-mysql-workbench/
title: MySQLWorkbenchでエクスポートしたSQLがIncorrect table definitionエラーになったときの対処法
date: 2013-08-22T22:37:57+00:00
twitter_id:
  - "370546231975485442"
image: /images/2013/08/20130822_mysqlworkbench1.jpg
categories:
  - 問題を解決した
tags:
  - MySQL
---
こんにちは。
  
今日、[MySQLWorkbench](http://www-jp.mysql.com/products/workbench/)というMySQL純正ツールを使ってDDLを作っていたのですが、

GUIでテーブルを設定し、SQLにエクスポートしたら

**Incorrect table definition; there can be only one auto column and it must be defined as a key**

というエラーが出たのでその対処法を残します。

<!--more-->

なぜエラーが起こるのか(SQLのお作法)
----------------------------------------


まずエラーの意味を理解します。

**Incorrect table definition; there can be only one auto column and it must be defined as a key**

とは、`AUTO INCREMENT`**が設定されたカラムは主キーでなければならない**
  
と言っています。

しかし、AUTO INCREMENTを設定したカラムは主キーにしてあります。

<img src="/images/2013/08/ef5ef751157160f8bf9c0fac717015a2.png" alt="AUTO INCREMENTを設定したカラムは主キーに" title="AUTO INCREMENTを設定したカラムは主キーに.png" width="502" />

では何故エラーが起こるのでしょう。

なぜエラーが起こるのか(ツールのバグ？)
----------------------------------------


こちらのページに引っかかる記述がありました。

> 主キーの設定をしていない場合は、主キーの設定をしてからAUTO_INCREMENT属性を設定する必要があります。
  
> [主キーの設定・削除、AUTO_ICREMENT属性の設定｜カラム（フィールド）：データ定義（SQL文）｜MySQL｜PHP & JavaScript Room](http://phpjavascriptroom.com/?t=mysql&p=autoincerment)

どうやら、主キーの設定がされる前に、AUTO INCREMENTの指定がされてしまっているようです。

そんなこと言われましても・・・。
  
**吐き出されたSQLをいちいち手動で修正**しなければならないのかと思いましたが、**直せました**。

対処法
----------------------------------------


上記のエラーが起こる原因は、**カラムの属性を選ぶ&#8221;順番&#8221;が左右していた**ようです。

つまり、チェックボックスの`AI`属性に先にチェックを入れてしまっていて、
  
そのあとに`PK`の指定をしたため、アウト。

**そんな馬鹿な**。。。

GUIからチェックボックスを選んだ順番なんてまともに見る術も無いのに、
  
あまりに不親切すぎませんか・・・

ということでチェックを解除して`PK`>`AI`の順番でチェックを入れなおしたら治りました。

<img src="/images/2013/08/8d64668f22f50892748e9a13f350eaa0.png" alt="チェックを入れなおし" title="チェックを入れなおし.png" width="502" />

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>