import { get } from './ajax'
import { callHook } from '../init/lifecycle'
import { getRoot } from '../route/util'
import { noop } from '../util/core'

export function fetchMixin (proto) {
  let last
  proto._fetch = function (cb = noop) {
    const { path } = this.route
    const { loadNavbar, loadSidebar } = this.config
    const root = getRoot(path)

    // Abort last request
    last && last.abort && last.abort()

    last = get(this.$getFile(path), true)

    // Current page is html
    this.isHTML = /\.html$/g.test(path)

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

  proto._fetchCover = function () {
    const { coverpage } = this.config
    const root = getRoot(this.route.path)
    const path = this.$getFile(root + coverpage)

    if (this.route.path !== '/' || !coverpage) {
      this._renderCover()
      return
    }

    this.coverIsHTML = /\.html$/g.test(path)
    get(path)
      .then(text => this._renderCover(text))
  }

  proto.$fetch = function (cb = noop) {
    this._fetchCover()
    this._fetch(result => {
      this.$resetEvents()
      callHook(this, 'doneEach')
      cb()
    })
  }
}

export function initFetch (vm) {
  vm.$fetch(_ => callHook(vm, 'ready'))
}
