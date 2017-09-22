import { isMobile } from '../util/env'
import * as dom from '../util/dom'

const title = dom.$.title
/**
 * Toggle button
 */
export function btn (el, router) {
  const toggle = _ => dom.body.classList.toggle('close')

  el = dom.getNode(el)
  dom.on(el, 'click', e => {
    e.stopPropagation()
    toggle()
  })

  const sidebar = dom.getNode('.sidebar')

  isMobile &&
    dom.on(
      dom.body,
      'click',
      _ => dom.body.classList.contains('close') && toggle()
    )
  dom.on(sidebar, 'click', _ =>
    setTimeout((_ => getAndActive(router, sidebar, true, true), 0))
  )
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
 * @param  {object} router
 * @param  {string|element}  el
 * @param  {Boolean} isParent   acitve parent
 * @param  {Boolean} autoTitle  auto set title
 * @return {element}
 */
export function getAndActive (router, el, isParent, autoTitle) {
  el = dom.getNode(el)

  const links = dom.findAll(el, 'a')
  const hash = router.toURL(router.getCurrentPath())
  let target

  links.sort((a, b) => b.href.length - a.href.length).forEach(a => {
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
