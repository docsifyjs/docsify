import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('OneTag Plugin Tests', () => {
  const widgetURL = 'https://onetagai.com/widget.js';
  const widgetSelector = `script[src="${widgetURL}"]`;

  // The widget script is replaced with a stub so that tests do not depend on the network
  async function stubWidget(page) {
    await page.route(widgetURL, route =>
      route.fulfill({
        contentType: 'text/javascript',
        body: 'window.onetagDataset = { ...document.currentScript.dataset };',
      }),
    );
  }

  test('key as a string', async ({ page }) => {
    await stubWidget(page);
    await docsifyInit({
      config: {
        onetag: 'ot_test',
      },
      scriptURLs: ['/dist/plugins/onetag.js'],
    });

    await expect
      .poll(() => page.evaluate(() => window.onetagDataset))
      .toEqual({
        key: 'ot_test',
        ref: 'docsify',
        source: '.markdown-section',
      });
    await expect(page.locator(widgetSelector)).toHaveCount(1);
  });

  test('options as an object', async ({ page }) => {
    await stubWidget(page);
    await docsifyInit({
      config: {
        onetag: {
          key: 'ot_test',
          position: 'left',
          title: 'Ask the docs',
        },
      },
      scriptURLs: ['/dist/plugins/onetag.js'],
    });

    await expect
      .poll(() => page.evaluate(() => window.onetagDataset))
      .toEqual({
        key: 'ot_test',
        position: 'left',
        ref: 'docsify',
        source: '.markdown-section',
        title: 'Ask the docs',
      });
  });

  test('nothing is loaded without a key', async ({ page }) => {
    const consoleMsgs = [];

    page.on('console', msg => consoleMsgs.push(msg.text()));
    await stubWidget(page);
    await docsifyInit({
      scriptURLs: ['/dist/plugins/onetag.js'],
    });

    await expect(page.locator(widgetSelector)).toHaveCount(0);
    expect(consoleMsgs).toContain('[Docsify] onetag key is required.');
  });
});
