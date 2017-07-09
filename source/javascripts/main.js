// @flow
import LazyLoadApp from './LazyLoadApp'
import SearchApp from './SearchApp'
import { registerWorkers } from './ServiceWorker'
import swPrecacheConfig from '../../sw-precache-config'

registerWorkers([
  swPrecacheConfig.swFile
])
LazyLoadApp(document.querySelectorAll('.markdown img'))
