import Prism from 'prismjs';
// See https://github.com/PrismJS/prism/pull/1367
import 'prismjs/components/prism-markup-templating';

export const highlightCodeCompiler = ({ renderer }) =>
  (renderer.code = function (code, lang = 'markup') {
    const langOrMarkup = Prism.languages[lang] || Prism.languages.markup;
    const text = Prism.highlight(
      code.replace(/@DOCSIFY_QM@/g, '`'),
      langOrMarkup,
      lang
    );

    return `<pre v-pre data-lang="${lang}"><code class="lang-${lang}">${text}</code></pre>`;
  });
