const docsifyInit = require('../helpers/docsifyInit');

describe(`Vue.js Rendering`, function() {
  const content = `<div id="test">test<span v-for="i in 5">{{ i }}</span></div>`;
  const scriptURLs = ['https://unpkg.com/vue@2/dist/vue.js'];

  // Setup & Teardown
  // -------------------------------------------------------------------------
  beforeEach(async () => {
    await jestPlaywright.resetPage();
  });

  // Tests
  // ---------------------------------------------------------------------------
  test('does render Vue content when executeScript is unspecified', async () => {
    await docsifyInit(page, {
      content,
      scriptURLs,
    });

    const testResult = await page.textContent('#test');

    expect(testResult).toBe('test12345');
  });

  test('does render Vue content when executeScript:true', async () => {
    await docsifyInit(page, {
      config: {
        executeScript: true,
      },
      content,
      scriptURLs,
    });

    const testResult = await page.textContent('#test');

    expect(testResult).toBe('test12345');
  });

  test('does not render Vue content when executeScript:false', async () => {
    await docsifyInit(page, {
      config: {
        executeScript: false,
      },
      content,
      scriptURLs,
    });

    const testResult = await page.textContent('#test');

    expect(testResult).toBe('test{{ i }}');
  });
});
