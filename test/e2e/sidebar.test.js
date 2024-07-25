import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

// Suite
// -----------------------------------------------------------------------------
test.describe('Sidebar Tests', () => {
  // Tests
  // ---------------------------------------------------------------------------
  test('Active Test', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        sidebar: `
          - [Test Space](test%20space)
          - [Test _](test_foo)
          - [Test -](test-foo)
          - [Test .](test.foo)
          - [Test >](test>foo)
          - [Test](test)
        `,
      },
      routes: {
        '/test space.md': `
          # Test Space
        `,
        '/test_foo.md': `
          # Test _
        `,
        '/test-foo.md': `
          # Test -
        `,
        '/test.foo.md': `
          # Test .
        `,
        '/test>foo.md': `
          # Test >
        `,
        '/test.md': `
          # Test page
        `,
      },
    };

    const activeLinkElm = page.locator('.sidebar-nav li[class=active]');

    await docsifyInit(docsifyInitConfig);

    await page.click('a[href="#/test"]');
    await expect(activeLinkElm).toHaveText('Test');
    expect(page.url()).toMatch(/\/test$/);

    await page.click('a[href="#/test%20space"]');
    await expect(activeLinkElm).toHaveText('Test Space');
    expect(page.url()).toMatch(/\/test%20space$/);

    await page.click('a[href="#/test_foo"]');
    await expect(activeLinkElm).toHaveText('Test _');
    expect(page.url()).toMatch(/\/test_foo$/);

    await page.click('a[href="#/test-foo"]');
    await expect(activeLinkElm).toHaveText('Test -');
    expect(page.url()).toMatch(/\/test-foo$/);

    await page.click('a[href="#/test.foo"]');
    await expect(activeLinkElm).toHaveText('Test .');
    expect(page.url()).toMatch(/\/test.foo$/);

    await page.click('a[href="#/test>foo"]');
    await expect(activeLinkElm).toHaveText('Test >');
    expect(page.url()).toMatch(/\/test%3Efoo$/);
  });
});

test.describe('Configuration: autoHeader', () => {
  test('autoHeader=false', async ({ page }) => {
    const docsifyInitConfig = {
      config: {
        loadSidebar: '_sidebar.md',
        autoHeader: false,
      },
      markdown: {
        sidebar: `
            - [QuickStartAutoHeader](quickstart.md)
          `,
      },
      routes: {
        '/quickstart.md': `
            the content of quickstart space
            ## In the main content there is no h1
          `,
      },
    };

    await docsifyInit(docsifyInitConfig);

    await page.click('a[href="#/quickstart"]');
    expect(page.url()).toMatch(/\/quickstart$/);
    // not heading
    await expect(page.locator('#quickstart')).toBeHidden();
  });

  test('autoHeader=true', async ({ page }) => {
    const docsifyInitConfig = {
      config: {
        loadSidebar: '_sidebar.md',
        autoHeader: true,
      },
      markdown: {
        sidebar: `
            - [QuickStartAutoHeader](quickstart.md )
          `,
      },
      routes: {
        '/quickstart.md': `
            the content of quickstart space
            ## In the main content there is no h1
          `,
      },
    };

    await docsifyInit(docsifyInitConfig);

    await page.click('a[href="#/quickstart"]');
    expect(page.url()).toMatch(/\/quickstart$/);

    // auto generate default heading id
    const autoHeader = page.locator('#quickstartautoheader');
    expect(await autoHeader.innerText()).toContain('QuickStartAutoHeader');
  });

  test('autoHeader=true and custom headingId', async ({ page }) => {
    const docsifyInitConfig = {
      config: {
        loadSidebar: '_sidebar.md',
        autoHeader: true,
      },
      markdown: {
        sidebar: `
            - [QuickStartAutoHeader](quickstart.md ":id=quickstartId")
          `,
      },
      routes: {
        '/quickstart.md': `
            the content of quickstart space
            ## In the main content there is no h1
          `,
      },
    };

    await docsifyInit(docsifyInitConfig);

    await page.click('a[href="#/quickstart"]');
    expect(page.url()).toMatch(/\/quickstart$/);
    // auto generate custom heading id
    const autoHeader = page.locator('#quickstartId');
    expect(await autoHeader.innerText()).toContain('QuickStartAutoHeader');
  });
});
