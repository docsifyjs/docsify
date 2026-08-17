import { noop } from '../util/core.js';

/** @typedef {import('../Docsify.js').Constructor} Constructor */

/**
 * @template {!Constructor} T
 * @param {T} Base - The class to extend
 */
export function Lifecycle(Base) {
  return class Lifecycle extends Base {
    /** @type {Record<string, Function[]>} */
    _hooks = {};

    _lifecycle = /** @type {Hooks} */ ({});

    initLifecycle() {
      const hooks = [
        'init',
        'mounted',
        'beforeEach',
        'afterEach',
        'doneEach',
        'ready',
      ];

      hooks.forEach((/** @type {string} */ hook) => {
        /** @type {Function[]} */
        const arr = (this._hooks[hook] = []);
        this._lifecycle[hook] = (/** @type {Function} */ fn) => arr.push(fn);
      });
    }

    /**
     * @param {string} hookName
     * @param {any} [data]
     * @param {Function} [next]
     */
    callHook(hookName, data, next = noop) {
      const queue = this._hooks[hookName];
      const catchPluginErrors = this.config.catchPluginErrors;

      /**
       * @param {number} index
       */
      const step = function (index) {
        const hookFn = queue[index];

        if (index >= queue.length) {
          next(data);
        } else if (typeof hookFn === 'function') {
          const errTitle = 'Docsify plugin error';

          if (hookFn.length === 2) {
            // FIXME this does not catch async errors. We can support async
            // functions for this, or add a second arg to next() functions.
            try {
              hookFn(data, (/** @type {string} */ result) => {
                data = result === undefined ? data : result;
                step(index + 1);
              });
            } catch (err) {
              if (catchPluginErrors) {
                // eslint-disable-next-line no-console
                console.error(errTitle, err);
              } else {
                throw err;
              }

              step(index + 1);
            }
          } else {
            try {
              const result = hookFn(data);

              data = result === undefined ? data : result;
              step(index + 1);
            } catch (err) {
              if (catchPluginErrors) {
                // eslint-disable-next-line no-console
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

/**
@typedef {{
  init(): void
  mounted(): void
  beforeEach: (
    ((markdown: string) => string) |
    ((markdown: string, next: (markdown?: string) => void) => void)
  )
  afterEach: (
    ((html: string) => string) |
    ((html: string, next: (html?: string) => void) => void)
  )
  doneEach(): void
  ready(): void
}} Hooks
*/
