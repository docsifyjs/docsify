import config from '../config';

export function initMixin(Base = class {}) {
  return class extends Base {
    _init() {
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
  };
}
