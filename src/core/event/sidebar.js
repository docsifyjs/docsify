import { isMobile } from '../util/env'
import * as dom from '../util/dom'
import { getHash } from '../route/hash'

const title = dom.$.title
/**
 * Toggle button
 */
export function btn (el) {
  const toggle = () => dom.body.classList.toggle('close')

  el = dom.getNode(el)
  dom.on(el, 'click', toggle)

  const sidebar = dom.getNode('.sidebar')

  dom.on(sidebar, 'click', () => {
    isMobile && toggle()
    setTimeout(() => getAndActive(sidebar, true, true), 0)
  })
}

export function sticky () {
  const cover = dom.getNode('section.cover')
  if (!cover) return
  const coverHeight = cover.getBoundingClientRect().height

  if (window.pageYOffset >= coverHeight || cover.classList.contains('hidden')) {
    dom.toggleClass(dom.body, 'add', 'sticky')
  } else {
    dom.toggleClass(dom.body, 'remove', 'sticky')
  }
}

/**
 * Get and active link
 * @param  {string|element}  el
 * @param  {Boolean} isParent   acitve parent
 * @param  {Boolean} autoTitle  auto set title
 * @return {element}
 */
export function getAndActive (el, isParent, autoTitle) {
  el = dom.getNode(el)

  const links = dom.findAll(el, 'a')
  const hash = '#' + getHash()
  let target

  links
    .sort((a, b) => b.href.length - a.href.length)
    .forEach(a => {
      const href = a.getAttribute('href')
      const node = isParent ? a.parentNode : a

      if (hash.indexOf(href) === 0 && !target) {
        target = a
        dom.toggleClass(node, 'add', 'active')
      } else {
        dom.toggleClass(node, 'remove', 'active')
      }
    })

  if (autoTitle) {
    dom.$.title = target ? `${target.innerText} - ${title}` : title
  }

  return target
}
