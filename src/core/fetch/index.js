import { get } from './ajax'
import { callHook } from '../init/lifecycle'
import { getParentPath } from '../router/util'
import { noop } from '../util/core'
import { getAndActive } from '../event/sidebar'

function loadNested (path, file, next, vm, first) {
  path = first ? path : path.replace(/\/$/, '')
  path = getParentPath(path)

  if (!path) return

  get(vm.router.getFile(path + file))
    .then(next, _ => loadNested(path, file, next, vm))
}

export function fetchMixin (proto) {
  let last
  proto._fetch = function (cb = noop) {
    const { path } = this.route
    const { loadNavbar, loadSidebar } = this.config

    // Abort last request
    last && last.abort && last.abort()

    last = get(this.router.getFile(path), true)

    // Current page is html
    this.isHTML = /\.html$/g.test(path)

    const loadSideAndNav = () => {
      if (!loadSidebar) return cb()

      const fn = result => { this._renderSidebar(result); cb() }

      // Load sidebar
      loadNested(path, loadSidebar, fn, this, true)
    }

    // Load main content
    last.then((text, opt) => {
      this._renderMain(text, opt)
      loadSideAndNav()
    },
    _ => {
      this._renderMain(null)
      loadSideAndNav()
    })

    // Load nav
    loadNavbar &&
    loadNested(path, loadNavbar, text => this._renderNav(text), this, true)
  }

  proto._fetchCover = function () {
    const { coverpage } = this.config
    const root = getParentPath(this.route.path)
    const path = this.router.getFile(root + coverpage)

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
  const { loadSidebar } = vm.config

  // server-client renderer
  if (vm.rendered) {
    const activeEl = getAndActive(vm.router, '.sidebar-nav', true, true)
    if (loadSidebar && activeEl) {
      activeEl.parentNode.innerHTML += window.__SUB_SIDEBAR__
    }
    vm._bindEventOnRendered(activeEl)
    vm._fetchCover()
    vm.$resetEvents()
    callHook(vm, 'doneEach')
    callHook(vm, 'ready')
  } else {
    vm.$fetch(_ => callHook(vm, 'ready'))
  }
}
