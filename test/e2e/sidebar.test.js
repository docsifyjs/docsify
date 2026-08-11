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

  test('collapses root sidebar groups', async ({ page }) => {
    await docsifyInit({
      styleURLs: ['/dist/themes/core.css'],
      markdown: {
        sidebar: `
          - Getting started
            - [Quick start](quickstart)
          - Customization
            - [Configuration](configuration)
          - Standalone
          - [Linked group](linked)
            - [Linked child](linked-child)
        `,
      },
      routes: {
        '/quickstart.md': '# Quick start',
        '/configuration.md': '# Configuration',
        '/linked.md': '# Linked group',
        '/linked-child.md': '# Linked child',
      },
    });

    const group = page.locator('.sidebar-nav > ul > li').first();
    const groupTitle = group.locator(':scope > p.group-title');
    const childLink = group.locator(':scope > ul > li > a');

    await expect(groupTitle).toHaveAttribute('role', 'button');
    await expect(groupTitle).toHaveAttribute('tabindex', '0');
    await expect(groupTitle).toHaveAttribute('aria-expanded', 'true');
    await expect(childLink).toBeVisible();

    const standalone = page.locator('.sidebar-nav > ul > li').nth(2);
    await expect(standalone).not.toHaveClass(/group/);
    await expect(standalone.locator('[role="button"]')).toHaveCount(0);

    const linkedGroup = page.locator('.sidebar-nav > ul > li').nth(3);
    const linkedGroupLink = linkedGroup.locator('a').first();
    await expect(linkedGroupLink).toHaveAttribute('href', '#/linked');

    await groupTitle.click();

    await expect(group).toHaveClass(/collapse/);
    await expect(groupTitle).toHaveAttribute('aria-expanded', 'false');
    await expect(childLink).toBeHidden();

    await linkedGroupLink.click();
    expect(page.url()).toMatch(/\/linked$/);
    await expect(group).toHaveClass(/collapse/);
    await expect(groupTitle).toHaveAttribute('aria-expanded', 'false');
    await expect(childLink).toBeHidden();

    await groupTitle.press('Enter');

    await expect(group).not.toHaveClass(/collapse/);
    await expect(groupTitle).toHaveAttribute('aria-expanded', 'true');
    await expect(childLink).toBeVisible();

    await groupTitle.press('Space');
    await expect(group).toHaveClass(/collapse/);
    await groupTitle.press('Space');
    await expect(group).not.toHaveClass(/collapse/);
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
