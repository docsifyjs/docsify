export default function (url, options = {}) {
  const xhr = new XMLHttpRequest()

  xhr.open(options.method || 'get', url)
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
