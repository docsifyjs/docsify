import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('Anchor scrolling', () => {
  test('keeps smooth scrolling for same-page anchor clicks', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const originalScrollIntoView = Element.prototype.scrollIntoView;

      window.__scrollendEvents = [];
      window.__scrollEvents = [];
      window.__scrollIntoViewCalls = [];
      document.addEventListener('scroll', () => {
        window.__scrollEvents.push({ time: performance.now() });
      });
      document.addEventListener('scrollend', () => {
        window.__scrollendEvents.push({ time: performance.now() });
      });
      Element.prototype.scrollIntoView = function (options) {
        window.__scrollIntoViewCalls.push({
          id: this.id,
          behavior: options?.behavior,
          time: performance.now(),
        });

        return originalScrollIntoView.call(this, options);
      };
    });

    await docsifyInit({
      markdown: {
        homepage: `
          # Anchor Scroll

          [Jump to target](#target-section)

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
    await page.waitForFunction(() => {
      const scrollendTime = window.__scrollendEvents[0]?.time;
      const lastScrollTime = window.__scrollEvents.at(-1)?.time;
      const readyTime =
        scrollendTime ??
        (lastScrollTime === undefined ? undefined : lastScrollTime + 700);

      return readyTime !== undefined && performance.now() > readyTime;
    });

    const { readyTime, targetCalls } = await page.evaluate(() => {
      const scrollendTime = window.__scrollendEvents[0]?.time;
      const lastScrollTime = window.__scrollEvents.at(-1)?.time;

      return {
        readyTime:
          scrollendTime ??
          (lastScrollTime === undefined ? undefined : lastScrollTime + 700),
        targetCalls: window.__scrollIntoViewCalls.filter(
          call => call.id === 'target-section',
        ),
      };
    });
    const earlyInstantCalls = targetCalls.filter(call => {
      return (
        call.behavior === 'instant' &&
        (readyTime === undefined || call.time < readyTime)
      );
    });

    expect(targetCalls.length).toBeGreaterThan(0);
    expect(targetCalls[0]).toMatchObject({ behavior: 'smooth' });
    expect(earlyInstantCalls).toEqual([]);
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
