/* global jestPlaywright page */

import { waitForSelector } from './wait-for-selector';
import doMockAjax from './do-mock-ajax.js';

const prettier = require('prettier');
const stripIndent = require('common-tags/lib/stripIndent');

const docsifyPATH = `${SRC_PATH}/core`; // JSDOM
const docsifyURL = `${LIB_URL}/docsify.js`; // Playwright
const isPlaywright = 'page' in global;
const isJSDOM = 'window' in global;

/**
 * Jest / Playwright helper for creating custom docsify test sites
 *
 * @param {Object} options options object
 * @param {Function|Object} [options.config] docsify configuration (merged with default)
 * @param {String} [options.html] HTML content to use for docsify `index.html` page
 * @param {Object} [options.markdown] Docsify markdown content
 * @param {String} [options.markdown.coverpage] coverpage markdown
 * @param {String} [options.markdown.homepage] homepage markdown
 * @param {String} [options.markdown.navbar] navbar markdown
 * @param {String} [options.markdown.sidebar] sidebar markdown
 * @param {Object} [options.routes] custom routes defined as `{ pathOrGlob: responseText }`
 * @param {String} [options.script] JS to inject via <script> tag
 * @param {String|String[]} [options.scriptURLs] External JS to inject via <script src="..."> tag(s)
 * @param {String} [options.style] CSS to inject via <style> tag
 * @param {String|String[]} [options.styleURLs=['/lib/themes/vue.css']] External CSS to inject via <link rel="stylesheet"> tag(s)
 * @param {String} [options.testURL] URL to set as window.location.href
 * @param {String} [options.waitForSelector='#main'] Element to wait for before returning promsie
 * @param {String} [options._debug] initiate debugger after site is created
 * @param {Boolean} [options._logHTML] Logs formatted HTML to console after initialization
 * @returns {Promise}
 */
async function docsifyInit(options = {}) {
  const defaults = {
    config: {
      // basePath: '/',
      basePath: TEST_URL,
      el: '#app',
    },
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
          <div id="app"></div>
        </body>
      </html>
    `,
    markdown: {
      coverpage: '',
      homepage: '',
      navbar: '',
      sidebar: '',
    },
    routes: {},
    script: '',
    scriptURLs: [],
    style: '',
    styleURLs: [`${LIB_URL}/themes/vue.css`],
    testURL: `${TEST_URL}/docsify-init.html`,
    waitForSelector: '#main',
  };
  const settings = {
    ...defaults,
    ...options,
    get config() {
      const sharedConfig = {
        ...defaults.config,
        // Conditionally set options but allow explicit overrides
        coverpage: Boolean(settings.markdown.coverpage),
        loadNavbar: Boolean(settings.markdown.navbar),
        loadSidebar: Boolean(settings.markdown.sidebar),
      };

      // Config as function
      if (typeof options.config === 'function') {
        return function(vm) {
          return { ...sharedConfig, ...options.config(vm) };
        };
      }
      // Config as object
      else {
        return { ...sharedConfig, ...options.config };
      }
    },
    get markdown() {
      return Object.fromEntries(
        Object.entries({
          ...defaults.markdown,
          ...options.markdown,
        })
          .filter(([key, markdown]) => key && markdown)
          .map(([key, markdown]) => [key, stripIndent`${markdown}`])
      );
    },
    get routes() {
      const helperRoutes = {
        [settings.testURL]: stripIndent`${settings.html}`,
        [`${TEST_URL}/README.md`]: settings.markdown.homepage,
        [`${TEST_URL}/_coverpage.md`]: settings.markdown.coverpage,
        [`${TEST_URL}/_navbar.md`]: settings.markdown.navbar,
        [`${TEST_URL}/_sidebar.md`]: settings.markdown.sidebar,
      };

      const optionRoutes = Object.fromEntries(
        Object.entries(options.routes || {}).map(([url, response]) => [
          url,
          stripIndent`${response}`,
        ])
      );

      return Object.fromEntries(
        Object.entries({
          ...helperRoutes,
          ...optionRoutes,
        }).filter(([url, response]) => url && response)
      );
    },
    // Merge scripts and remove duplicates
    scriptURLs: [].concat(options.scriptURLs || '').filter(url => url),
    styleURLs: [].concat(options.styleURLs || '').filter(url => url),
  };

  // Routes
  if (isJSDOM) {
    doMockAjax(settings.routes);
  } else if (isPlaywright) {
    Object.entries(settings.routes).forEach(async ([urlGlob, response]) => {
      if (typeof response === 'string') {
        response = {
          // contentType: 'text/markdown',
          body: response,
        };
      }
      await page.route(urlGlob, route => route.fulfill(response));
    });
  }

  // Set test URL / HTML
  if (isJSDOM) {
    window.history.pushState({}, 'docsify', settings.testURL);
    document.documentElement.innerHTML = settings.html;
  } else if (isPlaywright) {
    await page.goto(settings.testURL);
    await page.waitForLoadState();
  }

  // Docsify configuration
  if (isJSDOM) {
    window.$docsify = settings.config;
  } else if (isPlaywright) {
    await page.evaluate(config => {
      window.$docsify = config;
    }, settings.config);
  }

  // Style URLs
  if (isJSDOM) {
    for (const styleURL of settings.styleURLs) {
      document.head.insertAdjacentHTML(
        'beforeend',
        `<link rel="stylesheet" type="text/css" href="${styleURL}">`
      );
    }
  } else if (isPlaywright) {
    await Promise.all(settings.styleURLs.map(url => page.addStyleTag({ url })));
  }

  // JavaScript URLs
  if (isJSDOM) {
    for (const scriptURL of settings.scriptURLs) {
      document.body.insertAdjacentHTML(
        'beforeend',
        `<script src="${scriptURL}"></script>`
      );
    }

    const isDocsifyLoaded = 'Docsify' in window;

    if (!isDocsifyLoaded) {
      require(docsifyPATH);
    }
  } else if (isPlaywright) {
    for (const url of settings.scriptURLs) {
      await page.addScriptTag({ url });
    }

    const isDocsifyLoaded = await page.evaluate(() => 'Docsify' in window);

    if (!isDocsifyLoaded) {
      await page.addScriptTag({ url: docsifyURL });
    }
  }

  // Style
  if (settings.style) {
    if (isJSDOM) {
      const headElm = document.querySelector('head');
      const styleElm = document.createElement('style');

      styleElm.textContent = stripIndent`${settings.style}`;
      headElm.appendChild(styleElm);
    } else if (isPlaywright) {
      await page.evaluate(data => {
        const headElm = document.querySelector('head');
        const styleElm = document.createElement('style');

        styleElm.textContent = data;
        headElm.appendChild(styleElm);
      }, stripIndent`${settings.style}`);
    }
  }

  // JavaScript
  if (settings.script) {
    if (isJSDOM) {
      const bodyElm = document.querySelector('body');
      const scriptElm = document.createElement('script');

      scriptElm.textContent = stripIndent`${settings.script}`;
      bodyElm.appendChild(scriptElm);
    } else if (isPlaywright) {
      await page.evaluate(data => {
        const headElm = document.querySelector('head');
        const scriptElm = document.createElement('script');

        scriptElm.textContent = data;
        headElm.appendChild(scriptElm);
      }, stripIndent`${settings.script}`);
    }
  }

  // Docsify "Ready"
  if (isJSDOM) {
    await waitForSelector(settings.waitForSelector);
  } else if (isPlaywright) {
    await page.waitForSelector(settings.waitForSelector);
    await page.waitForLoadState('networkidle');
  }

  // Log HTML to console
  if (settings._logHTML) {
    const html = isJSDOM
      ? document.documentElement.innerHTML
      : await page.content();

    // eslint-disable-next-line no-console
    console.log(prettier.format(html, { parser: 'html' }));
  }

  // Debug
  if (settings._debug) {
    if (isJSDOM) {
      // eslint-disable-next-line no-debugger
      debugger;
    } else if (isPlaywright) {
      await jestPlaywright.debug();
    }
  }

  return Promise.resolve();
}

module.exports = docsifyInit;
