export const taskListCompiler = ({ renderer }) =>
  (renderer.list = (body, ordered, start) => {
    const isTaskList = /<li class="task-list-item">/.test(
      body.split('class="task-list"')[0]
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
