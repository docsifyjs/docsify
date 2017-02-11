import marked from 'marked'
import Prism from 'prismjs'
import * as tpl from './tpl'
import * as event from './event'
import * as polyfill from './polyfill'
import { genTree, getRoute, isMobile, slugify, merge, emojify } from './util'

let markdown = marked
let toc = []
const CACHE = {}
const originTitle = document.title

const renderTo = function (dom, content) {
  dom = typeof dom === 'object' ? dom : document.querySelector(dom)
  dom.innerHTML = content
  slugify.clear()

  return dom
}

/**
 * init render
 */
export function init () {
  const renderer = new marked.Renderer()
  /**
   * render anchor tag
   * @link https://github.com/chjj/marked#overriding-renderer-methods
   */
  renderer.heading = function (text, level) {
    const slug = slugify(text)
    let route = ''

    route = `#/${getRoute()}`
    toc.push({ level, slug: `${route}#${encodeURIComponent(slug)}`, title: text })

    return `<h${level} id="${slug}"><a href="${route}#${slug}" data-id="${slug}" class="anchor"><span>${text}</span></a></h${level}>`
  }
  // highlight code
  renderer.code = function (code, lang = '') {
    const hl = Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)

    return `<pre v-pre data-lang="${lang}"><code class="lang-${lang}">${hl}</code></pre>`
  }
  renderer.link = function (href, title, text) {
    if (!/:/.test(href)) {
      href = `#/${href}`.replace(/\/+/g, '/')
    }

    return `<a href="${href}" title="${title || ''}">${text}</a>`
  }
  renderer.paragraph = function (text) {
    if (/^!&gt;/.test(text)) {
      return tpl.helper('tip', text)
    } else if (/^\?&gt;/.test(text)) {
      return tpl.helper('warn', text)
    }
    return `<p>${text}</p>`
  }

  if (typeof $docsify.markdown === 'function') {
    markdown.setOptions({ renderer })
    markdown = $docsify.markdown.call(this, markdown)
  } else {
    markdown.setOptions(merge({ renderer }, $docsify.markdown))
  }

  const md = markdown

  markdown = text => emojify(md(text))

  window.Docsify.utils.marked = text => {
    const result = markdown(text)
    toc = []
    return result
  }
}

/**
 * App
 */
export function renderApp (dom, replace) {
  const nav = document.querySelector('nav') || document.createElement('nav')
  const body = document.body
  const head = document.head

  if (!$docsify.repo) nav.classList.add('no-badge')

  dom[replace ? 'outerHTML' : 'innerHTML'] = tpl.corner($docsify.repo) +
    ($docsify.coverpage ? tpl.cover() : '') +
    tpl.main()
  body.insertBefore(nav, body.children[0])

  // theme color
  if ($docsify.themeColor) {
    head.innerHTML += tpl.theme($docsify.themeColor)
    polyfill.cssVars()
  }

  // render name
  if ($docsify.name) {
    const aside = document.querySelector('.sidebar')
    aside.innerHTML = `<h1><a href="${$docsify.nameLink}">${$docsify.name}</a></h1>` + aside.innerHTML
  }

  // bind toggle
  event.bindToggle('button.sidebar-toggle')
  // bind sticky effect
  if ($docsify.coverpage) {
    !isMobile() && window.addEventListener('scroll', event.sticky)
  } else {
    body.classList.add('sticky')
  }
}

/**
 * article
 */
export function renderArticle (content) {
  renderTo('article', content ? markdown(content) : 'not found')
  if (!$docsify.loadSidebar) renderSidebar()

  if (content && typeof Vue !== 'undefined') {
    CACHE.vm && CACHE.vm.$destroy()

    const script = [].slice.call(
      document.body.querySelectorAll('article>script'))
        .filter(script => !/template/.test(script.type)
      )[0]
    const code = script ? script.innerText.trim() : null

    script && script.remove()
    CACHE.vm = code
      ? new Function(`return ${code}`)()
      : new Vue({ el: 'main' }) // eslint-disable-line
    CACHE.vm && CACHE.vm.$nextTick(_ => event.scrollActiveSidebar())
  }
  if ($docsify.auto2top) setTimeout(() => event.scroll2Top($docsify.auto2top), 0)
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
  } else {
    html = tpl.tree(genTree(toc, $docsify.maxLevel), '<ul>')
  }

  renderTo('.sidebar-nav', html)

  if (toc[0] && toc[0].level === 1) {
    document.title = `${toc[0].title}${originTitle ? ' - ' + originTitle : ''}`
  }

  const target = event.activeLink('.sidebar-nav', true)
  if (target) renderSubSidebar(target)

  toc = []
  event.scrollActiveSidebar()
}

export function renderSubSidebar (target) {
  if (!$docsify.subMaxLevel) return
  toc[0] && toc[0].level === 1 && toc.shift()
  target.parentNode.innerHTML += tpl.tree(genTree(toc, $docsify.subMaxLevel), '<ul>')
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
