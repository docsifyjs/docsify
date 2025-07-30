export const taskListItemCompiler = ({ renderer }) =>
  (renderer.listitem = function (item) {
    let text = '';
    if (item.task) {
      const checkbox = this.checkbox?.({ checked: !!item.checked });
      if (item.loose) {
        if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
          item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
          if (
            item.tokens[0].tokens &&
            item.tokens[0].tokens.length > 0 &&
            item.tokens[0].tokens[0].type === 'text'
          ) {
            item.tokens[0].tokens[0].text =
              checkbox + ' ' + item.tokens[0].tokens[0].text;
          }
        } else {
          item.tokens.unshift({
            type: 'text',
            raw: checkbox + ' ',
            text: checkbox + ' ',
          });
        }
      } else {
        text += checkbox + ' ';
      }
    }

    text += this.parser?.parse(item.tokens, !!item.loose);

    const isTaskItem = /^(<input.*type="checkbox"[^>]*>)/.test(text);
    const html = isTaskItem
      ? /* html */ `<li class="task-list-item"><label>${text}</label></li>`
      : /* html */ `<li>${text}</li>`;

    return html;
  });
