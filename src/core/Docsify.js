import prism from 'prismjs';
import { Router } from './router/index.js';
import { Render } from './render/index.js';
import { Fetch } from './fetch/index.js';
import { Events } from './event/index.js';
import { VirtualRoutes } from './virtual-routes/index.js';

import config from './config.js';
import { isFn } from './util/core.js';
import { Lifecycle } from './init/lifecycle.js';

export { prism };
export { marked } from 'marked';
export * as util from './util/index.js';
export * as dom from './util/dom.js';
export { Compiler } from './render/compiler.js';
export { slugify } from './render/slugify.js';
export { get } from './util/ajax.js';

/** @typedef {new (...args: any[]) => any} Constructor */
/** @typedef {import('./config.js').DocsifyConfig} DocsifyConfig */

// eslint-disable-next-line new-cap
export class Docsify extends Fetch(
  // eslint-disable-next-line new-cap
  Events(Render(VirtualRoutes(Router(Lifecycle(Object)))))
) {
  /** @type {DocsifyConfig} */
  config;

  /** @param {Partial<DocsifyConfig>} conf */
  constructor(conf = {}) {
    super();

    this.config = config(this, conf);

    this.initLifecycle(); // Init hooks
    this.initPlugin(); // Install plugins
    this.callHook('init');
    this.initRouter(); // Add router
    this.initRender(); // Render base DOM
    this.initEvent(); // Bind events
    this.initFetch(); // Fetch data
    this.callHook('mounted');
  }

  initPlugin() {
    this.config.plugins.forEach(fn => {
      try {
        isFn(fn) && fn(this._lifecycle, this);
      } catch (err) {
        if (this.config.catchPluginErrors) {
          const errTitle = 'Docsify plugin error';
          console.error(errTitle, err);
        } else {
          throw err;
        }
      }
    });
  }
}

export const version = '__VERSION__';
