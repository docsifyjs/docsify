import { isFn, noop } from '../util/core';

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

    callHook(hookName, data, next = noop, registeredPluginHooks = []) {
      // let myPredictor = (meta)=>{
      //   return true;
      // }

      // let myWorker = (ctx, number) => {
      //   console.log(`Current ctx is ${ctx}`)
      //   console.log(`Current number is ${number}`)
      // }
      // registeredPluginHooks.push({predicator:myPredictor, operator:myWorker})

      const queue = this._hooks[hookName];
      const catchPluginErrors = this.config.catchPluginErrors;

      const step = function (index) {
        const hookFn = queue[index];
        let matchedPluginHooks = [];
        if (index >= queue.length) {
          next(data);
        } else if (typeof hookFn === 'function') {
          const errTitle = 'Docsify plugin error';
          // find all matched pluginHook

          if (hookFn.enableDocsifyPluginHook) {
            registeredPluginHooks.forEach(registeredPluginHook => {
              const pluginMeta = hookFn.pluginMeta || {};
              const hookPredicator = registeredPluginHook.predicator;
              isFn(hookPredicator) &&
                hookPredicator(pluginMeta) &&
                matchedPluginHooks.push(registeredPluginHook.operator);
            });
          }

          if (hookFn.length === 2) {
            try {
              hookFn(
                data,
                result => {
                  data = result;
                  step(index + 1);
                },
                matchedPluginHooks
              );
            } catch (err) {
              if (catchPluginErrors) {
                console.error(errTitle, err);
              } else {
                throw err;
              }

              step(index + 1);
            }
          } else {
            try {
              const result = hookFn(data, matchedPluginHooks);

              data = result === undefined ? data : result;
              step(index + 1);
            } catch (err) {
              if (catchPluginErrors) {
                console.error(errTitle, err);
              } else {
                throw err;
              }

              step(index + 1);
            }
          }
        } else {
          step(index + 1);
        }
      };

      step(0);
    }
  };
}
