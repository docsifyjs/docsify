/**
 * Simple ajax
 * @param  {String} url
 * @param  {String} [method=get]
 * @return {Promise}
 */
export function load (url, method = 'get') {
  const xhr = new XMLHttpRequest()

  xhr.open(method, url)
  xhr.send()

  return {
    then: function (success, error = function () {}) {
      xhr.addEventListener('error', error)
      xhr.addEventListener('load', ({ target }) => {
        target.status >= 400 ? error(target) : success(target.response)
      })
    }
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
