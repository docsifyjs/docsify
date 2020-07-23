const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: {
    threshold: 0.3,
  },
  customSnapshotIdentifier(data) {
    return `${data.defaultIdentifier}-${browserName}`;
  },
  diffDirection: 'vertical',
  failureThreshold: 0.04,
  noColors: true,
});

expect.extend({ toMatchImageSnapshot });
