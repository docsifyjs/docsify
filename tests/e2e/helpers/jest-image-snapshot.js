const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  comparisonMethod: 'ssim',
  customSnapshotIdentifier(data) {
    return `${data.defaultIdentifier}-${browserName}`;
  },
  diffDirection: 'vertical',
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
  noColors: true,
});

expect.extend({ toMatchImageSnapshot });
