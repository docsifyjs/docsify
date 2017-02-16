const cacheNode = {}

export function getCacheNode (el) {
  if (typeof el === 'string') {
    const selector = el

    el = cacheNode[el] || document.querySelector(el)
    if (!el) console.error('Cannot find element:', selector)
  }

  return el
}
