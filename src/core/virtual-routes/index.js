import { makeExactMatcher } from './match-utils';

/** @typedef {import('../Docsify').Constructor} Constructor */

/** @typedef {Record<string, string | VirtualRouteHandler>} VirtualRoutesMap */
/** @typedef {(route: string, match: RegExpMatchArray | null) => string | void | Promise<string | void> } VirtualRouteHandler */

/**
 * @template {!Constructor} T
 * @param {T} Base - The class to extend
 */
export function VirtualRoutes(Base) {
  return class VirtualRoutes extends Base {
    /**
     * Gets the Routes object from the configuration
     * @returns {VirtualRoutesMap}
     */
    routes() {
      return this.config.routes || {};
    }

    /**
     * Attempts to match the given path with a virtual route.
     * @param {string} path
     * @returns {Promise<string | null>} resolves to string if route was matched, otherwise null
     */
    matchVirtualRoute(path) {
      const virtualRoutes = this.routes();

      const virtualRoutePaths = Object.keys(virtualRoutes);

      /**
       * This is a tail recursion that resolves to the first properly matched route, to itself or to null.
       * Used because async\await is not supported, so for loops over promises are out of the question...
       * @returns {Promise<string | null>}
       */
      function asyncMatchNextRoute() {
        const virtualRoutePath = virtualRoutePaths.shift();
        if (!virtualRoutePath) {
          return Promise.resolve(null);
        }

        const matcher = makeExactMatcher(virtualRoutePath);
        const matched = path.match(matcher);

        if (!matched) {
          return Promise.resolve().then(asyncMatchNextRoute);
        }

        const virtualRouteContentOrFn = virtualRoutes[virtualRoutePath];

        if (typeof virtualRouteContentOrFn === 'string') {
          return Promise.resolve(virtualRouteContentOrFn);
        } else if (typeof virtualRouteContentOrFn === 'function') {
          return Promise.resolve()
            .then(() => virtualRouteContentOrFn(path, matched))
            .then(contents => {
              if (typeof contents === 'string') {
                return contents;
              } else if (contents === false) {
                return null;
              } else {
                return asyncMatchNextRoute();
              }
            });
        } else {
          return Promise.resolve().then(asyncMatchNextRoute);
        }
      }

      return asyncMatchNextRoute();
    }
  };
}
