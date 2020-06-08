import config from '../config';
import { initRender } from '../render';
import { initRouter } from '../router';
import { initEvent } from '../event';
import { initFetch } from '../fetch';
import { isFn } from '../util/core';

export function initMixin(Base = class {}) {
  return class extends Base {
    _init() {
      this.config = config(this);

      this.initLifecycle(); // Init hooks
      initPlugin(this); // Install plugins
      this.callHook('init');
      initRouter(this); // Add router
      initRender(this); // Render base DOM
      initEvent(this); // Bind events
      initFetch(this); // Fetch data
      this.callHook('mounted');
    }
  };
}

function initPlugin(vm) {
  [].concat(vm.config.plugins).forEach(fn => isFn(fn) && fn(vm._lifecycle, vm));
}
