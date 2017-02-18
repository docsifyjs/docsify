import { isFn } from '../util/core'

const cacheNode = {}

/**
 * Get Node
 * @param  {String|Element} el
 * @param  {Boolean} noCache
 * @return {Element}
 */
export function getNode (el, noCache = false) {
  if (typeof el === 'string') {
    el = noCache ? find(el) : (cacheNode[el] || find(el))
  }

  return el
}

export const $ = document

export const body = $.body

export const head = $.head

export function find (node) {
  return $.querySelector(node)
}

export function findAll (node) {
  return [].clice.call($.querySelectorAll(node))
}

export function create (node, tpl) {
  node = $.createElement(node)
  if (tpl) node.innerHTML = tpl
  return node
}

export function appendTo (target, el) {
  return target.appendChild(el)
}

export function on (el, type, handler) {
  isFn(type)
    ? window.addEventListener(el, type)
    : el.addEventListener(type, handler)
}

export const off = function on (el, type, handler) {
  isFn(type)
    ? window.removeEventListener(el, type)
    : el.removeEventListener(type, handler)
}
