import { isMobile } from '../util/env'
import { getNode, on, dom } from '../util/dom'
/**
 * Toggle button
 */
export function btn (el) {
  const toggle = () => dom.body.classList.toggle('close')

  el = getNode(el)
  on(el, 'click', toggle)

  if (isMobile) {
    const sidebar = getNode('.sidebar')

    on(sidebar, 'click', () => {
      toggle()
      setTimeout(() => activeLink(sidebar, true), 0)
    })
  }
}

export function sticky () {

}

export function activeLink () {

}
