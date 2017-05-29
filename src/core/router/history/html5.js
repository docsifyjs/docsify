import { History } from './base'
import { merge, noop } from '../../util/core'
import { on } from '../../util/dom'
import { parseQuery, stringifyQuery, cleanPath } from '../util'

export class HTML5History extends History {
  constructor (config) {
    super(config)
    this.mode = 'history'
  }

  getCurrentPath () {
    const base = this.config.basePath
    let path = window.location.pathname

    if (base && path.indexOf(base) === 0) {
      path = path.slice(base.length)
    }

    return (path || '/') + window.location.search + window.location.hash
  }

  onchange (cb = noop) {
    on('click', e => {
      const el = e.target.tagName === 'A'
        ? e.target
        : e.target.parentNode

      if (el.tagName === 'A' && !/_blank/.test(el.target)) {
        e.preventDefault()
        const url = el.href
        window.history.pushState({ key: url }, '', url)
        cb()
      }
    })

    on('popstate', cb)
  }

  normalize () {
    let path = this.getCurrentPath()

    path = path.replace('#', '?id=')
    window.history.pushState({ key: path }, '', path)

    return path
  }

  /**
   * Parse the url
   * @param {string} [path=location.href]
   * @return {object} { path, query }
   */
  parse (path = location.href) {
    let query = ''

    const queryIndex = path.indexOf('?')
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1)
      path = path.slice(0, queryIndex)
    }

    const baseIndex = path.indexOf(location.origin)
    if (baseIndex > -1) {
      path = path.slice(baseIndex + location.origin.length)
    }

    return { path, query: parseQuery(query) }
  }

  toURL (path, params, currentRoute) {
    const local = currentRoute && path[0] === '#'
    const route = this.parse(path)

    route.query = merge({}, route.query, params)
    path = route.path + stringifyQuery(route.query)
    path = path.replace(/\.md(\?)|\.md$/, '$1')

    if (local) path = currentRoute + path

    return cleanPath('/' + path)
  }
}
