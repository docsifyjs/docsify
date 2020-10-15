const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe('Search Plugin Tests', function() {
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

  test('search ignore title', async () => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
        # Hello World

        This is the homepage.

        ## Test ignore title <!-- {docsify-ignore} -->

        This is the test ignore title.
      `,
      },
      scriptURLs: ['/lib/plugins/search.min.js'],
      styleURLs: ['/lib/themes/vue.css'],
    };
    await docsifyInit(docsifyInitConfig);
    await page.fill('input[type=search]', 'Test ignore title');
    expect(await page.innerText('.results-panel h2')).toEqual(
      'Test ignore title'
    );
  });
});
