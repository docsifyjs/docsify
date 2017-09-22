/**
 * Create a cached version of a pure function.
 */
export function cached (fn) {
  const cache = Object.create(null)
  return function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

/**
 * Hyphenate a camelCase string.
 */
export const hyphenate = cached(str => {
  return str.replace(/([A-Z])/g, m => '-' + m.toLowerCase())
})

/**
 * Simple Object.assign polyfill
 */
export const merge =
  Object.assign ||
  function (to) {
    const hasOwn = Object.prototype.hasOwnProperty

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
 */
export function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Perform no operation.
 */
export function noop () {}

/**
 * Check if value is function
 */
export function isFn (obj) {
  return typeof obj === 'function'
}
