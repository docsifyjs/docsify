import { History } from './base'
import { parseQuery, stringifyQuery, cleanPath } from '../util'
import { merge } from '../../util/core'

export class AbstractHistory extends History {
  constructor (config) {
    super(config)
    this.mode = 'abstract'
  }

  parse (path) {
    let query = ''

    const queryIndex = path.indexOf('?')
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1)
      path = path.slice(0, queryIndex)
    }

    return {
      path,
      file: this.getFile(path),
      query: parseQuery(query)
    }
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
