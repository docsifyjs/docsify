import { helper as helperTpl } from '../tpl';

export const paragraphCompiler = ({ renderer }) =>
  (renderer.paragraph = text => {
    let result;
    if (/^!&gt;/.test(text)) {
      result = helperTpl('tip', text);
    } else if (/^\?&gt;/.test(text)) {
      result = helperTpl('warn', text);
    } else {
      result = `<p>${text}</p>`;
    }

    return result;
  });
