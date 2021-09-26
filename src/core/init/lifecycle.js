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

// FIXME!
// FIXME!
// FIXME! Hooks can be async (they need to call the second callback arg passed
// to them, if they have to parameters). This allows plugins to be executed
// in sequence even if they run async code. However! On the last hook function
// of a particular type (for example the last afterEach hook), the next hook of
// the next type (for example the first doneEach hook) will start executing
// before the previous last hook of the last type completed (for example the
// first doneEach hook will begin executing before the last afterEach hook
// has completed). THIS IS BAD! Most people are probably not using async
// hooks in order to encounter this, but if they do, it will be jarring!

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
