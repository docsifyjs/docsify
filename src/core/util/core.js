/**
 * Create a cached version of a pure function.
 * @param {*} fn The function call to be cached
 * @void
 */

export function cached(fn) {
  const cache = Object.create(null)
  return function (str) {
    const key = isPrimitive(str) ? str : JSON.stringify(str)
    const hit = cache[key]
    return hit || (cache[key] = fn(str))
  }
}

/**
 * Hyphenate a camelCase string.
 */
export const hyphenate = cached(str => {
  return str.replace(/([A-Z])/g, m => '-' + m.toLowerCase())
})

export const hasOwn = Object.prototype.hasOwnProperty

/**
 * Simple Object.assign polyfill
 * @param {Object} to The object to be merged with
 * @returns {Object} The merged object
 */
export const merge =
  Object.assign ||
  function (to) {
    for (let i = 1; i < arguments.length; i++) {
      const from = Object(arguments[i])

      for (const key in from) {
        if (hasOwn.call(from, key)) {
          to[key] = from[key]
        }
      }
    }

    return to
  }

/**
 * Check if value is primitive
 * @param {*} value Checks if a value is primitive
 * @returns {Boolean} Result of the check
 */
export function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Performs no operation.
 * @void
 */
export function noop() { }

/**
 * Check if value is function
 * @param {*} obj Any javascript object
 * @returns {Boolean} True if the passed-in value is a function
 */
export function isFn(obj) {
  return typeof obj === 'function'
}

