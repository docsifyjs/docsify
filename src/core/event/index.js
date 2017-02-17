import { isMobile } from '../util/env'
import { dom, on } from '../util/dom'
import * as sidebar from './sidebar'

export function eventMixin (Docsify) {
  Docsify.prototype.$resetEvents = function () {
  }
}

export function initEvent (vm) {
  // Bind toggle button
  sidebar.btn('button.sidebar-toggle')
  // Bind sticky effect
  if (vm.config.coverpage) {
    !isMobile && on('scroll', sidebar.sticky)
  } else {
    dom.body.classList.add('sticky')
  }
}
