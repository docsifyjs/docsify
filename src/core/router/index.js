import * as dom from '../util/dom.js';
import { noop } from '../util/core.js';
import { HashHistory } from './history/hash.js';
import { HTML5History } from './history/html5.js';

/**
 * @typedef {{
 *   path?: string
 * }} Route
 */

/** @type {Route} */
let lastRoute = {};

/** @typedef {import('../Docsify.js').Constructor} Constructor */

/**
 * @template {!Constructor} T
 * @param {T} Base - The class to extend
 */
export function Router(Base) {
  return class Router extends Base {
    route = {};

    updateRender() {
      this.router.normalize();
      this.route = this.router.parse();
      dom.body.setAttribute('data-page', this.route.file);
    }

    initRouter() {
      const config = this.config;
      const mode = config.routerMode || 'hash';
      let router;

      if (mode === 'history') {
        router = new HTML5History(config);
      } else {
        router = new HashHistory(config);
      }

      this.router = router;
      this.updateRender();
      lastRoute = this.route;

      router.onchange(params => {
        this.updateRender();
        this._updateRender();

        if (lastRoute.path === this.route.path) {
          this.onNavigate(params.source);
          return;
        }

        this.$fetch(noop, this.onNavigate.bind(this, params.source));
        lastRoute = this.route;
      });
    }
  };
}
