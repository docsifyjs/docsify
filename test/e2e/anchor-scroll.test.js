import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

async function recordScrollIntoViewCalls(page) {
  await page.addInitScript(() => {
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    const originalScrollTo = window.scrollTo;

    window.__scrollIntoViewCalls = [];
    window.__scrollToCalls = [];
    window.__imageLoadEvents = [];
    document.addEventListener(
      'load',
      event => {
        const image = event.target;

        if (image instanceof HTMLImageElement) {
          window.__imageLoadEvents.push({
            alt: image.alt,
            time: performance.now(),
          });
        }
      },
      true,
    );
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

async function routeTimedImage(page, url, delay, height) {
  await page.route(`**/${url}`, async route => {
    await new Promise(resolve => setTimeout(resolve, delay));
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
      return window.__scrollIntoViewCalls?.some(
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
        targetCalls: (window.__scrollIntoViewCalls ?? []).filter(
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

    expect(targetCalls).toHaveLength(1);
    expect(targetCalls[0]).toMatchObject({ behavior: 'smooth' });
    expect(earlyInstantCalls).toEqual([]);
  });

  test('waits for images above a direct anchor before smooth scrolling', async ({
    page,
  }) => {
    await recordScrollIntoViewCalls(page);

    await routeTimedImage(page, 'slow-anchor-image-1.svg', 80, 900);
    await routeTimedImage(page, 'slow-anchor-image-2.svg', 120, 700);

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

    await initPromise;
    await page.waitForFunction(() => {
      const firstImage = document.querySelector('img[alt="Slow image 1"]');
      const secondImage = document.querySelector('img[alt="Slow image 2"]');
      const firstImageLoadTime = window.__imageLoadEvents.find(event => {
        return event.alt === 'Slow image 1';
      })?.time;
      const secondImageLoadTime = window.__imageLoadEvents.find(event => {
        return event.alt === 'Slow image 2';
      })?.time;

      return (
        firstImage instanceof HTMLImageElement &&
        secondImage instanceof HTMLImageElement &&
        firstImage.complete &&
        secondImage.complete &&
        firstImage.naturalHeight > 0 &&
        secondImage.naturalHeight > 0 &&
        firstImageLoadTime !== undefined &&
        secondImageLoadTime !== undefined
      );
    });
    await page.waitForFunction(() => {
      const target = document.querySelector('#target-section');
      const targetCalls = (window.__scrollIntoViewCalls ?? []).filter(
        call => call.id === 'target-section',
      );
      const targetTop = target?.getBoundingClientRect().top;

      return targetCalls.length === 1 && targetTop >= -1 && targetTop < 80;
    });

    const { firstImageLoadTime, secondImageLoadTime, targetCalls, targetTop } =
      await page.evaluate(() => {
        const target = document.querySelector('#target-section');
        const firstImageLoadTime = window.__imageLoadEvents.find(event => {
          return event.alt === 'Slow image 1';
        })?.time;
        const secondImageLoadTime = window.__imageLoadEvents.find(event => {
          return event.alt === 'Slow image 2';
        })?.time;

        return {
          firstImageLoadTime,
          secondImageLoadTime,
          targetCalls: (window.__scrollIntoViewCalls ?? []).filter(
            call => call.id === 'target-section',
          ),
          targetTop: target.getBoundingClientRect().top,
        };
      });

    expect(firstImageLoadTime).not.toBeUndefined();
    expect(secondImageLoadTime).not.toBeUndefined();

    expect(targetCalls).toHaveLength(1);
    expect(targetCalls[0]).toMatchObject({
      behavior: 'smooth',
      block: 'start',
    });
    expect(targetCalls[0].time).toBeGreaterThanOrEqual(firstImageLoadTime);
    expect(targetCalls[0].time).toBeGreaterThanOrEqual(secondImageLoadTime);
    expect(targetTop).toBeGreaterThanOrEqual(-1);
    expect(targetTop).toBeLessThan(80);
  });

  test('keeps a direct anchor aligned when images load after the fallback scroll', async ({
    page,
  }) => {
    await recordScrollIntoViewCalls(page);

    let releaseImage = () => {};
    const imageReleased = new Promise(resolve => {
      releaseImage = resolve;
    });

    await routeDelayedImage(
      page,
      'very-slow-anchor-image.svg',
      imageReleased,
      1200,
    );

    const initPromise = docsifyInit({
      config: {
        topMargin: 90,
      },
      testURL: '/docsify-init.html#/?id=target-section',
      markdown: {
        homepage: `
          # Anchor Scroll

          ![Very slow image](/very-slow-anchor-image.svg)

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

    await page.locator('#target-section').waitFor();
    await page.locator('img[alt="Very slow image"]').waitFor({
      state: 'attached',
    });
    await page.waitForFunction(() => {
      return (window.__scrollIntoViewCalls ?? []).some(
        call => call.id === 'target-section',
      );
    });

    const targetCallsBeforeImage = await page.evaluate(() => {
      return (window.__scrollIntoViewCalls ?? []).filter(
        call => call.id === 'target-section',
      );
    });

    expect(targetCallsBeforeImage).toHaveLength(1);
    expect(targetCallsBeforeImage[0]).toMatchObject({
      behavior: 'smooth',
      block: 'start',
    });

    releaseImage();
    await initPromise;
    await page.waitForFunction(() => {
      const image = document.querySelector('img[alt="Very slow image"]');

      return (
        image instanceof HTMLImageElement &&
        image.complete &&
        image.naturalHeight > 0
      );
    });
    await page.waitForFunction(() => {
      const target = document.querySelector('#target-section');
      const targetTop = target?.getBoundingClientRect().top;

      return targetTop >= 70 && targetTop < 120;
    });

    const { imageLoadTime, targetCalls, targetTop } = await page.evaluate(
      () => {
        const target = document.querySelector('#target-section');

        return {
          imageLoadTime: window.__imageLoadEvents.find(event => {
            return event.alt === 'Very slow image';
          })?.time,
          targetCalls: (window.__scrollIntoViewCalls ?? []).filter(
            call => call.id === 'target-section',
          ),
          targetTop: target.getBoundingClientRect().top,
        };
      },
    );

    expect(imageLoadTime).toBeGreaterThanOrEqual(targetCalls[0].time);
    expect(targetCalls).toHaveLength(1);
    expect(targetCalls[0]).toMatchObject({
      behavior: 'smooth',
      block: 'start',
    });
    expect(targetTop).toBeGreaterThanOrEqual(70);
    expect(targetTop).toBeLessThan(120);
  });

  test('cancels a pending direct anchor scroll after user input', async ({
    page,
  }) => {
    await recordScrollIntoViewCalls(page);
    await page.addInitScript(() => {
      window.__wheelTime = undefined;
      window.__anchorWheelListenerAttachedTime = undefined;
      const originalAddEventListener = window.addEventListener;

      window.addEventListener = function (eventName, listener, options) {
        if (
          eventName === 'wheel' &&
          options?.once === true &&
          options?.passive === true
        ) {
          window.__anchorWheelListenerAttachedTime = performance.now();
        }

        return originalAddEventListener.call(
          this,
          eventName,
          listener,
          options,
        );
      };

      window.addEventListener(
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

    await page.locator('#target-section').waitFor();
    await page.locator('img[alt="Slow image"]').waitFor({
      state: 'attached',
    });
    await page.waitForFunction(() => {
      return window.__anchorWheelListenerAttachedTime !== undefined;
    });

    await page.mouse.wheel(0, 900);
    const wheelTimeHandle = await page.waitForFunction(
      () => window.__wheelTime,
    );
    const wheelTime = await wheelTimeHandle.jsonValue();
    releaseImage();
    await initPromise;
    await page.waitForFunction(() => {
      const image = document.querySelector('img[alt="Slow image"]');

      return (
        image instanceof HTMLImageElement &&
        image.complete &&
        image.naturalHeight > 0
      );
    });
    await page.waitForFunction(wheelTime => {
      return performance.now() - wheelTime > 700;
    }, wheelTime);

    const { scrollStopsAfterWheel, targetCalls, targetCallsAfterWheel } =
      await page.evaluate(wheelTime => {
        return {
          scrollStopsAfterWheel: (window.__scrollToCalls ?? []).filter(call => {
            return call.time >= wheelTime;
          }),
          targetCalls: (window.__scrollIntoViewCalls ?? []).filter(
            call => call.id === 'target-section',
          ),
          targetCallsAfterWheel: (window.__scrollIntoViewCalls ?? []).filter(
            call => call.id === 'target-section' && call.time >= wheelTime,
          ),
        };
      }, wheelTime);

    expect(targetCalls).toEqual([]);
    expect(targetCallsAfterWheel).toEqual([]);
    expect(scrollStopsAfterWheel).toEqual([]);
  });

  test('does not pull back after user input following a fallback scroll', async ({
    page,
  }) => {
    await recordScrollIntoViewCalls(page);
    await page.addInitScript(() => {
      window.__wheelTime = undefined;

      window.addEventListener(
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

    await routeDelayedImage(
      page,
      'post-scroll-slow-image.svg',
      imageReleased,
      1200,
    );

    const initPromise = docsifyInit({
      testURL: '/docsify-init.html#/?id=target-section',
      markdown: {
        homepage: `
          # Anchor Scroll

          ![Post-scroll slow image](/post-scroll-slow-image.svg)

          ## Middle Section

          This section should not pull the user back after wheel input.

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

    await page.locator('#target-section').waitFor();
    await page.locator('img[alt="Post-scroll slow image"]').waitFor({
      state: 'attached',
    });
    await page.waitForFunction(() => {
      return (window.__scrollIntoViewCalls ?? []).some(
        call => call.id === 'target-section',
      );
    });

    const scrollYBeforeWheel = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 900);
    const wheelTimeHandle = await page.waitForFunction(
      () => window.__wheelTime,
    );
    const wheelTime = await wheelTimeHandle.jsonValue();
    await page.waitForFunction(
      scrollYBeforeWheel => Math.abs(scrollY - scrollYBeforeWheel) > 100,
      scrollYBeforeWheel,
    );
    const scrollYAfterWheel = await page.evaluate(() => scrollY);
    await page.waitForFunction(wheelTime => {
      return performance.now() - wheelTime > 200;
    }, wheelTime);
    const scrollYBeforeImage = await page.evaluate(() => scrollY);

    releaseImage();
    await initPromise;
    await page.waitForFunction(() => {
      const image = document.querySelector('img[alt="Post-scroll slow image"]');

      return (
        image instanceof HTMLImageElement &&
        image.complete &&
        image.naturalHeight > 0
      );
    });
    await page.waitForFunction(() => {
      const imageLoadTime = window.__imageLoadEvents.find(event => {
        return event.alt === 'Post-scroll slow image';
      })?.time;

      return (
        imageLoadTime !== undefined && performance.now() - imageLoadTime > 300
      );
    });

    const { scrollStopsAfterWheel, scrollYAfterImage, targetCallsAfterWheel } =
      await page.evaluate(wheelTime => {
        return {
          scrollStopsAfterWheel: (window.__scrollToCalls ?? []).filter(call => {
            return call.time >= wheelTime;
          }),
          scrollYAfterImage: scrollY,
          targetCallsAfterWheel: (window.__scrollIntoViewCalls ?? []).filter(
            call => call.id === 'target-section' && call.time >= wheelTime,
          ),
        };
      }, wheelTime);

    expect(Math.abs(scrollYAfterWheel - scrollYBeforeWheel)).toBeGreaterThan(
      100,
    );
    expect(targetCallsAfterWheel).toEqual([]);
    expect(scrollStopsAfterWheel).toEqual([]);
    expect(Math.abs(scrollYAfterImage - scrollYBeforeImage)).toBeLessThan(200);
  });
});
