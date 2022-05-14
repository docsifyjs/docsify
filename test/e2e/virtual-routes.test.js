const docsifyInit = require('../helpers/docsify-init');
const { navigateToRoute } = require('../helpers/navigate');
const { test, expect } = require('./fixtures/docsify-init-fixture');

test.describe.only(
  'Virtual Routes - Generate Dynamic Content via Config',
  () => {
    test.describe('Different types of virtual routes', () => {
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
          '/my-awesome-async-function-route': async function () {
            return '# My Awesome Function Route';
          },
        };

        await docsifyInit({
          config: {
            routes,
          },
        });

        await navigateToRoute(page, '/my-awesome-async-function-route');

        const titleElm = page.locator('#main h1');
        await expect(titleElm).toContainText('My Awesome Function Route');
      });
    });

    test.describe('Routes with regex matches', () => {
      test('rendering virtual routes with regex matches', async ({ page }) => {
        const routes = {
          '/items/(.*)': '# Item Page',
        };

        await docsifyInit({
          config: {
            routes,
          },
        });

        await navigateToRoute(page, '/items/banana');

        const titleElm = page.locator('#main h1');
        await expect(titleElm).toContainText('Item Page');
      });

      test('formatting regex matches into string virtual routes', async ({
        page,
      }) => {
        const routes = {
          '/items/(.*)': '# Item Page ($1)',
        };

        await docsifyInit({
          config: {
            routes,
          },
        });

        await navigateToRoute(page, '/items/apple');

        const titleElm = page.locator('#main h1');
        await expect(titleElm).toContainText('Item Page (apple)');
      });

      test('virtual route functions should get the route as first parameter', async ({
        page,
      }) => {
        const routes = {
          '/pets/(.*)': function (route) {
            return `# Route: /pets/dog`;
          },
        };

        await docsifyInit({
          config: {
            routes,
          },
        });

        await navigateToRoute(page, '/pets/dog');

        const titleElm = page.locator('#main h1');
        await expect(titleElm).toContainText('Route: /pets/dog');
      });

      test('virtual route functions should get the matched array as second parameter', async ({
        page,
      }) => {
        const routes = {
          '/pets/(.*)': function (_, matched) {
            return `# Pets Page (${matched[1]})`;
          },
        };

        await docsifyInit({
          config: {
            routes,
          },
        });

        await navigateToRoute(page, '/pets/cat');

        const titleElm = page.locator('#main h1');
        await expect(titleElm).toContainText('Pets Page (cat)');
      });
    });
  }
);
