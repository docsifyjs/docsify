export function cleanPath (path) {
  return path.replace(/\/+/g, '/')
}

export function getLocation (base) {
  let path = window.location.pathname
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}
