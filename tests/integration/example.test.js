const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe('Example Tests', function() {
  // Tests
  // ---------------------------------------------------------------------------
  test('kitchen sink docsify site using docsifyInit()', async () => {
    // Load custom docsify
    // (See ./helpers/docsifyInit.js for details)
    await docsifyInit({
      config: {
        name: 'Docsify Name',
      },
      markdown: {
        coverpage: `
          # Docsify Test

          > Testing a magical documentation site generator

          [GitHub](https://github.com/docsifyjs/docsify/)
          [Getting Started](#page-title)
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
        '**/test.md': `
          # Test Page

          This is a custom route.
        `,
      },
      script: `
        document.body.setAttribute('data-test-script', 'pass');
      `,
      scriptURLs: [
        '/lib/plugins/search.js',
        'https://cdn.jsdelivr.net/npm/docsify-themeable@0',
      ],
      style: `
        :root {
          --theme-hue: 275;
        }
      `,
      styleURLs: [
        'https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple.css',
      ],
      // _debug: true,
      // _logHTML: true,
    });

    // Verify config options
    expect(typeof window.$docsify).toEqual('object');
    expect(document.querySelector('.app-name').textContent).toContain(
      'Docsify Name'
    );

    // Verify options.markdown content was rendered
    Object.entries({
      'section.cover': 'Docsify Test', // Coverpage
      'nav.app-nav': 'docsify.js.org', // Navbar
      'aside.sidebar': 'Test Page', // Sidebar
      '#main': 'This is the homepage', // Homepage
    }).forEach(([selector, content]) => {
      expect(document.querySelector(selector).textContent).toContain(content);
    });

    // Verify options.script was executed
    expect(document.body.hasAttribute('data-test-script')).toBe(true);

    // Verify option.scriptURLs were executed
    // expect(document.querySelector('.search input[type="search"]')).toBeTruthy(); // Search

    // Verify options.style was applied
    // expect(
    //   window
    //     .getComputedStyle(document.documentElement)
    //     .getPropertyValue('--theme-hue')
    //     .trim()
    // ).toEqual('275');

    // Verify options.styleURLs were applied
    // expect(
    //   window
    //     .getComputedStyle(document.documentElement)
    //     .getPropertyValue('--theme-hue')
    //     .trim()
    // ).toContain('hsl');

    // Click the test page link
    // TBD

    // Verify page change by checking URL
    // TBD

    // Verify options.routes by checking page content
    // TBD
  });
});
