import docsifyInit from '../helpers/docsify-init.js';
import { waitForFunction } from '../helpers/wait-for.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('Plugins', () => {
  test('Hook order', async ({ page }) => {
    const consoleMsgs = [];
    const expectedMsgs = [
      'init',
      'mounted',
      'beforeEach-async',
      'beforeEach',
      'afterEach-async',
      'afterEach',
      'doneEach',
      'ready',
    ];

    page.on('console', msg => {
      const text = msg.text();
      if (text.startsWith('DEPRECATION:')) {
        return;
      } // ignore expected deprecation warnings
      consoleMsgs.push(text);
    });

    await docsifyInit({
      config: {
        plugins: [
          function (hook, vm) {
            hook.init(() => {
              console.log('init');
            });

            hook.mounted(() => {
              console.log('mounted');
            });

            hook.beforeEach((markdown, next) => {
              setTimeout(() => {
                console.log('beforeEach-async');
                next(markdown);
              }, 100);
            });

            hook.beforeEach(markdown => {
              console.log('beforeEach');
              return markdown;
            });

            hook.afterEach((html, next) => {
              setTimeout(() => {
                console.log('afterEach-async');
                next(html);
              }, 100);
            });

            hook.afterEach(html => {
              console.log('afterEach');
              return html;
            });

            hook.doneEach(() => {
              console.log('doneEach');
            });

            hook.ready(() => {
              console.log('ready');
            });
          },
        ],
      },
      markdown: {
        homepage: '# Hello World',
      },
      // _logHTML: true,
    });

    expect(consoleMsgs).toEqual(expectedMsgs);
  });

  test('ready runs once when the initial sidebar is missing', async ({
    page,
  }) => {
    await docsifyInit({
      config: {
        loadSidebar: true,
        name: 'Docsify',
        nameLink: '#/',
        plugins: [
          function (hook) {
            window.hookCalls = [];

            hook.doneEach(() => {
              window.hookCalls.push('doneEach');
            });

            hook.ready(() => {
              window.hookCalls.push('ready');
              document
                .querySelector('.sidebar-nav')
                .addEventListener('click', event => {
                  const groupTitle = event.target.closest(
                    '.sidebar-nav > ul > li > p',
                  );

                  groupTitle?.parentElement.classList.toggle('plugin-collapse');
                });
            });
          },
        ],
      },
      markdown: {
        homepage: `
          # Home

          [Section](/section/)
        `,
      },
      routes: {
        '/section/README.md': '# Section',
        '/section/_sidebar.md': `
          - Group
            - [Page](page)
        `,
      },
    });

    await expect
      .poll(() => page.evaluate(() => window.hookCalls))
      .toEqual(['doneEach', 'ready']);
    await expect(page.locator('.sidebar-nav')).toBeEmpty();

    await page.locator('a[href="#/section/"]').click();

    const group = page.locator('.sidebar-nav > ul > li').first();
    await expect(group.locator(':scope > p')).toHaveText('Group');

    await group.locator(':scope > p').click();
    await expect(group).toHaveClass(/plugin-collapse/);
    await expect
      .poll(() => page.evaluate(() => window.hookCalls))
      .toEqual(['doneEach', 'ready', 'doneEach']);

    await page.locator('.app-name-link').click();

    await expect(page.locator('#main h1')).toHaveText('Home');
    await expect(page.locator('.sidebar-nav')).toBeEmpty();
    await expect
      .poll(() => page.evaluate(() => window.hookCalls))
      .toEqual(['doneEach', 'ready', 'doneEach', 'doneEach']);

    await page.locator('a[href="#/section/"]').click();

    await expect(group.locator(':scope > p')).toHaveText('Group');
    await group.locator(':scope > p').click();
    await expect(group).toHaveClass(/plugin-collapse/);
    await expect
      .poll(() => page.evaluate(() => window.hookCalls))
      .toEqual(['doneEach', 'ready', 'doneEach', 'doneEach', 'doneEach']);
  });

  test.describe('beforeEach()', () => {
    test('return value', async ({ page }) => {
      await docsifyInit({
        config: {
          plugins: [
            function (hook, vm) {
              hook.beforeEach(markdown => {
                return 'beforeEach';
              });
            },
          ],
        },
        // _logHTML: true,
      });

      await expect(page.locator('#main')).toContainText('beforeEach');
    });

    test('async return value', async ({ page }) => {
      await docsifyInit({
        config: {
          plugins: [
            function (hook, vm) {
              hook.beforeEach((markdown, next) => {
                setTimeout(() => {
                  next('beforeEach');
                }, 100);
              });
            },
          ],
        },
        markdown: {
          homepage: '# Hello World',
        },
        // _logHTML: true,
      });

      await expect(page.locator('#main')).toContainText('beforeEach');
    });
  });

  test.describe('afterEach()', () => {
    test('return value', async ({ page }) => {
      await docsifyInit({
        config: {
          plugins: [
            function (hook, vm) {
              hook.afterEach(html => {
                return '<p>afterEach</p>';
              });
            },
          ],
        },
        markdown: {
          homepage: '# Hello World',
        },
        // _logHTML: true,
      });

      await expect(page.locator('#main')).toContainText('afterEach');
    });

    test('async return value', async ({ page }) => {
      await docsifyInit({
        config: {
          plugins: [
            function (hook, vm) {
              hook.afterEach((html, next) => {
                setTimeout(() => {
                  next('<p>afterEach</p>');
                }, 100);
              });
            },
          ],
        },
        markdown: {
          homepage: '# Hello World',
        },
        // _logHTML: true,
      });

      await expect(page.locator('#main')).toContainText('afterEach');
    });
  });

  test.describe('route data accessible to plugins', () => {
    let routeData = null;

    test.beforeEach(async ({ page }) => {
      // Store route data set via plugin hook (below)
      page.on('console', async msg => {
        for (const arg of msg.args()) {
          const val = await arg.jsonValue();
          if (typeof val === 'string' && val.startsWith('DEPRECATION:')) {
            continue;
          }
          try {
            const obj = typeof val === 'string' ? JSON.parse(val) : val;
            obj && obj.response && (routeData = obj);
          } catch {
            // ignore non-JSON console messages
          }
        }
      });
    });

    test.afterEach(async ({ page }) => {
      routeData = null;
    });

    test('success (200)', async ({ page }) => {
      await docsifyInit({
        config: {
          plugins: [
            function (hook, vm) {
              hook.doneEach(html => {
                console.log(JSON.stringify(vm.route));
              });
            },
          ],
        },
      });

      expect(routeData).toHaveProperty('response');
      expect(routeData.response).toHaveProperty('ok', true);
      expect(routeData.response).toHaveProperty('status', 200);
      expect(routeData.response).toHaveProperty('statusText', 'OK');
    });

    test('fail (404)', async ({ page }) => {
      const link404Elm = page.locator('a[href*="404"]');

      await docsifyInit({
        markdown: {
          sidebar: `
            - [404](404.md)
          `,
        },
        config: {
          plugins: [
            function (hook, vm) {
              hook.doneEach(html => {
                console.log(JSON.stringify(vm.route));
              });
            },
          ],
        },
      });

      await link404Elm.click();
      await waitForFunction(() => routeData?.response?.status === 404);

      expect(routeData).toHaveProperty('response');
      expect(routeData.response).toHaveProperty('ok', false);
      expect(routeData.response).toHaveProperty('status', 404);
      expect(routeData.response).toHaveProperty('statusText', 'Not Found');
    });
  });
});
