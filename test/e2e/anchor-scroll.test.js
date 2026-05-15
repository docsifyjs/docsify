import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

async function recordScrollIntoViewCalls(page) {
  await page.addInitScript(() => {
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    const originalScrollTo = window.scrollTo;

    window.__scrollIntoViewCalls = [];
    window.__scrollToCalls = [];
    Element.prototype.scrollIntoView = function (options) {
      window.__scrollIntoViewCalls.push({
        id: this.id,
        block: options?.block,
        behavior: options?.behavior,
        time: performance.now(),
      });

      return originalScrollIntoView.call(this, options);
    };
    window.scrollTo = function (...args) {
      const options = args[0];
      const call = {
        time: performance.now(),
      };

      if (typeof options === 'object' && options !== null) {
        call.behavior = options.behavior;
        call.left = options.left;
        call.top = options.top;
      } else {
        call.left = options;
        call.top = args[1];
      }

      window.__scrollToCalls.push(call);

      return originalScrollTo.apply(this, args);
    };
  });
}

async function routeDelayedImage(page, url, imageReleased, height) {
  await page.route(`**/${url}`, async route => {
    await imageReleased;
    await route.fulfill({
      contentType: 'image/svg+xml',
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" width="640" height="${height}">
          <rect width="640" height="${height}" fill="#ddd" />
        </svg>
      `,
    });
  });
}

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
    await recordScrollIntoViewCalls(page);
    await page.addInitScript(() => {
      window.__releaseFirstImageTime = undefined;
      window.__releaseSecondImageTime = undefined;
    });

    let releaseFirstImage = () => {};
    const firstImageReleased = new Promise(resolve => {
      releaseFirstImage = resolve;
    });
    let releaseSecondImage = () => {};
    const secondImageReleased = new Promise(resolve => {
      releaseSecondImage = resolve;
    });

    await routeDelayedImage(
      page,
      'slow-anchor-image-1.svg',
      firstImageReleased,
      900,
    );
    await routeDelayedImage(
      page,
      'slow-anchor-image-2.svg',
      secondImageReleased,
      700,
    );

    const initPromise = docsifyInit({
      testURL: '/docsify-init.html#/?id=target-section',
      markdown: {
        homepage: `
          # Anchor Scroll

          ![Slow image 1](/slow-anchor-image-1.svg)

          ![Slow image 2](/slow-anchor-image-2.svg)

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
        .markdown-section {
          overflow-anchor: none;
          padding-bottom: 1200px;
        }

        .markdown-section img {
          display: block;
          width: 100%;
          height: auto;
        }
      `,
      styleURLs: ['/dist/themes/core.css'],
    });

    await page.waitForFunction(() => {
      return window.__scrollIntoViewCalls.some(
        call => call.id === 'target-section',
      );
    });
    await page.evaluate(() => {
      return new Promise(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      });
    });
    await page.evaluate(() => {
      window.__releaseFirstImageTime = performance.now();
    });
    releaseFirstImage();
    await page.locator('img[alt="Slow image 1"]').waitFor();
    await page.waitForFunction(() => {
      const image = document.querySelector('img[alt="Slow image 1"]');
      const target = document.querySelector('#target-section');
      const targetCalls = window.__scrollIntoViewCalls.filter(
        call => call.id === 'target-section',
      );
      const delayedTargetCalls = targetCalls.filter(
        call => call.time >= window.__releaseFirstImageTime,
      );
      const targetTop = target?.getBoundingClientRect().top;

      return (
        image instanceof HTMLImageElement &&
        image.complete &&
        image.naturalHeight > 0 &&
        delayedTargetCalls.length > 0 &&
        targetTop >= -1 &&
        targetTop < 80
      );
    });
    await page.waitForFunction(() => {
      const delayedTargetCalls = window.__scrollIntoViewCalls.filter(call => {
        return (
          call.id === 'target-section' &&
          call.time >= window.__releaseFirstImageTime
        );
      });
      const lastDelayedTargetCall = delayedTargetCalls.at(-1);

      return (
        lastDelayedTargetCall &&
        performance.now() - lastDelayedTargetCall.time > 700
      );
    });
    await page.evaluate(() => {
      window.__releaseSecondImageTime = performance.now();
    });
    releaseSecondImage();
    await initPromise;
    await page.locator('img[alt="Slow image 2"]').waitFor();
    await page.waitForFunction(() => {
      const image = document.querySelector('img[alt="Slow image 2"]');
      const target = document.querySelector('#target-section');
      const targetCalls = window.__scrollIntoViewCalls.filter(
        call => call.id === 'target-section',
      );
      const delayedSecondImageCalls = targetCalls.filter(
        call => call.time >= window.__releaseSecondImageTime,
      );
      const targetTop = target?.getBoundingClientRect().top;

      return (
        image instanceof HTMLImageElement &&
        image.complete &&
        image.naturalHeight > 0 &&
        delayedSecondImageCalls.length > 0 &&
        targetTop >= -1 &&
        targetTop < 80
      );
    });

    const {
      releaseFirstImageTime,
      releaseSecondImageTime,
      targetCalls,
      targetTop,
    } = await page.evaluate(() => {
      const target = document.querySelector('#target-section');

      return {
        releaseFirstImageTime: window.__releaseFirstImageTime,
        releaseSecondImageTime: window.__releaseSecondImageTime,
        targetCalls: window.__scrollIntoViewCalls.filter(
          call => call.id === 'target-section',
        ),
        targetTop: target.getBoundingClientRect().top,
      };
    });
    const delayedInstantCalls = targetCalls.filter(call => {
      return call.behavior === 'instant' && call.time >= releaseFirstImageTime;
    });
    const delayedTargetCalls = targetCalls.filter(call => {
      return call.time >= releaseFirstImageTime;
    });
    const delayedSecondImageCalls = targetCalls.filter(call => {
      return call.time >= releaseSecondImageTime;
    });
    const nonSmoothDelayedTargetCalls = delayedTargetCalls.filter(call => {
      return call.behavior !== 'smooth';
    });

    expect(targetCalls.length).toBeGreaterThan(1);
    expect(targetCalls[0]).toMatchObject({ behavior: 'smooth' });
    expect(delayedTargetCalls.length).toBeGreaterThan(0);
    expect(delayedSecondImageCalls.length).toBeGreaterThan(0);
    expect(nonSmoothDelayedTargetCalls).toEqual([]);
    expect(delayedInstantCalls).toEqual([]);
    expect(targetTop).toBeGreaterThanOrEqual(-1);
    expect(targetTop).toBeLessThan(80);
  });

  test('does not stop a late smooth correction when observer cleanup expires', async ({
    page,
  }) => {
    await recordScrollIntoViewCalls(page);
    await page.addInitScript(() => {
      window.__releaseImageTime = undefined;
    });

    let releaseImage = () => {};
    const imageReleased = new Promise(resolve => {
      releaseImage = resolve;
    });

    await routeDelayedImage(page, 'late-anchor-image.svg', imageReleased, 1800);

    const initPromise = docsifyInit({
      testURL: '/docsify-init.html#/?id=target-section',
      markdown: {
        homepage: `
          # Anchor Scroll

          ![Late image](/late-anchor-image.svg)

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
        .markdown-section {
          overflow-anchor: none;
          padding-bottom: 3200px;
        }

        .markdown-section img {
          display: block;
          width: 100%;
          height: auto;
        }
      `,
      styleURLs: ['/dist/themes/core.css'],
    });

    await page.waitForFunction(() => {
      return window.__scrollIntoViewCalls.some(
        call => call.id === 'target-section',
      );
    });
    await page.waitForFunction(() => {
      const firstTargetCall = window.__scrollIntoViewCalls.find(
        call => call.id === 'target-section',
      );

      return firstTargetCall && performance.now() - firstTargetCall.time > 2300;
    });
    await page.evaluate(() => {
      window.__releaseImageTime = performance.now();
    });
    releaseImage();
    await initPromise;
    await page.locator('img[alt="Late image"]').waitFor();
    await page.waitForFunction(() => {
      return window.__scrollIntoViewCalls.some(call => {
        return (
          call.id === 'target-section' &&
          call.behavior === 'smooth' &&
          call.time >= window.__releaseImageTime
        );
      });
    });
    await page.waitForFunction(() => {
      const firstTargetCall = window.__scrollIntoViewCalls.find(
        call => call.id === 'target-section',
      );

      return firstTargetCall && performance.now() - firstTargetCall.time > 3600;
    });
    await page.waitForFunction(() => {
      const target = document.querySelector('#target-section');
      const targetTop = target?.getBoundingClientRect().top;

      return targetTop >= -1 && targetTop < 80;
    });

    const { instantStopsAfterRelease, targetTop } = await page.evaluate(() => {
      const target = document.querySelector('#target-section');

      return {
        instantStopsAfterRelease: window.__scrollToCalls.filter(call => {
          return (
            call.behavior === 'instant' &&
            call.time >= window.__releaseImageTime
          );
        }),
        targetTop: target.getBoundingClientRect().top,
      };
    });

    expect(instantStopsAfterRelease).toEqual([]);
    expect(targetTop).toBeGreaterThanOrEqual(-1);
    expect(targetTop).toBeLessThan(80);
  });

  test('does not continue corrective smooth scrolling after user input', async ({
    page,
  }) => {
    await recordScrollIntoViewCalls(page);
    await page.addInitScript(() => {
      window.__releaseImageTime = undefined;
      window.__wheelTime = undefined;
      document.addEventListener(
        'wheel',
        () => {
          window.__wheelTime = performance.now();
        },
        { capture: true },
      );
    });

    let releaseImage = () => {};
    const imageReleased = new Promise(resolve => {
      releaseImage = resolve;
    });

    await routeDelayedImage(page, 'slow-anchor-image.svg', imageReleased, 900);

    const initPromise = docsifyInit({
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
        .markdown-section {
          overflow-anchor: none;
          padding-bottom: 2200px;
        }

        .markdown-section img {
          display: block;
          width: 100%;
          height: auto;
        }
      `,
      styleURLs: ['/dist/themes/core.css'],
    });

    await page.waitForFunction(() => {
      return window.__scrollIntoViewCalls.some(
        call => call.id === 'target-section',
      );
    });
    await page.evaluate(() => {
      return new Promise(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      });
    });
    await page.evaluate(() => {
      window.__releaseImageTime = performance.now();
    });
    releaseImage();
    await initPromise;
    await page.locator('img[alt="Slow image"]').waitFor();
    await page.waitForFunction(() => {
      return window.__scrollIntoViewCalls.some(call => {
        return (
          call.id === 'target-section' &&
          call.behavior === 'smooth' &&
          call.time >= window.__releaseImageTime
        );
      });
    });

    await page.mouse.wheel(0, 900);
    const wheelTimeHandle = await page.waitForFunction(
      () => window.__wheelTime,
    );
    const wheelTime = await wheelTimeHandle.jsonValue();
    await page.waitForFunction(wheelTime => {
      const targetCallsAfterWheel = window.__scrollIntoViewCalls.filter(
        call => call.id === 'target-section' && call.time >= wheelTime,
      );
      const instantStopsAfterWheel = window.__scrollToCalls.filter(call => {
        return call.behavior === 'instant' && call.time >= wheelTime;
      });

      return (
        targetCallsAfterWheel.length === 0 &&
        instantStopsAfterWheel.length > 0 &&
        performance.now() - wheelTime > 900
      );
    }, wheelTime);

    const { instantStopsAfterWheel, targetCallsAfterWheel } =
      await page.evaluate(wheelTime => {
        return {
          instantStopsAfterWheel: window.__scrollToCalls.filter(call => {
            return call.behavior === 'instant' && call.time >= wheelTime;
          }),
          targetCallsAfterWheel: window.__scrollIntoViewCalls.filter(
            call => call.id === 'target-section' && call.time >= wheelTime,
          ),
        };
      }, wheelTime);

    expect(instantStopsAfterWheel.length).toBeGreaterThan(0);
    expect(targetCallsAfterWheel).toEqual([]);
  });
});
