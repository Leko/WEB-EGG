---
path: /post/how-to-fix-sublime-linter-in-japanese/
title: MacのSublimeLinterで日本語エラーが出る症状を治す方法
date: 2013-08-13T14:18:27+00:00
twitter_id:
  - "367158353270546432"
dsq_thread_id:
  - "3132828268"
image: /images/2013/08/20130813_sublimelinter1.jpg
categories:
  - 問題を解決した
tags:
  - Sublime Text2
---
こんにちは。  
SublimeText2で**SublimeLinter**という構文チェックパッケージを使っているのですが、  
いつからかアップデートがかかって、**日本語を含むコードがエラー**になってしまいました。

日本語というか、マルチバイト文字なんでしょうが、  
この不具合がタチ悪いのが、**コメントの中に日本語を含めてもエラー**になります。


![コメントの中に日本語を含めてもエラー](/images/2013/08/90f7e96e11d56ed0e19f02fae013ef9e1.png)



**なんという英語養成ギブス。**  
日本のエンジニアの未来は明るいかもしれませんが、  
日本語ゼロは不便なので直してみたいと思います。

<!--more-->

なぜエラーが起こるのか
----------------------------------------

[GithubのREADME](https://github.com/SublimeLinter/SublimeLinter)を読んだら書いてありました。

> On Mac OS X, you must install Node.js if you plan to edit JavaScript or CSS files that use non-ASCII characters in strings or comments, because JavaScriptCore is not Unicode-aware.

どうやら、このエラーはMac+JavaScript時のみ発生する不具合のようです。  
なぜjsだけダメなのかというと、  
他の言語と異なり、Nodejsのコマンドラインは入っていない場合が多いため、  
Nodejs依存ではなく、**JavaScriptCore**というMacのデフォルトjsエンジンを使っているようです。

このJavaScriptCoreがマルチバイト文字に対応していないため、  
**非ASCII文字**はエラーになるようです。

治らなかった対応策
----------------------------------------

> [Mac OS X + SublimeLinterでJavascriptの日本語エラーを回避する方法 \| kwLog](http://blog.makotokw.com/2012/11/06/mac-os-x-sublimelinter%E3%81%A7javascript%E3%81%AE%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%82%A8%E3%83%A9%E3%83%BC%E3%82%92%E5%9B%9E%E9%81%BF%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95/)

「SublimeLinter 日本語」でググるとまずこの記事が出てくるのですが、  
僕はこの記事の内容（Nodejsをインストールすれば勝手に治る）では治りませんでした。

もともとNodejsはインストールしてあったのですが、それが使われていない感じがします。  
Nodejsが使われているなら日本語エラー出ないし。  
ということで、**インストール済みのNodejsを使うように切り替える設定**がありそうだと思って探してみました。

治った対応策
----------------------------------------

> [解决Mac下SublimeLinter的Unsafe Characters警告 – 专注web前端开发](http://www.fantxi.com/blog/archives/mac-fix-js-lint/)

中国語は全く読めないのですが、タイトルに釣られて読んでみたら当たりでした。

> `設定>SublimeLinter>設定 - ユーザ`に以下を追加します。
> 
> "sublimelinter_executable_map": {  
> "javascript": "/Users/leon/.nvm/v0.10.8/bin/node" // which node  
> },

`which node`とコマンドを打って出てきたパスを設定するらしいです。

僕の場合boxen経由で入れているので、`/opt/boxen/nodenv/shims/node`でした。  
これをパッケージのユーザ設定に追加します。

```
"sublimelinter_executable_map": {
    "javascript": "/opt/boxen/nodenv/shims/node"
}
```

保存してSublimeTextを再起動したら治りました！


![コメントの中に日本語を含めてもエラーなし](/images/2013/08/ee9eefaa7f57d09488f344b5dc980a92.png)
