import docsifyInit from '../helpers/docsify-init.js';
import { waitForFunction } from '../helpers/wait-for.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('Plugins', () => {
  test('Hook order', async ({ page }) => {
    const consoleMsgs = [];
    const expectedMsgs = [
      'init',
      'mounted',
      'beforeEach-async',
      'beforeEach',
      'afterEach-async',
      'afterEach',
      'doneEach',
      'ready',
    ];

    page.on('console', msg => consoleMsgs.push(msg.text()));

    await docsifyInit({
      config: {
        plugins: [
          function (hook, vm) {
            hook.init(() => {
              console.log('init');
            });

            hook.mounted(() => {
              console.log('mounted');
            });

            hook.beforeEach((markdown, next) => {
              setTimeout(() => {
                console.log('beforeEach-async');
                next(markdown);
              }, 100);
            });

            hook.beforeEach(markdown => {
              console.log('beforeEach');
              return markdown;
            });

            hook.afterEach((html, next) => {
              setTimeout(() => {
                console.log('afterEach-async');
                next(html);
              }, 100);
            });

            hook.afterEach(html => {
              console.log('afterEach');
              return html;
            });

            hook.doneEach(() => {
              console.log('doneEach');
            });

            hook.ready(() => {
              console.log('ready');
            });
          },
        ],
      },
      markdown: {
        homepage: '# Hello World',
      },
      // _logHTML: true,
    });

    expect(consoleMsgs).toEqual(expectedMsgs);
  });

  test.describe('beforeEach()', () => {
    test('return value', async ({ page }) => {
      await docsifyInit({
        config: {
          plugins: [
            function (hook, vm) {
              hook.beforeEach(markdown => {
                return 'beforeEach';
              });
            },
          ],
        },
        // _logHTML: true,
      });

      await expect(page.locator('#main')).toContainText('beforeEach');
    });

    test('async return value', async ({ page }) => {
      await docsifyInit({
        config: {
          plugins: [
            function (hook, vm) {
              hook.beforeEach((markdown, next) => {
                setTimeout(() => {
                  next('beforeEach');
                }, 100);
              });
            },
          ],
        },
        markdown: {
          homepage: '# Hello World',
        },
        // _logHTML: true,
      });

      await expect(page.locator('#main')).toContainText('beforeEach');
    });
  });

  test.describe('afterEach()', () => {
    test('return value', async ({ page }) => {
      await docsifyInit({
        config: {
          plugins: [
            function (hook, vm) {
              hook.afterEach(html => {
                return '<p>afterEach</p>';
              });
            },
          ],
        },
        markdown: {
          homepage: '# Hello World',
        },
        // _logHTML: true,
      });

      await expect(page.locator('#main')).toContainText('afterEach');
    });

    test('async return value', async ({ page }) => {
      await docsifyInit({
        config: {
          plugins: [
            function (hook, vm) {
              hook.afterEach((html, next) => {
                setTimeout(() => {
                  next('<p>afterEach</p>');
                }, 100);
              });
            },
          ],
        },
        markdown: {
          homepage: '# Hello World',
        },
        // _logHTML: true,
      });

      await expect(page.locator('#main')).toContainText('afterEach');
    });
  });

  test.describe('doneEach()', () => {
    test('callback after cover loads', async ({ page }) => {
      const consoleMessages = [];

      page.on('console', msg => consoleMessages.push(msg.text()));

      await docsifyInit({
        config: {
          plugins: [
            function (hook) {
              hook.doneEach(() => {
                const homepageTitle = document.querySelector('#homepage-title');
                const coverTitle = document.querySelector('#cover-title');
                console.log(homepageTitle?.textContent);
                console.log(coverTitle?.textContent);
              });
            },
          ],
        },
        markdown: {
          homepage: '# Hello World :id=homepage-title',
          coverpage: () => {
            return new Promise(resolve => {
              setTimeout(() => resolve('# Cover Page :id=cover-title'), 500);
            });
          },
        },
        // _logHTML: {},
      });

      await expect(consoleMessages).toEqual(['Hello World', 'Cover Page']);
    });

    test('only cover', async ({ page }) => {
      const consoleMessages = [];

      page.on('console', msg => consoleMessages.push(msg.text()));

      await docsifyInit({
        config: {
          onlyCover: true,
          plugins: [
            function (hook) {
              hook.doneEach(() => {
                const homepageTitle = document.querySelector('#homepage-title');
                const coverTitle = document.querySelector('#cover-title');
                console.log(homepageTitle?.textContent);
                console.log(coverTitle?.textContent);
              });
            },
          ],
        },
        markdown: {
          homepage: '# Hello World :id=homepage-title',
          coverpage: () => {
            return new Promise(resolve => {
              setTimeout(() => resolve('# Cover Page :id=cover-title'), 500);
            });
          },
        },
        waitForSelector: '.cover-main > *:first-child',
        // _logHTML: {},
      });

      await expect(consoleMessages).toEqual(['undefined', 'Cover Page']);
    });
  });

  test.describe('route data accessible to plugins', () => {
    let routeData = null;

    test.beforeEach(async ({ page }) => {
      // Store route data set via plugin hook (below)
      page.on('console', async msg => {
        for (const arg of msg.args()) {
          const val = await arg.jsonValue();
          const obj = JSON.parse(val);
          obj.response && (routeData = obj);
        }
      });
    });

    test.afterEach(async ({ page }) => {
      routeData = null;
    });

    test('success (200)', async ({ page }) => {
      await docsifyInit({
        config: {
          plugins: [
            function (hook, vm) {
              hook.doneEach(html => {
                console.log(JSON.stringify(vm.route));
              });
            },
          ],
        },
      });

      expect(routeData).toHaveProperty('response');
      expect(routeData.response).toHaveProperty('ok', true);
      expect(routeData.response).toHaveProperty('status', 200);
      expect(routeData.response).toHaveProperty('statusText', 'OK');
    });

    test('fail (404)', async ({ page }) => {
      const link404Elm = page.locator('a[href*="404"]');

      await docsifyInit({
        markdown: {
          sidebar: `
            - [404](404.md)
          `,
        },
        config: {
          plugins: [
            function (hook, vm) {
              hook.doneEach(html => {
                console.log(JSON.stringify(vm.route));
              });
            },
          ],
        },
      });

      await link404Elm.click();
      await waitForFunction(() => routeData?.response?.status === 404);

      expect(routeData).toHaveProperty('response');
      expect(routeData.response).toHaveProperty('ok', false);
      expect(routeData.response).toHaveProperty('status', 404);
      expect(routeData.response).toHaveProperty('statusText', 'Not Found');
    });
  });
});
