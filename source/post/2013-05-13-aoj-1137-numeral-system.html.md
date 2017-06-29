---
path: /post/aoj-1137-numeral-system/
title: '[AOJ] 1137 Numeral System'
date: 2013-05-13T01:53:38+00:00
twitter_id:
  - "333627188173737984"
categories:
  - やってみた
tags:
  - AOJ
  - JavaScript
---
AOJの1137、Numeral SystemをJavaScriptで解きました。
  
入力の処理に時間を取られ、35分強かかってしまいました。

問題文は[こちら](http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=1137&lang=jp)

<!--more-->

文字列操作系の問題ですね。

replace＋evalというゴリ押しを真っ先に思いついたのですが、
  
前置詞の扱いが面倒 + ゴルフではないので真っ当に解くことに。

どれだけ重複が来るか不明でしたが、
  
メモ化の練習がてらキャッシュを使ってみました。

コード
----------------------------------------

\[js\] (function (input) { var decodeMCXI = function() { var cache = {}, table = { "m": 1000, "c": 100, "x": 10, "i": 1 }; return function(str) { // 文字列はこの順番で来ると仮定 var keywords = ["m", "c", "x", "i"], sum = 0;

            keywords.forEach(function(k) {
                var index = str.indexOf(k),
                    s;
                if ( index >= 0 ) {
                    // 先頭から一致したキーワードまで取り出す
                    s = str.slice(0, index + 1);
                    // キャッシュがあれば利用
                    if ( !cache[s] ) {
                        // 前置詞付きなら
                        if ( s.length == 2 ) {
                            var placeholder = parseInt(s[0]),
                                n = table[s[1]];
                        } else {
                            var placeholder = 1,
                                n = table[s[0]];
                        }
                        cache[s] = placeholder * n;
                    }
                    sum += cache[s];
                    str = str.replace(s, '');   // 取得した文を削除
                }
            });
            return sum;
        };
    }();
    var encodeMCXI = function() {
        var cache = {};
        return function(num) {
            var tmp = num;
            if ( !cache[num] ) {
                var placeholder, n, result = '';
                if ( tmp >= 1000 ) {
                    placeholder = ~~(tmp / 1000);
                    result += ( placeholder > 1 ? placeholder : '' ) + 'm';
                    tmp %= 1000;
                }
                if ( tmp >= 100 ) {
                    placeholder = ~~(tmp / 100);
                    result += ( placeholder > 1 ? placeholder : '' ) + 'c';
                    tmp %= 100;
                }
                if ( tmp >= 10 ) {
                    placeholder = ~~(tmp / 10);
                    result += ( placeholder > 1 ? placeholder : '' ) + 'x';
                    tmp %= 10;
                }
                if ( tmp > 0 ) {
                    result += ( tmp > 1 ? tmp : '' ) + 'i';
                }
                cache[num] = result;
            }
            return cache[num];
        }
    }();
    
    var inputs = input.replace(/r/g, '').split("n"),
        n;
    
    n = parseInt(inputs.shift());
    
    for ( var i = 0; i < n; i++ ) {
        var line = inputs.shift().split(' '),
            a = decodeMCXI(line[0]),
            b = decodeMCXI(line[1]);
        console.log(encodeMCXI(a+b));
    }
    

})(require("fs").readFileSync("/dev/stdin", "utf8"));
```

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>