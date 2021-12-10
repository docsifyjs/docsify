import { Router } from './router/index.js';
import { Render } from './render/index.js';
import { Fetch } from './fetch/index.js';
import { Events } from './event/index.js';
import initGlobalAPI from './global-api.js';

import config from './config.js';
import { isFn } from './util/core';
import { Lifecycle } from './init/lifecycle';

/** @typedef {new (...args: any[]) => any} Constructor */

// eslint-disable-next-line new-cap
export class Docsify extends Fetch(Events(Render(Router(Lifecycle(Object))))) {
  constructor() {
    super();

    this.config = config(this);

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
    []
      .concat(this.config.plugins)
      .forEach((fn) => isFn(fn) && fn(this._lifecycle, this));
  }
}

/**
 * Global API
 */
initGlobalAPI();
