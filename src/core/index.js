import { initMixin } from './init'
import { routeMixin } from './route'
import { renderMixin } from './render'
import { fetchMixin } from './fetch'
import { eventMixin } from './event'
import initGlobalAPI from './global-api'

function Docsify () {
  this._init()
}

const proto = Docsify.prototype

initMixin(proto)
routeMixin(proto)
renderMixin(proto)
fetchMixin(proto)
eventMixin(proto)

/**
 * Global API
 */
initGlobalAPI()

/**
 * Run Docsify
 */

setTimeout(_ => new Docsify(), 0)
