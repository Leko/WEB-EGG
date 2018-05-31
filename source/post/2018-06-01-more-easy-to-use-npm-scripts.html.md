---
title: pecoでnpm-scriptsをタブ補完でもっと超簡単に実行したい
date: 2018-06-01 10:30 JST
tags:
- npm
- Bash
- peco
---

便乗ネタです。

> &mdash; [pecoでnpm-scriptsを超簡単に実行したい - Qiita](https://qiita.com/hogesuke_1/items/46f009f31b5f2ec8c02c)

という素晴らしい記事が上がり使ってみたのですが、
`npm run `まで打ってから「あれ、コマンドなんだっけ」と思い出して、入力内容を消して`nrun`を実行する、という一手間があったので、
もっと超簡単に実行できるように`npm run <TAB>`でpecoが起動するようにしてみました。

<!--more-->

## まえおき
Bashでのみ動作確認しております。
ZやFの方は別途記事書いていただけるとありがたいです。

また、元記事の通りにセットアップができていることを前提とします。

> &mdash; [pecoでnpm-scriptsを超簡単に実行したい - Qiita](https://qiita.com/hogesuke_1/items/46f009f31b5f2ec8c02c)

## npm run <TAB>でpecoを作動させる

> &mdash; [Bashタブ補完自作入門 - Cybozu Inside Out | サイボウズエンジニアのブログ](http://blog.cybozu.io/entry/2016/09/26/080000)

タブ補完に関しては、こちらの記事を参考にしました。

```sh
_npm_run_peco() {
    local cur prev cword
    _get_comp_words_by_ref -n : cur prev cword
    if [ "$prev" = "run" ]; then
        COMPREPLY=$(cat package.json | jq -r '.scripts | keys[]' | peco --query=$cur)
    fi
}
complete -F _npm_run_peco npm
```

このコードをbash_profileなどに書き込み、

```
source ~/.bash_profile
```

などと実行すれば反映されます。
短いですが一応解説すると、

- `_get_comp_words_by_ref`という便利関数で現在カーソルがある手前の単語が何かわかる
    - prevが`run`だったら処理するみたいにフィルタできる
    - curは現在カーソルがある単語を指すので、入力途中のスクリプトをpecoの初期クエリに食わせる
- `complete -F フックさせたい関数名 補完対象にするコマンド`を実行すると、タブ補完が有効になる
- `COMPREPLY`に値をセットすると、補完される文字列になる
    - pecoで選ばれた値をセットする

というコードになります

## 動作デモ

![動作デモ](/images/2018/more-more-easy-to-use-npm-run-script/npm-run-tab-completion.gif)

快適٩( 'ω' )و
