const docsifyInit = require('../helpers/docsify-init');
const { test, expect } = require('./fixtures/docsify-init-fixture');

test.describe('Configuration options', () => {
  test('catchPluginErrors:true (handles uncaught errors)', async ({ page }) => {
    let consoleMsg, errorMsg;

    page.on('console', msg => (consoleMsg = msg.text()));
    page.on('pageerror', err => (errorMsg = err.message));

    await docsifyInit({
      config: {
        catchPluginErrors: true,
        plugins: [
          function (hook, vm) {
            hook.init(function () {
              // eslint-disable-next-line no-undef
              fail();
            });
            hook.beforeEach(function (markdown) {
              return `${markdown}\n\nbeforeEach`;
            });
          },
        ],
      },
      markdown: {
        homepage: '# Hello World',
      },
      // _logHTML: true,
    });

    const mainElm = page.locator('#main');

    expect(errorMsg).toBeUndefined();
    expect(consoleMsg).toContain('Docsify plugin error');
    await expect(mainElm).toContainText('Hello World');
    await expect(mainElm).toContainText('beforeEach');
  });

  test('catchPluginErrors:false (throws uncaught errors)', async ({
    page,
    browserName,
  }) => {
    let consoleMsg, errorMsg;

    page.on('console', msg => (consoleMsg = msg.text()));
    page.on('pageerror', err => (errorMsg = err.message));

    // firefox has some funky behavior with unhandled promise rejections. see related issue on playwright: https://github.com/microsoft/playwright/issues/14165
    if (browserName === 'firefox') {
      page.on('domcontentloaded', () =>
        page.evaluate(() =>
          window.addEventListener('unhandledrejection', err => {
            throw err.reason;
          })
        )
      );
    }

    await docsifyInit({
      config: {
        catchPluginErrors: false,
        plugins: [
          function (hook, vm) {
            hook.ready(function () {
              // eslint-disable-next-line no-undef
              fail();
            });
          },
        ],
      },
      markdown: {
        homepage: '# Hello World',
      },
      // _logHTML: true,
    });

    expect(consoleMsg).toBeUndefined();
    expect(errorMsg).toContain('fail');
  });
});
