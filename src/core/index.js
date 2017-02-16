import { initMixin } from './init'
import { routeMixin } from './route'
import { renderMixin } from './render'
import { fetchMixin } from './fetch'
import { eventMixin } from './event'
import * as util from './util'
import { get as load } from './fetch/ajax'
import * as routeUtil from './route/util'

function Docsify () {
  this._init()
}

initMixin(Docsify)
routeMixin(Docsify)
renderMixin(Docsify)
fetchMixin(Docsify)
eventMixin(Docsify)

/**
 * Global API
 */
window.Docsify = {
  util: util.merge({ load }, util, routeUtil)
}

/**
 * Run Docsify
 */
setTimeout(() => new Docsify(), 0)
