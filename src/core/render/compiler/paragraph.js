import { markdownParagraph } from '../tpl';

export const paragraphCompiler = ({ renderer }) =>
  (renderer.paragraph = text => {
    let result;
    if (/^!&gt;/.test(text)) {
      result = markdownParagraph('tip', text);
    } else if (/^\?&gt;/.test(text)) {
      result = markdownParagraph('warn', text);
    } else {
      result = `<p>${text}</p>`;
    }

    return result;
  });
