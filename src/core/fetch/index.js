import { get } from './ajax'
import { callHook } from '../init/lifecycle'
import { getParentPath, stringifyQuery } from '../router/util'
import { noop } from '../util/core'
import { getAndActive } from '../event/sidebar'

function loadNested (path, qs, file, next, vm, first) {
  path = first ? path : path.replace(/\/$/, '')
  path = getParentPath(path)

  if (!path) return

  get(
    vm.router.getFile(path + file) + qs,
    false,
    vm.config.requestHeaders
  ).then(next, _ => loadNested(path, qs, file, next, vm))
}

export function fetchMixin (proto) {
  let last
  proto._fetch = function (cb = noop) {
    const { path, query } = this.route
    const qs = stringifyQuery(query, ['id'])
    const { loadNavbar, loadSidebar, requestHeaders } = this.config

    // Abort last request
    last && last.abort && last.abort()

    const file = this.router.getFile(path)

    last = get(file + qs, true, requestHeaders)

    // Current page is html
    this.isHTML = /\.html$/g.test(file)

    const loadSideAndNav = () => {
      if (!loadSidebar) return cb()

      const fn = result => {
        this._renderSidebar(result)
        cb()
      }

      // Load sidebar
      loadNested(path, qs, loadSidebar, fn, this, true)
    }

    // Load main content
    last.then(
      (text, opt) => {
        this._renderMain(text, opt, loadSideAndNav)
      },
      _ => {
        this._renderMain(null, {}, loadSideAndNav)
      }
    )

    // Load nav
    loadNavbar &&
      loadNested(
        path,
        qs,
        loadNavbar,
        text => this._renderNav(text),
        this,
        true
      )
  }

  proto._fetchCover = function () {
    const { coverpage, requestHeaders } = this.config
    const query = this.route.query
    const root = getParentPath(this.route.path)

    if (coverpage) {
      let path = null
      const routePath = this.route.path
      if (typeof coverpage === 'string') {
        if (routePath === '/') {
          path = coverpage
        }
      } else if (Array.isArray(coverpage)) {
        path = coverpage.indexOf(routePath) > -1 && '_coverpage'
      } else {
        const cover = coverpage[routePath]
        path = cover === true ? '_coverpage' : cover
      }

      const coverOnly = !!path && this.config.onlyCover
      if (path) {
        path = this.router.getFile(root + path)
        this.coverIsHTML = /\.html$/g.test(path)
        get(path + stringifyQuery(query, ['id']), false, requestHeaders).then(
          text => this._renderCover(text, coverOnly)
        )
      } else {
        this._renderCover(null, coverOnly)
      }
      return coverOnly
    }
  }

  proto.$fetch = function (cb = noop) {
    const done = () => {
      callHook(this, 'doneEach')
      cb()
    }

    const onlyCover = this._fetchCover()

    if (onlyCover) {
      done()
    } else {
      this._fetch(result => {
        this.$resetEvents()
        done()
      })
    }
  }
}

export function initFetch (vm) {
  const { loadSidebar } = vm.config

  // Server-Side Rendering
  if (vm.rendered) {
    const activeEl = getAndActive(vm.router, '.sidebar-nav', true, true)
    if (loadSidebar && activeEl) {
      activeEl.parentNode.innerHTML += window.__SUB_SIDEBAR__
    }
    vm._bindEventOnRendered(activeEl)
    vm.$resetEvents()
    callHook(vm, 'doneEach')
    callHook(vm, 'ready')
  } else {
    vm.$fetch(_ => callHook(vm, 'ready'))
  }
}
