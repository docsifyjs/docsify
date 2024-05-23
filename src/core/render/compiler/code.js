import Prism from 'prismjs';
// See https://github.com/PrismJS/prism/pull/1367
import 'prismjs/components/prism-markup-templating.js';

export const highlightCodeCompiler = ({ renderer }) =>
  (renderer.code = function (code, lang = 'markup') {
    const langOrMarkup = Prism.languages[lang] || Prism.languages.markup;
    const text = Prism.highlight(
      code.replace(/@DOCSIFY_QM@/g, '`'),
      langOrMarkup,
      lang,
    );

    return /* html */ `<pre data-lang="${lang}"><code class="lang-${lang}" tabindex="0">${text}</code></pre>`;
  });
