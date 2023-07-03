import { helper as helperTpl } from '../tpl.js';

export const paragraphCompiler = ({ renderer }) =>
  (renderer.paragraph = text => {
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
