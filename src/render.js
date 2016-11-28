import marked from 'marked'
import Prism from 'prismjs'
import * as tpl from './tpl'

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

export default function (content, opts = {}) {
  const corner = opts.repo ? tpl.corner(opts.repo) : ''
  const article = tpl.article(marked(content))
  const sidebar = tpl.sidebar(tpl.tree(toc, opts))

  return corner + tpl.main({ article, sidebar })
}
