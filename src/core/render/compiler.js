import marked from 'marked'
import Prism from 'prismjs'
import { helper as helperTpl } from './tpl'
import { slugify, clearSlugCache } from './slugify'
import { emojify } from './emojify'
import { toURL } from '../route/hash'
import { isFn, merge, cached } from '../util/core'

let markdownCompiler = marked
let contentBase = ''
let renderer = new marked.Renderer()

const toc = []

/**
 * Compile markdown content
 */
export const markdown = cached(text => {
  let html = ''

  if (!text) return text

  html = markdownCompiler(text)
  html = emojify(html)
  clearSlugCache()

  return html
})

markdown.renderer = renderer

markdown.init = function (config = {}, context = window.location.pathname) {
  contentBase = context

  if (isFn(config)) {
    markdownCompiler = config(marked, renderer)
  } else {
    renderer = merge(renderer, config.renderer)
    marked.setOptions(merge(config, { renderer }))
  }
}

/**
 * render anchor tag
 * @link https://github.com/chjj/marked#overriding-renderer-methods
 */
renderer.heading = function (text, level) {
  const slug = slugify(text)
  const url = toURL(contentBase, { id: slug })

  toc.push({ level, slug: url, title: text })

  return `<h${level} id="${slug}"><a href="${url}" data-id="${slug}" class="anchor"><span>${text}</span></a></h${level}>`
}
// highlight code
renderer.code = function (code, lang = '') {
  const hl = Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)

  return `<pre v-pre data-lang="${lang}"><code class="lang-${lang}">${hl}</code></pre>`
}
renderer.link = function (href, title, text) {
  if (!/:|(\/{2})/.test(href)) {
    // TODO
    href = `#/${href}`.replace(/\/+/g, '/')
  }
  return `<a href="${href}" title="${title || ''}">${text}</a>`
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
  // TODO
  // get base path
  // const url = /:|(\/{2})/.test(href) ? href : ($docsify.basePath + href).replace(/\/+/g, '/')
  // const titleHTML = title ? ` title="${title}"` : ''

  // return `<img src="${url}" alt="${text}"${titleHTML} />`
}

/**
 * Compile sidebar
 */
export function sidebar (text) {

}
