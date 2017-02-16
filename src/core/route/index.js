import { ensureSlash } from './hash'

export function routeMixin (Docsify) {
  Docsify.prototype.$route = {
    query: location.query || {},
    path: location.path || '/',
    base: ''
  }
}

export function initRoute (vm) {
  ensureSlash()
  window.addEventListener('hashchange', () => {
    ensureSlash()
    vm.$fetch()
  })
}
