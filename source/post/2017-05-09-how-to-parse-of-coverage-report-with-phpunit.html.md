---
path: /post/how-to-parse-of-coverage-report-with-phpunit/
title: PHPUnitのカバレッジレポート(XML)を使ってカバレッジの計算してみた
date: 2017-05-09T11:30:44+00:00
dsq_thread_id:
  - "5799558684"
categories:
  - やってみた
tags:
  - PHP
  - PHPUnit
---
こんにちは
  
仕事の方でテストカバレッジをGUIなしに集計する必要が出たので、

  * メソッド単位のカバレッジを集計したい
  * クラス単位でのカバレッジを集計したい
  * ファイル単位でのカバレッジを集計したい
  * ディレクトリ単位でのカバレッジを集計したい

の集計をするために、PHPUnitが出力するClover形式のXMLと格闘して得られた、XMLの構造と扱い方についてまとめてみました

<!--more-->

はじめに
----------------------------------------


レガシーなPHPと戦っており、PHPUnitのバージョンは3.4です
  
**最高につらい**

なので出力されるXMLの構造や属性名に差異があるかもしれません
  
また、カバレッジレポートの出力方法は[こちらのドキュメント](https://phpunit.de/manual/3.4/ja/index.html)を参照して下さい

なお、PHPUnitのカバレッジレポート単体ではC0のカバレッジしか計測できませんでした
  
後述するlineタグのnum属性とcount属性の値を使って対象プログラムの静的解析かければ、解析できなくはないかもしれませんが、
  
カバレッジレポート単体ではC0のレポートしか出ません。

カバレッジXMLの書式
----------------------------------------


この当時のPHPUnitには`--coverage-clover`というオプションがあります
  
これがXML形式のカバレッジレポートを出力してくれるオプションです

カバレッジレポート(XML)の基本的な構造
----------------------------------------


XMLはざっくり、こんな感じになりました

```markup
&lt;coverage>
  &lt;project>
    &lt;file name="ファイルパス">
      &lt;class
        name="クラス名"
        namespace="名前空間"
      >
        <!-- クラス単位でのメトリクス -->
        &lt;metrics
          methods="クラス内のメソッド数"
          coveredmethods="カバレッジ100%のメソッド数"
          statements="クラス内の有効行数"
          coveredstatements="クラス内の行カバーしている有効行数"
        />
      &lt;/class>
      

<!-- ファイル内に定義されているクラスの分だけ上記繰り返し -->
      &lt;line
        num="左記メソッドの定義開始行"
        type="method"
        name="メソッド名"
        count="テストでこの行を通過した回数"
      />
      &lt;line
        num="行番号"
        type="stmt"
        count="テストでこの行を通過した回数"
      />
      

<!-- メソッド定義のたびに type="method" name="..."が出現。それ以外は type="stmt" -->
      

<!-- ファイル単位でのメトリクス -->
      &lt;metrics
        loc="ファイル内の有効行数"
        ncloc="カバーされていない有効行数"
        classes="ファイル内のクラス数"
        methods="ファイル内のメソッド数"
        coveredmethods="ファイル内の100%カバーされているメソッド数"
        statements="ファイル内の定義行を除いた有効行数"
        coveredstatements="行カバーされているファイル内の定義行を除いた有効行数"
      />
    &lt;/file>
    

<!-- 対象カバレッジのメトリクス総まとめ -->
    &lt;metrics
      files="カバレッジ集計対象のファイル数"
      loc="カバレッジ集計対象の有効行数"
      ncloc="カバレッジ集計対象のうちカバーされていない行数"
      classes="カバレッジ集計対象のクラス数"
      methods="カバレッジ集計対象のメソッド数"
      coveredmethods="カバレッジ集計対象のうち100%カバーされているメソッド数"
      statements="カバレッジ集計対象の有効行数（定義行を除く）"
      coveredstatements="カバレッジ集計対象のカバーされている有効行数（定義行を除く）"
    />
  &lt;/project>
&lt;/coverage>
```


`有効行数`は、空白行やコメントアウトなどを除いた、PHPのコードとして評価される行数を指しています。

クラス単位で行カバレッジを取る
----------------------------------------


jsで書くと、

```javascript
const el = document.querySelector('class[name="クラス名"][namespace="名前空間"]>metrics')
console.log(el.coveredstatements / el.statements)
```


に相当します

classタグ1つにつきmetricsタグが1つはいっているので、
  
目的のクラスの中にあるmetricsタグを抽出し、有効行数とカバーしている有効行数で比較できます。

namespaceを入れないと衝突する恐れがあります。
  
もしその辺考慮しなくていいならnamespace属性は無視できます。

ファイル単位で行カバレッジを取る
----------------------------------------


ファイルも同じ要領で、fileタグ1つの直下にmetricsタグが1つ入っているので、それを比較します。

```javascript
const el = document.querySelector('file[name="ファイルパス"]>metrics')
console.log(el.coveredstatements / el.statements)
```


ファイル名（[basepath](php.net/manual/ja/function.basename.php){.broken_link}相当）ではなく、フルパスな点に注意です。
  
テストを実行（カバレッジ集計）した環境によって変わるのでご注意下さい。

ディレクトリ単位でカバレッジを取る
----------------------------------------


カバレッジレポートはfileタグ単位で纏まっているので、ディレクトリごとのカバレッジを完璧に取ることは困難です。
  
**もしソースの実体があれば** ディレクトリの中身を漁って有効行数を出すことが可能ですが、
  
ソースの実体を持たない限り、カバレッジレポートに記載されているファイルしか計測対象になりません。

その不完全な状態であれば、

```javascript
const metricses = document.querySelectorAll('file[name^="ディレクトリまでのパス"]>metrics')
const dirMetrics = metricses.reduce((acc, metrics) => ({
  statements: acc.statements + metrics.statements,
  coveredstatements: acc.coveredstatements + metrics.coveredstatements,
}), { coveredstatements: 0, statements: 0 })

console.log(dirMetrics.coveredstatements / dirMetrics.statements)
```


相当で取得可能です。
  
ディレクトリ内部のファイルのメトリクスをかき集めて、最後に合算すれば算出可能です

メソッド単位でカバレッジを取る
----------------------------------------


※前置きでも話しましたが、バージョンアップによって改善されている可能性もあります。あくまで古いPHPUnitについて言及します。

メソッド単位も、完全な情報は出せません
  
いや、正確にはメソッドに関するレポートなら出せます。が、関数に関するレポートが出せません しかも不完全な情報の収集ですら地味に面倒でした

lineタグのtype属性は`stmt`か`method`にしかならず、関数の定義開始行は`type=stmt`になってしまいます
  
関数対して判別可能な値が何もありません。計測不可能です

これもソースの実体があれば静的解析と絡めてレポート可能だとは思いますが、レポート単体では計測不可能でした
  
なので関数のレポートは出ないという前提で良ければ、

```javascript
const classes = document.querySelectorAll('file[name="探したいファイル"]>class[]')
const statementCounts = classes.map(cls => parseInt(cls.querySelector('metrics').statements, 10))
const lines = Array.from(document.querySelectorAll('file[name="探したいファイル"]>line'))
let currentClass = classes[0].name
let currentMethod = null
let currentStatements = 0
let metrics = {}
lines.forEach(line => {
  if (line.type === 'method') {
    currentMethod = line.name
  } else if (line.type === 'stmt') {
    if (!metrics[currentClass]) {
      metrics[currentClass] = {}
    }
    if (!metrics[currentClass][currentMethod]) {
      metrics[currentClass][currentMethod] = { statements: 0, coveredStatements: 0 }
    }
    if (parseInt(line.count, 10) > 0) {
      metrics[currentClass][currentMethod].coveredStatements += 1
    }
    metrics[currentClass][currentMethod].statements += 1
    currentStatements += 1
  } else {
    throw new Error('知らないタイプ:' + line.type)
  }

  if (currentStatements === parseInt(classes[0].statements)) {
    classes.shift()
    currentClass = classes[0].name
    currentStatements = 0
  }
})

const methodMetrics = metrics[集計したいクラス][集計したいメソッド]
console.log(methodMetrics.coveredStatements / methodMetrics.statements)
```


ただし、これは不完全です
  
例えばクラスに属さない関数がファイルに含まれている場合に対応できません
  
完全なカバレッジを得るためにはソースコードと静的解析が必要です。

PHPUnitの設定ファイルにて[カバレッジ集計対象の設定]()をして、
  
テストに登場しなかったファイルもカバレッジ集計対象に加えることは可能ですが、結局のところ関数には対応できません

まとめ
----------------------------------------


  * 行カバレッジの解析はXMLの構造さえ分かれば結構簡単 
      * ファイル単位、クラス単位でのカバレッジなら確実に取れる
      * 関数が1つ以上定義されているファイルに対しては、ソースと突合しないとカバレッジ集計不可能
  * PHPには結構豊富なリフレクションのメソッドがあるので、突合は技術的には可能。今回は使ってない

結果的な感想としては「ツラい」のただ一言でした。

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>