/* global browserName page */
const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

// Lifecycle Hooks
// -----------------------------------------------------------------------------
beforeAll(async () => {
  // Storing separate image comparison configurations for easy switching while
  // evaluating results. Once more e2e tests are in place, we'll settle on a
  // configuration, allowing us to safely remove the multi-config object below.
  const config = {
    // Pixel-based image comparisons
    // https://github.com/mapbox/pixelmatch#pixelmatchimg1-img2-output-width-height-options
    pixelCompare: {
      customDiffConfig: {
        threshold: 0.3,
      },
      failureThreshold: 0.04,
    },
    // Structural Similarity Index Measure (SSIM) comparisons
    // https://github.com/obartra/ssim
    ssimCompare: {
      comparisonMethod: 'ssim',
      failureThreshold: 0.15,
    },
  };

  const toMatchImageSnapshot = configureToMatchImageSnapshot({
    allowSizeMismatch: true, // Windows CI fix
    customSnapshotIdentifier(data) {
      return `${data.defaultIdentifier}-${browserName}`;
    },
    diffDirection: 'vertical',
    failureThresholdType: 'percent',
    noColors: true,
    runInProcess: true, // macOS CI fix
    // pixel- or ssim-based configuration
    ...config.pixelCompare,
  });

  expect.extend({ toMatchImageSnapshot });
});

beforeEach(async () => {
  await global.jestPlaywright.resetContext();

  // Goto URL ()
  // https://playwright.dev/#path=docs%2Fapi.md&q=pagegotourl-options
  // NOTE: Tests typically begin by navigating to a page for testing. When
  // this doesn't happen, Playwright operates on the "about:blank" page which
  // will cause operations that require the window location to be a valid URL
  // to fail (e.g. AJAX requests). To avoid these issues, this hook ensures
  // that each tests begins by a blank HTML page.
  await page.goto(`${TEST_HOST}/_blank.html`);
});
