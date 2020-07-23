const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: {
    threshold: 0.3,
  },
  customSnapshotIdentifier(data) {
    return `${data.defaultIdentifier}-${browserName}`;
  },
});

expect.extend({ toMatchImageSnapshot });
