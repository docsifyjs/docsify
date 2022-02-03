import { noop } from '../util/core';

/** @typedef {import('../Docsify').Constructor} Constructor */

/**
 * @template {!Constructor} T
 * @param {T} Base - The class to extend
 */
export function Lifecycle(Base) {
  return class Lifecycle extends Base {
    initLifecycle() {
      const hooks = [
        'init',
        'mounted',
        'beforeEach',
        'afterEach',
        'doneEach',
        'ready',
      ];

      this._hooks = {};
      this._lifecycle = {};

      hooks.forEach(hook => {
        const arr = (this._hooks[hook] = []);
        this._lifecycle[hook] = fn => arr.push(fn);
      });
    }

    callHook(hookName, data, next = noop) {
      const queue = this._hooks[hookName];

      const step = function (index) {
        const hookFn = queue[index];

        if (index >= queue.length) {
          next(data);
        } else if (typeof hookFn === 'function') {
          const errTitle = `Docsify plugin ${
            hookFn.name ? '"' + hookFn.name + '"' : ''
          } error (${hookName})`;

          if (hookFn.length === 2) {
            try {
              hookFn(data, result => {
                data = result;
              });
            } catch (err) {
              console.error(errTitle, err);
            }
            step(index + 1);
          } else {
            let result;

            try {
              result = hookFn(data);
            } catch (err) {
              console.error(errTitle, err);
            }

            data = result || data;
            step(index + 1);
          }
        } else {
          step(index + 1);
        }
      };

      step(0);
    }
  };
}
