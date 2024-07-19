import { helper as helperTpl } from '../tpl.js';

export const paragraphCompiler = ({ renderer }) =>
  (renderer.paragraph = text => {
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
