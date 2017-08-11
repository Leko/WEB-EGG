---
path: /post/should-use-delete-option-to-delete-git-branch-or-tag/
title: 'リモートのタグを一括削除するときは–deleteを使おうと思った話'
date: 2016-12-21T23:50:48+00:00
dsq_thread_id:
  - "5318199219"
categories:
  - 問題を解決した
tags:
  - Git
---
この記事は[12/19のGit Advent Calendar](http://qiita.com/advent-calendar/2016/git)の記事です。

ひょんなことから、リモートのGitサーバにある4000個のタグを一括削除することになりました。

タグ消すときは`git push origin :タグ名`でタグを消してたのですが、 4000個もあると丸一日待っても終わらないので、他に素早く消せる方法はないだろうか、 とコマンドを探していたら良いものを見つけた、という備忘録です。

※タグについて書きますがブランチにおいても同様です。

<!--more-->

## Git push origin :タグ名

:は区切り文字に相当しており、おそらく普段使っているように省略すると

```
git push origin master # 省略前
git push origin master:master # 省略後
```

のように扱われています。 これを応用すればローカルとリモートで異なるブランチ名にpushできるのですが、そんなことする得が無いので基本省略すると思います。

> :<dst> part can be omitted—​such a push will update a ref that <src> normally updates without any <refspec> on the command line. Otherwise, missing :<dst> means to update the same ref as the <src>. > — [Git – git-push Documentation](https://git-scm.com/docs/git-push)</src></dst></refspec></src></dst>

で、`:`を付けて左側に何も書かないと、「無とpushする」みたいな動作になります。 これに関しては、どこぞのTAS動画で「無を掴む」とか表現されたりするように、概念的に理解しようとするより、結果論で覚えたほうが早いと思います。

> Pushing an empty <src> allows you to delete the <dst> ref from the remote repository. > — [Git – git-push Documentation](https://git-scm.com/docs/git-push)</dst></src>

## Git push origin –delete タグ名

`git push --delete origin hogehoge` のようなコマンドを叩くとリモートブランチが削除されます。

> –delete > All listed refs are deleted from the remote repository. This is the same as prefixing all refs with a colon. > — [Git – git-push Documentation](https://git-scm.com/docs/git-push)

ただ、どうにも遅い。なんとかできないか調べてました。

push時に複数ブランチ・タグが指定できる
----------------------------------------

Git-pushは複数のブランチを一気にpushすることが可能だったようです。試したことがなかった。

`git push origin :hoge :foo :bar`のようにやれば、複数のブランチ・タグを一括削除できます。 もしくは`--delete`オプションをつけても内部挙動としては同じです。 １個ずつ指定していく場合と比べてめちゃくちゃ早いです。

どれくらい違うのか
----------------------------------------

タグを100個切ってリモートにあげてから、それを全部削除するまでの時間を図ってみました。 ネットワーク状況の揺れを最小限にするよう有線で試しましたが、それでも誤差はあると思います。

| 方法              | 時間        |
| --------------- | --------- |
| １個ずつ+`:`        | 8m40.951s |
| １個ずつ+`--delete` | 8m35.192s |
| 一括+`:`          | 0m14.854s |
| 一括+`--delete`   | 0m4.338s  |

はい、結果は歴然です。 **一括削除したほうが圧倒的に早いです** 。

まとめ
----------------------------------------

私は、破壊的な操作をショートハンドでやるのは怖い（1文字オプションも見間違い・勘違いが怖いので使わない）と思っているので、 セーフティという意味では十分意図通りの挙動と安全性を提供してくれていると思います。

ということで、これからはリモートにあるブランチやタグを一気にを消すときは`--delete`オプションを愛用すると思います。
