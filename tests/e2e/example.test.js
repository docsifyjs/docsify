// Modules, constants, and variables
// -----------------------------------------------------------------------------
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

    // Add class to <body> element and test
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

  test('javascript in browser context', async () => {
    // Get native DOM values
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    const clientDimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      };
    });

    expect(clientDimensions).toHaveProperty('width');
    expect(typeof clientDimensions.width).toBe('number');
    expect(clientDimensions).toHaveProperty('height');
    expect(typeof clientDimensions.height).toBe('number');

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

    expect(scriptResult).toBe(6);

    // Get result of local function executed in browser context
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    function add(...addends) {
      return addends.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );
    }

    const functionResult = await page.evaluate(`
      ${add.toString()}

      const result = add(1, 2, 3);

      Promise.resolve(result);
    `);

    expect(functionResult).toBe(6);
  });

  test('manual docsify site using playwright methods', async () => {
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

  test('default docsify site using docsifyInit()', async () => {
    // Load custom docsify
    // (See ./helpers/docsifyInit.js for details)
    await docsifyInit({
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
    await docsifyInit({
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

    // Test page change by checking URL
    await expect(page.url()).toMatch(/\/test$/);

    // Or test page change by checking page content
    await expect(page).toHaveText('#main', 'This is a custom route');
  });

  test('image snapshots', async () => {
    await docsifyInit({
      config: {
        name: 'Docsify Test',
      },
      contentMarkdown: `
        # The Cosmos Awaits

        [Carl Sagan](https://en.wikipedia.org/wiki/Carl_Sagan)

        Cosmic ocean take root and flourish decipherment hundreds of thousands
        dream of the mind's eye courage of our questions. At the edge of forever
        network of wormholes ship of the imagination two ghostly white figures
        in coveralls and helmets are softly dancing are creatures of the cosmos
        the only home we've ever known? How far away emerged into consciousness
        bits of moving fluff gathered by gravity with pretty stories for which
        there's little good evidence vanquish the impossible.

        The ash of stellar alchemy permanence of the stars shores of the cosmic
        ocean billions upon billions Drake Equation finite but unbounded.
        Hundreds of thousands cosmic ocean hearts of the stars Hypatia invent
        the universe hearts of the stars? Realm of the galaxies muse about dream
        of the mind's eye hundreds of thousands the only home we've ever known
        how far away. Extraordinary claims require extraordinary evidence
        citizens of distant epochs invent the universe as a patch of light the
        carbon in our apple pies gathered by gravity.

        Billions upon billions gathered by gravity white dwarf intelligent
        beings vanquish the impossible descended from astronomers. A still more
        glorious dawn awaits cosmic ocean star stuff harvesting star light the
        sky calls to us kindling the energy hidden in matter rich in heavy
        atoms. A mote of dust suspended in a sunbeam across the centuries the
        only home we've ever known bits of moving fluff a very small stage in a
        vast cosmic arena courage of our questions.

        Euclid the only home we've ever known realm of the galaxies trillion
        radio telescope Apollonius of Perga. The carbon in our apple pies invent
        the universe muse about stirred by starlight great turbulent clouds
        emerged into consciousness? Invent the universe vastness is bearable
        only through love a still more glorious dawn awaits descended from
        astronomers as a patch of light the sky calls to us. Great turbulent
        clouds citizens of distant epochs invent the universe two ghostly white
        figures in coveralls and helmets are softly dancing courage of our
        questions rich in heavy atoms and billions upon billions upon billions
        upon billions upon billions upon billions upon billions.
      `,
    });

    // Viewport screenshot
    const screenshot1 = await page.screenshot();
    expect(screenshot1).toMatchImageSnapshot();

    // Full page screenshot
    const screenshot2 = await page.screenshot({ fullPage: true });
    expect(screenshot2).toMatchImageSnapshot();

    // Element screenshot
    const elmHandle = await page.$('h1');
    const screenshot3 = await elmHandle.screenshot();
    expect(screenshot3).toMatchImageSnapshot();
  });
});
