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
      const virtualRoutes = this.routes();

      const virtualRoutePaths = Object.keys(virtualRoutes);
      const matchedVirtualRoutePath = virtualRoutePaths.find(route =>
        path.match(route)
      );

      if (!matchedVirtualRoutePath) {
        return null;
      }

      const match = path.match(matchedVirtualRoutePath);
      const virtualRouteContentOrFn = virtualRoutes[matchedVirtualRoutePath];

      if (typeof virtualRouteContentOrFn === 'string') {
        return virtualRouteContentOrFn.replace(
          /\$(\d+)/g,
          (_, index) => match[parseInt(index, 10)]
        );
      }

      if (typeof virtualRouteContentOrFn === 'function') {
        return virtualRouteContentOrFn(path, match);
      }

      return null;
    }
  };
}
