import Prism from 'prismjs'
// See https://github.com/PrismJS/prism/pull/1367
import 'prismjs/components/prism-markup-templating'

export const highlightCodeCompiler = ({renderer}) => renderer.code = function (code, lang = '') {
  code = code.replace(/@DOCSIFY_QM@/g, '`')
  const langOrMarkup = Prism.languages[lang] || Prism.languages.markup
  const hl = Prism.highlight(code, langOrMarkup)

  return `<pre v-pre data-lang="${lang}"><code class="lang-${lang}">${hl}</code></pre>`
}
