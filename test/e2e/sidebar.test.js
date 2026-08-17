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

  test('keeps a loose-list page link visible when collapsed', async ({
    page,
  }) => {
    await docsifyInit({
      config: {
        subMaxLevel: 2,
      },
      markdown: {
        homepage: '# Home',
        sidebar: `
          - Getting started

            - [Introduction](introduction.md)

          - [Quick start](quickstart.md)
        `,
      },
      routes: {
        '/quickstart.md': `
          # Quick start

          ## Installation
        `,
      },
      styleURLs: ['/dist/themes/core.css'],
    });

    const quickStartLink = page.locator('.sidebar-nav a[href="#/quickstart"]');

    await quickStartLink.click();

    const quickStartItem = page.locator(
      '.sidebar-nav li:has(> p > a[href="#/quickstart"])',
    );
    const subSidebar = quickStartItem.locator(':scope > .app-sub-sidebar');
    await expect(subSidebar).toBeVisible();

    await quickStartLink.click();

    await expect(quickStartItem).toHaveClass(/collapse/);
    await expect(subSidebar).toBeHidden();
    await expect(quickStartLink).toBeVisible();
  });
});

test.describe('Mobile sidebar toggle', () => {
  test('wraps long links without causing horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const longUrl = `https://example.com/${'a'.repeat(240)}`;
    const content = Array.from(
      { length: 80 },
      (_, index) => `## Section ${index + 1}\n\nLong content for scrolling.`,
    ).join('\n\n');

    await docsifyInit({
      config: {
        loadSidebar: '_sidebar.md',
      },
      markdown: {
        homepage: `# Mobile scrolling\n\n${content}\n\n[${longUrl}](${longUrl})`,
        sidebar: '- [Mobile scrolling](README.md)',
      },
      styleURLs: ['/dist/themes/core.css'],
    });

    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(page.viewportSize().width);

    await page.mouse.wheel(0, 1200);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);

    await page.mouse.wheel(0, -1200);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
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
