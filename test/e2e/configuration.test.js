/* global fail */
import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

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
              fail();
            });
            hook.beforeEach(markdown => {
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

  test('catchPluginErrors:false (throws uncaught errors)', async ({ page }) => {
    let consoleMsg, errorMsg;

    page.on('console', msg => (consoleMsg = msg.text()));
    page.on('pageerror', err => (errorMsg = err.message));

    await docsifyInit({
      config: {
        catchPluginErrors: false,
        plugins: [
          function (hook, vm) {
            hook.ready(function () {
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
