import * as Prism from 'prismjs';
// See https://github.com/PrismJS/prism/pull/1367
import 'prismjs/components/prism-markup-templating.js';
import checkLangDependenciesAllLoaded, {
  sanitizeCodeLang,
} from '../../util/prism.js';

export const highlightCodeCompiler = ({ renderer }) =>
  (renderer.code = function ({ text, lang = 'markup' }) {
    const { escapedLang, prismLang } = sanitizeCodeLang(lang);

    checkLangDependenciesAllLoaded(prismLang);
    const langOrMarkup = Prism.languages[prismLang] || Prism.languages.markup;
    const code = Prism.highlight(
      text.replace(/@DOCSIFY_QM@/g, '`'),
      langOrMarkup,
      prismLang,
    );

    return /* html */ `<pre data-lang="${escapedLang}" class="language-${escapedLang}"><code class="lang-${escapedLang} language-${escapedLang}" tabindex="0">${code}</code></pre>`;
  });
