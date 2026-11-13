import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

const home = '# Home\n\n[Guide](/guide/page)';
const guide = `
  # Guide

  <p id="result">Loading</p>

  <script type="module">
    import /* comment */ { value } from './dep.js';
    document.querySelector('#result').textContent = value;
  </script>
`;

async function initSite(options) {
  await docsifyInit({
    ...options,
    config: {
      ...options.config,
      alias: { '/module-host.html': '/', ...options.config.alias },
    },
  });
}

// docsifyInit accepts text fixtures; HTTP statuses and headers need native routes.
async function mockFiles(page, files) {
  for (const [path, response] of Object.entries(files)) {
    await page.route(
      new URL(path, `${process.env.TEST_HOST}/content/`).href,
      route =>
        route.fulfill({
          contentType: path.endsWith('.js')
            ? 'application/javascript'
            : 'text/markdown',
          ...(typeof response === 'string' ? { body: response } : response),
        }),
    );
  }
}

async function startRedirectServer() {
  const docsify = await readFile(
    new URL('../../dist/docsify.js', import.meta.url),
  );
  const server = createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    if (request.url === '/dist/docsify.js') {
      response.setHeader('Content-Type', 'application/javascript');
      response.end(docsify);
    } else if (request.url === '/redirect.md') {
      response.writeHead(302, { Location: '/actual/page.md' }).end();
    } else if (request.url === '/actual/page.md') {
      response.setHeader('Content-Type', 'text/markdown');
      response.end(guide);
    } else if (request.url === '/actual/dep.js') {
      response.setHeader('Content-Type', 'application/javascript');
      response.end('export const value = "Redirected";');
    } else {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return server;
}

for (const routerMode of ['hash', 'history']) {
  const testURL = `${process.env.TEST_HOST}/module-host.html`;
  test.describe(`Markdown module paths (${routerMode})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(mode => {
        if (mode === 'hash') {
          history.replaceState(null, '', location.pathname + '#/');
        }
      }, routerMode);
    });
    for (const width of [1280, 375]) {
      test(`resolves imports on navigation at ${width}px`, async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.setViewportSize({ width, height: 800 });
        const markdown = `
          # Guide

          [Other](/guide/other)

          <p id="result">Loading</p>

          <script type="module">
            import /* comment */ { value } from './dep.js';
            import './side-effect.js';
            import { root } from '/root.js';
            export { shared } from '../shared.js';
            export * from './more.js';
            const { dynamic } = await import(/* comment */ '../dynamic.js');
            const text = "import './untouched.js'";
            window.moduleVisits = (window.moduleVisits || 0) + 1;
            document.querySelector('#result').textContent =
              [value, window.sideEffect, root, dynamic, text, window.moduleVisits].join('|');
          </script>
        `;

        await initSite({
          testURL,
          config: { executeScript: true, routerMode, basePath: '/content/' },
          markdown: { homepage: home },
          routes: {
            'guide/page.md': markdown,
            'guide/other.md': markdown.replace('# Guide', '# Other'),
            'guide/dep.js': "export { value } from './nested.js';",
            'guide/nested.js': 'export const value = "nested";',
            'guide/side-effect.js': 'window.sideEffect = "side";',
            'guide/more.js': 'export const more = true;',
            'shared.js': 'export const shared = true;',
            'dynamic.js': 'export const dynamic = "dynamic";',
            '/root.js': 'export const root = "root";',
          },
          styleURLs: ['/dist/themes/core.css'],
        });

        const result = page.locator('#result');
        const expected = "nested|side|root|dynamic|import './untouched.js'|";
        await page.getByRole('link', { name: 'Guide', exact: true }).click();
        await expect(result).toHaveText(`${expected}1`);
        await expect(result).toBeInViewport();
        await page.getByRole('link', { name: 'Other', exact: true }).click();
        await expect(result).toHaveText(`${expected}2`);
        await page.goBack();
        await expect(result).toHaveText(`${expected}3`);
        expect(errors).toEqual([]);
      });
    }

    for (const { name, config, files } of [
      {
        name: 'alias and custom extension',
        config: { ext: '.txt', alias: { '/guide/page': '/actual/page' } },
        files: {
          'actual/page.txt': guide,
          'actual/dep.js': 'export const value = "OK";',
        },
      },
      {
        name: 'remote alias',
        config: {
          alias: { '/guide/page': 'https://modules.example/actual/page.md' },
        },
        files: {
          'https://modules.example/actual/page.md': {
            body: guide,
            headers: { 'Access-Control-Allow-Origin': '*' },
          },
          'https://modules.example/actual/dep.js': {
            body: 'export const value = "OK";',
            headers: { 'Access-Control-Allow-Origin': '*' },
          },
        },
      },
      {
        name: 'virtual route',
        config: { routes: { '/guide/page': guide } },
        files: { 'guide/dep.js': 'export const value = "OK";' },
      },
      {
        name: 'language fallback',
        config: {
          fallbackLanguages: ['guide'],
          fallbackDefaultLanguage: '/en',
        },
        files: {
          'guide/page.md': { status: 404, body: 'Missing' },
          'en/page.md': guide,
          'en/dep.js': 'export const value = "OK";',
        },
      },
      {
        name: 'custom 404 page',
        config: { notFoundPage: 'errors/not-found.md' },
        files: {
          'guide/page.md': { status: 404, body: 'Missing' },
          'errors/not-found.md': guide,
          'errors/dep.js': 'export const value = "OK";',
        },
      },
    ]) {
      test(`uses the content URL for ${name}`, async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await mockFiles(page, files);
        await initSite({
          testURL,
          config: {
            executeScript: true,
            routerMode,
            basePath: '/content/',
            ...config,
          },
          markdown: { homepage: home },
        });

        await page.getByRole('link', { name: 'Guide', exact: true }).click();
        await expect(page.locator('#result')).toHaveText('OK');
        expect(errors).toEqual([]);
      });
    }

    test('uses a nested homepage URL', async ({ page }) => {
      await initSite({
        testURL,
        config: {
          executeScript: true,
          routerMode,
          basePath: '/content/',
          homepage: 'start/home.md',
        },
        routes: {
          'start/home.md': guide,
          'start/dep.js': 'export const value = "Homepage";',
        },
      });
      await expect(page.locator('#result')).toHaveText('Homepage');
    });

    test('uses the response URL after a redirect, including cached navigation', async ({
      page,
    }) => {
      // A real redirect verifies XMLHttpRequest.responseURL end to end,
      // including WebKit, which cannot fulfill a mocked redirect response.
      const server = await startRedirectServer();
      try {
        const origin = `http://127.0.0.1:${server.address().port}`;
        await initSite({
          testURL: `${origin}/module-host.html`,
          config: {
            executeScript: true,
            routerMode,
            basePath: `${origin}/content/`,
            alias: { '/guide/page': `${origin}/redirect.md` },
          },
          markdown: { homepage: home },
        });
        await page.getByRole('link', { name: 'Guide', exact: true }).click();
        await expect(page.locator('#result')).toHaveText('Redirected');
        await page.goBack();
        await page.getByRole('link', { name: 'Guide', exact: true }).click();
        await expect(page.locator('#result')).toHaveText('Redirected');
      } finally {
        server.closeAllConnections();
        await new Promise(resolve => server.close(resolve));
      }
    });

    test('keeps navigation working after a module parse error', async ({
      page,
    }) => {
      const error = page.waitForEvent('pageerror');
      await initSite({
        testURL,
        config: { executeScript: true, routerMode },
        markdown: {
          homepage: `${home}\n\n<script type="module">import {</script>`,
        },
        routes: { 'guide/page.md': '# Next page' },
      });
      expect((await error).message).toBeTruthy();
      await page.getByRole('link', { name: 'Guide', exact: true }).click();
      await expect(page.locator('h1')).toHaveText('Next page');
    });
  });
}

test('resolves hash routes hosted at an explicit HTML file', async ({
  page,
}) => {
  await page.addInitScript(() => {
    history.replaceState(null, '', location.pathname + '#/');
  });
  await docsifyInit({
    testURL: `${process.env.TEST_HOST}/app/index.html`,
    config: { executeScript: true, basePath: '' },
    routes: {
      '/app/README.md': home,
      '/app/guide/page.md': guide,
      '/app/guide/dep.js': 'export const value = "Index file";',
    },
  });
  await page.getByRole('link', { name: 'Guide', exact: true }).click();
  await expect(page.locator('#result')).toHaveText('Index file');
});
