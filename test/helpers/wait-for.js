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
function waitForFunction(fn, arg, options = {}) {
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
        const msg = `waitForFunction did not return a truthy value (${
          settings.timeout
        } ms): ${fn.toString()}\n`;

        reject(msg);
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
function waitForSelector(cssSelector, options = {}) {
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
        const msg = `waitForSelector did not match CSS selector '${cssSelector}' (${settings.timeout} ms)`;

        reject(msg);
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
function waitForText(cssSelector, text, options = {}) {
  const settings = {
    ...defaults,
    ...options,
  };

  return new Promise((resolve, reject) => {
    let timeElapsed = 0;

    waitForSelector(cssSelector, settings)
      .then(elm => {
        const int = setInterval(() => {
          const isMatch = elm.textContent.includes(text);

          if (isMatch) {
            clearInterval(int);
            resolve(true);
          }

          timeElapsed += settings.delay;

          if (timeElapsed >= settings.timeout) {
            const msg = `waitForText did not find '${text}' in CSS selector '${cssSelector}' (${settings.timeout} ms): '${elm.textContent}'`;

            reject(msg);
          }
        }, settings.delay);
      })
      .catch(() => {
        const msg = `waitForText did not match CSS selector '${cssSelector}' (${settings.timeout} ms)`;

        reject(msg);
      });
  });
}

module.exports = {
  waitForFunction,
  waitForSelector,
  waitForText,
};
