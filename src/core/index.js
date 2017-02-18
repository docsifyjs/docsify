import { initMixin } from './init'
import { routeMixin } from './route'
import { renderMixin } from './render'
import { fetchMixin } from './fetch'
import { eventMixin } from './event'
import initGlobalAPI from './global-api'

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
initGlobalAPI()

/**
 * Run Docsify
 */
setTimeout(() => new Docsify(), 0)
