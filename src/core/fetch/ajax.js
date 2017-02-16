import progressbar from '../render/progressbar'
import { noop } from '../util/core'

/**
 * Simple ajax get
 * @param  {String} url
 * @param {Boolean} [loading=false] has loading bar
 * @return { then(resolve, reject), abort }
 */
export function get (url, hasLoading = false) {
  const xhr = new XMLHttpRequest()

  xhr.open('GET', url)
  xhr.send()

  return {
    then: function (success, error = noop) {
      const on = xhr.addEventListener

      if (hasLoading) {
        const id = setInterval(_ => progressbar({}), 500)

        on('progress', progressbar)
        on('loadend', evt => {
          progressbar(evt)
          clearInterval(id)
        })
      }

      on('error', error)
      on('load', ({ target }) => {
        target.status >= 400 ? error(target) : success(target.response)
      })
    },
    abort: () => xhr.readyState !== 4 && xhr.abort()
  }
}
