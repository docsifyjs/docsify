import marked from 'marked'
import Prism from 'prismjs'
import genToc from './gen-toc'

const toc = []
const renderer = new marked.Renderer()

/**
 * render anchor tag
 * @link https://github.com/chjj/marked#overriding-renderer-methods
 */
renderer.heading = function (text, level) {
  const slug = text.toLowerCase().replace(/[\s\n\t]+/g, '-')

  toc.push({ level, slug, title: text })

  return `<h${level} id="${slug}"><a href="#${slug}" class="anchor"></a>${text}</h${level}>`
}
marked.setOptions({
  renderer,
  highlight (code, lang) {
    return Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)
  }
})

export default function (content) {
  const section = `<section class="content">
    <article class="markdown-section">${marked(content)}</article>
  </section>`
  const sidebar = `<aside class="sidebar">${genToc(toc)}</aside>`

  return `<main>${sidebar}${section}</main>`
}
