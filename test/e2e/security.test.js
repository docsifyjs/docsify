import docsifyInit from '../helpers/docsify-init';

describe(`Security`, function () {
  const sharedOptions = {
    markdown: {
      homepage: '# Hello World',
    },
    routes: {
      'test.md': '# Test Page',
    },
  };

  describe(`Cross Site Scripting (XSS)`, function () {
    const slashStrings = ['//', '///'];

    for (const slashString of slashStrings) {
      const hash = `#${slashString}domain.com/file.md`;

      test(`should not load remote content from hash (${hash})`, async () => {
        await docsifyInit(sharedOptions);
        await expect(page).toHaveText('#main', 'Hello World');
        await page.evaluate(() => (location.hash = '#/test'));
        await expect(page).toHaveText('#main', 'Test Page');
        await page.evaluate(newHash => {
          location.hash = newHash;
        }, hash);
        await expect(page).toHaveText('#main', 'Hello World');
        expect(page.url()).toMatch(/#\/$/);
      });
    }
  });
});
