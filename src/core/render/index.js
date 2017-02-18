import * as dom from '../util/dom'
import cssVars from '../util/polyfill/css-vars'
import * as tpl from './tpl'
import { markdown, sidebar } from './compiler'
import { callHook } from '../init/lifecycle'

function renderMain (html) {
  if (!html) {
    // TODO: Custom 404 page
  }
  this._renderTo('.markdown-section', html)
}

export function renderMixin (Docsify) {
  const proto = Docsify.prototype

  proto._renderTo = function (el, content, replace) {
    const node = dom.getNode(el)
    if (node) node[replace ? 'outerHTML' : 'innerHTML'] = content
  }

  proto._renderSidebar = function (text) {
    this._renderTo('.sidebar-nav', sidebar(text))
    // bind event
  }

  proto._renderNav = function (text) {
    this._renderTo('nav', markdown(text))
  }

  proto._renderMain = function (text) {
    callHook(this, 'beforeEach', text, result => {
      const html = markdown(result)
      callHook(this, 'afterEach', html, text => renderMain.call(this, text))
    })
  }
}

export function initRender (vm) {
  const config = vm.config

  // Init markdown compiler
  markdown.init(vm.config.markdown)

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
    dom.$.head += tpl.theme(config.themeColor)
    // Polyfll
    cssVars(config.themeColor)
  }
}
