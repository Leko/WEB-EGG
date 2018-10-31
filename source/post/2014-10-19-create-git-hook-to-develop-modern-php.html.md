---
path: /post/create-git-hook-to-develop-modern-php/
title: PHPで開発するためのgit hookを作った
date: 2014-10-19T03:48:17+00:00
twitter_id:
  - "523554239558078464"
dsq_thread_id:
  - "3131339785"
image: /images/2014/10/Untitled-1.png
categories:
  - 効率化
tags:
  - Git
  - PHP
---

こんにちは。  
久々の更新です。

最近<span class="removed_link" title="https://github.com/Leko/schema">Schema</span>というフレームワークを作っており、  
PHP での開発について色々と新たな知識を得る機会がたくさんあります。

そこでまずは開発環境の構築編として、最低限のお作法を担保する **Git の hook** を作成してみました。

<!--more-->

## 目的 – 5 箇条

**それくらいきちんとやれよ** という話に尽きるのですが、  
自動で確認してくれるに越したことはありません。  
プログラマは得てして機械的な確認が苦手な生き物です。楽することに全力であるべきです。

（マジレスをすると、人的要素を排除することで、うっかりや人為的なミスが無くなるので、より確実にコードの品質を担保できます。  
ただし、このチェックが通れば完璧というわけではないので、加えて動作確認やコードレビュー等の人的チェックも必要かと思います）。

と能書きはこのくらいにしておいて、具体的にやりたいことは以下の通りです。

- PHP の構文チェック
- PSR のお作法に反したコードが無いか
- 使用してない変数、あまりに長い命名、複雑なループ等を実装してないか
- composer.json は valid になっているか
- テストは通っているか

上記 5 点の確認をコミットする前に行い、どれか１つでもコケた場合は **コミットできない** という縛りを加えようと思います。  
さすがに業務や複数人でやるプロジェクトでこれは相当キツイので、  
いくらか縛りを外せば、ちょうどいい感じの制約になると思います。

それぞれの項目について説明していきます。

### 1. PHP の構文チェック

これは 5 番目のテストとかぶるのですが、  
たまに **自分が書いたコードを一度も実行・確認せずにコミットしやがる輩** が居て、pull した途端に動かなくなるということがあります。

そんなゴミクズ野郎にならないように、最低限構文エラー起こしてるコードはコミットしないためにチェックします。

### 2. PSR のお作法に反したコードが無いか

PHP のコーディング標準として、[PSR](http://www.php-fig.org/)というものが挙げられています。

- [PSR0](http://www.php-fig.org/psr/psr-0/): クラスのオートロードの規則について
- [PSR1](http://www.php-fig.org/psr/psr-1/): エンコーディングや命名規則などコーディング規則について
- [PSR2](http://www.php-fig.org/psr/psr-2/): PSR1 に加えてインデントやより詳しいコーディング規則について

コミットの制約に加えるか否かはさておき、読んでおいて損はない規約だと思います。

あと 3 と 4 もあるのですが、とりあえずこれだけ知っておけば問題ないので割愛します。 これら一般的なコーディング規則に則ったコードになっているかをチェックしていきます。

### 3. 使用してない変数、あまりに長い命名、複雑なループ等を実装してないか

**書いてる途中で気付けよ** というお話ではありますが、  
もしこのようなコードをうっかり書いてしまい、それに気づかずコミットしてしまわないようにコードの品質チェックを行います。

### 4. composer.json は valid になっているか

PHP には[composer](https://getcomposer.org/)という依存関係の解決ツールがあります。  
Ruby でいうとこの`Bundler`みたいなものです。

ナウい PHP 開発をしているなら`composer`の存在はほぼマストになっていると思います。  
昨今では、だいたいのライブラリが composer 経由でインストールできるようになっています。

私がよくやらかす`ケツカンマ問題`と`シングルクオートつけちゃう問題`のチェックをしてもらいたいがためのチェックです。

「ケツカンマ」とは、配列の末尾要素のあとにカンマをつけたりオブジェクトの末尾にカンマをつけてしまうアレです。  
js では IE9 以降ならケツカンマがきちんとパースされてしまうので、つい忘れがちですが JSON の書式としては不正です。  
シングルクオートは言わずもがな、JSON では不正な形式です。

<blockquote class="twitter-tweet" lang="ja">
  <p>
    「ケツカンマ問題」
  </p>&mdash; Sotaro KARASAWA© (@sotarok)   
  <a href="https://twitter.com/sotarok/status/197726558000136192">2012, 5月 2</a>
</blockquote>

### 5. テストは通っているか

「テストを書かずに実装だけドバドバ貯めていって、あとからテストを埋めてく」のはいささか危険です。  
私の経験談では、趣味でのコーディングではほぼ確実に途中で心が折れます。

最近上司の教えで、コードとテストコードを併せてレビューして頂いているのですが、  
実装と実装した分テストを書くのであれば、記述量がそこまで多くないのと、実装した直後なので割と仕様や考慮漏れに気づくことが出来ます。  
**これは良い習慣だ** と思ったので強制的に癖をつけようということで制約に追加しました。

あとは README の日本語チェックとかも入れたかったのですが、  
**色々やりすぎるとコミットできなくなって飽きる**  
と思ったので制約はこれくらいにしておきます。

上記の制約なら、普通にコード書いていれば問題ないはずの制約です。  
自分自身の「当たり前」のクオリティを上げるために矯正ギプスをはめます。

## 学習 – Git hook について

Git プロジェクトであれば、`./.git/hooks`の中に色々とファイルが入っています。

<span class="removed_link" title="http://blog.catatsuy.org/a/142">bare リポジトリで Git push されたら云々する</span>、とかにも使うやつです。

今回はコミット前にチェックをしたいので、`pre-commit`を使用します。  
hooks ディレクトリの中に`pre-commit.sample`というファイルがあるので、`.sample`を除去したファイルを複製します。

```shell
ls .git/hooks
cp .git/hooks/pre-commit.sample .git/hooks/pre-commit
```

エディタはなんでもいいので、複製した`pre-commit`を開いて下さい。

```shell
#!/bin/sh
#
# An example hook script to verify what is about to be committed.
# Called by "git commit" with no arguments.  The hook should
# exit with non-zero status after issuing an appropriate message if
# it wants to stop the commit.
#
# To enable this hook, rename this file to "pre-commit".

if git rev-parse --verify HEAD >/dev/null 2>&1
then
    against=HEAD
else
    # Initial commit: diff against an empty tree object
    against=4b825dc642cb6eb9a060e54bf8d69288fbee4904
fi

# If you want to allow non-ASCII filenames set this variable to true.
allownonascii=$(git config --bool hooks.allownonascii)

# Redirect output to stderr.
exec 1>&2

# --- 長いので割愛 ---
```

という感じのファイルになっていると思います。  
<del>まだ Git hook について詳しく知らないので上記掲載した部分はおまじないだと思ってます。</del>

このファイルを実行した時の終了コードが`1`なら、コミットが失敗するようにできています。

既に先駆者の方がいらっしゃったので、そちらをパクりつつ、拡張とカスタマイズを加えます。

> git の pre-commit hook を使って、綺麗な PHP ファイルしかコミットできないようにする  
> &mdash; http://blog.manaten.net/entry/645

先ほどの長いので割愛以下に、このコードを貼り付けて下さい。

```shell
IS_ERROR=0
# コミットされるファイルのうち、.phpで終わるもの
for FILE in `git status -uno --short | grep -E '^[AUM].*.php$'| cut -c3-`; do
    # シンタックスのチェック
    if php -l $FILE; then
        # PHPMDで未使用変数などのチェック
        if ! ./vendor/bin/phpmd $FILE text unusedcode,codesize,naming; then
            IS_ERROR=1
        fi
        # PSR準拠なコードかチェック
        if ! ./vendor/bin/php-cs-fixer fix $FILE --dry-run -v --diff; then
            IS_ERROR=1
        fi
    else
        IS_ERROR=1
    fi
done

# composer.jsonのバリデーション
if ! ./composer.phar validate; then
    IS_ERROR=1
fi

# テストを実行
if ! ./vendor/bin/phpunit -c tests/phpunit.xml; then
    echo "　　　　 ,、,,,、,,, "
    echo "　　　 _,,;' '\" '' ;;,, "
    echo "　　（rヽ,;''\"\"''゛゛;,ﾉｒ）　　　　 "
    echo "　　 ,; i ___　、___iヽ゛;,　　テスト書いてないとかお前それ@t_wadaの前でも同じ事言えんの？"
    echo "　 ,;'''|ヽ・〉〈・ノ |ﾞ ';, "
    echo "　 ,;''\"|　 　▼　　 |ﾞ゛';, "
    echo "　 ,;''　ヽ ＿人＿  /　,;'_ "
    echo " ／ｼ、    ヽ  ⌒⌒  /　 ﾘ　＼ "
    echo "|　　 \"ｒ,,｀\"'''ﾞ´　　,,ﾐ| "
    echo "|　　 　 ﾘ、　　　　,ﾘ　　 | "
    echo "|　　i 　゛ｒ、ﾉ,,ｒ\" i _ | "
    echo "|　　｀ー――-----------┴ ⌒´ ） "
    echo "（ヽ  _____________ ,, ＿´） "
    echo " （_⌒_______________ ,, ィ "
    echo "     T                 |"
    echo "     |                 |"

    IS_ERROR=1
fi

exit $IS_ERROR
</code>
```

テストを書かない人には[サバンナからお導き](https://twitter.com/gongoZ/status/521662328752709632)があるようなので、そちらを使わせていただきました。  
カバレッジの話になると閾値の調整が難しいのでカバレッジは見てません。判断基準は、テストに通るか否かです。テストがない場合も通ってしまいますが、そこは人力チェックで問題ない範囲でしょう。

参考元の記事では`php-cs-fixer`は勝手に修正を加えるようになっていたのですが、  
勝手に直されるのは性分じゃないので、自動的な修正はせず怒ってもらって、自分で修正するようにします。

この pre-commit の実行にはいくつかコマンドが必要なので、  
`composer.json`にこれらを追加しておいて下さい。

```json
"require-dev": {
  "phpmd/phpmd": "@stable",
  "fabpot/php-cs-fixer": "@stable",
  "phpunit/phpunit": "4.*"
}
```

## プロジェクト作成コマンドまとめ

これらを考慮し、新規プロジェクトを作成するときの最低限のコマンドをまとめます。

```shell
mkdir SOME_PROJECT
cd SOME_PROJECT
git init
# --- composer
curl -sS https://getcomposer.org/installer | php
./composer.phar init     # 必要事項を入力
vim composer.json # phpmd,php-cs-fixer,phpunitの指定を追加
./composer.phar install
echo vendor >> .gitignore
# --- PHPUnit
git clone  tests
rm -rf tests/.git
# --- git hook
cp .git/hooks/pre-commit.sample .git/hooks/pre-commit
vim .git/hooks/pre-commit # 先ほどのhookを貼り付け
# --- initial commit
touch README.md
git add .
git commit -m "initial commit"
```

PHPUnit の設定は結構面倒なので、gist にスケルトンを作っておき、それを`tests`というディレクトリ名で clone してます。  
ほかは特に変わったところはないと思います。

## まとめ

いかがでしたでしょうか。

PHP のプロジェクト作成と一口にとっても、色々と改良の余地がありそうです。 こんな感じで、少しでもウンコード発生率を下げましょう！ ！ ！

## 言い訳

冒頭に紹介した schema はまだこの記事を書く前に作成されたプロジェクトなので、PSR0 準拠できていません。  
ぼちぼちと修正中です。

> PHPMD – PHP Mess Detector  
> &mdash; http://phpmd.org/

<!---->

> The PHP Coding Standards Fixer for PSR-1 and PSR-2  
> &mdash; http://cs.sensiolabs.org/
