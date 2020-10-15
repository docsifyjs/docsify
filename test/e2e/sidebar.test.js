const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe('Sidebar Tests', function() {
  // Tests
  // ---------------------------------------------------------------------------
  test('search readme', async () => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          # Hello World

          This is the homepage.
        `,
        sidebar: `
          - [Home page](/)
          - [Test Page](test)
        `,
      },
      routes: {
        '/test.md': `
          # Test Page

          This is a custom route.
        `,
      },
      scriptURLs: ['/lib/plugins/search.min.js'],
    };

    await docsifyInit(docsifyInitConfig);
    await page.fill('input[type=search]', 'hello');
    await expect(page).toEqualText('.results-panel h2', 'Hello World');
    await page.click('.clear-button');
    await page.fill('input[type=search]', 'test');
    await expect(page).toEqualText('.results-panel h2', 'Test Page');
  });
});
