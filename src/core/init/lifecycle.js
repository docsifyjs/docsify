import { noop } from '../util/core';

export function initLifecycle(vm) {
  const hooks = [
    'init',
    'mounted',
    'beforeEach',
    'afterEach',
    'doneEach',
    'ready',
  ];

  vm._hooks = {};
  vm._hooksApi = {};
  hooks.forEach(hook => {
    const arr = (vm._hooks[hook] = []);
    vm._hooksApi[hook] = fn => arr.push(fn);
  });
}

export function callHook(vm, hookName, markdownOrHtml, next = noop) {
  const queue = vm._hooks[hookName];

  const runNextHook = function(index) {
    const hookFn = queue[index];

    if (index >= queue.length) {
      next(markdownOrHtml);
    } else if (typeof hookFn === 'function') {
      if (hookFn.length === 2) {
        const doneCallback = result => {
          markdownOrHtml = result;
          runNextHook(index + 1);
        };

        hookFn(markdownOrHtml, doneCallback);
      } else {
        const result = hookFn(markdownOrHtml);
        markdownOrHtml = result === undefined ? markdownOrHtml : result;
        runNextHook(index + 1);
      }
    } else {
      console.warn(
        'Skipping hook that was not a function (all plugin hooks should be functions). The hook was: ',
        hookFn
      );
      runNextHook(index + 1);
    }
  };

  runNextHook(0);
}
