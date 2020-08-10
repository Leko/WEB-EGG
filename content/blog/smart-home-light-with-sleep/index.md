---
title: 睡眠トラッカーWithings SleepをIFTTTで繋いで電気のOn/Offを制御する
date: '2020-02-08T07:12:47.186Z'
tags:
  - スマートホーム
  - IFTTT
---

お久しぶりです。れこです。[株式会社 CureApp を退職します | WEB EGG](https://blog.leko.jp/post/change-jobs-2020/)で書いたとおり転職までの束の間の無職を謳歌してます。  
最近蔵前に引っ越しました。浅草も近く[東京のブルックリン](https://www.renoveru.jp/showrooms/kuramae/blog/21)とも名高いおしゃれな街ながら、そんなにガヤガヤしてるわけでもなく閑静な住みやすい街です。そして、最近の趣味はせっかく引越したので新居をスマートホーム化することです。

今回は Withings Sleep というガジェットと Philips Hue を IFTTT でつないで布団に入ると電気が消え、布団から出ると電気がつくようにしたのでその記事です。プログラミングとかは一切登場しません。  
やり方が複雑なものでもなく、ごく簡単な設定だけで実現できるので「実際のところどうなのか」ってところを重点的に見てもらえればと思います。

<!--more-->

## まえおき

本記事は一人暮らしに最適化した内容となっています。  
人部屋に複数のベッドや布団がある場合本記事の内容では対応できません。

あくまで個人的な意見ですが、Voice UI が好きではないので「ねぇ Google、おやすみ」「Alexa、電気を消して」とか言いたくないわけですよ。何が悲しくて虚空におやすみを唱えないといけないのか。「ねぇ Google、[挫・人間のテクノ番長](https://www.youtube.com/watch?v=hfxFujlRcKk)流して」とかその瞬間の非継続的な思いつきをお願いするのには便利なんですが、毎日のルーチンに「声での命令」は登場してほしくない。  
能動的に人間がスマートホームに合わせるんじゃなくて、人間の自然な動きに併せて受動的に動作するものが私にとってのスマートホームだと思っております。ということで本記事では Google Home や Alexa などは一切登場させません。

## 使うもの

### Withings Sleep

Withings が発売する睡眠トラッカーです。布団の下に置き、その上に布団を敷き、普通に布団で寝るだけで睡眠状態（時間、深さ、いびき etc）のトラッキングができるガジェットです。我が家のマットレス兼敷布団は 10cm くらい厚みがあるんですがそれでも動作してるので布団の厚みはそれほど選ばないと思われます。取得したデータは Withings の Health Mate というアプリから閲覧できます。

睡眠トラッカーとしての価値はもちろんあるのですが、更に凄いのが Wi-Fi モジュールを積んでおりそれ自体がネットワーク通信できます。さらに IFTTT がこのガジェットに対応しているので、「布団に入ったら」「布団から出たら」というトリガーが利用できます。これがスマートホームにとって
**本記事では実質的に「IFTTT と繋がる感圧センサー」として利用しています。**

Amazon 等で購入できます

[Withings Sleep - Sleep Tracking Pad Under The Mattress with Sleep Cycle Analysis, Sleep Score & Sleep Sensor to Control Light, Music & Room Temperature, Breathing Disturbances - Compatible with Alexa 141［並行輸入］](https://amazon.co.jp/dp/B078Z1B34S/ref=cm_sw_r_cp_api_i_hyupEb3PZRV4P)

### Philips Hue

Philips が開発する、言わずと知れた遠隔操作できる電球です。スマートホームといえばとりあえずこれ買っとけというくらい、電気は効率化の恩恵が大きく暮らしに必須のアイテムだと思います。単価は高いですがフルカラー版を購入すればほぼ無限の色表現が可能で、真っ赤にしたり真っ青にしたり映像と同期させて没入感ある空間演出などが可能です。  
最近は白色だけ（ON/OFF 制御のみ）、白色〜電球色のみ（ON/OFF+制限付き色制御）などの廉価版モデルも登場していますが、個人的にはフルカラー版をおすすめします。大は小を兼ねます。

これ単体＋アプリの管理画面だけでも「〜時に向けて徐々に暗くする」「〜時に向けて徐々に明るくする」「スマフォが指定の範囲から外れたら/入ったら電気を XX する」などの制御はできます。でも毎日かならず決まった時間に寝るわけじゃないので、寝るつもりじゃないタイミングで電気が消えるのと結構邪魔です。

こちらも Amazon で購入できます（電球だけじゃなくてブリッジが必要なので初回はスターターキットがおすすめです）

[Philips Hue フルカラー スターターセット V3| E26 スマート LED ライト 3 個+ブリッジ 1 個 | 【Amazon Echo、Google Home、Apple HomeKit、LINE で音声コントロール 929001367901](https://amazon.co.jp/dp/B076GY1G4W/ref=cm_sw_r_cp_api_i_1yupEb9MVR9R0)

### IFTTT

API マッシュアップサービスの代名詞といえばこれだと思います。もはや説明不要。

今回は部屋の配線工事をして電気をすべて Hue に置き換えたので Hue のみ連携しますが、リモコン付きのシーリングライト等を併用する場合、赤外線を遠隔制御できる [Nature Remo](https://www.amazon.co.jp/Nature-Remo-%E7%AC%AC2%E4%B8%96%E4%BB%A3%E3%83%A2%E3%83%87%E3%83%AB-%E5%AE%B6%E9%9B%BB%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD-%E3%83%A9-REMO1W2/dp/B07JR6PVTD/ref=pd_sbs_23_t_0/355-5010009-2695651?_encoding=UTF8&pd_rd_i=B07JR6PVTD&pd_rd_r=574017fd-3d36-4d07-bf09-33f145dba575&pd_rd_w=itnrG&pd_rd_wg=zMRlq&pf_rd_p=ca22fd73-0f1e-4b39-9917-c84a20b3f3a8&pf_rd_r=BJ7SPZZ3D01X6GTA1H88&psc=1&refRID=BJ7SPZZ3D01X6GTA1H88) があれば同様の制御が可能です。  
また、壁についてる物理的なスイッチでしか ON/OFF できない電気の場合は[SwitchBot](https://www.switchbot.jp/)などを併用できます。

## 連携

このレシピを使うだけです。

- [Set a Hue scene when I get into bed - IFTTT](https://ifttt.com/applets/Kqh7DE9S-set-a-hue-scene-when-i-get-into-bed)
- [Set a Hue scene when I get out of bed - IFTTT](https://ifttt.com/applets/irkyxPLc-set-a-hue-scene-when-i-get-out-of-bed)

これでベッドに入ると電気が消え、ベッドから出たときに電気が点く連携が完了します。

## 実際にやってみた

家で実際にこのレシピを動かしてみたデモです。  
家の固定回線が用意できておらずポケット Wi-Fi を使っているのでちょっとラグいですが、人間の所作にあわせて動作してくれているのが解ると思います。

このように布団に入って寝るポジションを確保してる間に電気が消え、

<iframe width="560" height="315" src="https://www.youtube.com/embed/NbdTJ59RzkY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

このように布団から出きて寝ぼけ眼をこすってる間に電気が点きます。

<iframe width="560" height="315" src="https://www.youtube.com/embed/CwBJjaNdzNg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

以上です。便利。
