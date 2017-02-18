import marked from 'marked'
import Prism from 'prismjs'

export const renderer = new marked.Renderer()

export function markdown () {

}

const toc = []

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
  if (!/:|(\/{2})/.test(href)) {
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
renderer.image = function (href, title, text) {
  const url = /:|(\/{2})/.test(href) ? href : ($docsify.basePath + href).replace(/\/+/g, '/')
  const titleHTML = title ? ` title="${title}"` : ''

  return `<img src="${url}" alt="${text}"${titleHTML} />`
}
