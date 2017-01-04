import marked from 'marked'
import Prism from 'prismjs'
import * as tpl from './tpl'
import { activeLink, scrollActiveSidebar, bindToggle, scroll2Top, sticky } from './event'
import { genTree, getRoute, isMobile, slugify, merge } from './util'

let OPTIONS = {}
let toc = []
const CACHE = {}

const renderTo = function (dom, content) {
  dom = typeof dom === 'object' ? dom : document.querySelector(dom)
  dom.innerHTML = content
  slugify.clear()

  return dom
}

/**
 * init render
 * @param  {Object} options
 */
export function init (options) {
  OPTIONS = options

  const renderer = new marked.Renderer()
  /**
   * render anchor tag
   * @link https://github.com/chjj/marked#overriding-renderer-methods
   */
  renderer.heading = function (text, level) {
    const slug = slugify(text)
    let route = ''

    if (OPTIONS.router) {
      route = `#/${getRoute()}`
    }

    toc.push({ level, slug: `${route}#${encodeURIComponent(slug)}`, title: text })

    return `<h${level} id="${slug}"><a href="${route}#${slug}" data-id="${slug}" class="anchor"><span>${text}</span></a></h${level}>`
  }
  // highlight code
  renderer.code = function (code, lang = '') {
    const hl = Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)
      .replace(/{{/g, '<span>{{</span>')

    return `<pre data-lang="${lang}"><code class="lang-${lang}">${hl}</code></pre>`
  }
  renderer.link = function (href, title, text) {
    if (OPTIONS.router && !/:/.test(href)) {
      href = `#/${href}`.replace(/\/\//g, '/')
    }

    return `<a href="${href}" title="${title || ''}">${text}</a>`
  }
  marked.setOptions(merge({ renderer }, OPTIONS.marked))
}

/**
 * App
 */
export function renderApp (dom, replace) {
  const nav = document.querySelector('nav') || document.createElement('nav')

  if (!OPTIONS.repo) nav.classList.add('no-badge')

  dom[replace ? 'outerHTML' : 'innerHTML'] = tpl.corner(OPTIONS.repo) +
    (OPTIONS.coverpage ? tpl.cover() : '') +
    tpl.main(OPTIONS.sidebarToggle ? tpl.toggle() : '')
  document.body.insertBefore(nav, document.body.children[0])

  // bind toggle
  bindToggle('button.sidebar-toggle')
  // bind sticky effect
  if (OPTIONS.coverpage) {
    !isMobile() && window.addEventListener('scroll', sticky)
  } else {
    document.body.classList.add('sticky')
  }
}

/**
 * article
 */
export function renderArticle (content) {
  renderTo('article', content ? marked(content) : 'not found')
  if (!OPTIONS.sidebar && !OPTIONS.loadSidebar) renderSidebar()

  if (content && typeof Vue !== 'undefined' && typeof Vuep !== 'undefined') {
    const vm = new Vue({ el: 'main' }) // eslint-disable-line
    vm.$nextTick(_ => scrollActiveSidebar())
  }
  if (OPTIONS.auto2top) scroll2Top()
}

/**
 * navbar
 */
export function renderNavbar (content) {
  if (CACHE.navbar && CACHE.navbar === content) return
  CACHE.navbar = content

  if (content) renderTo('nav', marked(content))
  activeLink('nav')
}

/**
 * sidebar
 */
export function renderSidebar (content) {
  let html

  if (content) {
    html = marked(content)
  } else if (OPTIONS.sidebar) {
    html = tpl.tree(OPTIONS.sidebar, '<ul>')
  } else {
    html = tpl.tree(genTree(toc, OPTIONS.maxLevel), '<ul>')
  }

  renderTo('aside.sidebar', html)
  const target = activeLink('aside.sidebar', true)
  if (content) renderSubSidebar(target)
  toc = []

  scrollActiveSidebar()
}

export function renderSubSidebar (target) {
  if (!OPTIONS.subMaxLevel) return
  target.parentNode.innerHTML += tpl.tree(genTree(toc, OPTIONS.subMaxLevel), '<ul>')
}

/**
 * Cover Page
 */
export function renderCover (content) {
  renderCover.dom = renderCover.dom || document.querySelector('section.cover')
  if (!content) {
    renderCover.dom.classList.remove('show')
    return
  }
  renderCover.dom.classList.add('show')
  if (renderCover.rendered) return

  // render cover
  let html = marked(content)
  const match = html.trim().match('<p><img[^s]+src="(.*?)"[^a]+alt="(.*?)"></p>$')

  // render background
  if (match) {
    const coverEl = document.querySelector('section.cover')

    if (match[2] === 'color') {
      coverEl.style.background = match[1]
    } else {
      coverEl.classList.add('has-mask')
      coverEl.style.backgroundImage = `url(${match[1]})`
    }
    html = html.replace(match[0], '')
  }

  renderTo('.cover-main', html)
  renderCover.rendered = true

  sticky()
}

/**
 * render loading bar
 * @return {[type]} [description]
 */
export function renderLoading ({ loaded, total, step }) {
  let num

  if (!CACHE.loading) {
    const div = document.createElement('div')

    div.classList.add('progress')
    document.body.appendChild(div)
    CACHE.loading = div
  }
  if (step) {
    num = parseInt(CACHE.loading.style.width, 10) + step
    num = num > 80 ? 80 : num
  } else {
    num = Math.floor(loaded / total * 100)
  }

  CACHE.loading.style.opacity = 1
  CACHE.loading.style.width = num >= 95 ? '100%' : num + '%'

  if (num >= 95) {
    clearTimeout(renderLoading.cacheTimeout)
    renderLoading.cacheTimeout = setTimeout(_ => {
      CACHE.loading.style.opacity = 0
      CACHE.loading.style.width = '0%'
    }, 200)
  }
}
