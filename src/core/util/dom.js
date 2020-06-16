import { isFn } from '../util/core';
import { inBrowser } from './env';

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
      return find(el);
    }

    el = noCache ? find(el) : cacheNode[el] || (cacheNode[el] = find(el));
  }

  return el;
}

export const $ = inBrowser && document;

export const body = inBrowser && $.body;

export const head = inBrowser && $.head;

/**
 * Find elements
 * @param {String|Element} el The root element where to perform the search from
 * @param {Element} node The query
 * @returns {Element} The found DOM element
 * @example
 * find('nav') => document.querySelector('nav')
 * find(nav, 'a') => nav.querySelector('a')
 */
export function find(el, node) {
  return node ? el.querySelector(node) : $.querySelector(el);
}

/**
 * Find all elements
 * @param {String|Element} el The root element where to perform the search from
 * @param {Element} node The query
 * @returns {Array<Element>} An array of DOM elements
 * @example
 * findAll('a') => [].slice.call(document.querySelectorAll('a'))
 * findAll(nav, 'a') => [].slice.call(nav.querySelectorAll('a'))
 */
export function findAll(el, node) {
  return [].slice.call(
    node ? el.querySelectorAll(node) : $.querySelectorAll(el)
  );
}

export function create(node, tpl) {
  node = $.createElement(node);
  if (tpl) {
    node.innerHTML = tpl;
  }

  return node;
}

export function appendTo(target, el) {
  return target.appendChild(el);
}

export function before(target, el) {
  return target.insertBefore(el, target.children[0]);
}

export function on(el, type, handler) {
  isFn(type)
    ? window.addEventListener(el, type)
    : el.addEventListener(type, handler);
}

export function off(el, type, handler) {
  isFn(type)
    ? window.removeEventListener(el, type)
    : el.removeEventListener(type, handler);
}

/**
 * Toggle class
 * @param {String|Element} el The element that needs the class to be toggled
 * @param {Element} type The type of action to be performed on the classList (toggle by default)
 * @param {String} val Name of the class to be toggled
 * @void
 * @example
 * toggleClass(el, 'active') => el.classList.toggle('active')
 * toggleClass(el, 'add', 'active') => el.classList.add('active')
 */
export function toggleClass(el, type, val) {
  el && el.classList[val ? type : 'toggle'](val || type);
}

export function style(content) {
  appendTo(head, create('style', content));
}

/**
 * Fork https://github.com/bendrucker/document-ready/blob/master/index.js
 * @param {Function} callback The callbacack to be called when the page is loaded
 * @returns {Number|void} If the page is already laoded returns the result of the setTimeout callback,
 *  otherwise it only attaches the callback to the DOMContentLoaded event
 */
export function documentReady(callback, doc = document) {
  const state = doc.readyState;

  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0);
  }

  doc.addEventListener('DOMContentLoaded', callback);
}
