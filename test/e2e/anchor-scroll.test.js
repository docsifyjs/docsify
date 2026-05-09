import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('Anchor scrolling', () => {
  test('keeps direct anchor targets aligned after images above them load', async ({
    page,
  }) => {
    await page.route('**/slow-anchor-image.svg', async route => {
      await new Promise(resolve => setTimeout(resolve, 250));
      await route.fulfill({
        contentType: 'image/svg+xml',
        body: `
          <svg xmlns="http://www.w3.org/2000/svg" width="640" height="900">
            <rect width="640" height="900" fill="#ddd" />
          </svg>
        `,
      });
    });

    await docsifyInit({
      testURL: '/docsify-init.html#/?id=target-section',
      markdown: {
        homepage: `
          # Anchor Scroll

          ![Slow image](/slow-anchor-image.svg)

          ## Middle Section

          This section should not stay at the top after the image loads.

          ## Target Section

          This is the linked section.

          Trailing content keeps the target scrollable.
        `,
      },
      routes: {
        '/docsify-init.html': `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
            </head>
            <body>
              <div id="app"></div>
            </body>
          </html>
        `,
      },
      style: `
        .markdown-section img {
          display: block;
          width: 100%;
          height: auto;
        }

        .markdown-section {
          padding-bottom: 1200px;
        }
      `,
      styleURLs: ['/dist/themes/core.css'],
    });

    await expect
      .poll(async () => {
        return page.locator('#target-section').evaluate(el => {
          return el.getBoundingClientRect().top;
        });
      })
      .toBeLessThan(80);
  });
});
