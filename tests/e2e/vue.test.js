const docsifyInit = require('../helpers/docsify-init');

describe(`Vue.js Rendering`, function() {
  const sharedConfig = {
    markdown: {
      homepage: '<div id="test">test<span v-for="i in 5">{{ i }}</span></div>',
    },
    scriptURLs: ['https://unpkg.com/vue@2/dist/vue.js'],
  };

  // Tests
  // ---------------------------------------------------------------------------
  test('does render Vue content when executeScript is unspecified', async () => {
    await docsifyInit(sharedConfig);

    const testResult = await page.textContent('#test');

    expect(testResult).toBe('test12345');
  });

  test('does render Vue content when executeScript:true', async () => {
    await docsifyInit({
      ...sharedConfig,
      config: {
        executeScript: true,
      },
    });

    const testResult = await page.textContent('#test');

    expect(testResult).toBe('test12345');
  });

  test('does not render Vue content when executeScript:false', async () => {
    await docsifyInit({
      ...sharedConfig,
      config: {
        executeScript: false,
      },
    });

    const testResult = await page.textContent('#test');

    expect(testResult).toBe('test{{ i }}');
  });
});
