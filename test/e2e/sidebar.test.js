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
      },
      scriptURLs: ['/lib/plugins/search.min.js'],
      styleURLs: ['/lib/themes/vue.css'],
    };
    await docsifyInit(docsifyInitConfig);
    await page.fill('input[type=search]', 'Hello');
    expect(await page.innerText('.results-panel h2')).toEqual('Hello World');
  });
});
