/* jest
 * https://jestjs.io
 *
 * jest-playwright
 * https://github.com/playwright-community/jest-playwright
 *
 * Playwright
 * https://playwright.dev
 */

const docsifyInit = require('./helpers/docsifyInit');
const { serverURL } = require('./helpers/server.js');

describe(`Sample e2e Tests`, function() {
  // Setup & Teardown
  // ---------------------------------------------------------------------------
  beforeEach(async () => {
    await jestPlaywright.resetPage();
  });

  // Tests
  // ---------------------------------------------------------------------------
  test.only('renders the default docsify site', async () => {
    // Loads a new docsify site at serverURL
    await docsifyInit(page, {
      // Options...
    });

    const pageTitle = await page.title();

    // await jestPlaywright.debug();

    expect(pageTitle).toBe('docsify');
  });

  test('renders a customized docsify site', async () => {
    // const pageUrl = `${serverURL}/#/vue`;

    await docsifyInit(page, {
      url: serverURL,
      config: {
        homepage: 'test.md',
        themeColor: 'red',
      },
      content: `
            # It worked!

            This is a test
          `,
      coverpage: `
            # docsify

            > A magical documentation site generator.

            - Simple and lightweight
            - No statically built html files
            - Multiple themes

            [GitHub](https://github.com/docsifyjs/docsify/)
            [Getting Started](#docsify)
          `,
      navbar: `
            - Translations
            - [:uk: English](/)
            - [:cn: 中文](/zh-cn/)
            - [:de: Deutsch](/de-de/)
            - [:es: Spanish](/es/)
            - [:ru: Russian](/ru/)
          `,
      sidebar: `
            - Did this work?

            - [Yes](quickstart.md)
            - [No](more-pages.md)
            - [Maybe So](custom-navbar.md)

            - Customization
          `,
      routes: [
        [
          '**/README.md',
          `
            # Home Page

            This is a paragraph
          `,
        ],
        [
          '**/test.md',
          {
            body: `
              # Test

              This is a paragraph
            `,
          },
        ],
      ],
    });

    const pageTitle = await page.title();

    // await jestPlaywright.debug();

    expect(pageTitle).toBe('docsify');
  });
});
