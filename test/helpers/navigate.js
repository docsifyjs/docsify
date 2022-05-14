/**
 * Navigate to a specific hashtag route in the page, and wait for docsify to handle navigation.
 * @param {import('playwright-core').Page} page
 * @param {string} route
 */
async function navigateToRoute(page, route) {
  await page.evaluate(r => (window.location.hash = r), route);
  const mainElm = await page.waitForSelector('#main');
  await mainElm.waitForElementState('stable');
}

module.exports.navigateToRoute = navigateToRoute;
