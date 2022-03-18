// Modules, constants, and variables
// -----------------------------------------------------------------------------
const docsifyInit = require('../helpers/docsify-init');
const { test, expect } = require('./fixtures/docsify-init-fixture');

// Suite
// -----------------------------------------------------------------------------
test.describe('Example Tests', () => {
  // Tests
  // ---------------------------------------------------------------------------
  test('dom manipulation', async ({ page }) => {
    const testText = 'This is a test';
    const testHTML = `<h1>Test</h1><p>${testText}</p>`;

    // Inject HTML
    await page.setContent(testHTML);

    // Get reference to page element
    const bodyElm = page.locator('body');
    const pElm = page.locator('body > p');

    // Add class to element and test
    await bodyElm.evaluate(elm => elm.classList.add('foo'));

    // Tests
    await expect(bodyElm).toHaveClass('foo');
    await expect(bodyElm).toContainText('Test');
    await expect(pElm).toHaveCount(1);
    await expect(pElm).toHaveText(testText);
    await expect(pElm).not.toHaveText('NOPE');
  });

  test('javascript in browser context', async ({ page }) => {
    // Get native DOM values
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
    function add(...addends) {
      return addends.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );
    }

    const functionResult = await page.evaluate(`
      const add = ${add.toString()};

      const result = add(1, 2, 3);

      Promise.resolve(result);
    `);

    expect(functionResult).toBe(6);
  });

  test('manual docsify site using playwright methods', async ({ page }) => {
    // Add docsify target element
    await page.setContent('<div id="app"></div>');

    // Set docsify configuration
    await page.evaluate(() => {
      window.$docsify = {
        el: '#app',
        basePath: '/docs/',
        themeColor: 'red',
      };
    });

    // Inject docsify theme (vue.css)
    await page.addStyleTag({ url: '/lib/themes/vue.css' });

    // Inject docsify.js
    await page.addScriptTag({ url: '/lib/docsify.js' });

    // Wait for docsify to initialize
    await page.waitForSelector('#main');

    // Create handle for JavaScript object in browser
    const $docsify = await page.evaluate(() => window.$docsify);
    // const $docsify = await page.evaluateHandle(() => window.$docsify);

    // Test object property and value
    expect($docsify).toHaveProperty('themeColor', 'red');
  });

  test('Docsify /docs/ site using docsifyInit()', async ({ page }) => {
    // Load custom docsify
    // (See ./helpers/docsifyInit.js for details)
    await docsifyInit({
      config: {
        basePath: '/docs/',
      },
      // _logHTML: true,
    });

    // Verify docsifyInitConfig.markdown content was rendered
    const mainElm = page.locator('#main');
    await expect(mainElm).toHaveCount(1);
    await expect(mainElm).toContainText(
      'A magical documentation site generator'
    );
  });

  test('custom docsify site using docsifyInit()', async ({ page }) => {
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
      // _logHTML: true,
    });

    const $docsify = await page.evaluate(() => window.$docsify);

    // Verify config options
    expect(typeof $docsify).toEqual('object');
    expect($docsify).toHaveProperty('themeColor', 'red');
    await expect(page.locator('.app-name')).toHaveText('Docsify Name');

    // Verify docsifyInitConfig.markdown content was rendered
    await expect(page.locator('section.cover h1')).toHaveText('Docsify Test'); // Coverpage
    await expect(page.locator('nav.app-nav')).toHaveText('docsify.js.org'); // Navbar
    await expect(page.locator('aside.sidebar')).toContainText('Test Page'); // Sidebar
    await expect(page.locator('#main')).toContainText('This is the homepage'); // Homepage

    // Verify docsifyInitConfig.scriptURLs were added to the DOM
    for (const scriptURL of docsifyInitConfig.scriptURLs) {
      await expect(page.locator(`script[src$="${scriptURL}"]`)).toHaveCount(1);
    }

    // Verify docsifyInitConfig.scriptURLs were executed
    await expect(page.locator('body[data-test-scripturls]')).toHaveCount(1);
    await expect(page.locator('.search input[type="search"]')).toHaveCount(1);

    // Verify docsifyInitConfig.script was added to the DOM
    expect(
      await page.evaluate(scriptText => {
        return [...document.querySelectorAll('script')].some(
          elm => elm.textContent.replace(/\s+/g, '') === scriptText
        );
      }, docsifyInitConfig.script.replace(/\s+/g, ''))
    ).toBe(true);

    // Verify docsifyInitConfig.script was executed
    await expect(page.locator('body[data-test-script]')).toHaveCount(1);

    // Verify docsifyInitConfig.styleURLs were added to the DOM
    for (const styleURL of docsifyInitConfig.styleURLs) {
      await expect(
        page.locator(`link[rel*="stylesheet"][href$="${styleURL}"]`)
      ).toHaveCount(1);
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
    await expect(page.locator('#main')).toContainText('This is a custom route');
  });

  // test.fixme('image snapshots', async ({ page }) => {
  //   await docsifyInit({
  //     config: {
  //       name: 'Docsify Test',
  //     },
  //     markdown: {
  //       homepage: `
  //         # The Cosmos Awaits

  //         [Carl Sagan](https://en.wikipedia.org/wiki/Carl_Sagan)

  //         Cosmic ocean take root and flourish decipherment hundreds of thousands
  //         dream of the mind's eye courage of our questions. At the edge of forever
  //         network of wormholes ship of the imagination two ghostly white figures
  //         in coveralls and helmets are softly dancing are creatures of the cosmos
  //         the only home we've ever known? How far away emerged into consciousness
  //         bits of moving fluff gathered by gravity with pretty stories for which
  //         there's little good evidence vanquish the impossible.

  //         The ash of stellar alchemy permanence of the stars shores of the cosmic
  //         ocean billions upon billions Drake Equation finite but unbounded.
  //         Hundreds of thousands cosmic ocean hearts of the stars Hypatia invent
  //         the universe hearts of the stars? Realm of the galaxies muse about dream
  //         of the mind's eye hundreds of thousands the only home we've ever known
  //         how far away. Extraordinary claims require extraordinary evidence
  //         citizens of distant epochs invent the universe as a patch of light the
  //         carbon in our apple pies gathered by gravity.

  //         Billions upon billions gathered by gravity white dwarf intelligent
  //         beings vanquish the impossible descended from astronomers. A still more
  //         glorious dawn awaits cosmic ocean star stuff harvesting star light the
  //         sky calls to us kindling the energy hidden in matter rich in heavy
  //         atoms. A mote of dust suspended in a sunbeam across the centuries the
  //         only home we've ever known bits of moving fluff a very small stage in a
  //         vast cosmic arena courage of our questions.

  //         Euclid the only home we've ever known realm of the galaxies trillion
  //         radio telescope Apollonius of Perga. The carbon in our apple pies invent
  //         the universe muse about stirred by starlight great turbulent clouds
  //         emerged into consciousness? Invent the universe vastness is bearable
  //         only through love a still more glorious dawn awaits descended from
  //         astronomers as a patch of light the sky calls to us. Great turbulent
  //         clouds citizens of distant epochs invent the universe two ghostly white
  //         figures in coveralls and helmets are softly dancing courage of our
  //         questions rich in heavy atoms and billions upon billions upon billions
  //         upon billions upon billions upon billions upon billions.
  //       `,
  //     },
  //     styleURLs: [`/lib/themes/vue.css`],
  //     // _logHTML: true,
  //   });

  //   // Viewport screenshot
  //   const viewportShot = await page.screenshot();
  //   expect(viewportShot).toMatchSnapshot('viewport.png');

  //   // Element screenshot
  //   const elmHandle = await page.locator('h1').first();
  //   const elmShot = await elmHandle.screenshot();
  //   expect(elmShot).toMatchSnapshot('element.png');
  // });
});
