export const taskListItemCompiler = ({ renderer }) =>
  (renderer.listitem = text => {
    const isTaskItem = /^(<input.*type="checkbox"[^>]*>)/.test(text);
    const html = isTaskItem
      ? /* html */ `<li class="task-list-item"><label>${text}</label></li>`
      : /* html */ `<li>${text}</li>`;

    return html;
  });
