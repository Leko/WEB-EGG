---
title: ReactのNew Context APIは便利だけどreduxを使うのはやめないと思った
date: 2018-04-10T10:30:00+0900
tags:
- JavaScript
- React
- Redux
- React Native
---

Reduxの新しいContext APIが発表され、2ヶ月くらいが経過した。

> &mdash; [React’s ⚛️ new Context API – DailyJS – Medium](https://medium.com/dailyjs/reacts-%EF%B8%8F-new-context-api-70c9fe01596b)

私は少しバージョンの古いReactを主に使っているため、しばらく情報を追わずにいたが、

> &mdash; [Reactの新Context APIとRedux is deadはどう関係するのか？ – terrierscript – Medium](https://medium.com/@terrierscript/react%E3%81%AE%E6%96%B0context-api%E3%81%A8redux-is-dead%E3%81%AF%E3%81%A9%E3%81%86%E9%96%A2%E4%BF%82%E3%81%99%E3%82%8B%E3%81%AE%E3%81%8B-6d12a32f2f0c)

> &mdash; [React v16で実装された new Context APIを使って、Reduxへ別れを告げる - Qiita](https://qiita.com/loverails/items/50126e874b24ff984471)

などの記事が登場するようになったので、自分は新しいContext APIとどう向き合うのかを考えてみた。

<!--more-->

## TL;DR
新しいContext APIはとても有用で、それ自体は活用しようと思う。
ただしContext APIがReduxを置き換えるものではないと思っており、引き続きReduxを使用する

## シンプルな利用方法
```js
const { Provider, Consumer } = React.createContext()

const Counter = () => (
  <Consumer>
    {({ state, increment }) => (
      <React.Fragment>
        <div>
          <span>Count:</span>
          <span>{state.count}</span>
        </div>
        <button onClick={increment}>+1</button>
      </React.Fragment>
    )}
  </Consumer>
)

class App extends React.Component {
  state = {
  	count: 0,
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render () {
    return (
      <Provider value={{
        state: this.state,
        increment: this.increment,
      }}>
        <Counter />
      </Provider>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
```

このように使える。
`Provider`, `Consumer`という二役に分かれ、とても宣言的なAPIになったと思う。

これまでのContextは、`childContextTypes`、`getChildContext`、`contextTypes`など色々なメソッドをコンポーネントに実装して利用する、実質的なインタフェースとして機能していた。  
この方式ではprop-typesの利用も必須であるため、せっかくReact本体とは切り離されたライブラリをわざわざnpm installして利用することを強いられていた。  
それに比べると、はるかに扱いやすいAPIに変わったと思う。

軽いstate操作なら確かにこれだけでも足りるかもしれないし、多言語対応（文言定義）やテーマなど、宣言的に渡すデータにおいてはとても有用だと思う。

では、**Reduxはこれだけで無くすことができるのだろうか？**
私は違うと思う。

## Context APIだけでconnectを実装してみる
Redux（というかReact Redux）を「どこでもconnectできてstateを共有できるHoC」と捉えると、Contextさえあれば事足りているのかもしれない。  
Context APIだけを用いて、React Reduxのconnectっぽい関数を実現するとしたら、例えばこんな感じで雑に実装できる。

```js
const connectLike = (mapStateToProps, mapDispatchToProps) => (Component) => (props) => (
  <Consumer>
    {(context) => (
      <Component
        {...props}
        {...mapStateToProps(context.state)}
        {...mapDispatchToProps(context.dispatch)}
      />
    )}
  </Consumer>
)
```

これを利用して先ほどのサンプルコードを置き換えると、このように書けると思う

```js
const CounterComponent = ({ count, increment }) => (
  <React.Fragment>
    <div>
      <span>Count:</span>
      <span>{count}</span>
    </div>
    <button onClick={increment}>+1</button>
  </React.Fragment>
)

const mapStateToProps = (state) => ({ count: state.count })
const mapDispatchToProps = (dispatch) => ({
  increment () {
    // action, reducerを端折ったかなり簡素な実装
    dispatch((state) => ({
      ...state,
      count: state.count + 1,
    }))
  },
})

const Counter = connectLike(mapStateToProps, mapDispatchToProps)(CounterComponent)

class App extends React.Component {
  state = {
  	count: 0,
  }

  reduce = (reducer) => {
    this.setState(reducer)
  }

  render () {
    return (
      <Provider value={{
        state: this.state,
      	dispatch: this.reduce,
      }}>
        <Counter />
      </Provider>
    )
  }
}
```

Reduxの処理の大部分を端折って実現したが、connectLikeの使い心地はそれっぽいものにはなったと思う。
では、**Reduxを用いてやりたいことは、たったこれだけなのだろうか。**私は違うと思う。

## Reduxミドルウェア
私は、state管理やFluxアーキテクチャを提供してくれる他に、何よりミドルウェアがReduxの魅力だと思っている。

まず、3rdパーティのミドルウェアが豊富にある。  
例えば、`redux-logger`のように開発時に便利なロガーだったり、`redux-thunk`のような非同期に対するアプローチ、`redux-persist`のようなstateの永続化などが挙げられる。

ではContextを内部的に包み隠してくれる3rdパーティのライブラリがたくさん登場したらReduxは不要なのだろうか。  
それでもまだ私はReduxに価値があると思っている。

なぜなら、3rdパーティなミドルウェアが豊富にあることもさることながら、  
**Actionそのものと、Action handlerを分離するためにRedux Middlewareを利用している**からだ。

## ActionとAction handler
React Nativeの開発をしていると、どうしてもプラットフォームに依存する処理が多数登場する。  
例えばHTTP通信やPush通知、Alert、AsyncStorageなど。  
ネイティブに限らず、webでもAjax、LocalStorageやWebWorkerなど、プラットフォームに依存した処理は登場すると思う。

これらの処理がロジックの中に混じっていると非常にテストがしにくい。メンテナンスしにくく気軽じゃないテストになる。  
こういったプラットフォームに依存した処理をMiddleware側に逃して、ActionCreatorやThunkActionはUniversalに書いておくと、とてもテストがしやすい。

例えばアラートを抽象化するとこのような感じにできると思う。  
このアクションがdispatchされると、別途書いてあるMiddleware側でアラートを表示するように作れる。

```js
} catch (error) {
  dispatch(feedback({
    title: 'エラーが起こった',
    message: error.message,
  }))
}
```

このようにプラットフォームに依存した処理をAction creatorの中に直接書かずに、Middlewareの中に書く。
そうするとMiddlewareをapplyしなければどの環境でも動く処理になり、「dispatchされたアクションは何か？」にだけ注力すればよくなる。

例が少なくて恐縮だが、ミドルウェアにプラットフォームへの依存を閉じ込めて使いたい私にとって、
**Context APIはReduxを置き換えるものではない**と思った。

なお、Reduxに過度に拘っているわけではない。ミドルウェアを扱う処理は[たかだか20行程度](https://github.com/reactjs/redux/blob/a804207a890e40668643700d81f6a5c7cb78a9dc/src/applyMiddleware.js#L19-L42)なので、いざとなればオレオレで置き換えることもできる。

ただ、メンテナンスされているライブラリがあるならば、わざわざオレオレ実装する意味はなく、それを利用したらいいと思っている。

## 最後に
Contextについて触れている記事を読んでいて、「大規模ならReduxを使うケースもある」とかふわっとした意見が多いなと思ったので、
具体的になぜReduxが必要なのかの一ケースについて書きたかった。

Action/Action handler(Middleware)の考えは、CQRSの狭義のCommand/Command handlerと捉えることもできそうだなと思った。  
`redux-thunk`とミドルウェアと活用したユースケース駆動開発についてはもっと詳しく書きたいので、別途記事を書こうと思う。

以上、私にとってのReduxはこんな感じでした。  
誰かにとってのReduxが、あなたにとってのReduxだとは限らないので、あなたにとってReduxは何であって何ではないのか、という記事が増えると色々な目線が得られてとても勉強になるので、記事たくさん書かれてほしい。
