/**
 * Simple ajax
 * @param  {String} url
 * @param  {String} [method=get]
 * @return {Promise}
 */
export function ajax (url, method = 'get') {
  const xhr = new XMLHttpRequest()

  xhr.open(method, url)
  xhr.send()

  return {
    then: function (cb) {
      xhr.addEventListener('load', cb)
      return this
    },
    catch: function (cb) {
      xhr.addEventListener('error', cb)
      return this
    }
  }
}

/**
 * gen toc tree
 * @link from https://github.com/killercup/grock/blob/5280ae63e16c5739e9233d9009bc235ed7d79a50/styles/solarized/assets/js/behavior.coffee#L54-L81
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
