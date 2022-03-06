const base = require('@playwright/test');

exports.test = base.test.extend({
  page: async ({ page }, use) => {
    global.page = page;

    // Navigate to a real URL by default
    // Playwright tests are executed on "about:blank" by default, which will
    // cause operations that require the window location to be a valid URL to
    // fail (e.g. AJAX requests). Navigating to a blank document with a real
    // URL solved this problem.
    await page.goto('/_blank.html');
    await use(page);
  },
});
exports.expect = base.expect;
