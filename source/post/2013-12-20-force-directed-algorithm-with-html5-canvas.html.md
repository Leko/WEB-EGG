---
path: /post/force-directed-algorithm-with-html5-canvas/
title: jsとcanvasでグラフの描画(力学モデル)を実装した
date: 2013-12-20T15:12:10+00:00
twitter_id:
  - "413915035618930688"
image: /images/2013/12/canvas-graph.png
categories:
  - やってみた
tags:
  - CoffeeScript
  - HTML5 Canvas
  - JavaScript
---
こんにちは。

今回は、[力学モデル (グラフ描画アルゴリズム) &#8211; Wikipedia](http://ja.wikipedia.org/wiki/%E5%8A%9B%E5%AD%A6%E3%83%A2%E3%83%87%E3%83%AB_(%E3%82%B0%E3%83%A9%E3%83%95%E6%8F%8F%E7%94%BB%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0))というグラフを描画するための面白いアルゴリズムを見つけたので、
  
こいつをjavascript(CoffeeScript)とcanvasで実装してみました。

<!--more-->

動作デモ
----------------------------------------


まずはこちらを御覧ください。
  
５つの丸が、ふわふわ動いてバランス良い配置になると思います。

用語の整理
----------------------------------------


まず、グラフとは、**折れ線グラフ**や**円グラフ**のようなものではありません。
  
頂点と辺の集合で構成されている方のグラフです。

> [グラフ理論 &#8211; Wikipedia](http://ja.wikipedia.org/wiki/%E3%82%B0%E3%83%A9%E3%83%95%E7%90%86%E8%AB%96)

**グラフ**とは、↑のグラフのことで、
  
グラフの頂点のことを**ノード**
  
ノードの点と点を繋ぐ辺を**エッジ**と呼びます。

基本的な理論のおさらい
----------------------------------------


力学モデルのwikiに書いてある通りですが、少し噛み砕いてみます。

まず、ノードの座標決定には
  
**[クーロンの法則](http://www.mag2.com/sample/P0005602/html)**と**[フックの法則](http://www.wakariyasui.sakura.ne.jp/3-2-0-0/3-2-2-1dannseiryoku.html)**という法則が絡んできます。

どちらの法則も、
  
要は**ノード同士が引き合う/反発する力は徐々に安定へ収束**するというだけです。

この２つの法則を元に各ノード同士に働く力を計算し、
  
その力を元に座標を決定します。

ノードの実装
----------------------------------------


早速実装に移ります。
  
コードはCoffeeScriptで書きます。

まず、ノードに最低限必要な物は、
  
`x座標`, `y座標`, `半径`, `x方向の速度`, `y方向の速度`の５つです。

```coffeescript
# 文字とつながりを持った点
class Node
    constructor: (@x, @y, @r = 20) ->
        @vx = 0
        @vy = 0

    connect: (node) ->
        @connections.push node
```


ごくシンプル。

今回はそれに加えて、

  * 各ノードに固有のIDを持たせたい
  * 中にテキストを表示したい
  * ランダムに背景色をつけたい
  * ノード同士の接続情報をグラフではなくノード同士に持たせたい

ということで最終的に以下のような定義になりました。

```coffeescript
# 文字とつながりを持った点
class Node
    @_lastID = 0;
    colorPalette = ['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']

    constructor: (@value, @x, @y, @background, @r = 20) ->
        @id = Node._lastID++
        @connections = []
        @vx = 0
        @vy = 0

        idx = ~~(Math.random() * colorPalette.length)
        @background = colorPalette[idx] unless @background

    connect: (node) ->
        @connections.push node
```


グラフの実装
----------------------------------------


今回のキモ、力指向グラフです。
  
`balance`メソッドが、このグラフに属する各ノードの位置を計算します。

```coffeescript
# 力指向アルゴリズム
class ForceDirectedGraph
    # バネ定数: 大きいとノードの間隔が詰まる、クーロン数：大きいとノードの間隔が広がる
    @BOUNCE = 0.1         # バネ定数(BOUNCE < 0.1[推奨])
    @ATTENUATION = 0.8    # 減衰定数(ATTENUATION < 1[必須])
    @COULOMB = 600        # クーロン数

    constructor: (@nodes) ->

    add: (node) ->
        @nodes.push node

    connect: (a, b) ->
        @nodes[a].connect(@nodes[b])
        @nodes[b].connect(@nodes[a])

    balance: ->
        for targetNode in @nodes
            continue if targetNode.isFocus

            # このノードに作用する力
            fx = 0
            fy = 0

            # 自分以外全てのノードから受ける力をクーロンの法則を用いて計算
            for n in @nodes
                continue if targetNode == n

                distX = targetNode.x - n.x
                distY = targetNode.y - n.y
                rsq = distX * distX + distY * distY

                fx += ForceDirectedGraph.COULOMB * distX / rsq
                fy += ForceDirectedGraph.COULOMB * distY / rsq

            # 接続したノードから受けるバネのちからをフックの法則を用いて計算
            for n in targetNode.connections
                distX = n.x - targetNode.x
                distY = n.y - targetNode.y

                fx += ForceDirectedGraph.BOUNCE * distX
                fy += ForceDirectedGraph.BOUNCE * distY

            # 収束させるため速度を減衰
            targetNode.vx = (targetNode.vx + fx) * ForceDirectedGraph.ATTENUATION
            targetNode.vy = (targetNode.vy + fy) * ForceDirectedGraph.ATTENUATION

            # xy座標の決定
            targetNode.x += targetNode.vx
            targetNode.y += targetNode.vy
```


wikiに書いてある擬似コード、ほぼそのままだと思います。

Canvasユーティリティの作成
----------------------------------------


今回はcanvasで実装するので、さくっとcanvasのユーティリティを作ります。

```coffeescript
# canvasのユーティリティ
class Canvas
    constructor: (el) ->
        @ctx = el.getContext('2d')
        @width = el.width
        @height = el.height
        @elements = []

    # 描画する要素(今回は主にグラフ)を追加する
    add: (element) ->
        @elements.push element
        return @

    # キャンバスの状態を保ちつつ操作を行う
    keep: (fn) ->
        @ctx.save()
        @ctx.beginPath()
        fn()
        @ctx.closePath()
        @ctx.restore()

    # キャンバスをまっさらにする
    clear: ->
        @ctx.clearRect(0, 0, @width, @height)
        return @

    # キャンバスを塗りつぶす
    fill: (bg = '#000') ->
        @keep =>
            @ctx.fillStyle = bg
            @ctx.fillRect(0, 0, @width, @height)
        return @

    # 円の描画
    circle: (x, y, r, bg = '#000') ->
        @keep =>
            @ctx.fillStyle = bg
            @ctx.arc(x, y, r, 0, 2 * Math.PI)
            @ctx.fill()

    # 線分の描画
    line: (fromX, fromY, toX, toY, color = '#444', width = 2) ->
        @keep =>
            @ctx.strokeStyle = color
            @ctx.strokeWidth = width

            @ctx.moveTo(fromX, fromY)
            @ctx.lineTo(toX, toY)
            @ctx.stroke()

    # テキストを描画
    text: (txt, x, y, color = 'white', font = '14px bold') ->
        @keep =>
            @ctx.font = font
            @ctx.textAlign = 'center'
            @ctx.textBaseline = 'middle'
            @ctx.fillStyle = color
            @ctx.fillText(txt, x, y)

    # 追加した要素を描画
    draw: ->
        for el in @elements
            if el.constructor == ForceDirectedGraph
                @_drawGraph(el)

    # グラフを描画
    _drawGraph: (graph) ->
        connected = []
        for i in [0...graph.nodes.length]
            connected[i] = []

        for node, i in graph.nodes
            for n, j in node.connections
                continue if connected[i][j] || connected[j][i]

                connected[i][j] = true
                connected[j][i] = true
                @line(node.x, node.y, n.x, n.y)

        for node in graph.nodes
            @circle(node.x, node.y, node.r, node.background)
            @text(node.value, node.x, node.y)
```


`_drawGraph()`では、

  1. 接続されているノード同士を全て線分で繋ぐ
  2. 各ノードの背景を描画し、テキストを入れる

ということを行っています。

初期化処理
----------------------------------------


↑の３つだけではクラス定義でしかないので、初期化します。

最初の方はあまり意味がなく、canvasのサイズ調整をしているだけです。

いくつかノードを生成して、
  
そのノードのインデックスを渡して接続します。

そして、そのグラフのインスタンスをcanvasにadd（↑のCanvasクラスを参照）して、
  
50ミリ秒ごとに再描画をかけています。

```coffeescript
# init
do ($ = jQuery) ->
    random = (max) ->
        ~~(Math.random() * max)

    WIN_W = window.innerWidth
    WIN_H = window.innerHeight

    $canvas = $('#canvas')

    # canvasの初期化
    $canvas.attr('width': WIN_W, 'height': WIN_H)

    canvas = new Canvas($canvas[0])
    center = x: canvas.width / 2, y: canvas.height / 2

    # ノードを生成
    nodes = [
        new Node("A", center.x - 100 + random(200), center.y - 100 + random(200)),
        new Node("B", center.x - 100 + random(200), center.y - 100 + random(200)),
        new Node("C", center.x - 100 + random(200), center.y - 100 + random(200)),
        new Node("D", center.x - 100 + random(200), center.y - 100 + random(200)),
        new Node("E", center.x - 100 + random(200), center.y - 100 + random(200))
    ]

    # グラフを生成
    graph = new ForceDirectedGraph(nodes)

    # ノード同士を接続
    graph.connect(0, 4)
    graph.connect(0, 1)
    graph.connect(1, 4)
    graph.connect(1, 2)
    graph.connect(2, 4)
    graph.connect(2, 3)
    graph.connect(3, 4)
    graph.connect(3, 0)

    canvas.add graph

    # グラフを描画
    setInterval ->
        graph.balance()
        canvas.clear().fill('white')
        canvas.draw()
    , 50
```


というコードになっております。 コードベースでの解説となってしまいましたが、これで説明は以上です。

jsdo.itでも公開していますが、
  
一応zipのダウンロードリンクも貼っておきます。

<span class="removed_link" title="http://d.pr/f/gHXb">ダウンロード</span>

参考
----------------------------------------


 [&raquo; Force-based graph drawing in AS3](http://blog.ivank.net/force-based-graph-drawing-in-as3.html)

<div style="font-size:0px;height:0px;line-height:0px;margin:0;padding:0;clear:both">
</div>