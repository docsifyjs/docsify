const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe('Sidebar Tests', function() {
  // Tests
  // ---------------------------------------------------------------------------
  test('search readme', async () => {
    await docsifyInit();
    await page.goto(DOCS_URL + '/#/quickstart');
    await page.fill('input[type=search]', 'Donate');
    expect(
      await page.innerText('.results-panel > .matching-post > a > h2')
    ).toEqual('Donate');
  });
});
