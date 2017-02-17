import { callHook } from '../init/lifecycle'

export function fetchMixin (Docsify) {
  Docsify.prototype.$fetch = function (path) {
    // 加载侧边栏、导航、内容
  }
}

export function initFetch (vm) {
  vm.$fetch(result => {
    vm.$resetEvents()
    callHook(vm, 'doneEach')
  })
}
