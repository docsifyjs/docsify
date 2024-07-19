import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

const gtagList = [
  'AW-YYYYYY', // Google Ads
  'DC-ZZZZZZ', // Floodlight
  'G-XXXXXX', // Google Analytics 4 (GA4)
  'UA-XXXXXX', // Google Universal Analytics (GA3)
];

test.describe('Gtag Plugin Tests', () => {
  // page request listened, print collect url
  function pageRequestListened(page) {
    page.on('request', request => {
      if (request.url().indexOf('www.google-analytics.com') !== -1) {
        // console.log(request.url());
      }
    });

    page.on('response', response => {
      const request = response.request();
      // googleads.g.doubleclick.net
      // www.google-analytics.com
      // www.googletagmanager.com
      const reg =
        /googleads\.g\.doubleclick\.net|www\.google-analytics\.com|www\.googletagmanager\.com/g;
      if (request.url().match(reg)) {
        // console.log(request.url(), response.status());
      }
    });
  }

  test('single gtag', async ({ page }) => {
    pageRequestListened(page);

    const docsifyInitConfig = {
      config: {
        gtag: gtagList[0],
      },
      scriptURLs: ['/dist/plugins/gtag.js'],
      styleURLs: ['/dist/themes/core.css'],
    };

    await docsifyInit({
      ...docsifyInitConfig,
    });

    const $docsify = await page.evaluate(() => window.$docsify);

    // Verify config options
    expect(typeof $docsify).toEqual('object');

    // console.log($docsify.gtag, $docsify.gtag === '');

    // Tests
    expect($docsify.gtag).not.toEqual('');
  });

  test('multi gtag', async ({ page }) => {
    pageRequestListened(page);

    const docsifyInitConfig = {
      config: {
        gtag: gtagList,
      },
      scriptURLs: ['/dist/plugins/gtag.js'],
      styleURLs: ['/dist/themes/core.css'],
    };

    await docsifyInit({
      ...docsifyInitConfig,
    });

    const $docsify = await page.evaluate(() => window.$docsify);

    // Verify config options
    expect(typeof $docsify).toEqual('object');

    // console.log($docsify.gtag, $docsify.gtag === '');

    // Tests
    expect($docsify.gtag).not.toEqual('');
  });
});
