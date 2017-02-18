import { cached } from '../util/core'

const decode = decodeURIComponent
const encode = encodeURIComponent

export function parseQuery (query) {
  const res = {}

  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  // Simple parse
  query.split('&').forEach(function (param) {
    const parts = param.replace(/\+/g, ' ').split('=')

    res[parts[0]] = decode(parts[1])
  })
  return res
}

export function stringifyQuery (obj) {
  const qs = []

  for (const key in obj) {
    qs.push(`${encode(key)}=${encode(obj[key])}`)
  }

  return qs.length ? `?${qs.join('&')}` : ''
}

export const getBasePath = cached(base => {
  return /^(\/|https?:)/g.test(base)
    ? base
    : cleanPath(window.location.pathname + '/' + base)
})

export function getPath (...args) {
  const path = args.find(path => /:|(\/{2})/.test(path))

  if (path) return path

  return cleanPath(args.join('/'))
}

export const getRoot = cached(path => {
  return /\/$/g.test(path) ? path : path.match(/(\S*\/)[^\/]+$/)[1]
})

export function cleanPath (path) {
  return path.replace(/\/+/g, '/')
}
