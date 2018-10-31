---
title: ReactのNew Context APIは便利だけどreduxを使うのはやめないと思った
date: 2018-04-10 10:30 JST
tags:
  - JavaScript
  - React
  - Redux
  - React Native
---

Redux の新しい Context API が発表され、2 ヶ月くらいが経過した。

> &mdash; [React’s ⚛️ new Context API – DailyJS – Medium](https://medium.com/dailyjs/reacts-%EF%B8%8F-new-context-api-70c9fe01596b)

私は少しバージョンの古い React を主に使っているため、しばらく情報を追わずにいたが、

> &mdash; [React の新 Context API と Redux is dead はどう関係するのか？ – terrierscript – Medium](https://medium.com/@terrierscript/react%E3%81%AE%E6%96%B0context-api%E3%81%A8redux-is-dead%E3%81%AF%E3%81%A9%E3%81%86%E9%96%A2%E4%BF%82%E3%81%99%E3%82%8B%E3%81%AE%E3%81%8B-6d12a32f2f0c)

> &mdash; [React v16 で実装された new Context API を使って、Redux へ別れを告げる - Qiita](https://qiita.com/loverails/items/50126e874b24ff984471)

などの記事が登場するようになったので、自分は新しい Context API とどう向き合うのかを考えてみた。

<!--more-->

## TL;DR

新しい Context API はとても有用で、それ自体は活用しようと思う。
ただし Context API が Redux を置き換えるものではないと思っており、引き続き Redux を使用する

## シンプルな利用方法

```js
const { Provider, Consumer } = React.createContext();

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
);

class App extends React.Component {
  state = {
    count: 0
  };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <Provider
        value={{
          state: this.state,
          increment: this.increment
        }}
      >
        <Counter />
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("container"));
```

このように使える。
`Provider`, `Consumer`という二役に分かれ、とても宣言的な API になったと思う。

これまでの Context は、`childContextTypes`、`getChildContext`、`contextTypes`など色々なメソッドをコンポーネントに実装して利用する、実質的なインタフェースとして機能していた。  
この方式では prop-types の利用も必須であるため、せっかく React 本体とは切り離されたライブラリをわざわざ npm install して利用することを強いられていた。  
それに比べると、はるかに扱いやすい API に変わったと思う。

軽い state 操作なら確かにこれだけでも足りるかもしれないし、多言語対応（文言定義）やテーマなど、宣言的に渡すデータにおいてはとても有用だと思う。

では、**Redux はこれだけで無くすことができるのだろうか？**
私は違うと思う。

## Context API だけで connect を実装してみる

Redux（というか React Redux）を「どこでも connect できて state を共有できる HoC」と捉えると、Context さえあれば事足りているのかもしれない。  
Context API だけを用いて、React Redux の connect っぽい関数を実現するとしたら、例えばこんな感じで雑に実装できる。

```js
const connectLike = (
  mapStateToProps,
  mapDispatchToProps
) => Component => props => (
  <Consumer>
    {context => (
      <Component
        {...props}
        {...mapStateToProps(context.state)}
        {...mapDispatchToProps(context.dispatch)}
      />
    )}
  </Consumer>
);
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
);

const mapStateToProps = state => ({ count: state.count });
const mapDispatchToProps = dispatch => ({
  increment() {
    // action, reducerを端折ったかなり簡素な実装
    dispatch(state => ({
      ...state,
      count: state.count + 1
    }));
  }
});

const Counter = connectLike(mapStateToProps, mapDispatchToProps)(
  CounterComponent
);

class App extends React.Component {
  state = {
    count: 0
  };

  reduce = reducer => {
    this.setState(reducer);
  };

  render() {
    return (
      <Provider
        value={{
          state: this.state,
          dispatch: this.reduce
        }}
      >
        <Counter />
      </Provider>
    );
  }
}
```

Redux の処理の大部分を端折って実現したが、connectLike の使い心地はそれっぽいものにはなったと思う。
では、**Redux を用いてやりたいことは、たったこれだけなのだろうか。**私は違うと思う。

## Redux ミドルウェア

私は、state 管理や Flux アーキテクチャを提供してくれる他に、何よりミドルウェアが Redux の魅力だと思っている。

まず、3rd パーティのミドルウェアが豊富にある。  
例えば、`redux-logger`のように開発時に便利なロガーだったり、`redux-thunk`のような非同期に対するアプローチ、`redux-persist`のような state の永続化などが挙げられる。

では Context を内部的に包み隠してくれる 3rd パーティのライブラリがたくさん登場したら Redux は不要なのだろうか。  
それでもまだ私は Redux に価値があると思っている。

なぜなら、3rd パーティなミドルウェアが豊富にあることもさることながら、  
**Action そのものと、Action handler を分離するために Redux Middleware を利用している**からだ。

## Action と Action handler

React Native の開発をしていると、どうしてもプラットフォームに依存する処理が多数登場する。  
例えば HTTP 通信や Push 通知、Alert、AsyncStorage など。  
ネイティブに限らず、web でも Ajax、LocalStorage や WebWorker など、プラットフォームに依存した処理は登場すると思う。

これらの処理がロジックの中に混じっていると非常にテストがしにくい。メンテナンスしにくく気軽じゃないテストになる。  
こういったプラットフォームに依存した処理を Middleware 側に逃して、ActionCreator や ThunkAction は Universal に書いておくと、とてもテストがしやすい。

例えばアラートを抽象化するとこのような感じにできると思う。  
このアクションが dispatch されると、別途書いてある Middleware 側でアラートを表示するように作れる。

```js
} catch (error) {
  dispatch(feedback({
    title: 'エラーが起こった',
    message: error.message,
  }))
}
```

このようにプラットフォームに依存した処理を Action creator の中に直接書かずに、Middleware の中に書く。
そうすると Middleware を apply しなければどの環境でも動く処理になり、「dispatch されたアクションは何か？」にだけ注力すればよくなる。

例が少なくて恐縮だが、ミドルウェアにプラットフォームへの依存を閉じ込めて使いたい私にとって、
**Context API は Redux を置き換えるものではない**と思った。

なお、Redux に過度に拘っているわけではない。ミドルウェアを扱う処理は[たかだか 20 行程度](https://github.com/reactjs/redux/blob/a804207a890e40668643700d81f6a5c7cb78a9dc/src/applyMiddleware.js#L19-L42)なので、いざとなればオレオレで置き換えることもできる。

ただ、メンテナンスされているライブラリがあるならば、わざわざオレオレ実装する意味はなく、それを利用したらいいと思っている。

## 最後に

Context について触れている記事を読んでいて、「大規模なら Redux を使うケースもある」とかふわっとした意見が多いなと思ったので、
具体的になぜ Redux が必要なのかの一ケースについて書きたかった。

Action/Action handler(Middleware)の考えは、CQRS の狭義の Command/Command handler と捉えることもできそうだなと思った。  
`redux-thunk`とミドルウェアと活用したユースケース駆動開発についてはもっと詳しく書きたいので、別途記事を書こうと思う。

以上、私にとっての Redux はこんな感じでした。  
誰かにとっての Redux が、あなたにとっての Redux だとは限らないので、あなたにとって Redux は何であって何ではないのか、という記事が増えると色々な目線が得られてとても勉強になるので、記事たくさん書かれてほしい。
