/**
 * Simple ajax
 * @param  {String} url
 * @param  {String} [method=GET]
 * @param {Function} [loading] handle loading
 * @return {Promise}
 */
export function load (url, method = 'GET', loading) {
  const xhr = new XMLHttpRequest()

  xhr.open(method, url)
  xhr.send()

  return {
    then: function (success, error = function () {}) {
      if (loading) {
        xhr.addEventListener('progress', loading)
        xhr.addEventListener('loaded', loading)
      }
      xhr.addEventListener('error', error)
      xhr.addEventListener('load', ({ target }) => {
        target.status >= 400 ? error(target) : success(target.response)
      })
    },
    abort: () => xhr.readyState !== 4 && xhr.abort()
  }
}

/**
 * gen toc tree
 * @link https://github.com/killercup/grock/blob/5280ae63e16c5739e9233d9009bc235ed7d79a50/styles/solarized/assets/js/behavior.coffee#L54-L81
 * @param  {Array} toc
 * @param  {Number} maxLevel
 * @return {Array}
 */
export function genTree (toc, maxLevel) {
  const headlines = []
  const last = {}

  toc.forEach(headline => {
    const level = headline.level || 1
    const len = level - 1

    if (level > maxLevel) return
    if (last[len]) {
      last[len].children = last[len].children || []
      last[len].children.push(headline)
    } else {
      headlines.push(headline)
    }
    last[level] = headline
  })

  return headlines
}

/**
 * camel to kebab
 * @link https://github.com/bokuweb/kebab2camel/blob/master/index.js
 * @param  {String} str
 * @return {String}
 */
export function camel2kebab (str) {
  return str.replace(/([A-Z])/g, m => '-' + m.toLowerCase())
}

/**
 * is nil
 * @param  {Object}  object
 * @return {Boolean}
 */
export function isNil (o) {
  return o === null || o === undefined
}

let cacheRoute = null
let cacheHash = null

/**
 * hash route
 */
export function getRoute () {
  const loc = window.location
  if (cacheHash === loc.hash && !isNil(cacheRoute)) return cacheRoute

  let route = loc.hash.match(/^#\/([^#]+)/)

  if (route && route.length === 2) {
    route = route[1]
  } else {
    route = /^#\//.test(loc.hash) ? '' : loc.pathname
  }
  cacheRoute = route
  cacheHash = loc.hash

  return route
}

export function isMobile () {
  return document.body.clientWidth <= 600
}

