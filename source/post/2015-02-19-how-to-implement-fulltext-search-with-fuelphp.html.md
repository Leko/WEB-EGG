---
path: /post/how-to-implement-fulltext-search-with-fuelphp/
title: FuelPHPでInnoDBの全文検索を利用してみる
date: 2015-02-19T13:00:47+00:00
twitter_id:
  - "568259135260590080"
dsq_thread_id:
  - "5316515685"
categories:
  - やってみた
tags:
  - PHP
  - FuelPHP
  - MySQL
---
こんにちは。お久しぶりの更新です。

「入力内容に対する類似テキストの検索」を実装する機会があったので、[FuelPHP](http://fuelphp.jp/docs/1.7/)でInnoDBの全文検索を利用してみました。  
とはいえFuel自体には全文検索をサポートする操作は特に無いので、だいたい自前で書きました。

手間無くそこそこの精度が出せたので、導入から使用例までメモとして残します。

<!--more-->

前提
----------------------------------------

このような環境での動作確認しています。

| 名前    | バージョン             |
| ----- | ----------------- |
| OS    | CentOS 6.5(64bit) |
| MySQL | 5.6.20            |
| PHP   | 5.4.37            |
| MeCab | 0.996             |

最低限必要なのはMySQLのバージョンです。  
**InnoDBのFULLTEXTインデックスはMySQL 5.6.4からのみ利用できます。**<sup id="fnref-754:1"><a href="#fn-754:1" rel="footnote">1</a></sup>

また、InnoDBのFULLTEXTは空白区切りの単語検索しか対応していない<sup id="fnref-754:2"><a href="#fn-754:2" rel="footnote">2</a></sup>ため、  
[Mecab](http://taku910.github.io/mecab/)を使用して分かち書きして保存・検索します。

MySQL, PHPはインストール済みの前提で話を進めます。  
また、Fuelの基本的な知識があり、セットアップは済んでいるものとします。  
MeCabは次の環境構築にてインストールしていきます。

環境構築
----------------------------------------

> phpでmecabを使う手順
    
> <http://qiita.com/Keech/items/3b51a60c89b9e803b256>

こちらの記事を参考に環境構築をしたのですが、自分の環境ではコピー&ペーストでは動かない箇所があったのでそれを込みでインストールコマンド全てを貼り付けます。

`sudo`は省略しているため、コマンドが動かない場合はルートになるか適宜sudoの追加をして下さい。

```shell
# my.cnfにInnoDBの全文検索用の設定を追加。既にして有れば不要です
sed -i -e 's|\[mysqld\]|[mysqld]\n#fulltext index\ninnodb_ft_min_token_size=2\n|' /etc/my.cnf

# --- Mecab
yum install -y gcc-c++
cd /tmp
wget https://mecab.googlecode.com/files/mecab-0.996.tar.gz
tar zxfv mecab-0.996.tar.gz
cd mecab-0.996
./configure --enable-utf8-only
make
make install

# --- Mecab IPAdic
wget https://mecab.googlecode.com/files/mecab-ipadic-2.7.0-20070801.tar.gz
tar zxfv mecab-ipadic-2.7.0-20070801.tar.gz
cd mecab-ipadic-2.7.0-20070801
./configure --with-mecab-config=../mecab-config --with-charset=utf8
make
make install

# --- php-mecab
yum install -y php-devel --enablerepo=remi
cd /tmp
wget https://github.com/rsky/php-mecab/archive/master.zip
unzip master.zip
cd php-mecab-master/mecab
phpize
./configure --with-php-config=/usr/bin/php-config --with-mecab=/usr/local/bin/mecab-config
make
make install
ln -s /usr/lib64/php/modules/mecab.so /etc/php.d
sed -i -e 's|; default extension directory\.|; default extension directory.\nextension=mecab.so|' /etc/php.ini
```

InnoDBの全文検索用の設定はこちらの記事が参考になりました。

> MySQL5.6でInnoDBのFULLTEXT INDEXで全文検索する <http://www.petitec.com/2013/04/mysql5-6-fulltext-index/>

インストールできたか確認しておきます。

```shell
$ echo '東京特許許可局局長' | mecab
東京  名詞,固有名詞,地域,一般,*,*,東京,トウキョウ,トーキョー
特許  名詞,サ変接続,*,*,*,*,特許,トッキョ,トッキョ
許可  名詞,サ変接続,*,*,*,*,許可,キョカ,キョカ
局   名詞,接尾,一般,*,*,*,局,キョク,キョク
局長  名詞,一般,*,*,*,*,局長,キョクチョウ,キョクチョー
EOS

$ php -i | grep -i mecab
mecab
MeCab Support => enabled
MeCab Library => 0.996 => 0.996
mecab.default_dicdir => no value => no value
mecab.default_rcfile => no value => no value
mecab.default_userdic => no value => no value
OLDPWD => /tmp/php-mecab-master/mecab
_SERVER["OLDPWD"] => /tmp/php-mecab-master/mecab
```

こんな感じの出力になっていればOKです。

全文検索用のカラムを追加する
----------------------------------------

今回は、「既に作成済みのテーブルに全文検索の仕組みを入れる」というシチュエーションで行きます。

記事用のサンプルとして、こんなテーブルが存在するとします。  
名前は適当に`books`とでもしておきます。

| カラム名    | 型           |
| ------- | ----------- |
| title   | VARCHAR(50) |
| content | TEXT        |

このテーブルに全文検索用のカラム`content_splited`を追加します。

| カラム名            | 型    |
| --------------- | ---- |
| content_splited | TEXT |

Fuelのマイグレーションファイルに直すとこんな感じです。

```php
<?php

namespace Fuel\Migrations;

class Add_content_splited_to_demands
{
    public function up()
    {
        \DBUtil::add_fields('books', array(
            'content_splited' => array(
                'type'  => 'text',
                'after' => 'content',
            ),
        ));

        \DBUtil::create_index('books', 'content_splited', 'content_splited', 'fulltext');
    }

    public function down()
    {
        \DBUtil::drop_fields('books', array(
            'content_splited'
        ));
    }
}
```

既にレコードが存在している場合、  
追加した分かち書き用カラムにcontentをパースした結果を足して更新する必要があるかと思いますが、この記事では本筋から外れるため割愛しています。

```shell
$ php oil r migrate
Performed migrations for app:default:
008_add_content_splited_to_books
```

マイグレーションを実行して動けばOKです。

分かち書きオブザーバを定義
----------------------------------------

`books`テーブルを扱う`Model_Book`クラスを作成します。  
他のテーブルとJOINしたり何だりが楽なので、後々を考えて`Orm\Model`を継承して実装します。

content_splitedは検索用のメタ情報のようなものなので、モデル内部で黙字的に更新されるべきです。  
コントローラがその存在を気にしなくて良いように内部で完結させます。

DBへの **INSERT前** と **UPDATE前** に、`content`カラムのデータを分かち書きして、  
`content_splited`カラムへ代入するオブザーバを作成します。

モデルの定義としてはこんなイメージです。

```php
<?php

class Model_Book extends \Orm\Model
{
    const DROP_WORD_LENGTH = 2;

    protected static $_properties = array(
        'id',
        'title',
        'content',
        'content_splited',
        'created_at',
        'updated_at',
    );

    protected static $_observers = array(
        'Orm\Observer_CreatedAt' => array(
            'events' => array('before_insert'),
            'mysql_timestamp' => true,
        ),
        'Orm\Observer_UpdatedAt' => array(
            'events' => array('before_insert', 'before_update'),
            'mysql_timestamp' => true,
        ),
        'Model\Observer\Wakati' = array(
            'events'           => array('before_insert', 'before_update'),
            'wakati_from'      => 'content',
            'wakati_to'        => 'content_splited',
            'drop_word_length' => self::DROP_WORD_LENGTH,
        ),
    );
}
```

オブザーバのコードはやや長くなるのでgistに上げました。  
環境構築時の設定で、2文字未満の単語は検索する際に無視する設定にしているので、2文字に満たない単語は保存しない処理が入っています。

> FuelPHPでMecabを使用して分かち書きするオブザーバ
    
> <https://gist.github.com/Leko/6c98685bdb048b949392#file-wakati-php>
> 
> Creating – Observers – Orm Package – FuelPHP ドキュメント <http://fuelphp.jp/docs/1.7/packages/orm/observers/creating.html>

分かち書きした結果を保存する
----------------------------------------

このオブザーバを使用することで、`content`プロパティに文章を指定して更新すれば、勝手に分かち書きした結果が`content_splited`に格納されるようになります。

```php
$book = Model_Book::forge();

// 青空文庫
// http://www.aozora.gr.jp/cards/000535/files/3612_20811.html
$book->title = '言いたい事と言わねばならない事と';
$book->content = '人動もすれば、私を以て、言いたいことを言うから、結局、幸福だとする。長いので略、本当は全部入れてます';

$book->save();
$book->content_splited; // => 'すれ を以て 言い たい こと 言う から 結局 幸福...略'
```

こんな感じです。

全文検索用のメソッドを作成する
----------------------------------------

お待ちかねの本題です。全文検索のメソッドを実装します。

全文検索は`MATCH(カラム名) AGAINST ('+ほげ +ふー +ばー' IN BOOLEAN MODE)`のように扱います。  
とてもざっくりした説明なので、詳しい説明は公式のリファレンスを参照して下さい。

`Orm`パッケージのクエリビルダは涙がでるほどイケてないので色々と気に食わない箇所がありますが、  
今回はサンプルなので動けばいいやということで。実装する際にはいい感じにメソッド化したほうが良いと思います。

[先ほどのgist](https://gist.github.com/Leko/6c98685bdb048b949392#file-book-php-L33)に上がっている`similarBooks`メソッドがこれにあたります。

本の内容（`content`カラム）まで検索キーワードに含めるとノイズが多すぎるので、タイトルだけを検索キーワードにしています。

> （言い訳）カラム名と検索用テキスト、ふるい落とす文字数を渡してwhereの中身を１個の`Database_Expression`のインスタンスとしてwhereに渡したかったのですが、
    
> まだ理解が浅いのかそもそもできないのか、うまくいかなかったので汚い書き方になっています。

全文検索用のメソッドを作成する
----------------------------------------

[先ほどの青空文庫の文章](http://www.aozora.gr.jp/cards/000535/files/3612_20811.html)を入れて、例えば

「幸福で愉快な陸軍が飛行機を奪われた」

など本文中に直接は出てこないが本文中の単語を含んだ文で検索をかけると、検索に引っかかります。

```php
$book = Model_Book::forge()
$book->title = '幸福で愉快な陸軍が飛行機を奪われた'
$book->similarBooks();  // => 青空文庫のレコードがマッチする
```

まとめ
----------------------------------------

駆け足で説明していきましたが、いかがでしたでしょうか。  
「全文検索」って言葉は知っていたけど実装したことはなかったので、「こんな言葉で引っかかるのか！ すげえ！」とデバッグしながら一人で盛り上がってました。

`mecab`の説明を一切出さずモデルの裏側に隠してしまったのですが、  
せっかく環境を作ったので、次は`mecab`と係り受け解析のライブラリとか使って文章の要約でもしてみようかなと思います。

<ol>
  <li id="fn-754:1">
    <a href="http://dev.mysql.com/doc/refman/5.6/en/fulltext-restrictions.html">12.9.5 Full-Text Restrictions</a> <a href="#fnref-754:1" rev="footnote">↩</a>
  </li>

  <li id="fn-754:2">
    <a href="http://y-ken.hatenablog.com/entry/mysql-casual-talks-vol4-innodb-fts">MySQL-5.6.4からの新機能「InnoDB FullText Search」を用いた全文検索エンジンのベンチマークLTをしました。#mysqlcasual</a> <a href="#fnref-754:2" rev="footnote">↩</a>
  </li>
</ol>  
  <div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
  </div>