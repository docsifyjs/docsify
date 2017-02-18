import { cached } from '../util/core'

const decode = decodeURIComponent

export const parseQuery = cached(query => {
  const res = {}

  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    const parts = param.replace(/\+/g, ' ').split('=')
    const key = decode(parts.shift())
    const val = parts.length > 0
      ? decode(parts.join('='))
      : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      res[key].push(val)
    } else {
      res[key] = [res[key], val]
    }
  })

  return res
})

export function cleanPath (path) {
  return path.replace(/\/+/g, '/')
}

export function getBasePath (base) {
  return /^(\/|https?:)/g.test(base)
    ? base
    : cleanPath(window.location.pathname + '/' + base)
}

export function getCurrentRoot (path) {
  return /\/$/g.test(path) ? path : path.match(/(\S*\/)[^\/]+$/)[1]
}
