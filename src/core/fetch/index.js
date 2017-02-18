import { get } from './ajax'
import { callHook } from '../init/lifecycle'
import { getCurrentRoot } from '../route/util'

export function fetchMixin (Docsify) {
  let last

  Docsify.prototype._fetch = function (cb) {
    const { path } = this.route
    const { loadNavbar, loadSidebar } = this.config
    const currentRoot = getCurrentRoot(path)

    // Abort last request
    last && last.abort && last.abort()

    last = get(this.$getFile(path), true)
    last.then(text => {
      this._renderMain(text)
      if (!loadSidebar) return cb()

      const fn = result => { this._renderSidebar(result); cb() }

      // Load sidebar
      get(this.$getFile(currentRoot + loadSidebar))
        .then(fn, _ => get(loadSidebar).then(fn))
    },
    _ => this._renderMain(null))

    // Load nav
    loadNavbar &&
    get(this.$getFile(currentRoot + loadNavbar))
      .then(
        this._renderNav,
        _ => get(loadNavbar).then(this._renderNav)
      )
  }
}

export function initFetch (vm) {
  vm._fetch(result => {
    vm.$resetEvents()
    callHook(vm, 'doneEach')
  })
}
