import { helper as helperTpl } from '../tpl.js';

export const paragraphCompiler = ({ renderer }) =>
  (renderer.paragraph = function ({ tokens }) {
    const text = this.parser.parseInline(tokens);
    let result;

    if (text.startsWith('!&gt;')) {
      result = helperTpl('callout important', text);
    } else if (text.startsWith('?&gt;')) {
      result = helperTpl('callout tip', text);
    } else {
      result = /* html */ `<p>${text}</p>`;
    }

    return result;
  });
