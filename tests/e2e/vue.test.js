const docsifyInit = require('../helpers/docsifyInit');
// const { serverURL } = require('../helpers/server.js');

describe(`Vue.js Rendering`, function() {
  // Setup & Teardown
  // -------------------------------------------------------------------------
  beforeEach(async () => {
    await jestPlaywright.resetPage();
  });

  // Tests
  // -------------------------------------------------------------------------
  test('renders basic Vue content', async () => {
    // const pageUrl = `${serverURL}/#/vue`;

    await docsifyInit(page, {
      // url: pageUrl,
      content: 'hello',
      config: {
        executeScript: true,
      },
      scriptURLs: ['https://unpkg.com/vue@2'],
      routes: [
        '**/README.md',
        `
          # Home Page

          This is a paragraph
        `,
      ],
    });

    const pageTitle = await page.title();

    await jestPlaywright.debug();

    expect(pageTitle).toBe('docsify');
  });
});
