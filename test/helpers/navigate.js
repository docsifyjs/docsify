/**
 * Navigate to a specific route in the site
 * @param {import('playwright-core').Page} page the playwright page instance from the test
 * @param {string} route the route you want to navigate to
 */

async function navigateToRoute(page, route) {
  const routerMode = await page.evaluate(() => window.$docsify.routerMode);

  if (routerMode === 'history') {
    await page.evaluate(r => window.history.pushState({ key: r }, '', r));
  } else {
    await page.evaluate(r => (window.location.hash = r), route);
  }

  await page.waitForLoadState('networkidle');
}

module.exports.navigateToRoute = navigateToRoute;
