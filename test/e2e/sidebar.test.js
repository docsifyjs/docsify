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

  test('initially collapses root sidebar groups when configured', async ({
    page,
  }) => {
    await docsifyInit({
      config: {
        collapseSidebarGroups: true,
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
    const firstGroupTitle = firstGroup.locator(':scope > .group-title');
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
      styleURLs: ['/dist/themes/core.css'],
      style: `
        :root:has(body[class*='sidebar-chevron']) {
          --sidebar-chevron-collapsed-color: rgb(1, 2, 3);
          --sidebar-chevron-expanded-color: rgb(4, 5, 6);
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
        `,
      },
      routes: {
        '/quickstart.md': '# Quick start',
        '/standalone.md': '# Standalone',
      },
    });

    const groupTitle = page.locator('.group-title[role="button"]');
    const standaloneLink = page.locator('a[href="#/standalone"]');
    const background = await groupTitle.evaluate(
      element => getComputedStyle(element).backgroundImage,
    );
    const [groupTitleBox, standaloneLinkBox] = await Promise.all([
      groupTitle.boundingBox(),
      standaloneLink.boundingBox(),
    ]);

    expect(background).not.toBe('none');
    expect(background).toMatch(/rgb\(1,\s*2,\s*3\)/);
    expect(background).not.toMatch(/rgb\(4,\s*5,\s*6\)/);
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

  test('keeps group border spacing when the last group collapses', async ({
    page,
  }) => {
    await docsifyInit({
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
    const groupTitle = upgradingGroup.locator(':scope > .group-title');

    await groupTitle.click();

    const spacing = await page.evaluate(() => {
      const title = document.querySelector('.group-title');
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
