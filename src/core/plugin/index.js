import { isFn } from '../util/core';

export function pluginMixin(Base = class {}) {
  return class Plugin extends Base {
    initPlugin() {
      []
        .concat(this.config.plugins)
        .forEach(fn => isFn(fn) && fn(this._lifecycle, this));
    }
  };
}
