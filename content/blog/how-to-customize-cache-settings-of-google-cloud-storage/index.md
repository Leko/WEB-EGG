---
path: /post/how-to-customize-cache-settings-of-google-cloud-storage/
title: Google Cloud Storageのキャッシュの設定を変更してみる
date: 2016-07-06T13:15:44+00:00
dsq_thread_id:
  - "4964057825"
categories:
  - やってみた
  - 問題を解決した
---
この前公開した記事([Buildersconのセッションタイマーを作った](/post/create-session-timer-of-builderscon/))を実装する過程で、はじめて[Google Cloud Storage](https://cloud.google.com/storage/)を利用しました。  
利用してみたところ、キャッシュ周りの設定を変更する方法がよく分からなかったので、備忘録を残します。

<!--more-->

まえおき
----------------------------------------

Google Cloud StorageはブラウザからGUIで操作する方法と、[Google Cloud SDK](https://cloud.google.com/sdk/)という公式のCLIツールを利用する方法があるようです。 今回は両方の方法でまとめてみます。

※GCP自体はISUCONで使用したことがあるので、GCPことはじめ的なことは割愛します。  
また、GCSでバケット作成、ファイルアップロードなどのGCSことはじめも割愛します。

## Google Cloud SDKのインストール

[公式](https://cloud.google.com/sdk/docs/#install_the_latest_version_cloudsdk_current_version)にインストールガイドがあるのですが、<del>面倒なので</del>インストールはHomebrew-caskでやってしまいます。

```shell
brew cask install google-cloud-sdk
```

インストールできたか動作確認。

```shell
gsutil
```

ヘルプが表示されていればOKだと思います。

メタデータの確認
----------------------------------------

キャッシュの情報はメタデータと呼ばれるオブジェクトに格納されています。  
デフォルトでは`Cache-Control: public, max-age=3600`となっているようです。

開発途中に1時間もキャッシュが効いてしまうのは辛いので、もうちょっと短くしたい。

### GUIで見る

ファイル一覧の各ファイルの右端にメニューが有ります。


![スクリーンショッ](./9899cad30c9613f429309d9242dc9746.png)



**Edit metadata** を選択すると、メタデータの詳細が表示/編集されます。


![スクリーンショッ](./7aae685d0e8c76f43a6bc656c884f942.png)



### Google Cloud SDKで見る

コマンドの場合は、`gsutil ls -L {URL}`で確認できるようです。

```shell
$ gsutil ls -L gs://web.timer.builderscon.io/all.css
gs://web.timer.builderscon.io/all.css:
    Creation time:      Mon, 27 Jun 2016 00:02:53 GMT
    Cache-Control:      public, max-age=300
    Content-Length:     2225
    Content-Type:       text/css
    Hash (crc32c):      TTdzRQ==
    Hash (md5):     BHMNh5agX0rW+VxFUeO4vA==
    ETag:           CKfap76gw80CEAQ=
    Generation:     1466860311276839
    Metageneration:     4
    ACL:            ACCESS DENIED. Note: you need OWNER permission
                on the object to read its ACL.
TOTAL: 1 objects, 2225 bytes (2.17 KiB)
```

### httpでアクセスしてみる

curlからファイルにアクセスし、レスポンスヘッダを見てみます。

```shell
$ curl -v http://web.timer.builderscon.io/all.css | grep -i cache
*   Trying 172.217.25.112...
* Connected to web.timer.builderscon.io (172.217.25.112) port 80 (#0)
> GET /all.css HTTP/1.1
> Host: web.timer.builderscon.io
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 200 OK
< X-GUploader-UploadID: AEnB2Uo-VyZzLzndQK4fCwxFlWUnnbZJX36oxapS-DRXklr34ke74Liu8A8_uDWimrSzjS3hWoVpUh318hW9MVFQacQrjl_ozA
< Date: Wed, 06 Jul 2016 01:56:29 GMT
< Cache-Control: public, max-age=300
< Expires: Wed, 06 Jul 2016 02:01:29 GMT
< Last-Modified: Sat, 25 Jun 2016 13:11:51 GMT
< ETag: "04730d8796a05f4ad6f95c4551e3b8bc"
< x-goog-generation: 1466860311276839
< x-goog-metageneration: 4
< x-goog-stored-content-encoding: identity
< x-goog-stored-content-length: 2225
< Content-Type: text/css
< x-goog-hash: crc32c=TTdzRQ==
< x-goog-hash: md5=BHMNh5agX0rW+VxFUeO4vA==
< x-goog-storage-class: STANDARD
< Accept-Ranges: bytes
< Content-Length: 2225
< Server: UploadServer

...
```

このように、メタデータ内のキャッシュの項目がレスポンスヘッダに含まれています。

キャッシュの有効期限を変更してみる
----------------------------------------

### GUIから変更する

Edit metadataからキャッシュの情報を書き換えられます。


![スクリーンショッ](./2dfe421c7eaddb77926bbd551fc9b938.png)



書き換えたらcurlでアクセス。

```shell
$ curl -v http://web.timer.builderscon.io/all.css 2>&1 | grep -i cache
< Cache-Control: public, max-age=30
```

意図したとおりになりました。

### Google Cloud SDKから変更する

gsutilコマンドの場合は`setmeta`サブコマンドを使用します。

```shell
gsutil setmeta -h 'Cache-Control:public, max-age=100' gs://web.timer.builderscon.io/all.css
Setting metadata on gs://web.timer.builderscon.io/all.css...
BadRequestException: 400 Invalid argument.
```

**ん？**  
よくよく考えたらログインしてないですね。プロジェクトのメンバーでないとファイルの変更ができないので、gcloudコマンドでログインします。

```shell
$ gcloud auth login
Your browser has been opened to visit:

    https://accounts.google.com/o/oauth2/auth?XXXXXXXXXXXXXXXX

Saved Application Default Credentials.

You are now logged in as [XXX.XXX@gmail.com].
Your current project is [None].  You can change this setting by running:
  $ gcloud config set project PROJECT_ID
```

ログインが完了したら、もう一度メタデータを更新。

```shell
$ gsutil setmeta -h 'Cache-Control:public, max-age=100' gs://web.timer.builderscon.io/all.css
Setting metadata on gs://web.timer.builderscon.io/all.css...
```

今度はうまくいったようです。書き換えたらcurlでアクセス。

```shell
$ curl -v http://web.timer.builderscon.io/all.css 2>&1 | grep -i cache
< Cache-Control: public, max-age=100
```

意図したとおりになりました。
