import { merge, cached } from '../util/core'
import { parseQuery, stringifyQuery, cleanPath } from './util'

function replaceHash (path) {
  const i = window.location.href.indexOf('#')
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  )
}

const replaceSlug = cached(path => {
  return path
    .replace('#', '?id=')
    .replace(/\?(\w+)=/g, (_, slug) => slug === 'id' ? '?id=' : `&${slug}=`)
})
/**
 * Normalize the current url
 *
 * @example
 * domain.com/docs/ => domain.com/docs/#/
 * domain.com/docs/#/#slug => domain.com/docs/#/?id=slug
 */
export function normalize () {
  let path = getHash()

  path = replaceSlug(path)

  if (path.charAt(0) === '/') return replaceHash(path)
  replaceHash('/' + path)
}

export function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const href = window.location.href
  const index = href.indexOf('#')
  return index === -1 ? '' : href.slice(index + 1)
}

/**
 * Parse the url
 * @param {string} [path=window.location.herf]
 * @return {object} { path, query }
 */
export function parse (path = window.location.href) {
  let query = ''

  const queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  const hashIndex = path.indexOf('#')
  if (hashIndex) {
    path = path.slice(hashIndex + 1)
  }

  return { path, query: parseQuery(query) }
}

/**
 * to URL
 * @param  {string} path
 * @param  {object} qs   query params
 */
export function toURL (path, params) {
  const route = parse(replaceSlug(path))

  route.query = merge({}, route.query, params)
  path = route.path + stringifyQuery(route.query)

  return cleanPath('#/' + path)
}
