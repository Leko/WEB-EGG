// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { Dispatcher, Context } from 'almin'
import AppStoreGroup from './store/AppStoreGroup'
import SearchApp from './SearchApp'
import LazyLoadApp from './LazyLoadApp'
import { registerWorkers } from './ServiceWorker'
import swPrecacheConfig from '../../sw-precache-config'

// --- Init SearchApp
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

ReactDOM.render(<SearchApp appContext={appContext} />, document.getElementById('search'))

// --- Init LazyLoadApp
LazyLoadApp(document.querySelectorAll('.markdown img'))

// --- Init ServiceWorker
registerWorkers([
  swPrecacheConfig.swFile
])
