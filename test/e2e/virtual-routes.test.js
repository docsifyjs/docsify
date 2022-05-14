const docsifyInit = require('../helpers/docsify-init');
const { navigateToRoute } = require('../helpers/navigate');
const { test, expect } = require('./fixtures/docsify-init-fixture');

test.describe('Virtual Routes - Generate Dynamic Content via Config', () => {
  test.only('rendering virtual routes specified in the configuration', async ({
    page,
  }) => {
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
});
