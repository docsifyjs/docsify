import { parseQuery } from './util'

function replaceHash (path) {
  const i = window.location.href.indexOf('#')
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  )
}

/**
 * Normalize the current url
 *
 * @example
 * domain.com/docs/ => domain.com/docs/#/
 * domain.com/docs/#/#slug => domain.com/docs/#/?id=slug
 */
export function normalize () {
  let path = getHash()

  path = path
    .replace('#', '?id=')
    .replace(/\?(\w+)=/g, (_, slug) => slug === 'id' ? '?id=' : `&${slug}=`)

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
 * Parse the current url
 * @return {object} { path, query }
 */
export function parse () {
  let path = window.location.href
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
 * @param  {String} path
 * @param  {String} qs   query string
 */
export function toURL (path, qs) {

}
