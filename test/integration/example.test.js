const { waitForFunction, waitForText } = require('../helpers/wait-for');

const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe('Example Tests', function () {
  // Tests
  // ---------------------------------------------------------------------------
  test('Docsify /docs/ site using docsifyInit()', async () => {
    await docsifyInit({
      config: {
        basePath: '/docs/',
      },
      // _logHTML: true,
    });

    // Verify config options
    expect(typeof window.$docsify).toBe('object');

    // Verify options.markdown content was rendered
    expect(document.querySelector('#main').textContent).toContain(
      'A magical documentation site generator'
    );
  });

  test('kitchen sink docsify site using docsifyInit()', async () => {
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

    // Verify config options
    expect(typeof window.$docsify).toBe('object');
    expect(window.$docsify).toHaveProperty('themeColor', 'red');
    expect(document.querySelector('.app-name').textContent).toContain(
      'Docsify Name'
    );

    // Verify docsifyInitConfig.markdown content was rendered
    Object.entries({
      'section.cover': 'Docsify Test', // Coverpage
      'nav.app-nav': 'docsify.js.org', // Navbar
      'aside.sidebar': 'Test Page', // Sidebar
      '#main': 'This is the homepage', // Homepage
    }).forEach(([selector, content]) => {
      expect(document.querySelector(selector).textContent).toContain(content);
    });

    // Verify docsifyInitConfig.scriptURLs were added to the DOM
    for (const scriptURL of docsifyInitConfig.scriptURLs) {
      const matchElm = document.querySelector(
        `script[data-src$="${scriptURL}"]`
      );
      expect(matchElm).toBeTruthy();
    }

    // Verify docsifyInitConfig.scriptURLs were executed
    expect(document.body.hasAttribute('data-test-scripturls')).toBe(true);
    expect(document.querySelector('.search input[type="search"]')).toBeTruthy();

    // Verify docsifyInitConfig.script was added to the DOM
    expect(
      [...document.querySelectorAll('script')].some(
        elm =>
          elm.textContent.replace(/\s+/g, '') ===
          docsifyInitConfig.script.replace(/\s+/g, '')
      )
    ).toBe(true);

    // Verify docsifyInitConfig.script was executed
    expect(document.body.hasAttribute('data-test-script')).toBe(true);

    // Verify docsifyInitConfig.styleURLs were added to the DOM
    for (const styleURL of docsifyInitConfig.styleURLs) {
      const matchElm = document.querySelector(
        `link[rel*="stylesheet"][href$="${styleURL}"]`
      );
      expect(matchElm).toBeTruthy();
    }

    // Verify docsifyInitConfig.style was added to the DOM
    expect(
      [...document.querySelectorAll('style')].some(
        elm =>
          elm.textContent.replace(/\s+/g, '') ===
          docsifyInitConfig.style.replace(/\s+/g, '')
      )
    ).toBe(true);

    // Verify docsify navigation and docsifyInitConfig.routes
    document.querySelector('a[href="#/test"]').click();
    expect(
      await waitForFunction(() => /#\/test$/.test(window.location.href))
    ).toBeTruthy();
    expect(await waitForText('#main', 'This is a custom route')).toBeTruthy();
  });
});
