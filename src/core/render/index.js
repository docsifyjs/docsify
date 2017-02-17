import { getNode, dom } from '../util/dom'
import cssVars from '../util/polyfill/css-vars'
import * as tpl from './tpl'

export function renderMixin (Docsify) {
  Docsify.prototype._renderTo = function (el, content, replace) {
    const node = getNode(el)
    if (node) node[replace ? 'outerHTML' : 'innerHTML'] = content
  }
}

export function initRender (vm) {
  const config = vm.config
  const id = config.el || '#app'
  const navEl = dom.find('nav') || dom.create('nav')

  let el = dom.find(id)
  let html = ''

  navEl.classList.add('app-nav')

  if (!config.repo) {
    navEl.classList.add('no-badge')
  }
  if (!el) {
    el = dom.create(id)
    dom.appendTo(dom.body, el)
  }
  if (config.repo) {
    html += tpl.corner(config.repo)
  }
  if (config.coverpage) {
    html += tpl.cover()
  }

  html += tpl.main(config)
  // Render main app
  vm._renderTo(el, html, true)
  // Add nav
  dom.body.insertBefore(navEl, dom.body.children[0])

  if (config.themeColor) {
    dom.head += tpl.theme(config.themeColor)
    // Polyfll
    cssVars(config.themeColor)
  }
}
