import { get } from './ajax'
import { callHook } from '../init/lifecycle'
import { getRoot } from '../route/util'
import { noop } from '../util/core'
import { scrollIntoView } from '../event/scroll'
import { getAndActive } from '../event/sidebar'

export function fetchMixin (Docsify) {
  let last

  Docsify.prototype._fetch = function (cb = noop) {
    const { path } = this.route
    const { loadNavbar, loadSidebar } = this.config
    const root = getRoot(path)

    // Abort last request
    last && last.abort && last.abort()

    last = get(this.$getFile(path), true)

    // Load main content
    last.then(text => {
      this._renderMain(text)
      if (!loadSidebar) return cb()

      const fn = result => { this._renderSidebar(result); cb() }

      // Load sidebar
      get(this.$getFile(root + loadSidebar))
        // fallback root navbar when fail
        .then(fn, _ => get(loadSidebar).then(fn))
    },
    _ => this._renderMain(null))

    // Load nav
    loadNavbar &&
    get(this.$getFile(root + loadNavbar))
      .then(
        text => this._renderNav(text),
        // fallback root navbar when fail
        _ => get(loadNavbar).then(text => this._renderNav(text))
      )
  }

  Docsify.prototype._fetchCover = function () {
    const { coverpage } = this.config
    const root = getRoot(this.route.path)

    if (this.route.path !== '/' || !coverpage) {
      this._renderCover()
      return
    }

    get(this.$getFile(root + coverpage))
      .then(text => this._renderCover(text))
  }
}

export function initFetch (vm) {
  vm._fetchCover(vm)
  vm._fetch(result => {
    scrollIntoView(vm.route.query.id)
    getAndActive('nav')
    callHook(vm, 'doneEach')
  })
}
