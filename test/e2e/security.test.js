const docsifyInit = require('../helpers/docsify-init');
const { test, expect } = require('./fixtures/docsify-init-fixture');

test.describe('Security - Cross Site Scripting (XSS)', () => {
  const sharedOptions = {
    markdown: {
      homepage: '# Hello World',
    },
    routes: {
      'test.md': '# Test Page',
    },
  };
  const slashStrings = ['//', '///'];

  for (let slashString of slashStrings) {
    const hash = `#${slashString}domain.com/file.md`;

    test(`should not load remote content from hash (${hash})`, async ({
      page,
    }) => {
      const mainElm = page.locator('#main');

      await docsifyInit(sharedOptions);
      await expect(mainElm).toContainText('Hello World');
      await page.evaluate(() => (location.hash = '#/test'));
      await expect(mainElm).toContainText('Test Page');
      await page.evaluate(newHash => {
        location.hash = newHash;
      }, hash);
      await expect(mainElm).toContainText('Hello World');
      expect(page.url()).toMatch(/#\/$/);
    });
  }
});
