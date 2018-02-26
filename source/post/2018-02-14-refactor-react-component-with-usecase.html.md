---
title: React Componentの薄くし方、reduxにおけるユースケース層を考えてみる
date: 2017-02-15 11:55 JST
tags:
- JavaScript
- React
- Redux
---

こんにちは。れこです。

最近はReact Native+Reduxでネイティヴアプリを作ってます。  
非同期Actionには[redux-thunk][]を使用しています。  
Componentをなるべく薄く、状態を持たないようにしながら、現実世界に沿っていて開発がしやすく、防腐対策ができているぐらいの、ちょうどいい温度感を探っています。

NativeでもDOMでも"コンポーネント"という粒度で見たときに大きな違いはなく、Redux層とReact Componentをどう棲み分けるべきかという議論は共有していると思います。

半年くらい書いてみて個人的にしっくりくる形が定まってきたので、
いかにComponentからロジックを剥がし、コアとなるロジック≒ユースケースを独立させてテスタブルに保つかについて考えて見ました。

<!--more-->

まえおき
------------------------------------------------

本記事ではredux-thunkを用いるActionのことをThunkActionを表記します。


redux-thunkとは？
------------------------------------------------
Reduxで非同期のActionを行う方法として代表的なのが[redux-promise](https://github.com/acdlite/redux-promise)、[redux-saga](https://github.com/redux-saga/redux-saga)、そして[redux-thunk][]があるかなと思います。  
**個人的には圧倒的にredux-thunk推しです。**
具体的にどう良いかは、ケーススタディがある方が伝わりやすいと思うので、この記事を通じて書きます。

ThunkActionのざっくりした定義としては、

```js
import type { State, Dispatch } from 'redux'

type ThunkAction = (dispatch: Dispatch, getState: () => State) => Promise<void>

const someThunkAction = (): ThunkAction => async (dispatch, getState) => {
  // 現在のreduxStateの値を返す（同期）
  const beforeState = getState()

  // 何かPromiseを待ってdispatch。try-catchでエラーハンドリングも可能
  await somePromise
  dispatch(someActionCreator())

  // thunk-actionを結合できるし、それの完了を待てる
  await dispatch(someThunkAction2())

  // 特定のActionに反応するMiddlewareがPromiseを返す場合もawaitで待てる
  await dispatch(someActionCreatorWithMiddleware())

  // 一連の処理で変わった結果のstateが参照できる（途中参照も可能）
  const afterState = getState()
  // ...
}
```

上記のように、特定の形式の高階関数（戻り値の関数を便宜上ThunkActionと呼ぶ）を返す関数を定義します。
このActionをdispatchするには、

```js
await dispatch(someThunkAction())
```

と、通常のActionCreatorを扱うときのようにdispatchできます。  
なお、上記の書き方をした場合、**dispatchの戻り値はPromiseです**。

上記のように扱えるredux-thunkを活用し、コンポーネントからロジックを剥がしていきます。
導入方法についてはredux-thunkのリポジトリをご参照ください。ここでは説明を割愛します。

dispatchに引数を渡すためのmapStateToPropsをやめる
------------------------------------------------

例えばログイン処理に成功するとセッションやログインしたユーザの情報をredux stateに持つreducerがあったとして、  
**ログイン済みユーザが保持する何かしらのエンティティ（userId=ログイン済みユーザのID）をAPIから取得したい**
というケースはよくあると思います。

例えばこんな（良くない）実装が考えられるかなと思います。

```js
const getUserEntity = (user) => async (dispatch) => {
  // ユーザIDなどを見てAPIを叩く非同期処理
}

mapStateToProps(({ user }) => ({
  user,
})
mapDispatchToProps((dispatch) => ({
  async getUserEntity (user) {
    try {
      const userEntity = await getUserEntity(user)
      dispatch(setUserEntity(userEntity))
    } catch (error) {
      dispatch(setError(error))
    }
  }
})

// ...

const SomeComponent = ({ user, getUserEntity }) => (
  <TouchableOpacity onPress={() => getUserEntity(user)}>
    ...
  </TouchableOpacity>
)
```

container層に、getUserEntityの呼び出しとPromiseのハンドリングが混じっています。
さらに、**表示には使わない**userの値が、getUserEntityに値を渡すためだけにコンポーネントに渡っています。

ユーザIDをクライアントから渡すのか、それともセッションIDだけ渡してサーバサイドがユーザIDを処理するのか、その違いはこの議論の対象ではありません。
結局セッションIDをクライアントが渡さなければならない以上、上記の値の受け渡し問題が発生します。

redux-thunkを使用しない場合の回避策としては、Middlewareに状態管理ロジックをもたせたり、reduxのconnectの第3引数である[mergeProps](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)を利用するなどがあると思います。
Middlewareが複雑になると容易にスパゲティorピタゴラスイッチ化するので、私はいい手段とは思いません。

> connect関数を使っているとひとつ困ることがあって、それはmapDispatchToPropsの中でステートを知ることができないということです。
>
> &mdash; [react-reduxのconnectでmergePropsを活用する - Qiita](https://qiita.com/IzumiSy/items/10ce3b629e24e1cac164)

redux-thunkを使う場合は、ThunkActionの中でStateを見れるので、mergePropsのようなややこしい書き方をせずにすみます。

```js
const getUserEntity = () => async (dispatch, getState) => {
  const { user } = getState()
  try {
    const userEntity = await ... // ユーザIDなどを見て何か取得する処理
    dispatch(setUserEntity(userEntity))
  } catch (error) {
    dispatch(setError(error))
  }
}

mapStateToProps(() => ({})
mapDispatchToProps((dispatch) => ({
  getUserEntity () {
    dispatch(getUserEntity())
  }
})

// ...

const SomeComponent = ({ getUserEntity }) => (
  <TouchableOpacity onPress={getUserEntity}>
    ...
  </TouchableOpacity>
)
```

のように書くことができます。値の取り回しがシンプルかつ局所的になったと思います。

- mapStateToPropsからuserが消えた
- SomeComponentに渡すpropからuserが消えた
- **Componentから関数を呼び出し適切に引数を与えるという役割が消えた**
- **ThunkActionの中にのみロジックがあり、Componentはpropをイベントハンドラに繋ぐだけになった**

良くない書き方での大きな問題は、  
表示に使わない、Componentが知らなくていい値が、dispatchするためだけにpropとして渡されています。つまり、**getUserEntityを取り巻く一連の処理の正当性を確かめるために、mapStateToProps及びComponentを同時に確かめなければなりません**。
この挙動の正当性を確かめるために「mapStateToPropsやComponentが期待した通りに値を受け渡し、適切に関数を呼び出せていること」というしょうもないテストを書く必要があります。

一方redux-thunkを使った書き方では、そもそもmapStateToPropsの実装がなくなります。Componentはただ受け取ったpropを渡してるだけなのでテストする意義が薄くなります。getUserEntityだけをしっかりテストすれば良くなります。  
getUserEntityはredux-thunkが提供するミドルウェアに依存していますが、Reduxやredux-thunkは特定のプラットフォームに依存しないので、**テストが非常に書きやすくなります。**


SelectorパターンでStateの構造とロジックを分離する
------------------------------------------------

Selectorパターンとは、[reduxのComputing Derived Data](https://redux.js.org/docs/recipes/ComputingDerivedData.html)から発想を得た、本記事で名づけた造語です。  
**combineReducersされたオブジェクト（以下StateGroup）の構造を隠蔽**し、mapStateToPropsとThunkActionに防腐処理を施します。

例えば、ログイン済みユーザの情報を取り出す`getLoggedInUser`など、StateGroupの構造を把握し、Computedな値を取り出す処理がSelectorに該当します。  
**mapStateToPropsのstate加工処理が煩雑になった結果、utilやlib、commonなどに分離しがちなユーティリティ関数は、Selectorの原石**なのです。

例えば`getLoggedInUser`を実装するとしたら、以下のようになると思います

```js
// store(reducer)の定義
const initialState = {
  user: null,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user }
    default:
      return state
  }
}

const store = combineReducers({
  user: userReducer,
})

// ...

const getLoggedInUser = (state) => state.user.user
```

わざわざこんな小さな処理をラップする必要がある必要性はなんでしょうか。
表示するための値の整形（単位をつけたりカンマつけたり集計したり）はどんなにシンプルであってもロジックだからです。そして、いずれ肥大化しコードの重複が蔓延するためです。

各ThunkActionやcontainerがStateGroupに密結合していると、reducerをリファクタリングした時に、ThunkActionやComponentの値の受け渡しも一緒に変える必要があります。１限管理できていないため、バグをうむことがしばしばあります。

Flowなどの静的解析によって回避できることもありますが、各所のStateGroupの構造に依存した処理が蔓延り、リファクタリングが億劫になり、腐敗が進んでいきます。

Selectorの具体的な実装は、StateGroupを受け取り、任意の値を返す関数です。  
特定のreducerのみに関心を持つのではなく、StateGroup全体に関心を持ちます。

```js
const getUserId = (state) => state.user.id
const mapStateToProps = (state) => ({
  userId: getUserId(state),
})
```

と

```js
const getUserId = (userState) => userState.id
const mapStateToProps = (state) => ({
  userId: getUserId(state.user),
})
```

では大きく意味が違います。前者の方が良いselectorです。
呼び出す側がStateの構造を知らなくていいように、丸ごとstateを渡すのであって、`.user`のようにStateGroupの構造に関心を持ってはいけません。

Selectorは、mapStateToProps、ThunkActionどちらにも利用できることも大きなポイントです。  
例えばログインユーザの情報を表示するプロフィール画面なら

```js
const mapStateToProps = (state) => ({
  user: getLoggedInUser(state),
})
```

と書けますし、ログインユーザのエンティティを利用するThunkActionがあったとすれば

```js
const getUserEntity = () => (dispatch, getState) => {
  const user = getLoggedInUser(getState())
  // ...
}
```

と書けます。  
mapStateToPropsやThunkActionからStateGroupの構造を隠蔽でき、StateGroupの構造と表示/処理に必要な値を分離できる  
さらに、mapStateToPropsをテストするよりも粒度が小さいので、よりテスタブルです。

単に処理の共通化としても便利なので、Selectorです。


複数のreducerにまたがるThunkAction = UseCase
------------------------------------------------

selectorパターンによって、複数のreducerにまたがる値の計算をしやすくなった  
ReduxのActionCreatorは、特定のreducerに対応した処理になっているが、ThunkActionもまたreducer１つに対応しているのだろうか

ThunkActionは、しかるべき非同期処理を行い、ActionCreateを呼ぶか、直接Actionをdispatchするのが良いと思います。  
ThunkActionはActionよりも上位の概念であり、複数のActionを束ねる存在、個人的には**UseCase**と呼ぶのが妥当なんじゃないかと思っている。  
「ログインする」はユースケースなのか？ という原理的な話はさておき、便宜上ユースケースと呼んで差し支えないと思います。

ケーススタディ：validate → 本処理 → 画面遷移 + フィードバック
------------------------------------------------

モバイルアプリ（React Native）だと、フォームを含んだ画面であれば、だいたい該当すると思います。  
具体的な例を挙げながらユースケースがどのように実装できるか見ていきたい

### ログイン
例として、

1. ユーザ名、パスワードをバリデーションし、問題があればエラーをフィードバックする
1. ログインをリクエストする、失敗ならエラーをフィードバックする
1. ログインに成功したらダッシュボードへ遷移する

という処理で考えてみる。  
どのライブラリを使っているかなどの細かい事情は省略し、詳細な実装は適宜都合の良いように解釈していただきたい。  
あくまでイメージコードですという前提で見てもらえると理解が進みやすいと思います。

```js
type Credential = {
  email: string,
  password: string,
}

const login = (credential: Credential) => async (dispatch) => {
  try {
    await validateCredential(credential)
    const user = await apiClient.login(credential)
    await dispatch(setCurrentUser(user))
    dispatch(navigateTo('Dashboard'))
  } catch (error) {
    dispatch(feedbackError(error))
  }
}
```

`validateCredential`は`Promise<void>`な関数、  
`apiClient.login`はAPIサーバにHTTP通信してセッションを確立する処理、  
`setCurrentUser`は渡されたユーザをログインユーザとしてセットするActionCreator、  
`navigateTo`はその名前に対応する画面へ遷移するActionCreator、
`feedbackError`は**Middleware経由でエラーメッセージを[Alert.alert](https://facebook.github.io/react-native/docs/alert.html)**でユーザに表示するActionCreator  
という解釈です。

### ユーザエンティティの作成/編集/削除
例として、

1. 入力内容をバリデーションして、問題があればエラーをフィードバックする
1. APIリクエストして作成/編集/削除する、失敗ならエラーをフィードバックする
1. 成功したらそのエンティティの詳細/一覧へ遷移する
1. このとき「〜ました」とユーザへフィードバックをする

という処理で考えてみる。  
「設定画面からプロフィール編集画面に遷移した後、編集確定ボタンを押した後の処理」というイメージで書いてみた

```js
const UserProfile = {
  nickname: string,
  bio: string,
}

const updateProfile = (profile: UserProfile) => async (dispatch, getState) => {
  try {
    const user = getLoggedInUser(getState())
    if (!user) {
      dispatch(feedbackError(new Error('ログインしていません')))
      dispatch(navigateTo('Login'))
      return
    }

    await validateUserProfile(profile)
    const updatedProfile = await apiClient.updateProfile(user.id, profile)
    dispatch(setProfile(updatedProfile))
    dispatch(backTo('Settings'))
    dispatch(feedback('プロフィールを更新しました'))
  } catch (error) {
    dispatch(feedbackError(error))
  }
}
```

`getLoggedInUser`はログインユーザを取得するSelector、  
もしSelectorの値が不正ならエラーを出しつつログイン画面へ戻す、  
`validateUserProfile`で入力内容をバリデートして、  
`apiClient.updateProfile`で変更内容を反映するHTTPリクエストを送信し、  
保存に成功したらプロフィールを更新（`setProfile`）して設定画面へ戻る（`backTo`）、  
もし過程でエラーが発生したらユーザへそれをフィードバックする
というふうに記述できる。


Middlewareでプラットフォームとユースケースを分離する
------------------------------------------------

ユースケースとプラットフォームを分離しUniversalなコードを保つために、ミドルウェアを利用するといいと思います。  
製品コードではそのプラットフォームの依存を、テストコードではモックされた依存を渡すことが可能になる。  
前の章で記載した`feedbackError`と、それをAlertという副作用に変換するミドルウェアは例えば以下のようにになる。

```js
const feedbackError = (error: Error) => ({
  type: 'FEEDBACK',
  title: error.message,
})
```

```js
import type { Store, Next, Action } from 'redux'
import { Alert } from 'react-native'

interface FeedbackHandler = {
  alert (message: string): void
}

const createFeedbackMiddleware = (handler: FeedbackHandler) => (store: Store) => (next: Next) => (action: Action) => {
  const ret = next(action)

  if (action.type === 'FEEDBACK') {
    handler.alert(action.title)
  }

  return ret
}

const createStore(
  combineReducers({ ... }),
  applyMiddleware(
    createFeedbackMiddleware(Alert)
    // createFeedbackMiddleware({ alert() {} }) // テストでは雑にモック可能
  )
)
```

実際にはAlertが多重に表示されないようシーケンシャルに処理させたり、OKが押されたら〜などの細かい挙動制御が入るが、大枠としてはこうだ。  
このように、プラットフォームへの依存をMiddlewareに分離することで、ユースケースはUniversalになり、テスタビリティが向上する


テスタブルなユースケース
------------------------------------------------

長いところまでやってきたが、ここまでの対応で**ロジックのほぼ全てがテスト可能**になっている。

reducerやActionCreator、MiddlewareがUnitレベルでテストされている前提で、  
[reduxのAsync Action Creatorsのテストの書き方](https://redux.js.org/docs/recipes/WritingTests.html#async-action-creators)のように、ユースケースは「何が起こったか、そのペイロードは何か」だけをテストすれば良い。

ケーススタディで記載した`updateProfile`のテストを書くとすれば、例えばこのように記述できる

```js
import assert from 'assert'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [
  thunk,
  createFeedbackMiddleware({
    alert (title: string) {},
  }),
]

describe('updateProfile', () => {
  const mockStore = configureMockStore(middlewares)

  it('ログインしていない場合〜〜〜...', async () => {
    const expectedActions = [
      { type: 'FEEDBACK', title: 'ログインしていません' },
      { type: 'NAVIGATE_TO', route: 'Login' },
    ]

    const store = mockStore({ user: { user: null } })
    const actions = await store.dispatch(updateProfile())
    assert.deepEqual(actions, expectedActions)
  })

  it('バリデーションエラー〜〜〜...', async () => {
    const expectedActions = [
      { type: 'FEEDBACK', title: 'nicknameは必須です' },
    ]

    const store = mockStore({ user: { user: { ... } } })
    const actions = await store.dispatch(updateProfile({ bio: 'hogehoge' }))
    assert.deepEqual(actions, expectedActions)
  })

  it('正常に完了したら〜〜〜...', async () => {
    const profile = { nickname: 'Leko', bio: 'I am Leko' }
    const expectedActions = [
      { type: 'SET_PROFILE', profile: profile },
      { type: 'BACK_TO', route: 'Settings' },
      { type: 'FEEDBACK', title: 'プロフィールを更新しました' },
    ]

    const store = mockStore({ user: { user: { ... } } })
    const actions = await store.dispatch(updateProfile(profile))
    assert.deepEqual(actions, expectedActions)
  })
})
```

ユーザへのフィードバックの具体的な方法（プラットフォーム依存）を排除したことで、フィードバックしたことまで含めてテストが可能になった。  
ユースケースのテストが厚く書けて、なおかつコンポーネントの中身がごく薄い状態を保てている。


ライフサイクルを取り外す
------------------------------------------------

最後に、よくやりがちな処理として、`componentWillMount`や`componentDidMount`でAPIからデータをロードしてくる処理を起動すること  
Reduxの`map*ToProps`では最初の一回だけというライフサイクルを取り扱うことが難しいからだと思います。

例えばこんなHOCが改善の鍵にならないだろうか。

```js
const loadXXX = () => async (dispatch, getState) => {
  const xxx = await // 何かを非同期にロードする処理

  dispatch(loadSuccess(xxx))
}

const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => ({
  loadXXX () {
    dispatch(loadXXX())
  }
})

withLifecycle({
  componentWillMount () {
    this.props.loadXXX()
  },
})(connect(mapStateToProps, mapDispatchToProps)(Component))
```

この概念は[recomposeのlifecycle](https://github.com/acdlite/recompose/blob/master/docs/API.md#lifecycle)と等しいものだと思います。  
**ライフサイクルに応じたロジック**はComponentが関心を持つべきことではなく、その外側の世界に出すべき物事ではないだろうか、と最近思っている

これまでライフサイクルはComponentに書いていた私は、ライフサイクルの分離という発想に1週間くらいしっくり来ていなかった。  
この書き方に慣れてくると、Componentをclassで書かざるを得ない要因の多くを排除でき、コンポーネントを純粋なStateless Functionにしやすいので、こちらの方がより明確でシンプルだと感じるようになった。

これでもなおComponentが関心を持っていいライフサイクルは、ビュー層で発生するイベントの購読/解除だと思います  
例えばDOMの世界なら`IntersectionObserver`、RNでの１例を挙げるとしたらデバイスの回転（`Dimensions.addEventListener`）などが挙げられると思います。  
ただしAPIやキャッシュから何かを読んでくる処理や、WebSocketの接続/解除などはComponentが知らない方がいい世界のライフサイクルだと思います。


まとめ
------------------------------------------------

粒度はお好みで良いと思いますけど、結果としてはこのように住み分けると、Componentの内部/外部ともにすっきりすると思います

```
modules/    # １ファイル１reducer、それに紐づくActionCreatorの集まり
  user.js
selectors/  # １ファイル１Selector
  getLoggedInUser.js
usecase/    # １ファイル１Usecase、ThunkActionの集まり
  login.js
  logout.js
  getUserEntity.js
```

[redux-thunk]: https://github.com/gaearon/redux-thunk
