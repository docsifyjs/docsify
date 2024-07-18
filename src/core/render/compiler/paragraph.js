import { helper as helperTpl } from '../tpl.js';

export const paragraphCompiler = ({ renderer }) =>
  (renderer.paragraph = function ({ tokens }) {
    const text = this.parser.parseInline(tokens);
    let result;
    if (/^!&gt;/.test(text)) {
      result = helperTpl('tip', text);
    } else if (/^\?&gt;/.test(text)) {
      result = helperTpl('warn', text);
    } else {
      result = /* html */ `<p>${text}</p>`;
    }

    return result;
  });
