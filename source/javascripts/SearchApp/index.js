import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Context, Dispatcher } from 'almin'
import { shallowEqual } from 'shallow-equal-object'
import AppStoreGroup from '../store/AppStoreGroup'
import SearchApp from '../SearchApp'

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

ReactDOM.render(<Root appContext={appContext} />, document.getElementById('search'))
