import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('Anchor scrolling', () => {
  test('keeps smooth scrolling for same-page anchor clicks', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const originalScrollIntoView = Element.prototype.scrollIntoView;

      window.__scrollIntoViewCalls = [];
      Element.prototype.scrollIntoView = function (options) {
        window.__scrollIntoViewCalls.push({
          id: this.id,
          behavior: options?.behavior,
        });

        return originalScrollIntoView.call(this, options);
      };
    });

    await docsifyInit({
      markdown: {
        homepage: `
          # Anchor Scroll

          [Jump to target](#/?id=target-section)

          ## Middle Section

          This section keeps the target below the fold.

          ## Target Section

          This is the linked section.
        `,
      },
      style: `
        .markdown-section {
          padding-bottom: 1200px;
        }

        #middle-section {
          margin-top: 900px;
        }
      `,
      styleURLs: ['/dist/themes/core.css'],
    });

    await page.getByRole('link', { name: 'Jump to target' }).click();
    await page.waitForFunction(() => {
      return window.__scrollIntoViewCalls.some(
        call => call.id === 'target-section' && call.behavior === 'smooth',
      );
    });
    await page.evaluate(() => {
      return new Promise(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      });
    });

    const targetCalls = await page.evaluate(() => {
      return window.__scrollIntoViewCalls.filter(
        call => call.id === 'target-section',
      );
    });

    expect(targetCalls.length).toBeGreaterThan(0);
    expect(targetCalls[0]).toMatchObject({ behavior: 'smooth' });
    expect(targetCalls).not.toContainEqual(
      expect.objectContaining({ behavior: 'instant' }),
    );
  });

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

    await page.locator('img[alt="Slow image"]').waitFor();
    await page.waitForFunction(() => {
      const image = document.querySelector('img[alt="Slow image"]');
      const target = document.querySelector('#target-section');
      return (
        image instanceof HTMLImageElement &&
        image.complete &&
        image.naturalHeight > 0 &&
        target instanceof HTMLElement &&
        target.getBoundingClientRect().top < 80
      );
    });

    const targetTop = await page.locator('#target-section').evaluate(el => {
      return el.getBoundingClientRect().top;
    });
    expect(targetTop).toBeLessThan(80);
  });
});
