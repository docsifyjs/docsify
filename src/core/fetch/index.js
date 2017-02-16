import { callHook } from '../init/lifecycle'

export function fetchMixin (Docsify) {
  Docsify.prototype.$fetch = function () {
  }
}

export function initFetch (vm) {
  vm.$fetch(result => {
    vm.$resetEvents()
    callHook(vm, 'doneEach')
  })
}
