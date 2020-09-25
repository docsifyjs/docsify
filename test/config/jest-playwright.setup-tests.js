/* global browserName */
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
  await global.jestPlaywright.resetPage();
});
