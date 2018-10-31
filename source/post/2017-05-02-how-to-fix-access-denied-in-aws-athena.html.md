---
path: /post/how-to-fix-access-denied-in-aws-athena/
title: AWS Athenaでテーブルを作る時にAccess Deniedと怒られたら試すこと
date: 2017-05-02T11:30:35+00:00
dsq_thread_id:
  - "5760267601"
categories:
  - 問題を解決した
tags:
  - AWS
  - AWS Athena
---

こんにちは。  
はじめて AWS Athena を使用してみました

試しに S3 に置いてある CSV をもとにテーブルを作ろうとしたら`Access Denied`のエラーが発生  
権限は足りており、疎通確認もできているので、権限系の問題ではない。ではなぜ？

調べてみたらしょーもないところでドハマリしていたので、備忘録を残しておきます

<!--more-->

## エラーの詳細

出てきたエラーはこうです

> Your query has the following error: FAILED: Execution Error, return code 1 from org.apache.hadoop.hive.ql.exec.DDLTask. com.amazon.ws.emr.hadoop.fs.shaded.com.amazonaws.services.s3.model.AmazonS3Exception: Access Denied (Service: Amazon S3; Status Code: 403; Error Code: AccessDenied; Request ID: XXXXXXXXXXXX), S3 Extended Request ID: XXXXXXX/XXXXXX
>
> This query ran against the 'default' database, unless qualified by the query. Please post the error message on our forum or contact customer support with query id.

DDL のタスクにて`Access Denied`が起きているよ、とのこと  
このエラーを見た時に真っ先に権限を疑ったのですが、Athena と S3 に FullAccess を付けても治らず

## 対応方法

AWS のページを見つけました

> The S3 location should match the format s3://bucket/path; don't include the endpoint. For example, s3://us-east-1.amazonaws.com/bucket/path would result in an "Access Denied" error.
>
> &mdash; [Resolve "Access Denied" Errors When Running Amazon Athena Queries](https://aws.amazon.com/premiumsupport/knowledge-center/access-denied-athena/)

えぇ…  
ここで、実際の画面を見てみましょう

![undefined](/images/2017/04/693663e8211dbcfade29c5af49de6d5e.png)

お分かりいただけただろうか。  
プレースホルダがエンドポイントまで含めた URL を促しているのに対し、  
**バケットパスを入力する要素の下に、ヘルプテキストが書かれている**

ちゃんと読んでいればハマらないんでしょうが、プレースホルダ見るじゃん。それに従うじゃん。 **エラーになるじゃん**  
ということで納得はいかないのですが、治りはしました
