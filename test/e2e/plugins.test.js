const docsifyInit = require('../helpers/docsify-init');
const { test, expect } = require('./fixtures/docsify-init-fixture');

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
            hook.init(function () {
              console.log('init');
            });

            hook.mounted(function () {
              console.log('mounted');
            });

            hook.beforeEach(function (markdown, next) {
              setTimeout(function () {
                console.log('beforeEach-async');
                next(markdown);
              }, 100);
            });

            hook.beforeEach(function (markdown) {
              console.log('beforeEach');
              return markdown;
            });

            hook.afterEach(function (html, next) {
              setTimeout(function () {
                console.log('afterEach-async');
                next(html);
              }, 100);
            });

            hook.afterEach(function (html) {
              console.log('afterEach');
              return html;
            });

            hook.doneEach(function () {
              console.log('doneEach');
            });

            hook.ready(function () {
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
            hook.beforeEach(function (markdown) {
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
            hook.beforeEach(function (markdown, next) {
              setTimeout(function () {
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
            hook.afterEach(function (html) {
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
            hook.afterEach(function (html, next) {
              setTimeout(function () {
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
