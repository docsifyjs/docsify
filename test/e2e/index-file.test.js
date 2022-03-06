const docsifyInit = require('../helpers/docsify-init');
const { test, expect } = require('./fixtures/docsify-init-fixture');

test.describe('Index file hosting', () => {
  const sharedOptions = {
    config: {
      basePath: '/docs/index.html#/',
    },
    testURL: '/docs/index.html#/',
  };

  test('should serve from index file', async ({ page }) => {
    await docsifyInit(sharedOptions);
    await expect(page.locator('#main')).toContainText(
      'A magical documentation site generator'
    );
    expect(page.url()).toMatch(/index\.html#\/$/);
  });

  test('should use index file links in sidebar from index file hosting', async ({
    page,
  }) => {
    await docsifyInit(sharedOptions);
    await page.click('a[href="#/quickstart"]');
    await expect(page.locator('#main')).toContainText('Quick start');
    expect(page.url()).toMatch(/index\.html#\/quickstart$/);
  });
});
