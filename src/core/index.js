import { initMixin } from './init'
import { routeMixin } from './route'
import { renderMixin } from './render'
import { fetchMixin } from './fetch'
import initGlobalAPI from './global-api'

function Docsify () {
  this._init()
}

initMixin(Docsify)
routeMixin(Docsify)
renderMixin(Docsify)
fetchMixin(Docsify)

/**
 * Global API
 */
initGlobalAPI()

/**
 * Run Docsify
 */
new Docsify()
