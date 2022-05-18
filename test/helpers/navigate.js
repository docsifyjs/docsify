/**
 * Navigate to a specific route in the site
 * @param {import('playwright-core').Page} page the playwright page instance from the test
 * @param {string} route the route you want to navigate to
 * @param {Object} opts additional options (optional)
 * @param {'hash' | 'history'} opts.routerMode which router mode to use. Defaults to "hash"
 */

async function navigateToRoute(page, route, { routerMode = 'hash' } = {}) {
  if (routerMode === 'hash') {
    await page.evaluate(r => (window.location.hash = r), route);
  } else {
    await page.evaluate(r => window.history.pushState({ key: r }, '', r));
  }

  await page.waitForLoadState('networkidle');
}

module.exports.navigateToRoute = navigateToRoute;
