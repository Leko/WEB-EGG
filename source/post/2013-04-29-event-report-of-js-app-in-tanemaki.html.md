---
path: /post/event-report-of-js-app-in-tanemaki/
title: 第一回 JS-App勉強会@タネマキ LTメモ
date: 2013-04-29T21:21:26+00:00
twitter_id:
  - "328848215120179200"
dsq_thread_id:
  - "3163183048"
image: /images/2013/04/20130429_jsstudy1-604x244.png
categories:
  - イベントレポート
tags:
  - angular.js
  - Backbone.js
  - CoffeeScript
  - Grunt
  - knockout.js
  - Nodejs
---
こんにちは。
  
しばらく更新が停滞してしまいました。
  

  
今回は、<span class="removed_link" title="http://atnd.org/event/jsapp">第一回 JS-App勉強会@タネマキ</span>という勉強会に参加させていただいたので、
  
勉強会内で行われたLTのメモを残します。

<!--more-->

## 1, Knockout.jsでさくさくアプリ開発 (@ken_zookie)

  * ターゲット
    
      * アプリに動きをもたせるエンジニア
      * デザインも自分でやるエンジニア

  * knockout.js

  * linp.js

あたりをwatchしている

### Javascript = 開発者にやさしくない

  1. DOM操作 
      1. なんたらElement?
      2. ググりまくり
  2. Ajax
  3. ID地獄、callback地獄 
      1. 画面の各パーツにID,id, id…
      2. 画面の作り、見た目だけ変えたいのに、プログラムまで変わってしまう

### 何が問題なのか

開発したては特に問題なくさくさく実装できる。
  
**出来立てのスパゲティは美味しい**

ある日
  
度重なる仕様変更…
  
**ID, コールバック地獄から抜け出したい**

HTMLからIDを消して、js側でオブジェクトを持つ => **MVVM**

### MVVM

  * View 
      * HTML
  * **ViewModel** 
      * js

  * **Model**
    
      * jsその他
      * ビジネスロジックもここに入る

  * データバインディング

  * コマンドバインディング が必要

=> **Knockout.js**

### Knockout.js

  * バインディングエンジン
    
      * 宣言することで、HTMLとViewModelを紐付けて、同期させる

  * ko.applyBinding
    
      * HTML要素とjsのデータをバインディング
  * ko.observable 
      * 変更通知プロパティ（ゲッタ、セッタ）
      * 変更を監視して同期させる
      * inputだとblur時に動機がかかる = **リアルタイムじゃない** 
          * 1文字ごとに反映させる、**リアルタイムにすることが可能**
  * ko.computed 
      * 依存しているデータを記憶し、それら全ての変更を監視してデータを更新

### 弱点

  * Knockout.js = あくまで**バインディングエンジン** 
      * **バインディングで解決できないことも有る**
      * Canvasは無理・・・ タグのバインディングが出来ない手続き型
      * SVGならいけそう！ => ライブラリ製作中

### MVVMはデザインに力を入れる、今の設計のあり方として最も有力な候補

knockout = js-MVVMの叩き台として重要なポジション

## 2, AngularJSで勝機をつかむ(予定) (@Hivesbee)

あんぎゅら？

  * 背景 
      * 業務はwebアプリケーションの提案・拡販
      * AngularJSを学習中
      * 提案時の問題を絡めて、AngularJSの紹介を行う
    
      * 提案
        
          * モックが一番訴求力が有る 
  * 訴求力の有るモック 
      * **動きがある** 
          * つたわらないなら、紙でいい
      * **短期間で作成できる** 
          * 客の熱が冷めないうちに
      * **変更に柔軟に対応できる**
  * jQuery 
      * DOMとイベントが強く結合している
      * 汎用化しにくい => **jsフレームワーク**

### jsフレームワーク

  * サーバが受け持つ担務を吸収してくれる
    
      * ルーティング
      * 画面パーツ結合
      * MVCのVとCをサーバから引き剥がす

  * js側の「脱JSP」
    
      * データバインド
      * リスト
      * フィルタリング・ソート => 今回は**AngularJS**を採用

### AngularJS

※今回のゴールはモックを作るまで

  * 低コスト 
      * **Scope**という概念のおかげ
  * シナリオテストが用意
  * Google提供のフレームワークだから継続性も安心？

### Scope

  * コントローラの制御範囲を表す 
      * = DOMのスコープと一致した範囲
      * コントローラの入れ子
  * DOMとコントローラが1:1対応 
      * ファイル単位で分割、要素ごとに分割が可能
      * **構造に依存しない**ため柔軟

### e2eTesting

  * シナリオテスト用のフレームワーク
  * いくら提案用のモックとはいえバグは出したくない

### 開発効率を加速させるもの

  * ルーティング、ng-View
  * $Log（console.logの代替？）

### 向いてるもの

  * 簡単なアプリ
  * 業務系アプリ

### 向いてないもの

  * UXを考慮したアプリ
  * アニメーションとの連携

### イケてないところ

  * 実は**学習コストはバカ高い** 
      * 導入はたやすく、**ある程度を超えると難易度が跳ね上がる**
  * Backbone.jsより重い

### まとめ

  * 簡単なものなら簡単に作成できる 
      * モックアップ向け

## 3, 設計ポイントの比較で知るBackbone.js @utwang

  * Backbone * Railsの設計ポイント
  * 破綻しないWebアプリ開発 
      * 設計することで破綻を防ぐ
      * 設計ポイントからBackboneの特徴を知る

### Backbone.js

  * RESTfulなJSONインタフェースを備えたjsライブラリ
  * Router, View, Model, Collectionで構成される
  * Viewがコントローラのような役割

### &#8220;必要最小限&#8221;の設計

  * チーム開発
  * 調整が必要になったときの土台
  * インクリメンタル設計

### 何を設計するか？

  * システムの**InputとOutputが明確に**なれば振る舞いが検討できる

### jsでのinputとoutput

  * HTTPリクエスト
  * HTML
  * DBへのI/O

### jsView設計

  * 動的/静的なDOMの分別
  * BackboneのViewと結びつけるDOM要素を定義する

### Model

  * 対応するREST APIを1リソースとして扱う
  * ModelがやりとりするAPIエンドポイントを決める
  * Modelにエンドポイントを設定すると、RESTクライアントのように振舞ってくれる
  * APIから受け取るJSONを元にModelに必要になるプロパティを決める 
      * APIから帰されるJSONは必ずしもModelで扱いたいフォーマットとは限らない

### Backboneでの問題点

  * DOM要素単位でのVIewクラスの割り当て 
      * Viewのネスト構造が複雑になる
      * ファイル単位

### Rails × Backbone

  * サーバはJSONを返すAPIだけになるので、
  
    Railsのようにサーバが重たいものは特に必要ない

## 4, CoffeeScript + Grunt

  * 中野 稔@nenjiru
  * カヤックのHTMLファイ部のひと
  * Coffeeを良い感じにコンパイルする**grunt-unite-coffee**を作った

## 5, Node.js + Arduino

### duino

  * NodejsでArduinoをいじれるようにするライブラリ
  * Arduino用ファイルもあって、それをArduinoに書き込んでおくことで、jsからAPIを叩ける

## 6, CucumberによるHTML5アプリの受け入れテスト自動化 (@shida)

  * ビー・アジャイル代表

### cucumber

  * いろんな言語で動く
  * `回帰テスト？`を自動化 
    > 回帰テスト【リグレッションテスト】regression test
  
    > プログラムを変更した際に、その変更によって予想外の影響が現れていないかどうか確認するテスト。
    > 
    > もっとも一般的に行われるのは、プログラムのバグを修正したことによって、そのバグが取り除かれた代わりに新しいバグが発生していないかどうか、という検証である。
  
    > <span class="removed_link" title="http://e-words.jp/w/E59B9EE5B8B0E38386E382B9E38388.html">回帰テストとは 〔リグレッションテスト〕 〔退行テスト〕 &#8211; 意味/解説/説明/定義 ： IT用語辞典</span>

  * デグレを恐れなくて済む
  * コードに手を入れるのが怖くなる
  * リファクタしてコードをクリーンに保てる
  * 積極的に細かいバグ修正や仕様変更に応えられる
  * テストコード自体が仕様書となる
  * ドキュメントを書く手間を軽減できる

### TDDって工数増えないの？？

  * 過去のテスト用メソッドを流用できる
  * コーディング工数は確かに触れるけども、
  * 総合的に見れば工数が減る 
      * ドキュメントを書く工数
      * テスト工数
      * 引き継ぎや教育の工数
      * `受け入れテスト？`の工数 
        > 受け入れテスト（うけいれてすと）
  
        > acceptance testing / 検収テスト / 承認テスト
  
        > 納入されたシステムやソフトウェアの受け入れを判定するための公式テストのこと。
  
        > システムやソフトウェアの機能・性能などが本来的な目的や使用意図に合致しているのか、妥当性確認を行う。
        > 
        > 一般に受け入れテストは、オファーしたものが所定の条件に適合しているかを確認する作業であり、次工程に進むことに承認を与える過程である。 原則として利用者や購入者が主体となって行うテストを指すが、元請けが下請けからの納品物を検収する作業をいう場合もある。
  
        > [情報システム用語事典：受け入れテスト（うけいれてすと） &#8211; ITmedia エンタープライズ](http://www.itmedia.co.jp/im/articles/1111/07/news124.html)

### 書き方

  * 日本語で書ける 
      * お客様にとって可読性の高いテストが書ける
  * １行＝１ステップ
  * Seleniumとの連携もできる = ブラウザを操作することも出来る

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>