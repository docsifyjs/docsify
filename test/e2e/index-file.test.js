const docsifyInit = require('../helpers/docsify-init');

describe(`Index file hosting`, function() {
  const sharedOptions = {
    config: {
      basePath: `${TEST_HOST}/docs/index.html#/`,
    },
    testURL: `${TEST_HOST}/docs/index.html#/`,
  };

  test('should serve from index file', async () => {
    await docsifyInit(sharedOptions);

    await expect(page).toHaveText(
      '#main',
      'A magical documentation site generator'
    );
    expect(page.url()).toMatch(sharedOptions.testURL);
  });

  test('should use index file links in sidebar from index file hosting', async () => {
    const onceRendered = await docsifyInit(sharedOptions);

    await page.click('a[href="#/quickstart"]');
    await onceRendered();
    await expect(page).toHaveText('#main', 'Quick start');
    expect(page.url()).toMatch(sharedOptions.testURL + 'quickstart');
  });
});
