import { helper as helperTpl } from '../tpl.js';

export const paragraphCompiler = ({ renderer }) =>
  (renderer.paragraph = text => {
    let result;
    if (/^!&gt;/.test(text)) {
      result = helperTpl('callout tip', text);
    } else if (/^\?&gt;/.test(text)) {
      result = helperTpl('callout warn', text);
    } else {
      result = /* html */ `<p>${text}</p>`;
    }

    return result;
  });
