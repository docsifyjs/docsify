export default function (url, options = {}) {
  const xhr = new XMLHttpRequest()

  xhr.open(options.method || 'get', url)
  xhr.send()

  return {
    then: cb => xhr.addEventListener('load', cb)
  }
}
