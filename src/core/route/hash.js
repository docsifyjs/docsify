// import { cleanPath, getLocation } from './util'
export function ensureSlash () {
  const path = getHash()
  if (path.charAt(0) === '/') return
  replaceHash('/' + path)
}

export function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const href = window.location.href
  const index = href.indexOf('#')
  return index === -1 ? '' : href.slice(index + 1)
}

function replaceHash (path) {
  const i = window.location.href.indexOf('#')
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  )
}

// TODO 把第二个 hash 转成 ?id=
