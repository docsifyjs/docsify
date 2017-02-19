import * as dom from '../util/dom'
import { getAndActive, sticky } from '../event/sidebar'
import { scrollActiveSidebar, scroll2Top } from '../event/scroll'
import cssVars from '../util/polyfill/css-vars'
import * as tpl from './tpl'
import { markdown, sidebar, subSidebar, cover } from './compiler'
import { callHook } from '../init/lifecycle'
import { getBasePath, getPath, isAbsolutePath } from '../route/util'

function executeScript () {
  const script = dom.findAll('.markdown-section>script')
      .filter(s => !/template/.test(s.type))[0]
  if (!script) return false
  const code = script.innerText.trim()
  if (!code) return false

  setTimeout(_ => {
    window.__EXECUTE_RESULT__ = new Function(code)()
  }, 0)
}

function renderMain (html) {
  if (!html) {
    // TODO: Custom 404 page
    html = 'not found'
  }

  this._renderTo('.markdown-section', html)
  // Render sidebar with the TOC
  !this.config.loadSidebar && this._renderSidebar()
  // execute script
  this.config.executeScript && executeScript()

  if (this.config.executeScript !== false &&
      typeof window.Vue !== 'undefined' &&
      !executeScript()) {
    setTimeout(_ => {
      const vueVM = window.__EXECUTE_RESULT__
      vueVM && vueVM.$destroy && vueVM.$destroy()
      window.__EXECUTE_RESULT__ = new window.Vue().$mount('#main')
    }, 0)
  }

  if (this.config.auto2top) {
    scroll2Top(this.config.auto2top)
  }
}

export function renderMixin (proto) {
  proto._renderTo = function (el, content, replace) {
    const node = dom.getNode(el)
    if (node) node[replace ? 'outerHTML' : 'innerHTML'] = content
  }

  proto._renderSidebar = function (text) {
    const { maxLevel, subMaxLevel, autoHeader } = this.config

    this._renderTo('.sidebar-nav', sidebar(text, maxLevel))
    const active = getAndActive('.sidebar-nav', true, true)
    subSidebar(active, subMaxLevel)
    // bind event
    this.activeLink = active
    scrollActiveSidebar()

    if (autoHeader && active) {
      const main = dom.getNode('#main')
      const firstNode = main.children[0]
      if (firstNode && firstNode.tagName !== 'H1') {
        const h1 = dom.create('h1')
        h1.innerText = active.innerText
        dom.before(main, h1)
      }
    }
  }

  proto._renderNav = function (text) {
    text && this._renderTo('nav', markdown(text))
    getAndActive('nav')
  }

  proto._renderMain = function (text) {
    callHook(this, 'beforeEach', text, result => {
      const html = this.isHTML ? result : markdown(result)
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

    let html = this.coverIsHTML ? text : cover(text)
    const m = html.trim().match('<p><img.*?data-origin="(.*?)"[^a]+alt="(.*?)">([^<]*?)</p>$')

    if (m) {
      if (m[2] === 'color') {
        el.style.background = m[1] + (m[3] || '')
      } else {
        let path = m[1]

        dom.toggleClass(el, 'add', 'has-mask')
        if (isAbsolutePath(m[1])) {
          path = getPath(getBasePath(this.config.basePath), m[1])
        }
        el.style.backgroundImage = `url(${path})`
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
  dom.before(dom.body, navEl)

  if (config.themeColor) {
    dom.$.head.innerHTML += tpl.theme(config.themeColor)
    // Polyfll
    cssVars(config.themeColor)
  }
  dom.toggleClass(dom.body, 'ready')
}
