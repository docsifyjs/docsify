/* global fail */
import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('Configuration options', () => {
  test.describe('catchPluginErrors', () => {
    test('true (handles uncaught errors)', async ({ page }) => {
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

    test('false (throws uncaught errors)', async ({ page }) => {
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

  test.describe('notFoundPage', () => {
    test.describe('renders default error content', () => {
      test.beforeEach(async ({ page }) => {
        await page.route('README.md', async route => {
          await route.fulfill({
            status: 500,
          });
        });
      });

      test('false', async ({ page }) => {
        await docsifyInit({
          config: {
            notFoundPage: false,
          },
        });

        await expect(page.locator('#main')).toContainText('500');
      });

      test('true with non-404 error', async ({ page }) => {
        await docsifyInit({
          config: {
            notFoundPage: true,
          },
          routes: {
            '_404.md': '',
          },
        });

        await expect(page.locator('#main')).toContainText('500');
      });

      test('string with non-404 error', async ({ page }) => {
        await docsifyInit({
          config: {
            notFoundPage: '404.md',
          },
          routes: {
            '404.md': '',
          },
        });

        await expect(page.locator('#main')).toContainText('500');
      });
    });

    test('true: renders _404.md page', async ({ page }) => {
      const expectText = 'Pass';

      await docsifyInit({
        config: {
          notFoundPage: true,
        },
        routes: {
          '_404.md': expectText,
        },
      });

      await page.evaluate(() => (window.location.hash = '#/fail'));
      await expect(page.locator('#main')).toContainText(expectText);
    });

    test('string: renders specified 404 page', async ({ page }) => {
      const expectText = 'Pass';

      await docsifyInit({
        config: {
          notFoundPage: '404.md',
        },
        routes: {
          '404.md': expectText,
        },
      });

      await page.evaluate(() => (window.location.hash = '#/fail'));
      await expect(page.locator('#main')).toContainText(expectText);
    });
  });
});
