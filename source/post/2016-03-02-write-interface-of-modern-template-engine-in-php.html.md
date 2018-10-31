---
path: /post/write-interface-of-modern-template-engine-in-php/
title: 昨今のPHPのテンプレートエンジンについて調べて共通インタフェースを作った
date: 2016-03-02T22:28:02+00:00
meaningless:
  - "yes"
dsq_thread_id:
  - "4627716425"
categories:
  - やってみた
tags:
  - Github
  - PHP
  - Template Engine
---

こんにちは。  
突然ですが、[FuelPHP](http://fuelphp.com/)のビューを書く場合、デフォルトでは生 PHP + View クラスの構成だと思います。  
View クラス自体がエスケープ機構を備えているので XSS は塞げるんですが、生の PHP で書くと isset 地獄だったり if が増えたりと不便なところが多く、テンプレートエンジン使いたいと思うことが多々あります。

そんな FuelPHP には[parser](https://github.com/fuel/parser)というパッケージがあるので、設定を変更すればテンプレートエンジンが簡単に利用できます。

> [fuelphp で haml 導入したった – ド忘れ防止雑記帳](http://dolphin.hatenablog.jp/entry/2014/05/02/124522)

**が、しかし** 対応しているテンプレートエンジンの一覧を見てみると、どれも古い。とにかく古い。  
良く言えば枯れてるんですが、調べてみると **メンテナンスされてないだろこれ…** という感じのものが結構ありました。

ということで自分の知見をアップデートするため昨今のテンプレートエンジンについて調べつつ、  
parser パッケージのように複数テンプレートエンジンを同一のインタフェースで扱える仕組みを作ってみました。

<!--more-->

## 採用基準

- 開発が継続している
- ある程度 Github の star が集まっている
- もしくは"大御所"と呼べるくらい広く使われて枯れている

## 採用したテンプレートエンジン

これらのテンプレートエンジンに対応しました。

- [Jade](https://github.com/everzet/jade.php)
- [Fenom](https://github.com/fenom-template/fenom)
- [Dwoo](https://github.com/dwoo-project/dwoo)
- [FOIL](https://github.com/FoilPHP/Foil)
- [Plate](https://github.com/thephpleague/plates)
- [Twig](https://github.com/twigphp/Twig)
- [Smarty](https://github.com/smarty-php/smarty)
- [Latte](https://github.com/nette/latte)

色々と知らない名前のテンプレートエンジンが多く見つかりました。

偶然見つけた Plates に限らず、最近ライブラリを調べていると`thephpleague`というお名前のブランドをよく見かけます。  
それぞれいい感じのモジュール化されていて、ドキュメントも充実しており、高品質です。

とはいえ、これといって革新的なものはなかったので、個々のテンプレートエンジンについては触れません。

## 採用しなかったテンプレートエンジン

- [Blade](https://laravel.com/docs/5.0/templates)
  - Laravel のテンプレートエンジン。単体のライブラリになっていない
- [Volt](https://docs.phalconphp.com/en/latest/reference/volt.html)
  - Phalcon のテンプレートエンジン。ライブラリになっていない
- [H2O](https://github.com/speedmax/h2o-php)
  - メンテされていない。composer ない
- [RainTPL3](https://github.com/rainphp/raintpl3)
  - issue 溜まってる。メンテされていない
- [Razr](https://github.com/pagekit/razr)
  - メンテされてない
- [Flow](https://github.com/nramenta/flow)
  - 開発途中で止まってるっぽい？
- [Slade](https://github.com/Evertt/Slade)
  - 開発途中で止まっている
- [Tonic](https://github.com/rgamba/tonic)
  - 開発途中で止まっている
- [Mustache](https://github.com/bobthecow/mustache.php)
  - 開発が止まっている

## 作ったライブラリ

[rush/php-view-strategies](https://github.com/Leko/php-view-strategies)という名前で公開しています。

説明や使い方などは README を御覧下さい。  
記事を執筆した時点では最低限の機能しか提供していないので、ご要望やご提案などあれば[Issue](https://github.com/Leko/php-view-strategies/issues)にお願いします。
