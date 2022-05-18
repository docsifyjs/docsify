/** @typedef {((value: any) => void) => void} OnNext */
/** @typedef {(value: any) => void} NextFunction */

/**
 * Creates a pair of a function and an event emitter.
 * When the function is called, the event emitter calls the given callback with the value that was passed to the function.
 * @returns {[NextFunction, OnNext]}
 */
export function createNextFunction() {
  let storedCb = () => null;

  function next(value) {
    storedCb(value);
  }

  function onNext(cb) {
    storedCb = cb;
  }

  return [next, onNext];
}
