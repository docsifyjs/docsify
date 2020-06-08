import config from '../config';
import { initEvent } from '../event';
import { initFetch } from '../fetch';

export function initMixin(Base = class {}) {
  return class extends Base {
    _init() {
      this.config = config(this);

      this.initLifecycle(); // Init hooks
      this.initPlugin(); // Install plugins
      this.callHook('init');
      this.initRouter(); // Add router
      this.initRender(); // Render base DOM
      initEvent(this); // Bind events
      initFetch(this); // Fetch data
      this.callHook('mounted');
    }
  };
}
