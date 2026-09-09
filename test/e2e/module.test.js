import { test, expect } from './fixtures/docsify-init-fixture.js';

for (const moduleName of ['docsify.module.js', 'docsify.module.min.js']) {
  test(`initializes Docsify from ${moduleName}`, async ({ page }) => {
    await page.setContent('<div id="app"></div>');
    await page.addScriptTag({
      type: 'module',
      content: `
        import { Docsify } from '/dist/${moduleName}';

        new Docsify({
          routes: {
            '/': '# Docsify ES module',
          },
        });
      `,
    });

    await expect(page.locator('#main')).toContainText('Docsify ES module');
  });
}
