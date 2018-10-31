---
path: /post/introduction-of-raspberry-pi-with-gui/
title: Raspberry pi 3 Model BでGUIを起動してインターネットに繋がるまでの手順
date: 2017-04-25T10:30:54+00:00
dsq_thread_id:
  - "5752708671"
categories:
  - やってみた
  - 問題を解決した
tags:
  - RaspberryPi
---

結構前にラズパイを購入し、CLI オンリーな環境として使っていたのですが、  
CLI オンリーな環境から GUI の環境を整えようとしたらドハマリしたので、手動での構築を諦めて、ゼロから環境を作り直したときのメモです。

<!--more-->

## 前置き

記事内に`/dev/disk2`と出てきますが、端末によって変わります。 事前に`diskutil list`コマンドを実行し、SD カードがどこにマウントされているか確認してから実行して下さい。

> パスを間違えるとデータが消えるなどの大ダメージとなる可能性があるので気をつけて下さい。
>
> &mdash; [Raspberry Pi に Raspbian をインストールする for Mac OSX – Qiita](http://qiita.com/ttyokoyama/items/7afe6404fd8d3e910d09)

## Rasbian を DL

今回は GUI を起動したいので Lite 版じゃない方を DL します  
Lite 版の方を選んでしまうと、この記事を書いたきっかけのように、GUI の環境構築でドハマリする恐れがあります。

> <https://www.raspberrypi.org/downloads/raspbian/>

DL に結構時間がかかるので、この間に SD カードの準備を済ませておきます

## SD カードをフォーマット

既にラズパイの Lite 版イメージが入っちゃっているので、念のためまっさらにしておきます。

こちらの記事を参考にしました。 なぜか GUI 版のディスクユーティリティでは動いてくれず CLI から同じことしたら動きました。

```
diskutil eraseDisk FAT32 RPI /dev/disk2
```

> &mdash; [Raspberry Pi 2 に RASPBIAN JESSIE をインストールする for Mac OSX – Qiita](http://qiita.com/moutend/items/7ede458aec97056dfd5e#sd%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AE%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88)

## Rasbian を SD カードに書き込み

ダウンロードと SD カードの準備が終わったら SD カードに書き込みます

```
sudo dd bs=1m if=$HOME/Downloads/2017-04-10-raspbian-jessie.img of=/dev/rdisk2
```

> "/dev/rdisk2"と指定すると、"/dev/disk2"とするよりも早く書き込みができるらしいです。
>
> &mdash; [Raspberry Pi 3 に Raspbian をインストール(Mac OS X を使用) – Qiita](http://qiita.com/onlyindreams/items/acc70807b69b43e176bf)

え、なにそれ知らないと思って調べたらちょうど同じことに疑問を持たれた方が居ました。

> disk も rdisk も同じものを見ているのですが、ユーザーが disk という名前でアクセスしたときは 4kB ごとのバッファを経由してアクセスしています。  
> （原文は from user space と表現されているので、カーネルからだとまた違うのかな？）
>
> これに対し rdisk でアクセスした場合はバッファを通さずに読み書きができるので、いちいち 4kB の細切れデータを扱う必要がありません。  
> dd のようにランダムアクセスの発生しないものであれば大変都合がよく、大幅なスピードアップが望めるということです。
>
> &mdash; [disk と rdisk ｜いろいろ作るよ](http://www.iroiro-making.com/disk-and-rdisk.html)

## 起動

ここまでの準備が整っていれば、特にトラブルなく起動すると思います。

## キーボードの配列を設定する

私の環境では、HHKB US 配列を使用していると`|`パイプが入力できないという問題が発生しました。  
キーボード設定から`English(US)`を選ぶと、入力できるようになりました。

## Wi-Fi を設定する

家に LAN ケーブルが無かったので無線で接続します。 マウスが無いので GUI で Wifi 設定する方法がわかりませんでした。CLI から設定します。  
`ctrl + alt + F1`を押して CLI 版に切り替え、

```
sudo sh -c 'wpa_passphrase {SSID} {PASSPHRASE} >> /etc/wpa_supplicant/wpa_supplicant.conf'
sudo reboot -h now
```

> &mdash; [Raspberry Pi 3 を買って Mac を使って WiFi 接続と SSH の接続するまで – Qiita](http://qiita.com/toshihirock/items/8e7f0887b565defe7989)

再起動が終わり、Wi-fi のアイコンが繋がってそうな表示になったら OK です。  
念のため疎通確認。ターミナルを起動して、

```
curl https://google.co.jp
```

OK そうです。

## 最後に

Lite 版は CLI オンリーな場合だけ使ったら良いと思った。  
そこから無理くり GUI に持っていくなら作り直したほうが早かったです。

Lite 版ではなく Full 版で構築すれば Chromium browser もデフォで入っているので、後は良しなにすればよい。  
という感じでした。
