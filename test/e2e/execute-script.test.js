import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('executeScript', () => {
  for (const width of [1280, 375]) {
    test(`executes inline modules on navigation at ${width}px`, async ({
      page,
    }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width, height: 800 });

      const markdown = `
        # Module example

        [Next page](next.md)

        <p id="result">Loading</p>

        <script type="module" data-example="module">
          import { value } from './module-value.js';
          export const moduleValue = await Promise.resolve(value);
          window.moduleRuns = (window.moduleRuns || 0) + 1;
          document.querySelector('#result').textContent = moduleValue;
        </script>

        <script>
          throw new Error('The second script must not execute');
        </script>
      `;

      await docsifyInit({
        config: { executeScript: true },
        markdown: { homepage: markdown },
        routes: {
          'next.md': markdown.replace('# Module example', '# Next page'),
          'module-value.js': `
            window.dependencyRuns = (window.dependencyRuns || 0) + 1;
            export const value = 'Module loaded';
          `,
        },
        styleURLs: ['/dist/themes/core.css'],
      });

      await expect(page.locator('#result')).toHaveText('Module loaded');
      await expect(page.locator('#result')).toBeInViewport();
      await expect(page.locator('script[data-example]')).toHaveAttribute(
        'type',
        'module',
      );
      await page.getByRole('link', { name: 'Next page', exact: true }).click();
      await expect(page.locator('h1')).toHaveText('Next page');
      await expect(page.locator('#result')).toHaveText('Module loaded');
      await page.goBack();
      await expect(page.locator('h1')).toHaveText('Module example');
      await expect(page.locator('#result')).toHaveText('Module loaded');
      expect(
        await page.evaluate(() => ({
          moduleRuns: window.moduleRuns,
          dependencyRuns: window.dependencyRuns,
          moduleValue: window.moduleValue,
        })),
      ).toEqual({ moduleRuns: 3, dependencyRuns: 1, moduleValue: undefined });
      expect(errors).toEqual([]);
    });
  }

  test('keeps classic scripts in function scope and skips templates', async ({
    page,
  }) => {
    await docsifyInit({
      config: { executeScript: true },
      markdown: {
        homepage: `
          <p id="result">Waiting</p>

          <script type="text/x-template">{{ template }}</script>

          <script>
            var localValue = 'Classic script';
            document.querySelector('#result').textContent = localValue;
            return;
          </script>

          <script type="module">
            document.querySelector('#result').textContent = 'Second script';
          </script>
        `,
      },
    });

    await expect(page.locator('#result')).toHaveText('Classic script');
    expect(await page.evaluate(() => window.localValue)).toBeUndefined();
  });

  for (const type of ['', 'module']) {
    for (const executeScript of [false, null]) {
      test(`does not execute type="${type}" with executeScript=${executeScript}`, async ({
        page,
      }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await docsifyInit({
          config: { executeScript },
          markdown: {
            homepage: `
              # Disabled script

              <script type="${type}">
                throw new Error('Script must not execute');
              </script>
            `,
          },
        });

        await expect(page.locator('h1')).toHaveText('Disabled script');
        expect(errors).toEqual([]);
      });
    }
  }

  for (const script of [
    '',
    '<script> </script>',
    '<script type="module"> </script>',
    '<script type="text/x-template">{{ template }}</script>',
  ]) {
    test(`handles an empty page script: ${JSON.stringify(script)}`, async ({
      page,
    }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await docsifyInit({
        config: { executeScript: true },
        markdown: { homepage: `# Empty script\n\n${script}` },
      });

      await expect(page.locator('h1')).toHaveText('Empty script');
      expect(errors).toEqual([]);
    });
  }

  for (const [scriptURLs, expectedText] of [
    [[], 'Waiting'],
    [['/dist/plugins/external-script.js'], 'External module'],
  ]) {
    test(`leaves external modules to the plugin (${expectedText})`, async ({
      page,
    }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await docsifyInit({
        config: { executeScript: true },
        scriptURLs,
        markdown: {
          homepage: `
            <p id="result">Waiting</p>

            <script type="module" src="./external-module.js">
              throw new Error('Inline content must not execute with src');
            </script>
          `,
        },
        routes: {
          'external-module.js': `
            document.querySelector('#result').textContent = 'External module';
          `,
        },
      });

      await expect(page.locator('#result')).toHaveText(expectedText);
      expect(errors).toEqual([]);
    });
  }

  test('renders the document while a module is loading', async ({ page }) => {
    let releaseModule;
    const moduleReady = new Promise(resolve => {
      releaseModule = resolve;
    });
    await page.route('**/slow-module.js', async route => {
      await moduleReady;
      await route.fulfill({
        contentType: 'application/javascript',
        body: 'export const value = "Loaded";',
      });
    });
    const request = page.waitForRequest('**/slow-module.js');

    try {
      await docsifyInit({
        config: { executeScript: true },
        markdown: {
          homepage: `
            # Loading example

            <p id="result">Loading</p>

            <script type="module">
              import { value } from '${process.env.TEST_HOST}/slow-module.js';
              document.querySelector('#result').textContent = value;
            </script>
          `,
        },
      });

      await request;
      await expect(page.locator('h1')).toHaveText('Loading example');
      await expect(page.locator('#result')).toHaveText('Loading');
    } finally {
      releaseModule();
    }

    await expect(page.locator('#result')).toHaveText('Loaded');
  });

  test('keeps navigation working after a module fails to load', async ({
    page,
  }) => {
    await page.route('**/missing-module.js', route => route.abort());
    const failedRequest = page.waitForEvent('requestfailed', request =>
      request.url().endsWith('/missing-module.js'),
    );

    await docsifyInit({
      config: { executeScript: true },
      markdown: {
        homepage: `
          # Failed module

          [Next page](next.md)

          <script type="module">
            import './missing-module.js';
          </script>
        `,
      },
      routes: { 'next.md': '# Next page' },
    });

    expect((await failedRequest).failure()).toBeTruthy();
    await expect(page.locator('h1')).toHaveText('Failed module');
    await page.getByRole('link', { name: 'Next page', exact: true }).click();
    await expect(page.locator('h1')).toHaveText('Next page');
  });
});
