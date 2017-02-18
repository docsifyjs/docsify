import * as dom from '../util/dom'
import { getAndActive, sticky } from '../event/sidebar'
import { scrollActiveSidebar, scroll2Top } from '../event/scroll'
import cssVars from '../util/polyfill/css-vars'
import * as tpl from './tpl'
import { markdown, sidebar, subSidebar, cover } from './compiler'
import { callHook } from '../init/lifecycle'
import { getBasePath, getPath } from '../route/util'

function executeScript () {
  const script = dom.findAll('.markdown-section>script')
      .filter(s => !/template/.test(s.type))[0]
  if (!script) return false
  const code = script.innerText.trim()
  if (!code) return false

  window.__EXECUTE_RESULT__ = new Function('return ' + code)()
}

function renderMain (html) {
  if (!html) {
    // TODO: Custom 404 page
  }

  this._renderTo('.markdown-section', html)
  // Render sidebar with the TOC
  !this.config.loadSidebar && this._renderSidebar()
  // execute script
  this.config.executeScript && executeScript()

  if (!this.config.executeScript
      && typeof window.Vue !== 'undefined'
      && !executeScript()) {
    window.__EXECUTE_RESULT__ = new window.Vue().$mount('#main')
  }

  if (this.config.auto2top) {
    setTimeout(() => scroll2Top(this.config.auto2top), 0)
  }
}

export function renderMixin (proto) {
  proto._renderTo = function (el, content, replace) {
    const node = dom.getNode(el)
    if (node) node[replace ? 'outerHTML' : 'innerHTML'] = content
  }

  proto._renderSidebar = function (text) {
    const { maxLevel, subMaxLevel } = this.config

    this._renderTo('.sidebar-nav', sidebar(text, maxLevel))
    subSidebar(getAndActive('.sidebar-nav', true), subMaxLevel)
    // bind event
    scrollActiveSidebar()
  }

  proto._renderNav = function (text) {
    text && this._renderTo('nav', markdown(text))
    getAndActive('nav')
  }

  proto._renderMain = function (text) {
    callHook(this, 'beforeEach', text, result => {
      const html = markdown(result)
      callHook(this, 'afterEach', html, text => renderMain.call(this, text))
    })
  }

  proto._renderCover = function (text) {
    const el = dom.getNode('.cover')
    if (!text) {
      dom.toggleClass(el, 'remove', 'show')
      return
    }
    dom.toggleClass(el, 'add', 'show')

    let html = cover(text)
    const m = html.trim().match('<p><img.*?data-origin="(.*?)"[^a]+alt="(.*?)">([^<]*?)</p>$')

    if (m) {
      if (m[2] === 'color') {
        el.style.background = m[1] + (m[3] || '')
      } else {
        dom.toggleClass(el, 'add', 'has-mask')
        el.style.backgroundImage = `url(${getPath(getBasePath(this.config.basePath), m[1])})`
      }
      html = html.replace(m[0], '')
    }

    this._renderTo('.cover-main', html)
    sticky()
  }

  proto._updateRender = function () {
    markdown.update()
  }
}

export function initRender (vm) {
  const config = vm.config

  // Init markdown compiler
  markdown.init(config.markdown, config.basePath)

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
