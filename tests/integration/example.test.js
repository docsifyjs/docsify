import docsifyInit from '../unit/helpers/docsify-init.js';

// Suite
// -----------------------------------------------------------------------------
describe('Example Tests', function() {
  // Tests
  // ---------------------------------------------------------------------------
  test('docsifyInit() helper kitchen sink', async () => {
    await docsifyInit({
      config: {
        themeColor: 'red',
      },
      markdown: {
        coverpage: `
          # Docsify Test

          This is the coverpage.
        `,
        homepage: `
          # Hello World

          This is the homepage.
        `,
        navbar: `
          - Navbar Item 1
          - Navbar Item 2
          - Navbar Item 3
        `,
        sidebar: `
          - Sidebar Item 1
          - Sidebar Item 2
          - Sidebar Item 3
        `,
      },
      routes: {
        'test.md': 'This is content from a custom route',
      },
      script: `
        console.log('Injected <script> executed');
      `,
      scriptURLs:
        'https://cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js',
      styleURLs: ['/lib/themes/vue.css'],
      // _logHTML: true,
    });

    const styleElm = document.querySelector('head style');
    const mainElm = document.querySelector('#main');
    const coverElm = document.querySelector('section.cover');
    const sidebarElm = document.querySelector('aside.sidebar');
    const navbarElm = document.querySelector('nav.app-nav');

    expect(typeof window.Docsify).toEqual('object');
    expect(typeof window.$docsify).toEqual('object');
    expect(styleElm.textContent).toContain('--theme-color: red;');
    expect(mainElm.textContent).toContain('Hello World');
    expect(coverElm.textContent).toContain('Docsify Test');
    expect(sidebarElm.textContent).toContain('Sidebar Item 1');
    expect(navbarElm.textContent).toContain('Navbar Item 1');
  });
});
