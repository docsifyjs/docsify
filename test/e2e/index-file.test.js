import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('Index file hosting', () => {
  const sharedOptions = {
    config: {
      basePath: '/index.html#/',
    },
    testURL: '/index.html#/',
  };

  test('should serve from index file', async ({ page }) => {
    await docsifyInit(sharedOptions);
    await expect(page.locator('#main')).toContainText(
      'A magical documentation site generator',
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
