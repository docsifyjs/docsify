export function waitForSelector(cssSelector, options = {}) {
  const defaults = {
    delay: 100,
    timeout: 10000,
  };
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
        reject();
      }
    }, settings.delay);
  });
}
