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
     * Attempts to match the given path with a virtual route
     * @param {string} path
     * @returns {Promise<string | null>} resolves to string if route was matched, otherwise null
     */
    matchVirtualRoute(path) {
      const routes = this.routes();

      for (const route of Object.keys(routes)) {
        const match = path.match(route);
        if (!match) {
          continue;
        }

        const virtualRoute = routes[route];
        return virtualRoute;
      }

      return null;
    }
  };
}
