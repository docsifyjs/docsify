import { Router } from './router/index.js';
import { Render } from './render/index.js';
import { Fetch } from './fetch/index.js';
import { Events } from './event/index.js';
import { VirtualRoutes } from './virtual-routes/index.js';

import config from './config.js';
import { isFn } from './util/core.js';
import { Lifecycle } from './init/lifecycle.js';

/** @typedef {new (...args: any[]) => any} Constructor */

export class Docsify extends Fetch(
  Events(Render(VirtualRoutes(Router(Lifecycle(Object))))),
) {
  config = config(this);

  constructor() {
    super();

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

          // eslint-disable-next-line no-console
          console.error(errTitle, err);
        } else {
          throw err;
        }
      }
    });
  }
}
