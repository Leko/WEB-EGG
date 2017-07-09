// @flow
import Promise from 'bluebird'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Context, Dispatcher } from 'almin'
import { shallowEqual } from 'shallow-equal-object'
import AppStoreGroup from './store/AppStoreGroup'
import SearchApp from './SearchApp'
import { registerWorkers } from './ServiceWorker'
import swPrecacheConfig from '../../sw-precache-config'

const dispatcher = new Dispatcher()
const appContext = new Context({
  dispatcher,
  store: AppStoreGroup.create()
})

if (process.env.NODE_ENV !== 'production') {
  const ContextLogger = require('almin-logger')
  const logger = new ContextLogger()
  logger.startLogging(appContext)
}

class Root extends Component {
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
      <SearchApp appContext={appContext} {...this.state} />
    )
  }
}

// const Root = AlminReactContainer.create(SearchApp, appContext)
ReactDOM.render(<Root appContext={appContext} />, document.getElementById('search'))

registerWorkers([
  swPrecacheConfig.swFile
])
