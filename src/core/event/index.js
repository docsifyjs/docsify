export function eventMixin (Docsify) {
  Docsify.prototype.$bindEvents = function () {
  }

  Docsify.prototype.$resetEvents = function () {
  }
}

export function initEvent (vm) {
  vm.$bindEvents()
}
