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
    el = noCache ? dom.find(el) : (cacheNode[el] || dom.find(el))
  }

  return el
}

export const dom = {
  body: document.body,
  head: document.head,
  find: node => document.querySelector(node),
  findAll: node => document.querySelectorAll(node),
  create: (node, tpl) => {
    node = document.createElement(node)
    if (tpl) node.innerHTML = tpl
  },
  appendTo: (target, el) => target.appendChild(el)
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
