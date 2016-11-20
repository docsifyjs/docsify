import marked from 'marked'
import Prism from 'prismjs'

const renderer = new marked.Renderer()

/**
 * render anchor tag
 * @link https://github.com/chjj/marked#overriding-renderer-methods
 */
renderer.heading = function (text, level) {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')

  return '<h' + level + '><a name="' + escapedText + '" class="anchor" href="#' +
     escapedText + '"><span class="header-link"></span></a>' + text +
     '</h' + level + '>'
}

marked.setOptions({
  highlight (code, lang) {
    return Prism.highlight(code, Prism.languages[lang])
  }
})

export default function (content) {
  return marked(content, { renderer })
}
