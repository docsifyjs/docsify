const docsifyInit = require('../helpers/docsify-init');
const { navigateToRoute } = require('../helpers/navigate');
const { test, expect } = require('./fixtures/docsify-init-fixture');

test.describe.only(
  'Virtual Routes - Generate Dynamic Content via Config',
  () => {
    test('rendering virtual routes specified as string', async ({ page }) => {
      const routes = {
        '/my-awesome-route': '# My Awesome Route',
      };

      await docsifyInit({
        config: {
          routes,
        },
      });

      await navigateToRoute(page, '/my-awesome-route');

      const titleElm = page.locator('#main h1');
      await expect(titleElm).toContainText('My Awesome Route');
    });

    test('rendering virtual routes specified as functions', async ({
      page,
    }) => {
      const routes = {
        '/my-awesome-function-route': function () {
          return '# My Awesome Function Route';
        },
      };

      await docsifyInit({
        config: {
          routes,
        },
      });

      await navigateToRoute(page, '/my-awesome-function-route');

      const titleElm = page.locator('#main h1');
      await expect(titleElm).toContainText('My Awesome Function Route');
    });

    test('rendering virtual routes specified as async functions', async ({
      page,
    }) => {
      const routes = {
        '/my-awesome-function-route': async function () {
          return '# My Awesome Function Route';
        },
      };

      await docsifyInit({
        config: {
          routes,
        },
      });

      await navigateToRoute(page, '/my-awesome-function-route');

      const titleElm = page.locator('#main h1');
      await expect(titleElm).toContainText('My Awesome Function Route');
    });
  }
);
