import { AbstractHistory } from './history/abstract'
import { HashHistory } from './history/hash'
import { HTML5History } from './history/html5'
import { supportsPushState, inBrowser } from '../util/env'

export function routerMixin (proto) {
  proto.route = {}
}

let lastRoute = {}

export function initRouter (vm) {
  const config = vm.config
  const mode = config.routerMode || 'hash'
  let router

  if (mode === 'history' && supportsPushState) {
    router = new HTML5History(config)
  } else if (!inBrowser || mode === 'abstract') {
    router = new AbstractHistory(config)
  } else {
    router = new HashHistory(config)
  }

  vm.router = router

  router.normalize()
  lastRoute = vm.route = router.parse()
  vm._updateRender()

  router.onchange(_ => {
    router.normalize()
    vm.route = router.parse()
    vm._updateRender()

    if (lastRoute.path === vm.route.path) {
      vm.$resetEvents()
      return
    }

    vm.$fetch()
    lastRoute = vm.route
  })
}
