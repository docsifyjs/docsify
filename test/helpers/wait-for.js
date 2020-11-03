const defaults = {
  delay: 100,
  timeout: 4000,
};

/**
 * Waits for specified function to resolve to a truthy value.
 *
 * @param {Function} fn function to be evaluated until truthy
 * @param {*} arg optional argument to pass to `fn`
 * @param {Object} options optional parameters
 * @returns {Promise} promise which resolves to function result
 */
export function waitForFunction(fn, arg, options = {}) {
  const settings = {
    ...defaults,
    ...options,
  };

  return new Promise((resolve, reject) => {
    let timeElapsed = 0;

    const int = setInterval(() => {
      let result;

      try {
        result = fn(arg);
      } catch (e) {
        // Continue...
      }

      if (result) {
        clearInterval(int);
        resolve(result);
      }

      timeElapsed += settings.delay;

      if (timeElapsed >= settings.timeout) {
        reject(
          `waitForFunction() did not return a truthy value\n\n${fn.toString()}\n\n`
        );
      }
    }, settings.delay);
  });
}

/**
 * Waits for specified CSS selector to be located in the DOM
 *
 * @param {String} cssSelector CSS selector to query for
 * @param {Object} options optional parameters
 * @returns {Promise} promise which resolves to first matching element
 */
export function waitForSelector(cssSelector, options = {}) {
  const settings = {
    ...defaults,
    ...options,
  };

  return new Promise((resolve, reject) => {
    let timeElapsed = 0;

    const int = setInterval(() => {
      const elm = document.querySelector(cssSelector);
      if (elm) {
        clearInterval(int);
        resolve(elm);
      }

      timeElapsed += settings.delay;

      if (timeElapsed >= settings.timeout) {
        reject(
          `waitForSelector() was unable to find CSS selector ${cssSelector}`
        );
      }
    }, settings.delay);
  });
}

/**
 * Waits for specified CSS selector to contain text content
 *
 * @param {String} cssSelector CSS selector to query for
 * @param {String} text text to match
 * @param {Object} options optional parameters
 * @returns {Promise} promise which resolves to first matching element that contains specified text
 */
export function waitForText(cssSelector, text, options = {}) {
  const settings = {
    ...defaults,
    ...options,
  };

  return new Promise((resolve, reject) => {
    waitForSelector(cssSelector, settings)
      .then((elm) => {
        const isMatch = elm.textContent.includes(text);

        if (isMatch) {
          resolve(elm);
        } else {
          reject(
            `waitForText() did not find "${text}" in CSS selector ${cssSelector}`
          );
        }
      })
      .catch(() => {
        reject(`waitForText() was unable to find CSS selector ${cssSelector}`);
      });
  });
}
