---
path: /post/aoj-1179-millennium/
title: '[AOJ] 1179 Millennium'
date: 2013-06-08T20:50:32+00:00
categories:
  - やってみた
tags:
  - AOJ
  - C++
---
AOJの1179、Millenniumをc++で解きました。

日付の計算の問題が苦手で、  
結構グダグダになりました。

うるう年と平年の月ごとの経過日数をハードコーディングして、  
月をindexとしてそのまま取れるようオフセットして経過日数を撮りました。

後はうるう年(i%3==0)判定をすればOK。

問題文は[こちら](http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=1179&lang=jp)

<!--more-->

コード
----------------------------------------

<script src="https://gist.github.com/Leko/5734926.js"></script>
