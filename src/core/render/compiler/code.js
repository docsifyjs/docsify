import Prism from 'prismjs';
// See https://github.com/PrismJS/prism/pull/1367
import 'prismjs/components/prism-markup-templating.js';
import checkLangDependenciesAllLoaded from '../../util/prism.js';

export const highlightCodeCompiler = ({ renderer }) =>
  (renderer.code = function ({ text, lang = 'markup' }) {
    checkLangDependenciesAllLoaded(lang);
    const langOrMarkup = Prism.languages[lang] || Prism.languages.markup;
    const code = Prism.highlight(
      text.replace(/@DOCSIFY_QM@/g, '`'),
      langOrMarkup,
      lang,
    );

    return /* html */ `<pre data-lang="${lang}" class="language-${lang}"><code class="lang-${lang} language-${lang}" tabindex="0">${code}</code></pre>`;
  });
