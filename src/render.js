import marked from 'marked'
import Prism from 'prismjs'
import * as tpl from './tpl'
import { activeLink, scrollActiveSidebar, bindToggle } from './event'
import { genTree } from './util'

const renderTo = function (dom, content) {
  dom = typeof dom === 'object' ? dom : document.querySelector(dom)
  dom.innerHTML = content

  return dom
}
const toc = []
const renderer = new marked.Renderer()

/**
 * render anchor tag
 * @link https://github.com/chjj/marked#overriding-renderer-methods
 */
renderer.heading = function (text, level) {
  const slug = text.toLowerCase().replace(/<(?:.|\n)*?>/gm, '').replace(/[\s\n\t]+/g, '-')

  toc.push({ level, slug: '#' + slug, title: text })

  return `<h${level} id="${slug}"><a href="#${slug}" class="anchor"></a>${text}</h${level}>`
}
// highlight code
renderer.code = function (code, lang = '') {
  const hl = Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)

  return `<pre data-lang="${lang}"><code class="lang-${lang}">${hl}</code></pre>`
}
marked.setOptions({ renderer })

/**
 * App
 */
export function renderApp (dom, replace, opts) {
  const nav = document.querySelector('nav') || document.createElement('nav')

  dom[replace ? 'outerHTML' : 'innerHTML'] = tpl.toggle(opts.sidebarToggle) + tpl.corner(opts.repo) + tpl.main()
  document.body.insertBefore(nav, document.body.children[0])

  // bind toggle
  bindToggle('button.sidebar-toggle')
}

/**
 * article
 */
export function renderArticle (content, OPTIONS) {
  renderTo('article', content ? marked(content) : 'not found')
  if (!renderSidebar.rendered) renderSidebar(null, OPTIONS)
  if (!renderNavbar.rendered) renderNavbar(null, OPTIONS)
}

/**
 * navbar
 */
export function renderNavbar (content, OPTIONS = {}) {
  renderNavbar.rendered = true

  if (content) renderTo('nav', marked(content))
  activeLink('nav')
}

/**
 * sidebar
 */
export function renderSidebar (content, OPTIONS = {}) {
  renderSidebar.rendered = true

  let isToc = false

  if (content) {
    content = marked(content)
  } else if (OPTIONS.sidebar) {
    content = tpl.tree(OPTIONS.sidebar, '<ul>')
  } else {
    content = tpl.tree(genTree(toc, OPTIONS.maxLevel), '<ul>')
    isToc = true
  }

  renderTo('aside.sidebar', content)
  isToc ? scrollActiveSidebar() : activeLink('aside.sidebar', true)
}
