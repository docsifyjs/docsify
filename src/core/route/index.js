import { normalize, parse } from './hash'
import { getBasePath, getPath, isAbsolutePath } from './util'
import { on } from '../util/dom'

function getAlias (path, alias) {
  return alias[path] ? getAlias(alias[path], alias) : path
}

function getFileName (path) {
  return /\.(md|html)$/g.test(path)
    ? path
    : /\/$/g.test(path)
      ? `${path}README.md`
      : `${path}.md`
}

export function routeMixin (proto) {
  proto.route = {}
  proto.$getFile = function (path) {
    const { config } = this
    const base = getBasePath(config.basePath)

    path = config.alias ? getAlias(path, config.alias) : path
    path = getFileName(path)
    path = path === '/README.md' ? (config.homepage || path) : path
    path = isAbsolutePath(path) ? path : getPath(base, path)

    return path
  }
}

let lastRoute = {}

export function initRoute (vm) {
  normalize()
  lastRoute = vm.route = parse()

  on('hashchange', _ => {
    normalize()
    vm.route = parse()
    vm._updateRender()

    if (lastRoute.path === vm.route.path) {
      vm.$resetEvents()
      return
    }

    vm.$fetch()
    lastRoute = vm.route
  })
}
