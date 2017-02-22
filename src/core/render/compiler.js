import marked from 'marked'
import Prism from 'prismjs'
import { helper as helperTpl, tree as treeTpl } from './tpl'
import { genTree } from './gen-tree'
import { slugify } from './slugify'
import { emojify } from './emojify'
import { toURL, parse } from '../route/hash'
import { getBasePath, isAbsolutePath, getPath } from '../route/util'
import { isFn, merge, cached } from '../util/core'

let markdownCompiler = marked
let contentBase = ''
let currentPath = ''
let renderer = new marked.Renderer()
const cacheTree = {}
let toc = []

/**
 * Compile markdown content
 */
export const markdown = cached(text => {
  let html = ''

  if (!text) return text

  html = markdownCompiler(text)
  html = emojify(html)
  slugify.clear()

  return html
})

markdown.renderer = renderer

markdown.init = function (config = {}, base = window.location.pathname) {
  contentBase = getBasePath(base)
  currentPath = parse().path

  if (isFn(config)) {
    markdownCompiler = config(marked, renderer)
  } else {
    renderer = merge(renderer, config.renderer)
    marked.setOptions(merge(config, { renderer }))
  }
}

markdown.update = function () {
  currentPath = parse().path
}

/**
 * render anchor tag
 * @link https://github.com/chjj/marked#overriding-renderer-methods
 */
renderer.heading = function (text, level) {
  const slug = slugify(text)
  const url = toURL(currentPath, { id: slug })

  toc.push({ level, slug: url, title: text })

  return `<h${level} id="${slug}"><a href="${url}" data-id="${slug}" class="anchor"><span>${text}</span></a></h${level}>`
}
// highlight code
renderer.code = function (code, lang = '') {
  const hl = Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)

  return `<pre v-pre data-lang="${lang}"><code class="lang-${lang}">${hl}</code></pre>`
}
renderer.link = function (href, title, text) {
  let blank = ''
  if (!/:|(\/{2})/.test(href)) {
    href = toURL(href)
  } else {
    blank = ' target="_blank"'
  }
  if (title) {
    title = ` title="${title}"`
  }
  return `<a href="${href}"${title}${blank}>${text}</a>`
}
renderer.paragraph = function (text) {
  if (/^!&gt;/.test(text)) {
    return helperTpl('tip', text)
  } else if (/^\?&gt;/.test(text)) {
    return helperTpl('warn', text)
  }
  return `<p>${text}</p>`
}
renderer.image = function (href, title, text) {
  let url = href
  const titleHTML = title ? ` title="${title}"` : ''

  if (!isAbsolutePath(href)) {
    url = getPath(contentBase, href)
  }

  return `<img src="${url}" data-origin="${href}" alt="${text}"${titleHTML}>`
}

/**
 * Compile sidebar
 */
export function sidebar (text, level) {
  let html = ''

  if (text) {
    html = markdown(text)
    html = html.match(/<ul[^>]*>([\s\S]+)<\/ul>/g)[0]
  } else {
    const tree = genTree(toc, level)
    html = treeTpl(tree, '<ul>')
  }

  return html
}

/**
 * Compile sub sidebar
 */
export function subSidebar (el, level) {
  if (el) {
    toc[0] && toc[0].level === 1 && toc.shift()
    const tree = cacheTree[currentPath] || genTree(toc, level)
    el.parentNode.innerHTML += treeTpl(tree, '<ul class="app-sub-sidebar">')
    cacheTree[currentPath] = tree
  }
  toc = []
}

/**
 * Compile cover page
 */
export function cover (text) {
  const cacheToc = toc.slice()
  const html = markdown(text)

  toc = cacheToc.slice()

  return html
}
