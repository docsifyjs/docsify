import { normalize, parse } from './hash'
import { getBasePath, cleanPath } from './util'
import { on } from '../util/dom'

function getAlias (path, alias) {
  if (alias[path]) return getAlias(alias[path], alias)
  return path
}

function getFileName (path) {
  return /\.(md|html)$/g.test(path)
    ? path
    : /\/$/g.test(path)
      ? `${path}README.md`
      : `${path}.md`
}

export function routeMixin (Docsify) {
  Docsify.prototype.route = {}
  Docsify.prototype.$getFile = function (path) {
    const { config } = this
    const base = getBasePath(config.basePath)

    path = getAlias(path, config.alias)
    path = getFileName(path)
    path = path === '/README.md' ? ('/' + config.homepage || path) : path
    path = cleanPath(base + path)

    return path
  }
}

export function initRoute (vm) {
  normalize()
  vm.route = parse()

  on('hashchange', _ => {
    normalize()
    vm.route = parse()
    vm._fetch()
  })
}
