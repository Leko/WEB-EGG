import React, { Component } from 'react'
import { shallowEqual } from 'shallow-equal-object'
import SearchApp from './SearchApp'

export default class Root extends Component {
  unSubscribe: Function

  constructor (props) {
    super(props)
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
