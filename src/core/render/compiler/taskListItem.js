export const taskListItemCompiler = ({ renderer }) =>
  (renderer.listitem = text => {
    const isTaskItem = /^(<input.*type="checkbox"[^>]*>)/.test(text);
    const html = isTaskItem
      ? `<li class="task-list-item"><label>${text}</label></li>`
      : `<li>${text}</li>`;

    return html;
  });
