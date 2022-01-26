const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe('Docs Site', function() {
  // Tests
  // ---------------------------------------------------------------------------
  test('coverpage renders and is unchanged', async () => {
    // Override Math.random implementation to prevent random gradient values
    // used as background image from causing test to fail
    const mathSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    await docsifyInit({
      config: {
        coverpage: 'docs/_coverpage.md',
      },
      markdown: {
        homepage: '# Hello World',
      },

      // JEST_JSDOM_BUG: because the style attribute will be empty in jsdom
      // (although it works fine in a real browser), we can't wait for the style
      // attribute selector.
      // waitForSelector: '.cover.show[style*="background"]',
      waitForSelector: '.cover.show',
    });

    const coverpageElm = document.querySelector('section.cover');

    // Test snapshots
    expect(mathSpy).toHaveBeenCalled();
    expect(coverpageElm).not.toBeNull();

    // JEST_JSDOM_BUG These tests don't work because the values show up as empty
    // strings, although in a regular browser things work fine.
    // expect(coverpageElm.style.background).toContain('linear-gradient');
    // expect(coverpageElm.getAttribute('style')).toContain('linear-gradient');

    expect(coverpageElm.outerHTML).toMatchSnapshot();
  });

  test('sidebar renders and is unchanged', async () => {
    await docsifyInit({
      config: {
        loadSidebar: 'docs/_sidebar.md',
      },
      markdown: {
        homepage: '# Hello World',
      },
      waitForSelector: '.sidebar-nav > ul',
    });

    const sidebarElm = document.querySelector('.sidebar');

    // Test snapshots
    expect(sidebarElm).not.toBeNull();
    expect(sidebarElm.outerHTML).toMatchSnapshot();
  });

  test('navbar renders and is unchanged', async () => {
    await docsifyInit({
      config: {
        loadNavbar: 'docs/_navbar.md',
      },
      markdown: {
        homepage: '# Hello World',
      },
      waitForSelector: '.app-nav > ul',
    });

    const navbarElm = document.querySelector('nav.app-nav');

    // Test snapshots
    expect(navbarElm).not.toBeNull();
    expect(navbarElm.outerHTML).toMatchSnapshot();
  });
});
