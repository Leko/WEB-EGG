// @flow
import type { Context } from 'almin'
import type PostState from '../store/PostState'
import React, { Component } from 'react'
import { shallowEqual } from 'shallow-equal-object'
import SearchApp from './SearchApp'

type Props = {
  appContext: Context,
}
type State = {
  postState: PostState
}

export default class Root extends Component<Props, State> {
  state: State
  unSubscribe: Function

  constructor (props: Props) {
    super(props)
    // $FlowFixMe
    this.state = props.appContext.getState()
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return !shallowEqual(this.state, nextState)
  }

  componentWillMount () {
    const context = this.props.appContext
    const handleChange = () => {
      // $FlowFixMe
      this.setState(context.getState())
    }
    this.unSubscribe = context.onChange(handleChange)
  }

  componentWillUnmount () {
    if (typeof this.unSubscribe === "function") {
      this.unSubscribe()
    }
  }

  render () {
    return (
      <SearchApp appContext={this.props.appContext} {...this.state} />
    )
  }
}
