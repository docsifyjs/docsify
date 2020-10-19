const docsifyInit = require('../helpers/docsify-init');

describe(`Index file hosting`, function() {
  const sharedConfig = {
    basePath: `${TEST_HOST}/docs/index.html`,
  };

  test('should serve from index file', async () => {
    await docsifyInit({
      config: sharedConfig,
    });

    await expect(page).toHaveText(
      '#main',
      'A magical documentation site generator'
    );
  });
});
