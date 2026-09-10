import { cached } from '../util/core.js';

const decode = decodeURIComponent;
const encode = encodeURIComponent;

/**
 * @typedef {{
 *   className: 'app-name-link' | 'page-link' | 'section-link';
 *   href: string;
 * }} SidebarNavigationTarget
 */

const sidebarNavigationClassNames = /** @type {const} */ ([
  'app-name-link',
  'page-link',
  'section-link',
]);

/**
 * Resolve a link value using the same URL normalization as an anchor element.
 *
 * @param {string} href Link value
 * @returns {string}
 */
export function resolveHref(href) {
  try {
    return new URL(href, location.href).href;
  } catch {
    return href;
  }
}

/**
 * Find an anchor by its normalized URL without interpolating the URL into a
 * CSS selector.
 *
 * @param {Element} rootElm Element to search within
 * @param {string} href Link value
 * @param {string} [selector] Anchor selector
 * @returns {HTMLAnchorElement|null}
 */
export function findLinkByHref(rootElm, href, selector = 'a') {
  const resolvedHref = resolveHref(href);

  return (
    /** @type {HTMLAnchorElement[]} */ (
      Array.from(rootElm.querySelectorAll(selector))
    ).find(linkElm => linkElm.href === resolvedHref) || null
  );
}

/**
 * Get the anchor associated with a click event.
 *
 * @param {MouseEvent} event Click event
 * @returns {HTMLAnchorElement|null}
 */
export function getClickedLink(event) {
  const target = event.target;

  return target instanceof Element
    ? /** @type {HTMLAnchorElement|null} */ (target.closest('a'))
    : null;
}

/**
 * Check whether a click will navigate the current browsing context.
 *
 * @param {MouseEvent} event Click event
 * @param {HTMLAnchorElement} linkElm Clicked link
 * @returns {boolean}
 */
export function isCurrentContextNavigation(event, linkElm) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    linkElm.hasAttribute('download') ||
    (linkElm.target && linkElm.target !== '_self')
  );
}

/**
 * Create a stable description of the clicked sidebar link so it can be found
 * again after the sidebar has been rendered.
 *
 * @param {HTMLAnchorElement} linkElm Clicked link
 * @returns {SidebarNavigationTarget|undefined}
 */
export function getSidebarNavigationTarget(linkElm) {
  const sidebarElm = linkElm.closest('.sidebar');
  const className = sidebarNavigationClassNames.find(className =>
    linkElm.classList.contains(className),
  );

  if (!sidebarElm || !className) {
    return;
  }

  return {
    className,
    href: linkElm.href,
  };
}

/**
 * @param {string} query
 * @return {Record<string, string>}
 */
export function parseQuery(query) {
  /** @type {Record<string, string>} */
  const res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res;
  }

  // Simple parse
  query.split('&').forEach(param => {
    const parts = param.replace(/\+/g, ' ').split('=');

    res[parts[0]] = parts[1] && decode(parts[1]);
  });

  return res;
}

export function stringifyQuery(obj, ignores = []) {
  const qs = [];

  for (const key in obj) {
    if (ignores.indexOf(key) > -1) {
      continue;
    }

    qs.push(
      obj[key]
        ? `${encode(key)}=${encode(obj[key])}`.toLowerCase()
        : encode(key),
    );
  }

  return qs.length ? `?${qs.join('&')}` : '';
}

export function stripUrlExceptId(str) {
  const [path, queryString] = str.split('?');
  if (!queryString) {
    return str;
  }

  const params = new URLSearchParams(queryString);
  const id = params.get('id');

  if (id !== null) {
    return `${path}?id=${id}`;
  }

  return path;
}

export const isAbsolutePath = cached(path => {
  return /(:|(\/{2}))/g.test(path);
});

export const removeParams = cached(path => {
  return path.split(/[?#]/)[0];
});

export const getParentPath = cached(path => {
  if (/\/$/g.test(path)) {
    return path;
  }

  const matchingParts = path.match(/(\S*\/)[^/]+$/);
  return matchingParts ? matchingParts[1] : '';
});

export const cleanPath = cached(path => {
  return path.replace(/^\/+/, '/').replace(/([^:])\/{2,}/g, '$1/');
});

export const resolvePath = cached(path => {
  const segments = path.replace(/^\//, '').split('/');
  const resolved = [];
  for (const segment of segments) {
    if (segment === '..') {
      resolved.pop();
    } else if (segment !== '.') {
      resolved.push(segment);
    }
  }

  return '/' + resolved.join('/');
});

/**
 * Normalises the URI path to handle the case where Docsify is
 * hosted off explicit files, i.e. /index.html. This function
 * eliminates any path segments that contain `#` fragments.
 *
 * This is used to map browser URIs to markdown file sources.
 *
 * For example:
 *
 * http://example.org/base/index.html#/blah
 *
 * would be mapped to:
 *
 * http://example.org/base/blah.md.
 *
 * See here for more information:
 *
 * https://github.com/docsifyjs/docsify/pull/1372
 *
 * @param {string} path The URI path to normalise
 * @return {string} { path, query }
 */

function normaliseFragment(path) {
  return path
    .split('/')
    .filter(p => p.indexOf('#') === -1)
    .join('/');
}

export function getPath(...args) {
  return cleanPath(args.map(normaliseFragment).join('/'));
}

export const replaceSlug = cached(path => {
  return path.replace('#', '?id=');
});
