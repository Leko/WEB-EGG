---
path: /post/how-to-implement-find-all-by-with-php-magic-method/
title: 'phpのマジックメソッドを使ってRailsのfind_all_by_*メソッドを実装してみる'
date: 2014-07-22T13:19:53+00:00
twitter_id:
  - "491438434905366528"
dsq_thread_id:
  - "3136013808"
image: /images/2014/07/Untitled-11.png
categories:
  - やってみた
tags:
  - PHP
  - Ruby
  - Ruby on Rails
---
久々の更新です。
  
ネタは溜まっているんですがなかなか書くモチベが沸かず。

これから定期的に更新できるよう頑張ります。

今日はPHPのマジックメソッドについて書きます。

PHPのマジックメソッドの中に`__callStatic`というメソッドがあります。
  
これは、クラスで定義されていないメソッドに対してstaticなコールをした際に呼び出されるフックです。

この機能を使えば、Rubyでいうところの`method missing`のような挙動が可能になるのでは？
  
と考え、実験にRuby on Railsで以前まで使われていた`find_all_by_*`を実装してみたいと思います。

ライブラリ等に依存しないシンプルなデモと、
  
実用化するために、`FuelPHP`のモデルを用いた例も作成します。

<!--more-->

__callStaticの仕様を読む
----------------------------------------

> __callStatic() は、 アクセス不能メソッドを静的コンテキストで実行したときに起動します。
> 
> 引数 $name は、 コールしようとしたメソッドの名前です。 引数 $arguments は配列で、メソッド $name に渡そうとしたパラメータが格納されます。
    
> &mdash; [PHP: オーバーロード &#8211; Manual](http://php.net/manual/ja/language.oop5.overloading.php#object.callstatic)

サンプルコードを呼んでみると、`__callStatic`はPHP5.3以上で動作可能な機能のようです。

引数の説明が分かりにくいので、コードを交えつつ解説します。

```php
<?php

class Sample {
    public static function __callStatic($name, $args) {
        var_dump($name, $args);
    }
}

Sample::hogehoge(1,2,3,4,5);
```

<p>
  こんなコードがあったとします。<br />
  <code>Sample::hogehoge()</code>をコールすると、Sampleクラスにはhogehogeメソッドが定義されていないため、<code>__callStatic</code>が呼び出されます。<br />
  このとき、$nameにはメソッド名である<code>hogehoge</code>が、$argsにはhogehogeに渡した引数である<code>[1, 2, 3, 4, 5]</code>が配列で格納されています。
</p>

<p>
  これを利用して、<code>find_all_by_*</code>を実装してみたいと思います。
</p>

<h2>
  <code>fund_all_by_*</code>とは？
</h2>

<p>
  先ほどから出ているfind_all_byメソッドとは何でしょうか。<br />
  やや古いRails(3.2.*)まで使用されていたデータ検索用のメソッドです。
</p>

<blockquote>
  <p>
    カラム名を指定して、検索条件にあうすべてのレコードを取得する。<br />
      rails4からは、whereで代替することができる。<br />
      &mdash; <a href="http://railsdoc.com/references/find_all_by">find_all_by - リファレンス - Railsドキュメント</a>
  </p>
  
</blockquote>

<p>
  4.*系からは非推奨になってしまいました。<br />
  とはいえ、今回はあくまで__callStaticが活躍できそうな方法を探ることが目的なので構わず実装します。
</p>

<h2>
  仕様
</h2>

<p>
  単一のカラムの指定も受け付け、<br />
  更に<code>_and_</code>で繋いだ複数カラムと値の組み合わせを受け付ける<br />
  というものを作ってみたいと思います。
</p>

<p>
  例えば、<code>クラス名::カラム名1_and_カラム名2(値1, 値2)</code>とメソッドを呼び出せば、__callStatic内では<br />
  <code>SELECT * FROM クラス名 WHERE カラム名1=値1 AND カラム名2=値2</code><br />
  と解釈してもらうことにします。
</p>

<p>
  なお、このメソッドでは、カラム名に<code>and</code>が含まれることを考慮しません。
</p>

<h2>
  クラスを定義
</h2>

<p>
  まずは、２つのクラスを作成します。
</p>

```php

<?php

abstract class Model {
    protected static $table_name = null;
}

class Test extends Model {
    protected static $table_name = 'test';
}
```

<p>
  <code>Model</code>クラスは抽象クラスで、継承される前提のクラスです。<br />
  <code>Test</code>クラスはModelクラスを継承し、実際にアプリケーション内で使用されるモデルクラスとします。
</p>

<p>
  テーブル名は、クラス名から取得などをせずに、<br />
  おとなしく<code>$table_name</code>というプロパティを定義しています。
</p>

<h3>
  検索用メソッドを作成
</h3>

<p>
  マジックメソッドの前に、汎用的な検索メソッドを作成します。<br />
  連想配列を受け取り、それをSQL文字列に変換するメソッドです。
</p>

<p>
  <code>Test</code>クラスにはこれ以上書くことがないので、以下のコードでは<code>Model</code>クラスのみ記述します。
</p>

```php

class Model {
    const FIND_ALL_BY = 'find_all_by_';

    protected static $table_name = '';

    // 連想配列を与えて、条件にマッチする行を全件取得するSQLを作成する
    public static function find_all($where = array()) {
        $sql = 'SELECT * FROM '.static::$table_name;

        // 連想配列が指定されていたらWHERE句を生成
        if(count($where) > 0) {
            $keyval = array();
            foreach($where as $column => $value) {
                $keyval[] = $column.'='.$value;
            }
            $sql .= ' WHERE '.implode(' AND ', $keyval);
        }

        return $sql;
    }
```

<p>
  <code>find_all</code>というメソッドを追加しました。
</p>

<p>
  "コピペで使えるコード"を目指しているわけではないので、SQLの生成自体はかなり適当です。<br />
  クオートしていないので、クオートが必要な値が含まれていたら実行すらできません。<br />
  しかし、イメージは十分に伝わると思います。
</p>

<p>
  SQLの作成が雑なのは、自力でSQLを生成するのは非現実的であることと、<br />
  この後FuelPHP対応の実用版を書くため、<strong>カラム名と値の組み合わせ</strong>という情報さえ手に入れば十分だからです。
</p>

<p>
  ちなみに、<code>findAll</code>メソッドの使用イメージはこんな感じです。
</p>

```php

// "SELECT * FROM test WHERE id=1"
Test::find_all(array('id' => 1));

// "SELECT * FROM test WHERE name=Leko AND age => 22"
Test::find_all(array('name' => 'Leko', 'age' => 22));
```

<h3>
  マジックメソッドを定義
</h3>

<p>
  本題です。マジックメソッドを入れていきます。<br />
  先ほど<code>find_all</code>メソッドを作成したので、検索自体は<code>find_all</code>の責務です。<br />
  そのため<code>__callStatic</code>では、カラム名と値の組み合わせさえ取得できればOKです。<br />
  <code>find_all</code>へパスする処理を実装します。
</p>

<p>
  全体を書くとやや長くなるため、マジックメソッドのみ記述します。
</p>

```php

public static function __callStatic($method_name, $args) {
    // メソッド名がfind_all_by_で始まる場合のみ解析を行う
    if(strpos($method_name, self::FIND_ALL_BY) === 0) {
        // find_all_by_を除去
        $method_name = str_replace(self::FIND_ALL_BY, '', $method_name);

        // カラム名 => 値の連想配列へ変換
        $columns = explode('_and_', $method_name);
        $where   = array_combine($columns, $args);

        return self::find_all($where);
    }
}
```

<ol>
  <li>
    呼び出されたメソッド名が<code>find_all_by_*</code>(※<code>self::FIND_ALL_BY</code>)の書式なら、  
  </li>
  
  
  <li>
    メソッド名を<code>_and_</code>で千切って配列化し、  
  </li>
  
  
  <li>
    <a href="http://php.net/manual/ja/function.array-combine.php">array_combine()</a>関数を使用して<code>カラム名 => 値</code>の連想配列へ変換し、  
  </li>
  
  
  <li>
    それをfind_allメソッドへパスする
  </li>
  
</ol>

<p>
  という処理になっています。
</p>

<p>
  他のマジックメソッドの邪魔をしないために、<br />
  呼び出されたメソッドの名前が、<code>find_all_by_</code>で始まる場合のみ、処理するようにしています。
</p>

<p>
  使用イメージは以下の通りです。
</p>

```php

// "SELECT * FROM test WHERE id=1"
Test::find_all_by_id(1);

// "SELECT * FROM test WHERE name=Leko"
Test::find_all_by_name('Leko');

// "SELECT * FROM test WHERE name=Leko AND age=22"
Test::find_all_by_name_and_age('Leko', 22);

// "SELECT * FROM test WHERE name=Leko and created_at=2014-07-20 04:00:00"
Test::find_all_by_name_and_created_at('Leko', date('Y-m-d h:i:s'));
```

<p>
  <code>created_at</code>のように、カラム名にアンダースコアが混じっていても問題ありません。
</p>

<h3>
  FuelPHPに組み込んでみる
</h3>

<p>
  本題２です。上記のマジックメソッドを実用化してみます。
</p>

<p>
  FuelPHPを選んだ理由は、<br />
  メソッド名にアンダースコアを使うことを<a href="http://fuelphp.jp/docs/1.7/general/coding_standards.html#methods_standards">コーディング規約</a>にしているのと、<br />
  普段業務で使用しているため勝手がわかるという理由からです。
</p>

<p>
  また、自作した<code>find_all</code>メソッドは、<br />
  同等以上の機能がFuelPHPの<code>find_by</code>メソッドで実現されているためそちらを利用します。
</p>

<p>
  <strong>また、<code>find_by_*</code>というメソッドもサポートしています。</strong>
</p>

<p>
  ・・・気にせず実装します。<br />
  <code>_and_</code>があれば差別化できますし、車輪の再発明だとしても、勉強のためです。
</p>

<p>
  マジックメソッドをFuelPHPのモデルに組み込むと、下記のようになります。
</p>

```php

abstract class Model_Base extends Model_Crud
{
    const FIND_ALL_BY = 'find_all_by_';

    protected static $_table_name = 'hoges';

    public static function __callStatic($method_name, $args) {
        // メソッド名がfind_all_by_で始まる場合のみ解析を行う
        if(strpos($method_name, self::FIND_ALL_BY) === 0) {
            // find_all_by_を除去
            $method_name = str_replace(self::FIND_ALL_BY, '', $method_name);

            // カラム名 => 値の連想配列へ変換
            $columns = explode('_and_', $method_name);
            $where   = array_combine($columns, $args);

            return self::find_by($where);
        }
    }
}
```

<p>
  <code>find_all_by_</code>以外のメソッドには反応しないので、<br />
  FuelPHPの他のメソッドを邪魔することはありません。
</p>

<h2>
  PHPだってRailsっぽいことしたい
</h2>

<p>
  Railsは数回しか触ったことがなく、特に好きも嫌いも無いんですが、
</p>

<ul>
  <li>
    PHPだと古臭いコードになる
  </li>
  
  
  <li>
    PHPイケてない
  </li>
  
</ul>

<p>
  とか言われると、「意外と色々な機能あるよ」と悲しい気持ちになるので、今回の記事に至りました。
</p>

<p>
  <del>確かにイケてないし</del>文法や言語仕様の欠陥はどうしようもないですが、<br />
  今回の記事のように、Rubyちっくな機能も作れます。ダメダメではないよ！
</p>

<p>
  ただ、当然ながらマジックメソッドを使用すると動作速度に影響しますし、<br />
  あまりトリッキーなことはやらないほうが身のためかもしれません。
</p>

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
  
</div>