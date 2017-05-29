import { isMobile } from '../util/env'
import { body, on } from '../util/dom'
import * as sidebar from './sidebar'
import { scrollIntoView } from './scroll'

export function eventMixin (proto) {
  proto.$resetEvents = function () {
    scrollIntoView(this.route.query.id)
    sidebar.getAndActive(this.router, 'nav')
  }
}

export function initEvent (vm) {
  // Bind toggle button
  sidebar.btn('button.sidebar-toggle', vm.router)
  // Bind sticky effect
  if (vm.config.coverpage) {
    !isMobile && on('scroll', sidebar.sticky)
  } else {
    body.classList.add('sticky')
  }
}
