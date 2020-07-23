const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: {
    threshold: 0.1,
  },
  customSnapshotIdentifier(data) {
    return `${data.defaultIdentifier}-${browserName}`;
  },
});

expect.extend({ toMatchImageSnapshot });
