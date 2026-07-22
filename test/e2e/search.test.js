import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('Search Plugin Tests', () => {
  test('search readme', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          # Hello World

          This is the homepage.
        `,
        sidebar: `
          - [Test Page](test)
        `,
      },
      routes: {
        '/test.md': `
          # Test Page

          This is a custom route.
        `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .title');

    await docsifyInit(docsifyInitConfig);

    await searchFieldElm.fill('hello');
    await expect(resultsHeadingElm).toHaveText('Hello World');
    await page.click('.clear-button');
    await searchFieldElm.fill('test');
    await expect(resultsHeadingElm).toHaveText('Test Page');
  });

  test.describe('resultSource option', () => {
    const markdown = {
      homepage: `
        # Hello World

        This is the homepage.
      `,
      sidebar: `
        - Guides 📚
          - [Test Page 🚀](test)
      `,
    };
    const routes = {
      '/test.md': `
        # Test Page 🧪

        This is a custom route.

        ## Deep Section

        Content about volcanoes.
      `,
    };

    test('shows nothing by default', async ({ page }) => {
      const docsifyInitConfig = {
        markdown,
        routes,
        scriptURLs: ['/dist/plugins/search.js'],
      };

      const searchFieldElm = page.locator('input[type=search]');
      const resultsHeadingElm = page.locator('.results-panel .title');
      const resultsPageElm = page.locator('.results-panel .search-breadcrumb');

      await docsifyInit(docsifyInitConfig);

      await searchFieldElm.fill('volcanoes');
      await expect(resultsHeadingElm).toHaveText('Deep Section');
      await expect(resultsPageElm).toHaveCount(0);
    });

    test('page mode shows page title for section matches', async ({ page }) => {
      const docsifyInitConfig = {
        config: {
          search: {
            resultSource: 'page',
          },
        },
        markdown,
        routes,
        scriptURLs: ['/dist/plugins/search.js'],
      };

      const searchFieldElm = page.locator('input[type=search]');
      const resultsHeadingElm = page.locator('.results-panel .title');
      const resultsPageElm = page.locator('.results-panel .search-breadcrumb');

      await docsifyInit(docsifyInitConfig);

      // A match inside a section shows which page it comes from,
      // with emoji stripped from the page title.
      await searchFieldElm.fill('volcanoes');
      await expect(resultsHeadingElm).toHaveText('Deep Section');
      await expect(resultsPageElm).toHaveText('Test Page');

      // A match on the page title itself does not repeat the page title.
      await page.click('.clear-button');
      await searchFieldElm.fill('custom route');
      await expect(resultsHeadingElm).toHaveText('Test Page 🧪');
      await expect(resultsPageElm).toHaveCount(0);
    });

    test('breadcrumb mode shows sidebar path to the page', async ({ page }) => {
      const docsifyInitConfig = {
        config: {
          search: {
            resultSource: 'breadcrumb',
          },
        },
        markdown,
        routes,
        scriptURLs: ['/dist/plugins/search.js'],
      };

      const searchFieldElm = page.locator('input[type=search]');
      const resultsHeadingElm = page.locator('.results-panel .title');
      const resultsPageElm = page.locator('.results-panel .search-breadcrumb');

      await docsifyInit(docsifyInitConfig);

      // Emoji from sidebar labels are stripped from the breadcrumb.
      await searchFieldElm.fill('volcanoes');
      await expect(resultsHeadingElm).toHaveText('Deep Section');
      await expect(resultsPageElm).toHaveText('Guides › Test Page');

      // A page absent from the sidebar falls back to its page title.
      await page.click('.clear-button');
      await searchFieldElm.fill('homepage');
      await expect(resultsHeadingElm).toHaveText('Hello World');
      await expect(resultsPageElm).toHaveText('Hello World');
    });
  });

  test('search ignore title', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          # Hello World

          This is the homepage.
        `,
        sidebar: `
          - [Home page](/)
          - [GitHub Pages](github)
        `,
      },
      routes: {
        '/github.md': `
            # GitHub Pages

            This is the GitHub Pages.

            ## GitHub Pages ignore1 <!-- {docsify-ignore} -->

            There're three places to populate your docs for your GitHub repository1.

            ## GitHub Pages ignore2 {docsify-ignore}

            There're three places to populate your docs for your GitHub repository2.
          `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .title');

    await docsifyInit(docsifyInitConfig);

    await searchFieldElm.fill('repository1');
    await expect(resultsHeadingElm).toHaveText('GitHub Pages ignore1');
    await page.click('.clear-button');
    await searchFieldElm.fill('repository2');
    await expect(resultsHeadingElm).toHaveText('GitHub Pages ignore2');
  });

  test('search only one homepage', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        sidebar: `
          - [README](README)
          - [Test Page](test)
        `,
      },
      routes: {
        '/README.md': `
          # Hello World

          This is the homepage.
        `,
        '/test.md': `
          # Test Page

          This is a custom route.
        `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .title');
    const resultElm = page.locator('.matching-post');

    await docsifyInit(docsifyInitConfig);

    await searchFieldElm.fill('hello');
    await expect(resultElm).toHaveCount(1);
    await expect(resultsHeadingElm).toHaveText('Hello World');
    await page.click('.clear-button');
    await searchFieldElm.fill('test');
    await expect(resultsHeadingElm).toHaveText('Test Page');
  });

  test('search ignore diacritical marks', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          # Qué es

          docsify genera su sitio web de documentación sobre la marcha. A diferencia de GitBook, no genera archivos estáticos html. En cambio, carga y analiza de forma inteligente sus archivos de Markdown y los muestra como sitio web. Todo lo que necesita hacer es crear un index.html para comenzar y desplegarlo en GitHub Pages.
        `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .title');

    await docsifyInit(docsifyInitConfig);

    await searchFieldElm.fill('documentacion');
    await expect(resultsHeadingElm).toHaveText('Que es');
    await page.click('.clear-button');
    await searchFieldElm.fill('estáticos');
    await expect(resultsHeadingElm).toHaveText('Que es');
  });

  test('search when there is no title', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          This is some description. We assume autoHeader added the # Title. A long paragraph.
        `,
        sidebar: `
          - [Changelog](changelog)
        `,
      },
      routes: {
        '/changelog.md': `
          feat: Support search when there is no title

          ## Changelog Title

          hello, this is a changelog
        `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .title');

    await docsifyInit(docsifyInitConfig);

    await searchFieldElm.fill('paragraph');
    await expect(resultsHeadingElm).toHaveText('Home Page');
    await page.click('.clear-button');
    await searchFieldElm.fill('Support');
    await expect(resultsHeadingElm).toHaveText('changelog');
    await page.click('.clear-button');
    await searchFieldElm.fill('hello');
    await expect(resultsHeadingElm).toHaveText('Changelog Title');
  });

  test('search when there is no body', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          # EmptyContent
          ---
          ---
        `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .title');

    await docsifyInit(docsifyInitConfig);

    await searchFieldElm.fill('empty');
    await expect(resultsHeadingElm).toHaveText('EmptyContent');
  });

  test('keeps saving index when one auto path request fails with cached records', async ({
    page,
  }) => {
    const indexKey = 'docsify.search.index';
    const expireKey = 'docsify.search.expires';

    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.evaluate(
      ({ indexKey, expireKey }) => {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('docsify', 1);

          request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains('search')) {
              db.createObjectStore('search', { keyPath: 'slug' });
            }

            if (!db.objectStoreNames.contains('expires')) {
              db.createObjectStore('expires', { keyPath: 'key' });
            }
          };

          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction(['search', 'expires'], 'readwrite');

            tx.objectStore('search').put({
              slug: '/cached',
              title: 'Cached Page',
              body: 'cached record',
              path: '/cached',
              indexKey,
            });
            tx.objectStore('expires').put({
              key: expireKey,
              value: Date.now() + 60 * 1000,
            });

            tx.oncomplete = () => {
              db.close();
              resolve();
            };
            tx.onerror = () => reject(tx.error);
          };
        });
      },
      { indexKey, expireKey },
    );

    await docsifyInit({
      markdown: {
        homepage: '# Home',
        sidebar: `
          - [Cached](cached)
          - [Success](success)
          - [Fail](fail)
        `,
      },
      routes: {
        '/success.md': '# Success\n\nregressionKeyword',
        '/fail.md': {
          status: 404,
          body: 'Not Found',
          contentType: 'text/markdown',
        },
      },
      scriptURLs: ['/dist/plugins/search.js'],
    });

    await expect
      .poll(async () => {
        return await page.evaluate(indexKey => {
          return new Promise((resolve, reject) => {
            const request = indexedDB.open('docsify');

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
              const db = request.result;
              const tx = db.transaction(['search', 'expires'], 'readonly');
              const searchStore = tx.objectStore('search');
              const expiresStore = tx.objectStore('expires');
              const searchReq = searchStore.getAll();
              const expiresReq = expiresStore.get('docsify.search.expires');

              tx.onerror = () => reject(tx.error);
              tx.oncomplete = () => {
                const records = Array.isArray(searchReq.result)
                  ? searchReq.result
                  : [];
                const hasSuccessRecord = records.some(
                  record =>
                    record &&
                    record.indexKey === indexKey &&
                    record.path === '/success',
                );
                const hasInvalidRecord = records.some(
                  record => !record || typeof record.slug !== 'string',
                );
                const hasExpireRecord = Boolean(expiresReq.result?.value);

                db.close();
                resolve(
                  hasSuccessRecord && hasExpireRecord && !hasInvalidRecord,
                );
              };
            };
          });
        }, indexKey);
      })
      .toBe(true);

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .title');

    await searchFieldElm.fill('regressionKeyword');
    await expect(resultsHeadingElm).toHaveText('Success');
    expect(pageErrors).toEqual([]);
  });

  test('handles default focusSearch binding', async ({ page }) => {
    const docsifyInitConfig = {
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type="search"]');

    await docsifyInit(docsifyInitConfig);

    await expect(searchFieldElm).not.toBeFocused();
    await page.keyboard.press('/');
    await expect(searchFieldElm).toBeFocused();
  });

  test('handles custom focusSearch binding', async ({ page }) => {
    const docsifyInitConfig = {
      config: {
        search: {
          keyBindings: ['z'],
        },
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type="search"]');

    await docsifyInit(docsifyInitConfig);

    await expect(searchFieldElm).not.toBeFocused();
    await page.keyboard.press('/');
    await expect(searchFieldElm).not.toBeFocused();
    await page.keyboard.press('z');
    await expect(searchFieldElm).toBeFocused();
  });
  test('search result should remove markdown code block', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
# Hello World

searchHere
\`\`\`js
console.log('Hello World');
\`\`\`
        `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .content');

    await docsifyInit(docsifyInitConfig);
    await searchFieldElm.fill('searchHere');
    // there is a newline after searchHere and the markdown part ```js ``` it should be removed
    expect(await resultsHeadingElm.textContent()).toContain(
      "...searchHere\nconsole.log('Hello World');...",
    );
  });

  test('search result should remove file markdown and keep href attribution for files', async ({
    page,
  }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
# Hello World
![filename](_media/example.js ':include :type=code :fragment=demo')
        `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .content');

    await docsifyInit(docsifyInitConfig);
    await searchFieldElm.fill('filename');
    expect(await resultsHeadingElm.textContent()).toContain(
      'filename _media/example.js :include :type=code :fragment=demo',
    );
  });

  test('search should index embedded include content', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
# Include Search

![snippet](snippet.js ':include :type=code')
        `,
      },
      routes: {
        '/snippet.js': `
const embeddedSearchKeyword = 'ok';
        `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .title');

    await docsifyInit(docsifyInitConfig);
    await searchFieldElm.fill('embeddedSearchKeyword');
    await expect(resultsHeadingElm).toHaveText('Include Search');
  });

  test('search should index embedded include content from relative path', async ({
    page,
  }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: '# Home',
        sidebar: '- [Guide Intro](guide/intro)',
      },
      routes: {
        '/guide/intro.md': `
# Relative Include Search

![snippet](./snippets/demo.js ':include :type=code')
        `,
        '/guide/snippets/demo.js': `
const embeddedRelativeKeyword = 'ok';
        `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .title');

    await docsifyInit(docsifyInitConfig);
    await searchFieldElm.fill('embeddedRelativeKeyword');
    await expect(resultsHeadingElm).toHaveText('Relative Include Search');
  });

  test('search result should remove checkbox markdown and keep related values', async ({
    page,
  }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
# Hello World

- [ ] Task 1
- [x] SearchHere
- [ ] Task 3
          `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .content');

    await docsifyInit(docsifyInitConfig);
    await searchFieldElm.fill('SearchHere');
    // remove the checkbox markdown and keep the related values
    expect(await resultsHeadingElm.textContent()).toContain(
      '...Task 1 SearchHere Task 3...',
    );
  });

  test('search result should remove docsify self helper markdown and keep related values', async ({
    page,
  }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
# Hello World

!> SearchHere to check it!

          `,
      },
      scriptURLs: ['/dist/plugins/search.js'],
    };

    const searchFieldElm = page.locator('input[type=search]');
    const resultsHeadingElm = page.locator('.results-panel .content');

    await docsifyInit(docsifyInitConfig);
    await searchFieldElm.fill('SearchHere');
    // remove the helper markdown and keep the related values
    expect(await resultsHeadingElm.textContent()).toContain(
      '...SearchHere to check it!...',
    );
  });
});
