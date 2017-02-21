import progressbar from '../render/progressbar'
import { noop } from '../util/core'

const cache = {}

/**
 * Simple ajax get
 * @param {string} url
 * @param {boolean} [hasBar=false] has progress bar
 * @return { then(resolve, reject), abort }
 */
export function get (url, hasBar = false) {
  const xhr = new XMLHttpRequest()
  const on = function () {
    xhr.addEventListener.apply(xhr, arguments)
  }

  if (cache[url]) {
    return { then: cb => cb(cache[url]), abort: noop }
  }

  xhr.open('GET', url)
  xhr.send()

  return {
    then: function (success, error = noop) {
      if (hasBar) {
        const id = setInterval(_ => progressbar({
          step: Math.floor(Math.random() * 5 + 1)
        }), 500)

        on('progress', progressbar)
        on('loadend', evt => {
          progressbar(evt)
          clearInterval(id)
        })
      }

      on('error', error)
      on('load', ({ target }) => {
        if (target.status >= 400) {
          error(target)
        } else {
          cache[url] = target.response
          success(target.response)
        }
      })
    },
    abort: _ => xhr.readyState !== 4 && xhr.abort()
  }
}
