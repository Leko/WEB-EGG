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
こんにちは
  
はじめてAWS Athenaを使用してみました

試しにS3に置いてあるCSVをもとにテーブルを作ろうとしたら`Access Denied`のエラーが発生
  
権限は足りており、疎通確認もできているので、権限系の問題ではない。ではなぜ？

調べてみたらしょーもないところでドハマリしていたので、備忘録を残しておきます

<!--more-->

エラーの詳細
----------------------------------------


出てきたエラーはこうです

> Your query has the following error: FAILED: Execution Error, return code 1 from org.apache.hadoop.hive.ql.exec.DDLTask. com.amazon.ws.emr.hadoop.fs.shaded.com.amazonaws.services.s3.model.AmazonS3Exception: Access Denied (Service: Amazon S3; Status Code: 403; Error Code: AccessDenied; Request ID: XXXXXXXXXXXX), S3 Extended Request ID: XXXXXXX/XXXXXX
> 
> This query ran against the &#8216;default&#8217; database, unless qualified by the query. Please post the error message on our forum or contact customer support with query id.

DDLのタスクにて`Access Denied`が起きているよ、とのこと
  
このエラーを見た時に真っ先に権限を疑ったのですが、AthenaとS3にFullAccessを付けても治らず

対応方法
----------------------------------------


AWSのページを見つけました

> The S3 location should match the format s3://bucket/path; don&#8217;t include the endpoint. For example, s3://us-east-1.amazonaws.com/bucket/path would result in an &#8220;Access Denied&#8221; error.
> 
> &mdash; [Resolve "Access Denied" Errors When Running Amazon Athena Queries](https://aws.amazon.com/premiumsupport/knowledge-center/access-denied-athena/)

えぇ&#8230;
  
ここで、実際の画面を見てみましょう

<img src="http://leko.jp/images/2017/04/693663e8211dbcfade29c5af49de6d5e.png" alt="" width="1007" height="410" class="alignnone size-full wp-image-953" />

お分かりいただけたであろうか。
  
プレースホルダがエンドポイントまで含めたURLを促しているのに対し、
  
**バケットパスを入力する要素の下に、ヘルプテキストが書かれている**

ちゃんと読んでいればハマらないんでしょうが、プレースホルダ見るじゃん。それに従うじゃん。 **エラーになるじゃん**
  
ということで納得はいかないのですが、治りはしました

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>