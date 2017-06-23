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
結構前にラズパイを購入し、CLIオンリーな環境として使っていたのですが、
  
CLIオンリーな環境からGUIの環境を整えようとしたらドハマリしたので、手動での構築を諦めて、ゼロから環境を作り直したときのメモです。

<!--more-->

前置き
----------------------------------------


記事内に`/dev/disk2`と出てきますが、端末によって変わります。 事前に`diskutil list`コマンドを実行し、SDカードがどこにマウントされているか確認してから実行して下さい。

> パスを間違えるとデータが消えるなどの大ダメージとなる可能性があるので気をつけて下さい。
> 
> &mdash; [Raspberry PiにRaspbianをインストールする for Mac OSX &#8211; Qiita](http://qiita.com/ttyokoyama/items/7afe6404fd8d3e910d09)

RasbianをDL
----------------------------------------


今回はGUIを起動したいのでLite版じゃない方をDLします
  
Lite版の方を選んでしまうと、この記事を書いたきっかけのように、GUIの環境構築でドハマリする恐れがあります。

> <https://www.raspberrypi.org/downloads/raspbian/>

DLに結構時間がかかるので、この間にSDカードの準備を済ませておきます

SDカードをフォーマット
----------------------------------------


既にラズパイのLite版イメージが入っちゃっているので、念のためまっさらにしておきます。

こちらの記事を参考にしました。 なぜかGUI版のディスクユーティリティでは動いてくれずCLIから同じことしたら動きました。


```
diskutil eraseDisk FAT32 RPI /dev/disk2

```


> &mdash; [Raspberry Pi 2にRASPBIAN JESSIEをインストールする for Mac OSX &#8211; Qiita](http://qiita.com/moutend/items/7ede458aec97056dfd5e#sd%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AE%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88)

RasbianをSDカードに書き込み
----------------------------------------


ダウンロードとSDカードの準備が終わったらSDカードに書き込みます


```
sudo dd bs=1m if=$HOME/Downloads/2017-04-10-raspbian-jessie.img of=/dev/rdisk2

```


> &#8220;/dev/rdisk2&#8243;と指定すると、&#8221;/dev/disk2&#8243;とするよりも早く書き込みができるらしいです。
> 
> &mdash; [Raspberry Pi 3にRaspbianをインストール(Mac OS X を使用) &#8211; Qiita](http://qiita.com/onlyindreams/items/acc70807b69b43e176bf)

え、なにそれ知らないと思って調べたらちょうど同じことに疑問を持たれた方が居ました。

> diskもrdiskも同じものを見ているのですが、ユーザーがdiskという名前でアクセスしたときは4kBごとのバッファを経由してアクセスしています。
    
> （原文は from user space と表現されているので、カーネルからだとまた違うのかな？）
> 
> これに対しrdiskでアクセスした場合はバッファを通さずに読み書きができるので、いちいち4kBの細切れデータを扱う必要がありません。
    
> ddのようにランダムアクセスの発生しないものであれば大変都合がよく、大幅なスピードアップが望めるということです。
> 
> &mdash; [diskとrdisk｜いろいろ作るよ](http://www.iroiro-making.com/disk-and-rdisk.html)

起動
----------------------------------------


ここまでの準備が整っていれば、特にトラブルなく起動すると思います。

キーボードの配列を設定する
----------------------------------------


私の環境では、HHKB US配列を使用していると`|`パイプが入力できないという問題が発生しました。
  
キーボード設定から`English(US)`を選ぶと、入力できるようになりました。

Wi-Fiを設定する
----------------------------------------


家にLANケーブルが無かったので無線で接続します。 マウスが無いのでGUIでWifi設定する方法がわかりませんでした。CLIから設定します。
  
`ctrl + alt + F1`を押してCLI版に切り替え、


```
sudo sh -c 'wpa_passphrase {SSID} {PASSPHRASE} >> /etc/wpa_supplicant/wpa_supplicant.conf'
sudo reboot -h now

```


> &mdash; [Raspberry Pi 3を買ってMacを使ってWiFi接続とSSHの接続するまで &#8211; Qiita](http://qiita.com/toshihirock/items/8e7f0887b565defe7989)

再起動が終わり、Wi-fiのアイコンが繋がってそうな表示になったらOKです。
  
念のため疎通確認。ターミナルを起動して、


```
curl https://google.co.jp

```


OKそうです。

最後に
----------------------------------------


Lite版はCLIオンリーな場合だけ使ったら良いと思った。
  
そこから無理くりGUIに持っていくなら作り直したほうが早かったです。

Lite版ではなくFull版で構築すればChromium browserもデフォで入っているので、後は良しなにすればよい。
  
という感じでした。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>