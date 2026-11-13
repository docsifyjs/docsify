let executions = 0;

export function renderResult(element, message) {
  executions += 1;
  element.textContent = `${message}; executions: ${executions}`;
}
