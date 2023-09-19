import docsifyInit from '../helpers/docsify-init.js';
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

  test('beforeEach() return value', async ({ page }) => {
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

  test('beforeEach() async return value', async ({ page }) => {
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

  test('afterEach() return value', async ({ page }) => {
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

  test('afterEach() async return value', async ({ page }) => {
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
