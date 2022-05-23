import { makeExactMatcher } from './exact-match';
import { createNextFunction } from './next';

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
     * @param {string} path the path of the route to match
     * @returns {Promise<string | null>} resolves to string if route was matched, otherwise null
     */
    matchVirtualRoute(path) {
      const virtualRoutes = this.routes();
      const virtualRoutePaths = Object.keys(virtualRoutes);

      let done = () => null;

      /**
       * This is a tail recursion that iterates over all the available routes.
       * It can result in one of two ways:
       * 1. Call itself (essentially reviewing the next route)
       * 2. Call the "done" callback with the result (either the contents, or "null" if no match was found)
       */
      function asyncMatchNextRoute() {
        const virtualRoutePath = virtualRoutePaths.shift();
        if (!virtualRoutePath) {
          return done(null);
        }

        const matcher = makeExactMatcher(virtualRoutePath);
        const matched = path.match(matcher);

        if (!matched) {
          return asyncMatchNextRoute();
        }

        const virtualRouteContentOrFn = virtualRoutes[virtualRoutePath];

        if (typeof virtualRouteContentOrFn === 'string') {
          const contents = virtualRouteContentOrFn;
          return done(contents);
        }

        if (typeof virtualRouteContentOrFn === 'function') {
          const fn = virtualRouteContentOrFn;

          const [next, onNext] = createNextFunction();
          onNext(contents => {
            if (typeof contents === 'string') {
              return done(contents);
            } else if (contents === false) {
              return done(null);
            } else {
              return asyncMatchNextRoute();
            }
          });

          if (fn.length <= 2) {
            const returnedValue = fn(path, matched);
            return next(returnedValue);
          } else {
            return fn(path, matched, next);
          }
        }

        return asyncMatchNextRoute();
      }

      return {
        then: function (cb) {
          done = cb;
          asyncMatchNextRoute();
        },
      };
    }
  };
}
