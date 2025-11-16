import { isFn } from '../util/core.js';

/** @type {Record<string, Element>} */
const cacheNode = {};

/**
 * Get Node
 * @param  {String|Element} el A DOM element
 * @param  {Boolean} noCache Flag to use or not use the cache
 * @return {Element} The found node element
 */
export function getNode(el, noCache = false) {
  if (typeof el === 'string') {
    if (typeof window.Vue !== 'undefined') {
      window.Vue.version;
      return find(el);
    }

    el = noCache ? find(el) : cacheNode[el] || (cacheNode[el] = find(el));
  }

  return el;
}

/**
 *
 * @param {*} el the targt element or the selector
 * @param {*} content the content to be rendered as HTML
 * @param {*} replace To replace the content (true) or insert instead (false) , default is false
 */
/**
 * @param {string|Element} el
 * @param {string} content
 * @param {boolean} [replace]
 */
export function setHTML(el, content, replace) {
  const node = getNode(el);
  if (node) {
    node[replace ? 'outerHTML' : 'innerHTML'] = content;
  }
}

export const $ = document;

export const body = $.body;

export const head = $.head;

/**
 * Find the first matching element
 * @param {string|Element} el The root element on which to perform the query
 * from, or a query string to query from `document`.
 * @param {string} [query] The query string to use on `el` if `el` is an
 * element.
 * @returns {Element} The found DOM element
 * @example
 * find('nav') => document.querySelector('nav')
 * find(nav, 'a') => nav.querySelector('a')
 */
export function find(el, query = ':is()') {
  return /** @type {Element} */ (
    typeof el !== 'string' ? el.querySelector(query) : $.querySelector(el)
  );
}

/**
 * Find all matching elements
 * @param {string|Element} el The root element on which to perform the query
 * from, or a query string to query from `document`.
 * @param {string} [query] The query string to use on `el` if `el` is an
 * element.
 * @returns {Array<Element>} An array of DOM elements
 * @example
 * findAll('a') => Array.from(document.querySelectorAll('a'))
 * findAll(nav, 'a') => Array.from(nav.querySelectorAll('a'))
 */
export function findAll(el, query = ':is()') {
  return Array.from(
    typeof el !== 'string'
      ? el.querySelectorAll(query)
      : $.querySelectorAll(el),
  );
}

/**
 * @param {string} node
 * @param {string} [tpl]
 * @returns {HTMLElement}
 */
export function create(node, tpl) {
  const element = $.createElement(node);
  if (tpl) {
    element.innerHTML = tpl;
  }

  return element;
}

/**
 * @param {Element} target
 * @param {Element} el
 */
export function appendTo(target, el) {
  return target.appendChild(el);
}

/**
 * @param {Element} target
 * @param {Element} el
 */
export function before(target, el) {
  return target.insertBefore(el, target.children[0]);
}

/**
 * @param {any} el
 * @param {any} type
 * @param {any} [handler]
 */
export function on(el, type, handler) {
  isFn(type)
    ? window.addEventListener(el, type)
    : el.addEventListener(type, handler);
}

/**
 * @param {any} el
 * @param {any} type
 * @param {any} [handler]
 */
export function off(el, type, handler) {
  isFn(type)
    ? window.removeEventListener(el, type)
    : el.removeEventListener(type, handler);
}

/**
 * @param {string} content
 */
export function style(content) {
  appendTo(head, /** @type {Element} */ (create('style', content)));
}

/**
 * Fork https://github.com/bendrucker/document-ready/blob/master/index.js
 * @param {(event: Event) => void} callback The callbacack to be called when the page is loaded
 * @returns {number|void} If the page is already loaded returns the result of the setTimeout callback,
 *  otherwise it only attaches the callback to the DOMContentLoaded event
 */
export function documentReady(callback, doc = document) {
  const state = doc.readyState;

  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0);
  }

  doc.addEventListener('DOMContentLoaded', callback);
}
