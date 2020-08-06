---
title: 急遽Windowsを開発機として使うことになったときやったこと
date: 2020-08-07T20:03:48+00:00
---

普段使いしているUbuntuで致命的な問題が起こり実用に耐えなくなってしまったので急遽IE確認用に残しておいたWindowsを開発機として使うことにしました。次こういうことが起こった時にスムーズに対処できるようにするためのメモを残します。  
WindowsをIEの動作確認に利用する程度で全くセットアップされておらず、ほぼクリーンインストール直後と同じ状況でした。

なお、もともとWindowsに詳しいユーザにとって特に目新しいことはないと思います。**そして吟味されていない不適切な方法が掲載されている可能性があります**  
新しいPCが届くまでのつなぎとして情報の吟味をほとんどしてないため、より良い選択肢があれば教えてもらえると喜びます。  

## 環境
- Thinkpad X1 Carbon 2019年モデル
- Windows 10 (64bit, ver 1909, build 18363.900)
- Windows 10歴 2日目

## ゴール
- 普段使ってるキーマッピングとほぼ同等の使用感にする
- Apple Magic trackpad 2が使えるようにする
- Chrome, Slack, VSCodeが使えるようにする
- VSCodeで多段SSHの環境に入って開発ができる
- sshコマンドが使えるようにする
- いざという時のためにWSL2でUbuntuが使えるようにしておく

## Windows updateする
環境を整えるためにいろいろインストールしていくので、セキュリティパッチなどを最新まで適用しておいたほうが安心です。  
長いこと溜め込んでたWindows Updateを実行します。もしアップデート後に起動しなくなっても専門外なので自己責任で。

私の場合Windows 10のメジャーアップデート（？）があったようで100Mbpsの有線接続で3-40分くらい放置しました。

## キー配列を設定する
US配列を使っているのですがWindowsはJIS配列として認識されていました。  
IEにURLを打つ程度なら問題なかったのですが、さすがにコード書くとなると記号の入力が壊滅しているのは厳しいので修正しました。

- 言語設定を開く（Winキー→"lang"で開ける）
- 優先言語に表示されている言語をクリック＋オプションボタンを押下
- ハードウェアキーボードレイアウトをUSに変更

## CapsLockキーをCtrlキーにマッピングする

> &mdash; [Ctrl2Capツールで［Ctrl］と［CapsLock］キーを入れ替える（Windows編）：Tech TIPS - ＠IT](https://www.atmarkit.co.jp/ait/articles/0907/03/news103.html)

純正のツールでキーマップを変更できたので取り急ぎこれを使った。  
ただ後述するキーマッピングの変更ソフトを使って一元管理したほうがよさそうです。

## IME（日本語↔英語）の切り替え
仕事では日本語を入力しないので英語しか入力できなくても大きな支障はないですが、日本語が入力できないとTwitterやブログ書くのに不便なのでやります。  
もともとUbuntuでも使用していた「左右の⌘キー/Altキーで日英の切り替え」ができる手段の１つがこちらです。

> &mdash; [karakaram/alt-ime-ahk](https://github.com/karakaram/alt-ime-ahk)  
> &mdash; [WindowsのAlt空打ちで日本語入力(IME)を切り替えるツールを作った - karakaram-blog](https://www.karakaram.com/alt-ime-on-off/)

AutoHotKeyというソフトを使ってAltを単押ししたときだけ日英を切り替えるスクリプトだそうです。  
[@euxn23](https://twitter.com/euxn23)から教えてもらったのですがAHKより良い手段がいろいろあるそうで、現キーマップが動かないor物足りなくなったら試行錯誤してみようと思います。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">ahk 不安定なので nodoka (yamy の後継)がおすすめですよ。変なことしないなら PowerToys のキーボード拡張でも事足ります</p>&mdash; ユーン🍆 (@euxn23) <a href="https://twitter.com/euxn23/status/1291365340606160896?ref_src=twsrc%5Etfw">August 6, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Apple Magic trackpadを使えるようにする

単にBluetoothデバイスとしてペアリングすると最低限マウスとしては動作します。  
しかしマウスの移動とクリックしかできず、スクロールやその他ジェスチャはすべて使えません。これではMagic trackpadを利用する意味がありません。治します。

まず出てきたのがこちらのOSSで作成されているドライバ。Bluetooth接続には対応してない（ロードマップには入っている）ので有線接続でのみ動作します。

> &mdash; [imbushuo/mac-precision-touchpad: Windows Precision Touchpad Driver Implementation for Apple MacBook / Magic Trackpad](https://github.com/imbushuo/mac-precision-touchpad)

次に出てきたのがこちら。有償ですが品質は高いそうです（試してない）  

> &mdash; [Home - Magic Utilities](https://magicutilities.net/)

mac-precision-touchpadがよくできているので、結局そちらを使っています。  
本当は無線のまま使えたら良かったのですが、OSSもしくはフリーソフトでBluetooth対応しているドライバはなかった＋USBポート１つ空いてたので有線接続しました。

## WSL 2を有効化する

こちらの記事の通りです。

> &mdash; [WSL2入れてみた - Qiita](https://qiita.com/TsuyoshiUshio@github/items/947301bd9317610572fc)

## WSL + VSCodeの設定

「結局Ubuntuじゃねえか！」って感じですが、慣れないPowerShellやWindowsのFSの事情に引っ張られたくないので対比手段を用意します。  
まずVSCodeをインストールし、WSLにて有効化したUbuntu上でVSCodeが動作するように設定しておきます。やることはExtension入れるだけです。

> &mdash; [Developing in the Windows Subsystem for Linux with Visual Studio Code](https://code.visualstudio.com/docs/remote/wsl#_getting-started)

## OpenSSHのセットアップ


## SSH + VSCodeの設定

私の場合はEC2においてある開発用のコンテナに接続して開発しているので、ローカルに開発環境を整える必要はありません。  
VSCodeでSSHできればいいのですが思った以上にハマったので残しておきます。

### OpenSSHの有効化

公式ドキュメントがあったのでこの通り進めてOpenSSHを有効化します。

> &mdash; [Installation of OpenSSH For Windows Server | Microsoft Docs](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse#installing-openssh-with-powershell)

するとPowerShellでssh-keygenが使えるようになります。UNIX系OSと同様のやり方でキーペアを生成し、パーミッションを確認しておきます。  

### VSCodeの設定

VSCodeの`Remote - SSH`というExtensionをインストールし、SSHの設定ファイル（パスは違うけど~/.ssh/configと同じもの）を開いて必要な設定を書き足します。  

> &mdash; [Developing on Remote Machines using SSH and Visual Studio Code](https://code.visualstudio.com/docs/remote/ssh)

公開鍵認証を用いた１段階のSSHであれば問題なく接続できたのですが、踏み台を用いた多段SSHでよくわからないエラーが起きました。  
具体的には`ProxyCommand`が動作しません。ProxyCommandの設定内容を直接SSHコマンドとして実行すると動作するのですが、なぜかSSHできない場合はおそらくこれが原因です。  
`ProxyCommand`コマンドの中身を貼り付けて実行してエラーになるようなら別の問題です。ググりましょう。

デフォルトでインストールされるOpenSSHのバージョンにはバグがあるようで、SSHコマンドを最新に更新する詳しい手順があるのでそれに従います。  
手順通りsshコマンドをアップグレードしたところProxyCommandが期待通り動き、VSCodeで多段SSH環境に入れるようになりました。

> こちらのコメントに手動で修正する方法が紹介されています。
> https://github.com/microsoft/vscode-remote-release/issues/18#issuecomment-507258777
>
> &mdash; [Windwos10でssh ProxyCommandの多段SSHの設定 - suzu6](https://www.suzu6.net/posts/205-ssh-config-proxycommand-windows10/)

## 起動時に自動で起動するアプリを変更したい
「スタートアップ アプリ」という設定があるのですが、この設定画面から項目を追加することはできません。  

スタートアイコン（Windowsマーク）を右クリックし「ファイル名を指定して実行」を押下し、`shell:startup`と入力すると、起動時に自動起動してほしいアプリを置いておくフォルダが開かれます。  
このフォルダにexeのショートカットまたはexe本体を配置しておくと自動起動するようです。

フォルダにいろいろ追加してみると「スタートアップ アプリ」の設定画面にも反映されていました。  
なんでGUIの設定画面から設定できないんだろう。

## 最後に
私はSteamなどのゲームもしないしWindows専用のソフトも何も使ってないため、真剣にWindowsを触ったのはWeb制作会社でバイトしてた頃の貸与PCぶり（8年前）でした。  
その頃はAdobeのDreamweaverとSublime Text、ターミナルには[Git for Windows](https://gitforwindows.org/)を使ってました。  
当時と比べて（今更ですが）WSLの登場だったりエディタの進化だったりOSの進化だったりによってかなり使いやすくなってると感じました。正直このままメインマシンとして使ってもいけそうな予感がしています。

仕事ではEC2に開発環境を置いてあるためローカルの動作環境が一切なくてもいい点が幸いでした。  
そのためまだlocalhostを立てたこともなくWSL化のUbuntuも酷使していません。
趣味のコードを書き始めれば何か問題が見つかると思います。何かあれば逐次追記します。

以上雑記でした。
