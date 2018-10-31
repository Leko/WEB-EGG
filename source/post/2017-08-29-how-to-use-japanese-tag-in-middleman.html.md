---
title: middleman-blogで日本語のタグのURLが空になる問題を解消する方法
date: 2017-08-29 11:55 JST
tags:
  - Middleman
---

こんにちは。  
Middleman で日本語のタグを使ったときに、そのタグの URL が空になってしまうことがあります。  
このブログでは日本語のタグも使えるようにしてありますが、一手間加える必要がありました。  
なぜそうなるのかと、どうすれば治るのかを残しておこうと思います。

<!--more-->

## はじめに

使用している gem とそのバージョンです

| gem            | Version |
| -------------- | ------- |
| middleman      | 4.2.1   |
| middleman-blog | 4.0.2   |

## 原因

```ruby
      ##
      # Get a path to the given tag, based on the :taglink setting.
      #
      # @param  tag [String] Tag name
      # @return     [String] Safe Tag URL
      ##
      def link( tag )
        apply_uri_template @tag_link_template, tag: safe_parameterize( tag )
      end
```

`middleman-blog`gem の中の`lib/middleman-blog/tag_pages.rb`にあります。  
`safe_parameterize`された結果が URL になるのですが、これが日本語が弾かれて空文字になります。

```ruby
      ##
      # Parametrize a string preserving any multi-byte characters
      # Reimplementation of this, preserves un-transliterate-able multibyte chars.
      #
      # @see http://api.rubyonrails.org/classes/ActiveSupport/Inflector.html#method-i-parameterize
      ##
      def safe_parameterize(str)
        parameterized_string = ::ActiveSupport::Inflector.transliterate(str.to_s)
        parameterized_string.parameterize
      end
```

`lib/middleman-blog/uri_templates.rb`に定義があります。  
ActiveSupport::Inflector#parameterize の説明は[こちら](https://apidock.com/rails/v4.2.7/ActiveSupport/Inflector/parameterize)を読むと良いと思います。

これらの処理が日本語というかマルチバイト文字を弾いてしまい、日本語のタグの URL が空になります。

## 対処法

`ActiveSupport::Inflector`に設定を渡したりして回避はできるそうなのですが、わざわざ日本語と英語のマッピング作るよりも、汎用的に％エンコードすればいいのでは？  
と思い、そんな感じで対処しました。  
結論としては[こちら](https://github.com/Leko/WEB-EGG/blob/master/config.rb#L7)の設定ファイルのような対処をとりました。

`after_configuration`フックで無理やりモンキーパッチ当ててますが、影響箇所わかってるしブログのビルドツールなのでこれくらいの対処でいいだろうと判断してます。

対処した内容としては、

```
    def link( tag )
      safe_tag = safe_parameterize(tag)
      safe_tag = URI.encode(tag) if safe_tag == ''
      apply_uri_template @tag_link_template, tag: safe_tag
    end
```

です。  
一度公開してしまってから問題に気づいたので、もともと`safe_parameterize`でうまくいっていた箇所はそのままに、空文字になってしまうものは％エンコードという対処をとりました。  
もし最初から気付いていれば全て％エンコードでもよかったと思います。

## さいごに

英語圏のツールは枯れててもマルチバイトに弱いことが多いので、ローカルで気をつけて動作確認しておくべきでした...  
同じ悩みを抱えている方がいらっしゃったら解決手段になれば幸いです。
