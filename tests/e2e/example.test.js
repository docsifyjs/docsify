// Modules, constants, and variables
// -----------------------------------------------------------------------------
const add = require('./fixtures/add.js');
const docsifyInit = require('./helpers/docsifyInit');
const { URL: serverURL } = require('./config/server.js');

// Suite
// -----------------------------------------------------------------------------
describe(`Example Tests`, function() {
  // Setup & Teardown
  // ---------------------------------------------------------------------------
  beforeEach(async () => {
    // Goto URL (fixtures/index.html)
    // https://playwright.dev/#path=docs%2Fapi.md&q=pagegotourl-options
    // NOTE: Tests typically begin by navigating to a page for testing. When
    // this doesn't happen, Playwright operates on the "about:blank" page which
    // will cause operations that require the window location to be a valid URL
    // to fail (e.g. AJAX requests). To avoid these issues, this hook ensures
    // that each tests begins by loading the default test server page.
    await page.goto(serverURL);
  });

  // Tests
  // ---------------------------------------------------------------------------
  test('dom manipulation', async () => {
    const testText = 'This is a test';
    const testHTML = `<h1>Test</h1><p>${testText}</p>`;

    // Inject HTML
    // https://playwright.dev/#path=docs%2Fapi.md&q=pagesetcontenthtml-options
    await page.setContent(testHTML);

    // Add class to <body> element and verify
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevalselector-pagefunction-arg
    await page.$eval('body', elm => elm.classList.add('foo'));
    expect(await page.getAttribute('body', 'class')).toEqual('foo');

    // Test using helper methods from expect-playright (via jest-playwright)
    // https://github.com/playwright-community/expect-playwright
    // https://playwright.tech/blog/using-jest-with-playwright
    await expect(page).toHaveText('body', 'Test');
    await expect(page).toHaveSelector('p');
    await expect(page).toEqualText('p', testText);
    await expect(page).not.toHaveSelector('table', { timeout: 1 });

    // Test using standard jest + playwrite methods
    // https://playwright.dev/#path=docs%2Fapi.md&q=pagetextcontentselector-options
    expect(await page.textContent('body')).toMatch(/Test/);
    await page.waitForSelector('p');
    expect(await page.textContent('p')).toEqual(testText);
    await page.waitForSelector('table', { state: 'detached' });

    // Debug mode
    // https://github.com/playwright-community/jest-playwright#put-in-debug-mode
    // await jestPlaywright.debug();
  });

  test('javascript in the browser context', async () => {
    // Get native DOM values
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    const clientDimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      };
    });

    // Get result of script executed in browser context
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    const scriptResult = await page.evaluate(
      numbers => {
        const result = numbers.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        );

        return Promise.resolve(result);
      },
      [1, 2, 3]
    );

    // Get result of local function executed in browser context
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    const functionResult = await page.evaluate(`
      ${add.toString()}

      const result = add(1, 2, 3);

      Promise.resolve(result);
    `);

    expect(clientDimensions).toHaveProperty('width');
    expect(typeof clientDimensions.width).toBe('number');
    expect(clientDimensions).toHaveProperty('height');
    expect(typeof clientDimensions.height).toBe('number');
    expect(scriptResult).toBe(6);
    expect(functionResult).toBe(6);
  });

  test('docsify test using playwright methods', async () => {
    // Goto URL
    // https://playwright.dev/#path=docs%2Fapi.md&q=pagegotourl-options
    await page.goto(`${serverURL}/html5.html`);

    // Set docsify configuration
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    await page.evaluate(() => {
      window.$docsify = {
        el: '#app',
        basePath: '/docs',
        themeColor: 'red',
      };
    });

    // Add docsify target element
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevalselector-pagefunction-arg
    await page.$eval('body', elm => {
      elm.innerHTML = '<div id="app"></div>';
    });

    // Inject docsify theme (vue.css)
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageaddstyletagoptions
    await page.addStyleTag({ url: `${serverURL}/lib/themes/vue.css` });

    // Inject docsify.js
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageaddscripttagoptions
    await page.addScriptTag({ url: `${serverURL}/lib/docsify.js` });

    // Wait for docsify to initialize
    // https://playwright.dev/#path=docs%2Fapi.md&q=pagewaitforselectorselector-options
    await page.waitForSelector('#main');

    // Create handle for JavaScript object in browser
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    const $docsify = await page.evaluate(() => window.$docsify);

    // Test object property and value
    expect($docsify).toHaveProperty('themeColor', 'red');
  });

  //

  test('docsify test using docsifyInit()', async () => {
    // Load custom docsify
    // (See ./helpers/docsifyInit.js for details)
    await docsifyInit(page, {
      config: {
        themeColor: 'red',
      },
    });

    // Create handle for JavaScript object in browser
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    const $docsify = await page.evaluate(() => window.$docsify);

    // Test object property and value
    expect($docsify).toHaveProperty('themeColor', 'red');
  });

  test('custom docsify site using docsifyInit()', async () => {
    // Load custom docsify
    // (See ./helpers/docsifyInit.js for details)
    await docsifyInit(page, {
      config: {
        name: 'Docsify Test',
      },
      contentMarkdown: `
        # Page Title

        This is a paragraph

        1. Item
        1. Item
        1. Item
      `,
      coverpageMarkdown: `
        # Docsify Test

        > Testing a magical documentation site generator

        [GitHub](https://github.com/docsifyjs/docsify/)
        [Getting Started](#page-title)
      `,
      navbarMarkdown: `
        - [docsify.js.org](https://docsify.js.org/#/)
      `,
      sidebarMarkdown: `
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

    // Click the test page link
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageclickselector-options
    await page.click('a[href="#/test"]');

    // Verify page change by checking URL
    await expect(page.url()).toMatch(/\/test$/);

    // Or verify page change by checking page content
    await expect(page).toHaveText('#main', 'This is a custom route');
  });
});
