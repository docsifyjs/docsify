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
    failureThreshold: 0.15,
  },
};

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customSnapshotIdentifier(data) {
    return `${data.defaultIdentifier}-${browserName}`;
  },
  diffDirection: 'vertical',
  failureThresholdType: 'percent',
  noColors: true,
  // pixel or ssim
  ...config.ssimCompare,
});

expect.extend({ toMatchImageSnapshot });
