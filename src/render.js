import marked from 'marked'
import Prism from 'prismjs'
import * as tpl from './tpl'
import * as event from './event'
import { genTree, getRoute, isMobile, slugify, merge } from './util'

let OPTIONS = {}
let markdown = marked
let toc = []
const CACHE = {}
const TIP_RE = /^!\s/

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

    return `<pre v-pre data-lang="${lang}"><code class="lang-${lang}">${hl}</code></pre>`
  }
  renderer.link = function (href, title, text) {
    if (OPTIONS.router && !/:/.test(href)) {
      href = `#/${href}`.replace(/\/\//g, '/')
    }

    return `<a href="${href}" title="${title || ''}">${text}</a>`
  }
  renderer.paragraph = function (text) {
    const isTip = TIP_RE.test(text)
    return isTip ? `<p class="tip">${text.replace(TIP_RE, '')}</p>` : `<p>${text}</p>`
  }

  if (typeof OPTIONS.markdown === 'function') {
    markdown.setOptions({ renderer })
    markdown = OPTIONS.markdown.call(this, markdown)
  } else {
    markdown.setOptions(merge({ renderer }, OPTIONS.markdown))
  }
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
  event.bindToggle('button.sidebar-toggle')
  // bind sticky effect
  if (OPTIONS.coverpage) {
    !isMobile() && window.addEventListener('scroll', event.sticky)
  } else {
    document.body.classList.add('sticky')
  }
}

/**
 * article
 */
export function renderArticle (content) {
  renderTo('article', content ? markdown(content) : 'not found')
  if (!OPTIONS.sidebar && !OPTIONS.loadSidebar) renderSidebar()

  if (content && typeof Vue !== 'undefined' && typeof Vuep !== 'undefined') {
    const vm = new Vue({ el: 'main' }) // eslint-disable-line
    vm.$nextTick(_ => event.scrollActiveSidebar())
  }
  if (OPTIONS.auto2top) setTimeout(() => event.scroll2Top(OPTIONS.auto2top), 0)
}

/**
 * navbar
 */
export function renderNavbar (content) {
  if (CACHE.navbar && CACHE.navbar === content) return
  CACHE.navbar = content

  if (content) renderTo('nav', markdown(content))
  event.activeLink('nav')
}

/**
 * sidebar
 */
export function renderSidebar (content) {
  let html

  if (content) {
    html = markdown(content)
    // find url tag
    html = html.match(/<ul[^>]*>([\s\S]+)<\/ul>/g)[0]
  } else if (OPTIONS.sidebar) {
    html = tpl.tree(OPTIONS.sidebar, '<ul>')
  } else {
    html = tpl.tree(genTree(toc, OPTIONS.maxLevel), '<ul>')
  }

  html = (OPTIONS.name ? `<h1><a href="${OPTIONS.nameLink}">${OPTIONS.name}</a></h1>` : '') + html
  renderTo('aside.sidebar', html)
  const target = event.activeLink('aside.sidebar', true)
  if (target) renderSubSidebar(target)
  toc = []

  event.scrollActiveSidebar()
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
  if (renderCover.rendered) return event.sticky()

  // render cover
  const cacheToc = toc.slice()
  let html = markdown(content)
  const match = html.trim().match('<p><img[^s]+src="(.*?)"[^a]+alt="(.*?)">([^<]*?)</p>$')

  toc = cacheToc.slice()

  // render background
  if (match) {
    const coverEl = document.querySelector('section.cover')

    if (match[2] === 'color') {
      coverEl.style.background = match[1] + (match[3] || '')
    } else {
      coverEl.classList.add('has-mask')
      coverEl.style.backgroundImage = `url(${match[1]})`
    }
    html = html.replace(match[0], '')
  }

  renderTo('.cover-main', html)
  renderCover.rendered = true

  event.sticky()
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
