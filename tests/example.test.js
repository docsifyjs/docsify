// Imports, Modules, Constants, and Variables
// ---------------------------------------------------------------------------
const docsifyInit = require('./helpers/docsifyInit');

// Functions
// ---------------------------------------------------------------------------
function add(...numbers) {
  return numbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  );
}

describe(`Example Tests`, function() {
  // Setup & Teardown
  // ---------------------------------------------------------------------------
  beforeEach(async () => {
    await jestPlaywright.resetPage();
  });

  // Tests
  // ---------------------------------------------------------------------------
  test('function', async () => {
    const testValue = add(1, 2, 3);

    expect(testValue).toBe(6);
  });

  test('injected HTML', async () => {
    const testText = 'This is a test';
    const testHTML = `<h1>Test</h1><p>${testText}</p>`;

    // Inject HTML
    // https://playwright.dev/#path=docs%2Fapi.md&q=pagesetcontenthtml-options
    await page.setContent(testHTML);

    // Use helper methods from expect-playright (via jest-playwright)
    // - https://github.com/playwright-community/expect-playwright
    // - https://playwright.tech/blog/using-jest-with-playwright
    await expect(page).toHaveText('body', 'Test');
    await expect(page).toHaveSelector('p');
    await expect(page).toEqualText('p', testText);
    await expect(page).not.toHaveSelector('table', { timeout: 1 });

    // Or use standard jest + playwrite methods
    // https://playwright.dev/#path=docs%2Fapi.md&q=pagetextcontentselector-options
    expect(await page.textContent('body')).toMatch(/Test/);
    expect(await page.waitForSelector('p'));
    expect(await page.textContent('p')).toEqual(testText);
    expect(await page.waitForSelector('table', { state: 'detached' }));
  });

  test('docsify docs site', async () => {
    // Load docsify docs site
    // See ./helpers/docsifyInit.js for details
    await docsifyInit(page, {
      basePath: '/docs', // default
    });

    // TIP 1: Use the jestPlaywright.debug() helper to pause execution
    // TIP 2: Debug with devtools by setting `headless: false` in jest-playwright.config.js
    // await jestPlaywright.debug();

    expect(await page.title()).toBe('docsify');
  });

  test('docsify custom site', async () => {
    // Load a custom docsify site
    // See ./helpers/docsifyInit.js for details
    await docsifyInit(page, {
      config: {
        name: 'Docsify Test',
      },
      content: `
        # Page Title

        This is a paragraph

        1. Item
        1. Item
        1. Item
      `,
      coverpage: `
        # Docsify Test

        > Testing a magical documentation site generator

        [GitHub](https://github.com/docsifyjs/docsify/)
        [Getting Started](#page-title)
      `,
      navbar: `
        - [docsify.js.org](https://docsify.js.org/#/)
      `,
      sidebar: `
        - [Test Page](test)
      `,
      routes: [
        [
          '**/test.md',
          `
            # Test Page

            This is a custom route
          `,
        ],
      ],
      script: `
        console.log('Injected JavaScript');
      `,
      scriptURLs: ['https://cdn.jsdelivr.net/npm/docsify-themeable@0'],
      style: `
        :root {
          --theme-hue: 275;
        }
      `,
      styleURLs: [
        'https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple.css',
      ],
    });

    // await jestPlaywright.debug();

    // Click the test page link
    await page.click('a[href="#/test"]');

    // Verify page change by checking URL
    await expect(page.url()).toMatch(/\/test$/);

    // Or verify page change by checking page content
    await expect(page).toHaveText('#main', 'This is a custom route');
  });
});
