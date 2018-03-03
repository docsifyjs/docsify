import {History} from './base'
import {noop} from '../../util/core'
import {on} from '../../util/dom'
import {parseQuery, cleanPath, replaceSlug} from '../util'

function replaceHash(path) {
  const i = location.href.indexOf('#')
  location.replace(location.href.slice(0, i >= 0 ? i : 0) + '#' + path)
}

export class HashHistory extends History {
  constructor(config) {
    super(config)
    this.mode = 'hash'
  }

  getBasePath() {
    const path = window.location.pathname || ''
    const base = this.config.basePath

    return /^(\/|https?:)/g.test(base) ? base : cleanPath(path + '/' + base)
  }

  getCurrentPath() {
    // We can't use location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    const href = location.href
    const index = href.indexOf('#')
    return index === -1 ? '' : href.slice(index + 1)
  }

  onchange(cb = noop) {
    on('hashchange', cb)
  }

  normalize() {
    let path = this.getCurrentPath()

    path = replaceSlug(path)

    if (path.charAt(0) === '/') {
      return replaceHash(path)
    }
    replaceHash('/' + path)
  }

  /**
   * Parse the url
   * @param {string} [path=location.herf]
   * @return {object} { path, query }
   */
  parse(path = location.href) {
    let query = ''

    const hashIndex = path.indexOf('#')
    if (hashIndex >= 0) {
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

  toURL(path, params, currentRoute) {
    return '#' + super.toURL(path, params, currentRoute)
  }
}
