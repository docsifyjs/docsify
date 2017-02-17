import config from '../config'
import { initLifecycle, callHook } from './lifecycle'
import { initRender } from '../render'
import { initRoute } from '../route'
import { initEvent } from '../event'
import { initFetch } from '../fetch'
import { isFn } from '../util/core'

export function initMixin (Docsify) {
  Docsify.prototype._init = function () {
    const vm = this
    vm.config = config || {}

    initLifecycle(vm) // Init hooks
    initPlugin(vm) // Install plugins
    callHook(vm, 'init')
    initRender(vm) // Render base DOM
    initEvent(vm) // Bind events
    initRoute(vm) // Add hashchange eventListener
    initFetch(vm) // Fetch data
    callHook(vm, 'ready')
  }
}

function initPlugin (vm) {
  [].concat(vm.config.plugins).forEach(fn => isFn(fn) && fn(vm._lifecycle, vm))
}
