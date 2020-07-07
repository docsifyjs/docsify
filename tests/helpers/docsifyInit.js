const stripIndent = require('common-tags/lib/stripIndent');
const { serverIP, serverPort } = require('./server.js');

async function docsifyInit(page, options) {
  const defaults = {
    config: {},
    content: '',
    coverpage: '',
    navbar: '',
    sidebar: '',
    routes: [[]],
    style: '',
    styleURLs: ['/lib/themes/vue.css'],
    script: '',
    scriptURLs: [],
    url: `http://${serverIP}:${serverPort}`,
    docsifyURL: '/lib/docsify.js',
    waitForSelector: '#main',
  };
  const settings = {
    ...defaults,
    ...options,
  };

  // Routes - General
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

  // Routes - Docsify Markdown
  [
    [settings.content, '**/README.md'],
    [settings.coverpage, '**/_coverpage.md', { coverpage: true }],
    [settings.navbar, '**/_navbar.md', { loadNavbar: true }],
    [settings.sidebar, '**/_sidebar.md', { loadSidebar: true }],
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

  // Load URL
  await page.goto(settings.url);

  // Docsify configuration
  if (Object.keys(settings.config).length > 0) {
    await page.evaluate(config => {
      Object.assign(window.$docsify, config);
    }, settings.config);
  }

  // CSS
  settings.styleURLs.forEach(async url => await page.addStyleTag({ url }));

  // JavaScript (must load/resolve sequentially)
  settings.scriptURLs.push(settings.docsifyURL);
  for (const url of settings.scriptURLs) {
    await page.addScriptTag({ url });
  }

  // Detect docsify "complete" by waiting for specified element
  if (settings.waitForSelector) {
    await page.waitForSelector(settings.waitForSelector);
  }
}

module.exports = docsifyInit;
