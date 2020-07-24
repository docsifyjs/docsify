const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

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
    customDiffConfig: {
      ssim: 'fast',
    },
    failureThreshold: 0.01,
    runInProcess: true,
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
  // pixel or ssim
  ...config.ssimCompare,
});

expect.extend({ toMatchImageSnapshot });
