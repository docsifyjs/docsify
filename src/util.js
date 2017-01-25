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
        const id = setInterval(_ =>
          loading({ step: Math.floor(Math.random() * 5 + 1) }),
        500)
        xhr.addEventListener('progress', loading)
        xhr.addEventListener('loadend', evt => {
          loading(evt)
          clearInterval(id)
        })
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

export function slugify (string) {
  const re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,.\/:;<=>?@\[\]^`{|}~]/g
  const maintainCase = false
  const replacement = '-'

  slugify.occurrences = slugify.occurrences || {}

  if (typeof string !== 'string') return ''
  if (!maintainCase) string = string.toLowerCase()

  let slug = string.trim()
    .replace(/<[^>\d]+>/g, '')
    .replace(re, '')
    .replace(/\s/g, replacement)
    .replace(/-+/g, replacement)
    .replace(/^(\d)/, '_$1')
  let occurrences = slugify.occurrences[slug]

  if (slugify.occurrences.hasOwnProperty(slug)) {
    occurrences++
  } else {
    occurrences = 0
  }

  slugify.occurrences[slug] = occurrences

  if (occurrences) {
    slug = slug + '-' + occurrences
  }

  return slug
}

slugify.clear = function () {
  slugify.occurrences = {}
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export const merge = Object.assign || function (to) {
  for (let i = 1; i < arguments.length; i++) {
    const from = Object(arguments[i])

    for (const key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key]
      }
    }
  }

  return to
}

export function emojify (text) {
  return text
    .replace(/:(\w*?):/ig, '<img class="emoji" src="https://assets-cdn.github.com/images/icons/emoji/$1.png" alt="$1" />')
    .replace(/__colon__/g, ':')
}

