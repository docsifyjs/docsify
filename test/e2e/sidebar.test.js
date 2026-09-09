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

  test('does not collapse root sidebar groups by default', async ({ page }) => {
    await docsifyInit({
      config: {
        collapseSidebarGroups: true,
      },
      styleURLs: ['/dist/themes/core.css'],
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8" /></head>
          <body class="sidebar-chevron-right">
            <div id="app"></div>
          </body>
        </html>
      `,
      markdown: {
        sidebar: `
          - Getting started
            - [Quick start](quickstart)
        `,
      },
      routes: {
        '/quickstart.md': '# Quick start',
      },
    });

    const group = page.locator('.sidebar-nav > ul > li.group');
    const groupTitle = group.locator(':scope > p');
    const childLink = group.locator(':scope > ul > li > a');

    await expect(group).not.toHaveClass(/collapse/);
    await expect(groupTitle).not.toHaveClass(/group-toggle/);
    await expect(groupTitle).not.toHaveAttribute('role');
    await expect(groupTitle).not.toHaveAttribute('tabindex');
    await expect(groupTitle).not.toHaveAttribute('aria-expanded');
    await expect(groupTitle).not.toHaveAttribute('data-group-id');
    await expect(groupTitle).toHaveCSS('background-image', 'none');
    await expect(groupTitle).toHaveCSS('cursor', 'auto');
    await expect(childLink).toBeVisible();

    await groupTitle.click();
    await expect(group).not.toHaveClass(/collapse/);
    await expect(childLink).toBeVisible();
  });

  test('collapses root sidebar groups when configured', async ({ page }) => {
    await docsifyInit({
      config: {
        collapsibleSidebarGroups: true,
      },
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
    const groupTitle = group.locator(':scope > p.group-toggle');
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

  for (const viewport of [
    {
      name: 'desktop',
      width: 1280,
      height: 720,
      prepareSidebar: async () => {},
    },
    {
      name: 'mobile',
      width: 390,
      height: 500,
      prepareSidebar: async (page, sidebar) => {
        await page.locator('.sidebar-toggle-button').click();
        await sidebar.evaluate(element =>
          Promise.all(
            element.getAnimations().map(animation => animation.finished),
          ),
        );
      },
    },
  ]) {
    test(`keeps sidebar content aligned when a root group removes the scrollbar on ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);

      const childLinks = Array.from(
        { length: 40 },
        (_, index) => `  - [Page ${index + 1}](page-${index + 1})`,
      ).join('\n');

      await docsifyInit({
        config: {
          collapsibleSidebarGroups: true,
        },
        styleURLs: ['/dist/themes/core.css'],
        markdown: {
          homepage: '# Home',
          sidebar: `- Root\n${childLinks}`,
        },
      });

      const sidebar = page.locator('.sidebar');
      const group = page.locator('.sidebar-nav > ul > li.group');
      const groupTitle = group.locator(':scope > .group-toggle');

      await viewport.prepareSidebar(page, sidebar);

      await expect(sidebar).toHaveCSS('overflow-y', 'scroll');

      const expandedLayout = await page.evaluate(() => {
        const sidebar = document.querySelector('.sidebar');
        const groupTitle = document.querySelector('.group-toggle');

        return {
          hasScrollbar: sidebar.scrollHeight > sidebar.clientHeight,
          titleRight: groupTitle.getBoundingClientRect().right,
          url: location.href,
        };
      });

      expect(expandedLayout.hasScrollbar).toBe(true);

      await groupTitle.click();
      await expect(group).toHaveClass(/collapse/);

      const collapsedLayout = await page.evaluate(() => {
        const sidebar = document.querySelector('.sidebar');
        const groupTitle = document.querySelector('.group-toggle');

        return {
          hasScrollbar: sidebar.scrollHeight > sidebar.clientHeight,
          titleRight: groupTitle.getBoundingClientRect().right,
          url: location.href,
        };
      });

      expect(collapsedLayout.hasScrollbar).toBe(false);
      expect(collapsedLayout.titleRight).toBe(expandedLayout.titleRight);
      expect(collapsedLayout.url).toBe(expandedLayout.url);
    });
  }

  test('initially collapses root sidebar groups when configured', async ({
    page,
  }) => {
    await docsifyInit({
      config: {
        collapseSidebarGroups: true,
        collapsibleSidebarGroups: true,
      },
      styleURLs: ['/dist/themes/core.css'],
      markdown: {
        sidebar: `
          - Getting started
            - [Quick start](quickstart)
          - Customization
            - [Configuration](configuration)
          - [Standalone](standalone)
        `,
      },
      routes: {
        '/quickstart.md': '# Quick start',
        '/configuration.md': '# Configuration',
        '/standalone.md': '# Standalone',
      },
    });

    const groups = page.locator('.sidebar-nav > ul > li.group');
    const firstGroup = groups.first();
    const firstGroupTitle = firstGroup.locator(':scope > .group-toggle');
    const firstGroupLink = firstGroup.locator(':scope > ul > li > a');
    const secondGroup = groups.nth(1);

    await expect(groups).toHaveCount(2);
    await expect(firstGroup).toHaveClass(/collapse/);
    await expect(secondGroup).toHaveClass(/collapse/);
    await expect(firstGroupTitle).toHaveAttribute('aria-expanded', 'false');
    await expect(firstGroupLink).toBeHidden();

    await firstGroupTitle.click();
    await expect(firstGroup).not.toHaveClass(/collapse/);
    await firstGroupLink.click();

    expect(page.url()).toMatch(/\/quickstart$/);
    await expect(firstGroup).not.toHaveClass(/collapse/);
    await expect(firstGroupTitle).toHaveAttribute('aria-expanded', 'true');
    await expect(secondGroup).toHaveClass(/collapse/);
  });

  test('supports chevrons on collapsible root groups', async ({ page }) => {
    await docsifyInit({
      config: {
        collapsibleSidebarGroups: true,
      },
      styleURLs: ['/dist/themes/core.css'],
      style: `
        :root:has(body[class*='sidebar-chevron']) {
          --sidebar-chevron-collapsed-color: rgb(1, 2, 3);
          --sidebar-chevron-expanded-color: rgb(4, 5, 6);
          --sidebar-group-title-font-weight: 700;
        }
      `,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8" /></head>
          <body class="sidebar-chevron-right">
            <div id="app"></div>
          </body>
        </html>
      `,
      markdown: {
        sidebar: `
          - Getting started
            - [Quick start](quickstart)
          - [Standalone](standalone)

          1. Styled group

             - [Styled child](styled-child)
        `,
      },
      routes: {
        '/quickstart.md': '# Quick start',
        '/styled-child.md': '# Styled child',
        '/standalone.md': '# Standalone',
      },
    });

    const groupTitle = page
      .locator('.group-toggle[role="button"]')
      .filter({ hasText: 'Getting started' });
    const styledGroupTitle = page
      .locator('.group-title.group-toggle')
      .filter({ hasText: 'Styled group' });
    const standaloneLink = page.locator('a[href="#/standalone"]');
    const background = await groupTitle.evaluate(
      element => getComputedStyle(element).backgroundImage,
    );
    const [groupTitleBox, standaloneLinkBox] = await Promise.all([
      groupTitle.boundingBox(),
      standaloneLink.boundingBox(),
    ]);
    const [groupTitleFontWeight, standaloneLinkFontWeight] = await Promise.all([
      groupTitle.evaluate(element => getComputedStyle(element).fontWeight),
      standaloneLink.evaluate(element => getComputedStyle(element).fontWeight),
    ]);

    expect(background).not.toBe('none');
    expect(background).toMatch(/rgb\(1,\s*2,\s*3\)/);
    expect(background).not.toMatch(/rgb\(4,\s*5,\s*6\)/);
    await expect(groupTitle).not.toHaveClass(/group-title/);
    expect(groupTitleFontWeight).toBe(standaloneLinkFontWeight);
    await expect(styledGroupTitle).not.toHaveCSS('background-image', 'none');
    await expect(styledGroupTitle).toHaveCSS('font-weight', '700');
    expect(groupTitleBox?.x + groupTitleBox?.width).toBe(
      standaloneLinkBox?.x + standaloneLinkBox?.width,
    );
    await groupTitle.click();

    await expect(groupTitle).toHaveAttribute('aria-expanded', 'false');
    const collapsedBackground = await groupTitle.evaluate(
      element => getComputedStyle(element).backgroundImage,
    );
    expect(collapsedBackground).not.toBe(background);
    expect(collapsedBackground).toMatch(/rgb\(1,\s*2,\s*3\)/);
    expect(collapsedBackground).not.toMatch(/rgb\(4,\s*5,\s*6\)/);
  });

  test('normalizes loose-list page links and shows expanded chevrons', async ({
    page,
  }) => {
    await docsifyInit({
      config: {
        subMaxLevel: 2,
      },
      styleURLs: ['/dist/themes/core.css'],
      style: `
        :root:has(body[class*='sidebar-chevron']) {
          --sidebar-chevron-collapsed-color: rgb(1, 2, 3);
          --sidebar-chevron-expanded-color: rgb(4, 5, 6);
          --sidebar-link-color-active: rgb(7, 8, 9);
        }
      `,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8" /></head>
          <body class="sidebar-chevron-right">
            <div id="app"></div>
          </body>
        </html>
      `,
      markdown: {
        homepage: '# Home',
        sidebar: `
          * [Test](test.md)
          + [Quick start](quickstart.md)
          - [Adding pages](adding-pages.md)

          - Getting started

            - [Cover page](cover.md)
        `,
      },
      routes: {
        '/test.md': '# Test',
        '/quickstart.md': '# Quick start\n\n## Installation',
        '/adding-pages.md': '# Adding pages\n\n## Sidebar',
        '/cover.md': '# Cover page',
      },
    });

    const quickStartLink = page.locator('a[href="#/quickstart"]');
    const addingPagesLink = page.locator('a[href="#/adding-pages"]');
    const quickStartItem = page.locator(
      '.sidebar-nav li:has(> a[href="#/quickstart"])',
    );
    const addingPagesItem = page.locator(
      '.sidebar-nav li:has(> a[href="#/adding-pages"])',
    );

    await expect(page.locator('.sidebar-nav li > p > a')).toHaveCount(0);

    await quickStartLink.click();
    await expect(
      quickStartItem.locator(':scope > .app-sub-sidebar'),
    ).toBeVisible();
    const quickStartBackground = await quickStartLink.evaluate(
      element => getComputedStyle(element).backgroundImage,
    );

    await addingPagesLink.click();
    await expect(
      addingPagesItem.locator(':scope > .app-sub-sidebar'),
    ).toBeVisible();
    const addingPagesBackground = await addingPagesLink.evaluate(
      element => getComputedStyle(element).backgroundImage,
    );

    expect(addingPagesBackground).toBe(quickStartBackground);
    expect(addingPagesBackground).toMatch(/rgb\(4,\s*5,\s*6\)/);
    await expect(addingPagesLink).toHaveCSS('color', 'rgb(7, 8, 9)');

    await addingPagesLink.click();
    await expect(addingPagesItem).toHaveClass(/collapse/);
    const collapsedBackground = await addingPagesLink.evaluate(
      element => getComputedStyle(element).backgroundImage,
    );

    expect(collapsedBackground).not.toBe(addingPagesBackground);
  });

  test('hides root chevrons when configured by body class', async ({
    page,
  }) => {
    await docsifyInit({
      config: {
        collapsibleSidebarGroups: true,
        subMaxLevel: 2,
      },
      styleURLs: ['/dist/themes/core.css'],
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8" /></head>
          <body class="sidebar-chevron-right sidebar-chevron-root-hidden">
            <div id="app"></div>
          </body>
        </html>
      `,
      markdown: {
        homepage: '# Home',
        sidebar: `
          + [Direct root page](direct.md)
          - [Loose root page](loose.md)

          - Getting started

            - [Nested page](nested.md)
        `,
      },
      routes: {
        '/direct.md': '# Direct root page',
        '/loose.md': '# Loose root page\n\n## Child heading',
        '/nested.md': '# Nested page',
      },
    });

    const directRootLink = page.locator('a[href="#/direct"]');
    const looseRootLink = page.locator('a[href="#/loose"]');
    const nestedLink = page.locator('a[href="#/nested"]');
    const groupTitle = page.locator('.group-toggle[role="button"]');
    const looseRootItem = page.locator(
      '.sidebar-nav li:has(> a[href="#/loose"])',
    );

    for (const rootLink of [directRootLink, looseRootLink]) {
      await expect(rootLink).toHaveCSS('background-image', 'none');
    }

    await expect(nestedLink).not.toHaveCSS('background-image', 'none');
    await expect(groupTitle).toHaveCSS('background-image', 'none');

    await groupTitle.click();
    await expect(groupTitle).toHaveAttribute('aria-expanded', 'false');
    await expect(groupTitle).toHaveCSS('background-image', 'none');

    await looseRootLink.click();
    await expect(
      looseRootItem.locator(':scope > .app-sub-sidebar'),
    ).toBeVisible();
    await expect(looseRootLink).toHaveCSS('background-image', 'none');

    await looseRootLink.click();
    await expect(looseRootItem).toHaveClass(/collapse/);
    await expect(looseRootLink).toHaveCSS('background-image', 'none');
  });

  test('keeps group border spacing when the last group collapses', async ({
    page,
  }) => {
    await docsifyInit({
      config: {
        collapsibleSidebarGroups: true,
      },
      styleURLs: ['/dist/themes/core.css'],
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8" /></head>
          <body class="sidebar-group-box">
            <div id="app"></div>
          </body>
        </html>
      `,
      markdown: {
        sidebar: `
          - Upgrading
            - [v4 to v5](upgrade)

          * [Awesome docsify](awesome)
        `,
      },
      routes: {
        '/upgrade.md': '# v4 to v5',
        '/awesome.md': '# Awesome docsify',
      },
    });

    const upgradingGroup = page.locator(
      '.sidebar-nav > ul:first-of-type > li:last-child',
    );
    const groupTitle = upgradingGroup.locator(':scope > .group-toggle');

    await groupTitle.click();

    const spacing = await page.evaluate(() => {
      const title = document.querySelector('.group-toggle');
      const group = title.closest('li');
      const awesome = document.querySelector('a[href="#/awesome"]');
      const titleBox = title.getBoundingClientRect();
      const groupBox = group.getBoundingClientRect();
      const awesomeBox = awesome.getBoundingClientRect();

      return {
        borderToAwesome: awesomeBox.top - groupBox.bottom,
        titleToBorder: groupBox.bottom - titleBox.bottom,
      };
    });

    expect(spacing.titleToBorder).toBeGreaterThan(spacing.borderToAwesome);
  });

  test('keeps a normalized loose-list page link visible when collapsed', async ({
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
      '.sidebar-nav li:has(> a[href="#/quickstart"])',
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
