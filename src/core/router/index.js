import { supportsPushState } from '../util/env';
import * as dom from '../util/dom';
import { noop } from '../util/core';
import { HashHistory } from './history/hash';
import { HTML5History } from './history/html5';

/**
 * @typedef {{
 *   path?: string
 * }} Route
 */

/** @type {Route} */
let lastRoute = {};

/** @typedef {import('../Docsify').Constructor} Constructor */

/**
 * @template {!Constructor} T
 * @param {T} Base - The class to extend
 */
export function Router(Base) {
  return class Router extends Base {
    /** @param {any[]} args */
    constructor(...args) {
      super(...args);

      this.route = {};
    }

    updateRender() {
      this.router.normalize();
      this.route = this.router.parse();
      dom.body.setAttribute('data-page', this.route.file);
    }

    initRouter() {
      const config = this.config;
      const mode = config.routerMode || 'hash';
      let router;

      if (mode === 'history' && supportsPushState) {
        router = new HTML5History(config);
      } else {
        router = new HashHistory(config);
      }

      this.router = router;
      this.updateRender();
      lastRoute = this.route;

      // eslint-disable-next-line no-unused-vars
      router.onchange(params => {
        this.updateRender();
        this._updateRender();

        if (lastRoute.path === this.route.path) {
          this.$resetEvents(params.source);
          return;
        }

        this.$fetch(noop, this.$resetEvents.bind(this, params.source));
        lastRoute = this.route;
      });
    }
  };
}
