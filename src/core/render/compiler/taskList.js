export const taskListCompiler = ({ renderer }) =>
  (renderer.list = function (token) {
    const ordered = token.ordered;
    const start = token.start;

    let body = '';
    for (let j = 0; j < token.items.length; j++) {
      const item = token.items[j];
      body += this.listitem?.(item);
    }

    const isTaskList = /<li class="task-list-item">/.test(
      body.split('class="task-list"')[0],
    );
    const isStartReq = start && start > 1;
    const tag = ordered ? 'ol' : 'ul';
    const tagAttrs = [
      isTaskList ? 'class="task-list"' : '',
      isStartReq ? `start="${start}"` : '',
    ]
      .join(' ')
      .trim();

    return `<${tag} ${tagAttrs}>${body}</${tag}>`;
  });
