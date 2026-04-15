import { helper as helperTpl } from '../tpl.js';

function renderParagraphText(text) {
  if (text.startsWith('!&gt;')) {
    return helperTpl('callout important', text);
  }
  if (text.startsWith('?&gt;')) {
    return helperTpl('callout tip', text);
  }
  return /* html */ `<p>${text}</p>`;
}

export const paragraphCompiler = ({ renderer }) =>
  (renderer.paragraph = function ({ tokens, embedTokenMap }) {
    let result;

    if (embedTokenMap && tokens?.length) {
      // Keep original inline order: plain text/link tokens stay inline, include links are replaced.
      const parts = [];
      let inlineBuffer = [];

      const flushInlineBuffer = () => {
        if (!inlineBuffer.length) {
          return;
        }
        const text = this.parser.parseInline(inlineBuffer);
        parts.push(renderParagraphText(text));
        inlineBuffer = [];
      };

      tokens.forEach((inlineToken, inlineIndex) => {
        const embedToken = embedTokenMap[inlineIndex];
        if (embedToken?.length) {
          flushInlineBuffer();
          parts.push(this.parser.parse(embedToken));
        } else {
          inlineBuffer.push(inlineToken);
        }
      });

      flushInlineBuffer();
      result = parts.join('');
    } else {
      const text = this.parser.parseInline(tokens);
      result = renderParagraphText(text);
    }

    return result;
  });
