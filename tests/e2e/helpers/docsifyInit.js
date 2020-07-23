const stripIndent = require('common-tags/lib/stripIndent');
const { URL: serverURL } = require('../config/server.js');

/**
 * Playwright helper for dynamically creating custom docsify sites.
 *
 * @param {Object} options options object
 * @param {Object} [options.config] docsify configuration (merged with default)
 * @param {String} [options.contentMarkdown] homepage markdown
 * @param {String} [options.coverpageMarkdown] coverpage markdown
 * @param {String} [options.debug] initiate debugger after site is created
 * @param {String} [options.docsifyURL='/lib/docsify.js']
 * @param {String} [options.navbarMarkdown] navbar markdown
 * @param {Array[]|Array[][]} [options.routes] custom routes as [path, response] (See https://playwright.dev/#path=docs%2Fapi.md&q=routefulfillresponse for details)
 * @param {String} [options.script] JS to inject via <script> tag
 * @param {string|String[]} [options.scriptURLs] External JS to inject via <script src="..."> tag(s)
 * @param {String} [options.sidebarMarkdown] sidebar markdown
 * @param {String} [options.style] CSS to inject via <style> tag
 * @param {string|String[]} [options.styleURLs=['/lib/themes/vue.css']] External CSS to inject via <link rel="stylesheet"> tag(s)
 * @param {String} [options.url=`${serverURL}/docsify-init.html`] URL of local test server
 * @param {String} [options.waitForSelector='#main']
 */
async function docsifyInit(options) {
  const defaults = {
    config: {},
    contentMarkdown: '',
    coverpageMarkdown: '',
    debug: false,
    docsifyURL: '/lib/docsify.js',
    navbarMarkdown: '',
    routes: [[]],
    script: '',
    scriptURLs: [],
    sidebarMarkdown: '',
    style: '',
    styleURLs: ['/lib/themes/vue.css'],
    url: `${serverURL}/docsify-init.html`,
    waitForSelector: '#main',
  };
  const settings = {
    ...defaults,
    ...options,
  };

  // Routes
  if (settings.routes.length > 0 && typeof settings.routes[0] === 'string') {
    settings.routes = [settings.routes];
  }
  settings.routes.forEach(async ([urlGlob, response]) => {
    if (urlGlob && response) {
      if (typeof response === 'string') {
        response = {
          body: stripIndent`${response}`,
        };
      }
      await page.route(urlGlob, route => route.fulfill(response));
    }
  });

  // Docsify markdown
  [
    [settings.contentMarkdown, '**/README.md'],
    [settings.coverpageMarkdown, '**/_coverpage.md', { coverpage: true }],
    [settings.navbarMarkdown, '**/_navbar.md', { loadNavbar: true }],
    [settings.sidebarMarkdown, '**/_sidebar.md', { loadSidebar: true }],
  ].forEach(async ([markdown, urlGlob, config]) => {
    if (markdown) {
      if (config) {
        Object.assign(settings.config, config);
      }
      await page.route(urlGlob, route =>
        route.fulfill({
          contentType: 'text/markdown',
          body: stripIndent`${markdown}`,
        })
      );
    }
  });

  // Load URL and wait for 'load' event
  await page.goto(settings.url);
  await page.waitForLoadState();

  // Docsify configuration
  if (Object.keys(settings.config).length > 0) {
    await page.evaluate(config => {
      Object.assign(window.$docsify, config);
    }, settings.config);
  }

  // CSS (must resolve all before proceeding)
  await Promise.all(settings.styleURLs.map(url => page.addStyleTag({ url })));
  if (settings.style) {
    await page.evaluate(data => {
      const headElm = document.querySelector('head');
      const styleElm = document.createElement('style');

      styleElm.textContent = data;
      headElm.appendChild(styleElm);
    }, stripIndent`${settings.style}`);
  }

  // JavaScript (must load/resolve sequentially to guaraantee execution order)
  settings.scriptURLs.push(settings.docsifyURL);
  for (const url of settings.scriptURLs) {
    await page.addScriptTag({ url });
  }
  if (settings.script) {
    await page.evaluate(data => {
      const headElm = document.querySelector('head');
      const scriptElm = document.createElement('script');

      scriptElm.textContent = data;
      headElm.appendChild(scriptElm);
    }, stripIndent`${settings.script}`);
  }

  // Docsify "Ready"
  if (settings.waitForSelector) {
    await page.waitForSelector(settings.waitForSelector);
  }

  // Wait for all network requests to complete
  await page.waitForLoadState('networkidle');

  // Debug
  if (settings.debug) {
    await jestPlaywright.debug();
  }

  return Promise.resolve();
}

module.exports = docsifyInit;
