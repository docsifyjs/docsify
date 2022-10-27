const docsifyInit = require('../helpers/docsify-init');
const { test, expect } = require('./fixtures/docsify-init-fixture');

/**
 * Navigate to a specific route in the site
 * @param {import('playwright-core').Page} page the playwright page instance from the test
 * @param {string} route the route you want to navigate to
 */
async function navigateToRoute(page, route) {
  await page.evaluate(r => (window.location.hash = r), route);
  await page.waitForLoadState('networkidle');
}

test.describe('Virtual Routes - Generate Dynamic Content via Config', () => {
  test.describe('Different Types of Virtual Routes', () => {
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

    test('rendering virtual routes specified functions that use the "next" callback', async ({
      page,
    }) => {
      const routes = {
        '/my-awesome-async-function-route': async function (
          route,
          matched,
          next
        ) {
          setTimeout(() => next('# My Awesome Function Route'), 100);
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

  test.describe('Routes with Regex Matches', () => {
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

  test.describe('Route Matching Specifics', () => {
    test('routes should be exact match if no regex was passed', async ({
      page,
    }) => {
      const routes = {
        '/my': '# Incorrect Route - only prefix',
        '/route': '# Incorrect Route - only postfix',
        '/my/route': '# Correct Route',
      };

      await docsifyInit({
        config: {
          routes,
        },
      });

      await navigateToRoute(page, '/my/route');

      const titleElm = page.locator('#main h1');
      await expect(titleElm).toContainText('Correct Route');
    });

    test('if there are two routes that match, the first one should be taken', async ({
      page,
    }) => {
      const routes = {
        '/multiple/(.+)': '# First Match',
        '/multiple/(.*)': '# Second Match',
      };

      await docsifyInit({
        config: {
          routes,
        },
      });

      await navigateToRoute(page, '/multiple/matches');

      const titleElm = page.locator('#main h1');
      await expect(titleElm).toContainText('First Match');
    });

    test('prefer virtual route over a real file, if a virtual route exists', async ({
      page,
    }) => {
      const routes = {
        '/': '# Virtual Homepage',
      };

      await docsifyInit({
        markdown: {
          homepage: '# Real File Homepage',
        },
        config: {
          routes,
        },
      });

      const titleElm = page.locator('#main h1');
      await expect(titleElm).toContainText('Virtual Homepage');
    });

    test('fallback to default routing if no route was matched', async ({
      page,
    }) => {
      const routes = {
        '/a': '# A',
        '/b': '# B',
        '/c': '# C',
      };

      await docsifyInit({
        markdown: {
          homepage: '# Real File Homepage',
        },
        config: {
          routes,
        },
      });

      await navigateToRoute(page, '/d');

      const mainElm = page.locator('#main');
      await expect(mainElm).toContainText('404 - Not found');
    });

    test('skip routes that returned a falsy value that is not a boolean', async ({
      page,
    }) => {
      const routes = {
        '/multiple/(.+)': () => null,
        '/multiple/(.*)': () => undefined,
        '/multiple/.+': () => 0,
        '/multiple/.*': () => '# Last Match',
      };

      await docsifyInit({
        config: {
          routes,
        },
      });

      await navigateToRoute(page, '/multiple/matches');

      const titleElm = page.locator('#main h1');
      await expect(titleElm).toContainText('Last Match');
    });

    test('abort virtual routes and not try the next one, if any matched route returned an explicit "false" boolean', async ({
      page,
    }) => {
      const routes = {
        '/multiple/(.+)': () => false,
        '/multiple/(.*)': () => "# You Shouldn't See Me",
      };

      await docsifyInit({
        config: {
          routes,
        },
      });

      await navigateToRoute(page, '/multiple/matches');

      const mainElm = page.locator('#main');
      await expect(mainElm).toContainText('404 - Not found');
    });

    test('skip routes that are not a valid string or function', async ({
      page,
    }) => {
      const routes = {
        '/multiple/(.+)': 123,
        '/multiple/(.*)': false,
        '/multiple/.+': null,
        '/multiple/..+': [],
        '/multiple/..*': {},
        '/multiple/.*': '# Last Match',
      };

      await docsifyInit({
        config: {
          routes,
        },
      });

      await navigateToRoute(page, '/multiple/matches');

      const titleElm = page.locator('#main h1');
      await expect(titleElm).toContainText('Last Match');
    });
  });
});
