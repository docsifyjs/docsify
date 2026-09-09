import { getParentPath, getPath, isAbsolutePath } from '../router/util.js';

const placeholderOrigin = 'https://docsify.invalid';

function getString(value) {
  return typeof value === 'string' && value ? value : null;
}

function getConfiguredBasePath(
  href,
  config,
  elementBasePath,
  ignoreExternalBasePath = false,
) {
  const elementPath = getString(elementBasePath);
  const resourcePath = getString(
    href.startsWith('/') ? config.absoluteBasePath : config.relativeBasePath,
  );
  const sharedPath = getString(config.basePath);
  const configuredBasePath = elementPath || resourcePath || sharedPath;

  // An external basePath identifies where Docsify fetches markdown files. A
  // document link must remain an SPA route so the router can perform that
  // fetch, while images and includes can point at the source URL directly.
  return ignoreExternalBasePath &&
    !elementPath &&
    !resourcePath &&
    isAbsolutePath(sharedPath)
    ? null
    : configuredBasePath;
}

/**
 * Resolve a path against an explicit base while preserving URL origins.
 * Invalid bases return null so callers can safely use the default behavior.
 *
 * @param {string} path
 * @param {string} basePath
 * @returns {string | null}
 */
export function resolvePathFromBase(path, basePath) {
  try {
    const protocolRelative = basePath.startsWith('//');
    const absolute = isAbsolutePath(basePath);
    const base = new URL(
      basePath.endsWith('/') ? basePath : `${basePath}/`,
      placeholderOrigin,
    );
    const url = new URL(path.replace(/^\/+/, ''), base);

    if (protocolRelative) {
      return url.href.replace(url.protocol, '');
    }

    return absolute ? url.href : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

/**
 * Resolve image and embedded-resource paths using standard web path rules.
 *
 * @param {string} href
 * @param {object} options
 * @param {Record<string, any>} options.config
 * @param {string} options.contentBase
 * @param {string} options.currentPath
 * @param {string | string[] | undefined} options.elementBasePath
 * @returns {string}
 */
export function resolveResourcePath(
  href,
  { config, contentBase, currentPath, elementBasePath },
) {
  if (isAbsolutePath(href)) {
    return href;
  }

  const configuredBasePath = getConfiguredBasePath(
    href,
    config,
    elementBasePath,
  );
  const configuredPath =
    configuredBasePath && resolvePathFromBase(href, configuredBasePath);

  if (configuredPath) {
    return configuredPath;
  }

  if (href.startsWith('/')) {
    return href;
  }

  const pageBase = getPath(contentBase, getParentPath(currentPath));

  return resolvePathFromBase(href, pageBase) || href;
}

/**
 * Resolve a document link. The boolean indicates that the link is rooted at
 * the domain hierarchy rather than the current Docsify index route.
 *
 * @param {string} href
 * @param {object} options
 * @param {Record<string, any>} options.config
 * @param {string | string[] | undefined} options.elementBasePath
 * @returns {{path: string, rooted: boolean}}
 */
export function resolveDocumentPath(href, { config, elementBasePath }) {
  const configuredBasePath = getConfiguredBasePath(
    href,
    config,
    elementBasePath,
    true,
  );
  const configuredPath =
    configuredBasePath && resolvePathFromBase(href, configuredBasePath);

  if (configuredPath) {
    return { path: configuredPath, rooted: true };
  }

  return { path: href, rooted: href.startsWith('/') };
}
