const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customSnapshotIdentifier(data) {
    return `${data.defaultIdentifier}-${browserName}`;
  },
});

expect.extend({ toMatchImageSnapshot });
