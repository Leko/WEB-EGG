---
title: CLIだけでReactNativeアプリをビルドしてDeployGateにデプロイする方法
date: 2017-08-22 10:30 JST
tags:
- iOS
- Android
- ReactNative
- DeployGate
---

こんにちは。  
仕事でReactNativeを触っているのですが、ステージング（DeployGate）へアプリを反映するときに、

* XCodeを起動
* Project > Archiveを選択
* しばらく待つ
* エクスポート方法（Ad-Hoc）を選択
* オプション（Code Signingに使用するアカウント）を選択
* しばらく待つ
* DeployGateを開く
* 出来上がったipaファイルをDeployGateにドロップ

という手作業をちまちまやるのが面倒になったので、  
どうにかできないか調べてみたらCLIだけで完結できたので、その方法を残します

<!--more-->

