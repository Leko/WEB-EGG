
React Componentの薄くし方、reduxにおけるユースケース層を考えてみる
==============================================================

こんにちは。れこです。  

最近はReact Native+Reduxでアプリケーションを書いてます。  
Componentをなるべく薄く、状態を持たないように、でもべき論ではなく現実世界に沿っていて開発がしやすく、防腐対策ができているちょうどいい温度感を探ってます。

本記事のおおよその構成要素は、redux-thunkの活用とHOCによるロジックとrenderの分離の話である。

非同期のActionには[redux-thunk](https://github.com/gaearon/redux-thunk)を使用しています。  
API通信するような処理や、AsyncStorageへの書き込みなどの副作用をThunkActionとして実装しています。  
その他アラートやpush通知の取り扱いなどのRNに密結合した副作用はMiddlewareとして実装しています。

ThunkAction+見た目上の副作用はMiddlewareという構成が、ReactのComponentを薄くする鍵となる

これから記載する多くのことは[やまたつ](https://twitter.com/yamatatsu193)氏からもらった発想なのだが、  
最初はあまりピンときてないまま、自分なりにコードを書きながら咀嚼した結果思ってることを記事にしているので、一応実体験に基づく言葉だと思う。

<!--more-->

まえおき
------------------------------------------------

本記事ではredux-thunkを用いたActionのことをThunkActionを表記する。


dispatchにstateの値を渡すためにmapStateToPropsを使わない
------------------------------------------------

まずはThunkActionを活用するための前提知識。  
redux-thunkのドキュメントをちゃんと読んでいなかったため、つい最近知った。  
ThunkActionの第二引数に`getState`という同期でStateを返してくれる関数が渡ってくる

例えばアプリにログインに成功するとユーザ情報を持つreducerがあったとして、  
「ログイン済みユーザが保持するなにがしかのエンティティを取得したい」というケースはよくあると思う  
ThunkActionがstateを見れると知らなかった私は

```js
const getMyEntity = (user) => async (dispatch) => {
  // ユーザIDなどを見て何か取得する処理
}

mapStateToProps(({ user }) => ({
  user,
})
mapDispatchToProps((dispatch) => ({
  getMyEntity (user) {
    dispatch(getMyEntity(user))
  }
})

// ...

const SomeComponent = ({ user, getMyEntity }) => (
  <TouchableOpacity onPress={() => getMyEntity(user)}>
    ...
  </TouchableOpacity>
)
```

みたいな書き方をしていた。  
こんな大げさな書き方をしなくても、ThunkAction配下で直接Stateを見れば良い

```js
const getMyEntity = () => async (dispatch, getState) => {
  const { user } = getState()
  // ユーザIDなどを見て何か取得する処理
}

mapStateToProps(() => ({})
mapDispatchToProps((dispatch) => ({
  getMyEntity () {
    dispatch(getMyEntity())
  }
})

// ...

const SomeComponent = ({ user, getMyEntity }) => (
  <TouchableOpacity onPress={getMyEntity}>
    ...
  </TouchableOpacity>
)
```

のように書くことができる。だいぶバケツリレーがシンプルになったと思う。  
悪い方の書き方がReact描くときの当たり前になっていたので普通に読めるのだけど、シンプルな姿に慣れると無駄に複雑な値の取り回しをしていたと感じるようになった。

悪い書き方での大きな問題は、  
表示に使わない、Componentが知らなくていい値が、dispatchするためだけにpropとして渡されている  
つまり**ロジックが成立するためには、mapStateToPropsとComponentによる値の正しい取り扱いが不可欠**になってしまうことが問題だと思う。  
そうなるとロジックの正当性を確かめるために「Componentが正しく関数を呼び出せていること」をテストしないといけなくなる。

ここがバグるというしょうもないことが稀によくあるので、テストしたい気持ちはわかる。  
でもComponentのテストはプラットフォームと密結合しているためとてもやりづらい。というか面倒臭い。可能なら書きたくない。

Stateが見れるようになったからといって、reducerは互いに独立しており、相互に関心を持つべきではないという考えもあると思う。  
それについては次の章で考えを述べたい。


SelectorパターンでStateの構造とロジックを分離する
------------------------------------------------

Selectorパターンという名前は、本記事で名づけたパターンであるが、概念自体は既存のものであると思う。  
combineReducersされたオブジェクト（以下StateGroup）の構造を隠蔽し、mapStateToPropsとThunkActionへ防腐処理を施すものだ

なぜこれが必要かというと、表示するための値の整形（単位をつけたりカンマつけたり集計したり）はどんなにシンプルであってもロジックだからだ

各ThunkActionがStateGroupに密結合していると、さまざまなcontainerにStateGroupの構造に依存した処理が発生する。  
これがコードを腐敗させる因子になると思っている  
reducerをリファクタすると、気づいたらThunkActionやComponentの値の受け渡しがバグっていることがある  
Flowなどの静的解析によって回避できる面もあるが、そもそもリファクタした時に一緒に書き換えるべきコードが多いのは精神衛生が良くない。  
リファクタが億劫になり、腐敗が進んでいく。いざ頑張って慎重になっても、割とバグる。

そこで活用したいのがSelectorパターンだ  
[reduxのComputing Derived Data](https://redux.js.org/docs/recipes/ComputingDerivedData.html)を読んでいたらしっくり来た。

Selectorは、StateGroupを受け取り、任意の値を返す関数だと定義づける。  
例えば、ログイン済みユーザの情報を取り出す`getLoggedInUser`など、StateGroupの構造を把握し、Computedな値を取り出す処理がSelectorだ。  
mapStateToPropsのstate加工処理が煩雑になり、utilやlibなどに分離しがちなユーティリティ関数は、実はSelectorの原石なのである。

例えば`getLoggedInUser`を実装するとしたら、こんな感じになると思う

```js
// store(reducer)の定義
const initialState = { user: null }
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

const getLoggedInUser = (state): ?User => state.user.user
```

Selectorは、mapStateToProps、ThunkActionどちらにも利用できる。  
例えばログインユーザの情報を表示するプロフィール画面なら

```js
const mapStateToProps = (state) => ({
  user: getLoggedInUser(state),
})
```

と書けるし、ログインユーザのエンティティを利用するThunkActionがあったとすれば

```js
const getMyEntity = () => (dispatch, getState) => {
  const user = getLoggedInUser(getState())
  // ...
}
```

と書くことができる。  
mapStateToPropsやThunkActionからStateGroupの構造を隠蔽することができ、StateGroupの構造と表示/処理に必要な値を分離することができる  
さらに、mapStateToPropsをテストするよりも粒度が小さいので、よりテスタブルである。

単に処理の共通化としても便利なので、ThunkAction云々に関わらずSelectorは採用するといいと思っている。


複数のreducerにまたがるThunkAction = UseCase
------------------------------------------------

selectorパターンによって、複数のreducerにまたがる値の計算をしやすくなった  
reduxのActionCreatorは、特定のreducerに対応した処理になっているが、ThunkActionもまたreducer１つに対応しているのだろうか

ThunkActionは、しかるべき非同期処理を行い、ActionCreateを呼ぶか、直接Actionをdispatchするのが良いと思う。  
ThunkActionはActionよりも上位の概念であり、複数のActionを束ねる存在、個人的には**UseCase**と呼ぶのが妥当なんじゃないかと思っている。  
「ログインする」はユースケースなのか？という原理的な話はさておき、便宜上ユースケースと呼んで差し支えないと思う。

ケーススタディ：validate → 本処理 → 画面遷移 + フィードバック
------------------------------------------------

モバイルアプリ（React Native）だと、フォームを含んだ画面であれば、だいたい該当すると思う。  
具体的な例を挙げながらユースケースがどのように実装できるか見ていきたい

### ログイン
例として、

1. ユーザ名、パスワードをバリデーションし、問題があればエラーをフィードバックする
1. ログインをリクエストする、失敗ならエラーをフィードバックする
1. ログインに成功したらダッシュボードへ遷移する

という処理で考えてみる。  
どのライブラリを使っているかなどの細かい事情は省略し、詳細な実装は適宜都合の良いように解釈していただきたい。  
あくまでイメージコードであるという前提で見てもらえると理解が進みやすいと思う。

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

ユースケースとプラットフォームを分離しUniversalなコードを保つために、ミドルウェアを利用するといいと思う。  
製品コードではそのプラットフォームの依存を、テストコードではモックされた依存を渡すことが可能になる。  
前の章で記載した`feedbackError`と、それをAlertという副作用に変換するミドルウェアは例えばこんな感じになる。

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
reduxの`map*ToProps`では最初の一回だけというライフサイクルを取り扱うことが難しいからだと思う。

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

この概念は[recomposeのlifecycle](https://github.com/acdlite/recompose/blob/master/docs/API.md#lifecycle)と等しいものだと思う。  
**ライフサイクルに応じたロジック**はComponentが関心を持つべきことではなく、その外側の世界に出すべき物事ではないだろうか、と最近思っている

これまでライフサイクルはComponentに書いていた私は、ライフサイクルの分離という発想に1週間くらいしっくり来ていなかった。  
この書き方に慣れてくると、Componentをclassで書かざるを得ない要因の多くを排除でき、コンポーネントを純粋なStateless Functionにしやすいので、こちらの方がより明確でシンプルだと感じるようになった。

これでもなおComponentが関心を持っていいライフサイクルは、ビュー層で発生するイベントの購読/解除だと思う  
例えばDOMの世界なら`IntersectionObserver`、RNでの１例を挙げるとしたらデバイスの回転（`Dimensions.addEventListener`）などが挙げられると思う。  
ただしAPIやキャッシュから何かを読んでくる処理や、Websocketの接続/解除などはComponentが知らない方がいい世界のライフサイクルだと思う。


まとめ
------------------------------------------------

粒度はお好みで良いと思うけど、結果としてはこのように住み分けると、Componentの内部/外部ともにすっきりすると思う

```
modules/    # １ファイル１reducer、それに紐づくActionCreatorの集まり
  user.js
selectors/  # １ファイル１Selector
  getLoggedInUser.js
usecase/    # １ファイル１Usecase、ThunkActionの集まり
  login.js
  logout.js
  getMyEntity.js
```
