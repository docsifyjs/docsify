import {HashHistory} from './history/hash'
import {HTML5History} from './history/html5'
import {supportsPushState} from '../util/env'
import * as dom from '../util/dom'

export function routerMixin(proto) {
  proto.route = {}
}

let lastRoute = {}

function updateRender(vm) {
  vm.router.normalize()
  vm.route = vm.router.parse()
  dom.body.setAttribute('data-page', vm.route.file)
}

export function initRouter(vm) {
  const config = vm.config
  const mode = config.routerMode || 'hash'
  let router

  if (mode === 'history' && supportsPushState) {
    router = new HTML5History(config)
  } else {
    router = new HashHistory(config)
  }

  vm.router = router
  updateRender(vm)
  lastRoute = vm.route

  router.onchange(_ => {
    updateRender(vm)
    vm._updateRender()

    if (lastRoute.path === vm.route.path) {
      vm.$resetEvents()
      return
    }

    vm.$fetch()
    lastRoute = vm.route
  })
}
