/** @typedef {(value: any) => void} NextFunction */

/**
 * Creates a pair of a function and a promise.
 * When the function is called, the promise is resolved with the value that was passed to the function.
 * @returns {[Promise, NextFunction]}
 */
export function createNextFunction() {
  let resolvePromise;
  const promise = new Promise(res => (resolvePromise = res));

  function next(value) {
    resolvePromise(value);
  }

  return [promise, next];
}
