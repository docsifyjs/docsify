// Modules, constants, and variables
// -----------------------------------------------------------------------------
const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe(`Example Tests`, function() {
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
    await page.goto(`${TEST_HOST}/_blank.html`);

    // Set docsify configuration
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    await page.evaluate(() => {
      window.$docsify = {
        el: '#app',
        basePath: '/docs/',
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
    await page.addStyleTag({ url: '/lib/themes/vue.css' });

    // Inject docsify.js
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageaddscripttagoptions
    await page.addScriptTag({ url: '/lib/docsify.js' });

    // Wait for docsify to initialize
    // https://playwright.dev/#path=docs%2Fapi.md&q=pagewaitforselectorselector-options
    await page.waitForSelector('#main');

    // Create handle for JavaScript object in browser
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    const $docsify = await page.evaluate(() => window.$docsify);

    // Test object property and value
    expect($docsify).toHaveProperty('themeColor', 'red');
  });

  test('Docsify /docs/ site using docsifyInit()', async () => {
    // Load custom docsify
    // (See ./helpers/docsifyInit.js for details)
    await docsifyInit({
      config: {
        basePath: '/docs/',
      },
      // _debug: true,
      // _logHTML: true,
    });

    // Create handle for JavaScript object in browser
    // https://playwright.dev/#path=docs%2Fapi.md&q=pageevaluatepagefunction-arg
    const $docsify = await page.evaluate(() => window.$docsify);

    // Verify config options
    expect(typeof $docsify).toEqual('object');

    // Verify docsifyInitConfig.markdown content was rendered
    await expect(page).toHaveText(
      '#main',
      'A magical documentation site generator'
    );
  });

  test('custom docsify site using docsifyInit()', async () => {
    const docsifyInitConfig = {
      config: {
        name: 'Docsify Name',
        themeColor: 'red',
      },
      markdown: {
        coverpage: `
          # Docsify Test

          > Testing a magical documentation site generator

          [GitHub](https://github.com/docsifyjs/docsify/)
        `,
        homepage: `
          # Hello World

          This is the homepage.
        `,
        navbar: `
          - [docsify.js.org](https://docsify.js.org/#/)
        `,
        sidebar: `
          - [Test Page](test)
        `,
      },
      routes: {
        'test.md': `
          # Test Page

          This is a custom route.
        `,
        'data-test-scripturls.js': `
          document.body.setAttribute('data-test-scripturls', 'pass');
        `,
      },
      script: `
        document.body.setAttribute('data-test-script', 'pass');
      `,
      scriptURLs: [
        // docsifyInit() route
        'data-test-scripturls.js',
        // Server route
        '/lib/plugins/search.min.js',
      ],
      style: `
        body {
          background: red !important;
        }
      `,
      styleURLs: ['/lib/themes/vue.css'],
    };

    await docsifyInit({
      ...docsifyInitConfig,
      // _debug: true,
      // _logHTML: true,
    });

    const $docsify = await page.evaluate(() => window.$docsify);

    // Verify config options
    expect(typeof $docsify).toEqual('object');
    expect($docsify).toHaveProperty('themeColor', 'red');
    await expect(page).toHaveText('.app-name', 'Docsify Name');

    // Verify docsifyInitConfig.markdown content was rendered
    await expect(page).toHaveText('section.cover', 'Docsify Test'); // Coverpage
    await expect(page).toHaveText('nav.app-nav', 'docsify.js.org'); // Navbar
    await expect(page).toHaveText('aside.sidebar', 'Test Page'); // Sidebar
    await expect(page).toHaveText('#main', 'This is the homepage'); // Homepage

    // Verify docsifyInitConfig.scriptURLs were added to the DOM
    for (const scriptURL of docsifyInitConfig.scriptURLs) {
      await expect(page).toHaveSelector(`script[src$="${scriptURL}"]`, {
        state: 'attached',
      });
    }

    // Verify docsifyInitConfig.scriptURLs were executed
    await expect(page).toHaveSelector('body[data-test-scripturls]');
    await expect(page).toHaveSelector('.search input[type="search"]');

    // Verify docsifyInitConfig.script was added to the DOM
    expect(
      await page.evaluate(scriptText => {
        return [...document.querySelectorAll('script')].some(
          elm => elm.textContent.replace(/\s+/g, '') === scriptText
        );
      }, docsifyInitConfig.script.replace(/\s+/g, ''))
    ).toBe(true);

    // Verify docsifyInitConfig.script was executed
    await expect(page).toHaveSelector('body[data-test-script]');

    // Verify docsifyInitConfig.styleURLs were added to the DOM
    for (const styleURL of docsifyInitConfig.styleURLs) {
      await expect(page).toHaveSelector(
        `link[rel*="stylesheet"][href$="${styleURL}"]`,
        {
          state: 'attached',
        }
      );
    }

    // Verify docsifyInitConfig.style was added to the DOM
    expect(
      await page.evaluate(styleText => {
        return [...document.querySelectorAll('style')].some(
          elm => elm.textContent.replace(/\s+/g, '') === styleText
        );
      }, docsifyInitConfig.style.replace(/\s+/g, ''))
    ).toBe(true);

    // Verify docsify navigation and docsifyInitConfig.routes
    await page.click('a[href="#/test"]');
    expect(page.url()).toMatch(/\/test$/);
    await expect(page).toHaveText('#main', 'This is a custom route');
  });

  test('image snapshots', async () => {
    await docsifyInit({
      config: {
        name: 'Docsify Test',
      },
      markdown: {
        homepage: `
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
      },
      styleURLs: [`/lib/themes/vue.css`],
      // _debug: true,
      // _logHTML: true,
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
