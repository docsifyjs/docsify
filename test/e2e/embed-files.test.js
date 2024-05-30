import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('Embed files', () => {
  const routes = {
    'fragment.md': '## Fragment',
  };

  test('embed into homepage', async ({ page }) => {
    await docsifyInit({
      routes,
      markdown: {
        homepage: "# Hello World\n\n[fragment](fragment.md ':include')",
      },
      // _logHTML: {},
    });

    await expect(page.locator('#main')).toContainText('Fragment');
  });

  test('embed into cover', async ({ page }) => {
    await docsifyInit({
      routes,
      markdown: {
        homepage: '# Hello World',
        coverpage: "# Cover\n\n[fragment](fragment.md ':include')",
      },
      // _logHTML: {},
    });

    await expect(page.locator('.cover-main')).toContainText('Fragment');
  });
});
