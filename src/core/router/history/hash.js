import { History } from './base'
import { merge, cached, noop } from '../../util/core'
import { on } from '../../util/dom'
import { parseQuery, stringifyQuery, cleanPath } from '../util'

function replaceHash (path) {
  const i = location.href.indexOf('#')
  location.replace(location.href.slice(0, i >= 0 ? i : 0) + '#' + path)
}

const replaceSlug = cached(path => {
  return path.replace('#', '?id=')
})

export class HashHistory extends History {
  constructor (config) {
    super(config)
    this.mode = 'hash'
  }

  getBasePath () {
    const path = window.location.pathname || ''
    const base = this.config.basePath

    return /^(\/|https?:)/g.test(base) ? base : cleanPath(path + '/' + base)
  }

  getCurrentPath () {
    // We can't use location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    const href = location.href
    const index = href.indexOf('#')
    return index === -1 ? '' : href.slice(index + 1)
  }

  onchange (cb = noop) {
    on('hashchange', cb)
  }

  normalize () {
    let path = this.getCurrentPath()

    path = replaceSlug(path)

    if (path.charAt(0) === '/') return replaceHash(path)
    replaceHash('/' + path)
  }

  /**
   * Parse the url
   * @param {string} [path=location.herf]
   * @return {object} { path, query }
   */
  parse (path = location.href) {
    let query = ''

    const hashIndex = path.indexOf('#')
    if (hashIndex) {
      path = path.slice(hashIndex + 1)
    }

    const queryIndex = path.indexOf('?')
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1)
      path = path.slice(0, queryIndex)
    }

    return {
      path,
      file: this.getFile(path, true),
      query: parseQuery(query)
    }
  }

  toURL (path, params, currentRoute) {
    const local = currentRoute && path[0] === '#'
    const route = this.parse(replaceSlug(path))

    route.query = merge({}, route.query, params)
    path = route.path + stringifyQuery(route.query)
    path = path.replace(/\.md(\?)|\.md$/, '$1')

    if (local) path = currentRoute + path

    return cleanPath('#/' + path)
  }
}
