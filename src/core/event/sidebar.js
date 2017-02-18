import { isMobile } from '../util/env'
import { getNode, on, body, findAll, toggleClass } from '../util/dom'
import { getHash } from '../route/hash'
/**
 * Toggle button
 */
export function btn (el) {
  const toggle = () => body.classList.toggle('close')

  el = getNode(el)
  on(el, 'click', toggle)

  if (isMobile) {
    const sidebar = getNode('.sidebar')

    on(sidebar, 'click', () => {
      toggle()
      setTimeout(() => getAndActive(true), 0)
    })
  }
}

export function sticky () {

}

export function getAndActive (el, isParent) {
  const dom = getNode(el)
  const links = findAll(dom, 'a')
  const hash = '#' + getHash()

  let target

  links
    .sort((a, b) => b.href.length - a.href.length)
    .forEach(a => {
      const href = a.getAttribute('href')
      const node = isParent ? a.parentNode : a

      if (hash.indexOf(href) === 0 && !target) {
        target = a
        toggleClass(node, 'add', 'active')
      } else {
        toggleClass(node, 'remove', 'active')
      }
    })

  // TODO FIXED
  return target
}
