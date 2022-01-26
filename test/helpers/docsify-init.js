/* global jestPlaywright page */
import mock, { proxy } from 'xhr-mock';
import { waitForSelector } from './wait-for';

// TODO use browser.newPage() instead of re-using the same page every time?

const axios = require('axios');
const prettier = require('prettier');
const stripIndent = require('common-tags/lib/stripIndent');

const docsifyPATH = '../../lib/docsify.js'; // JSDOM
const docsifyURL = '/lib/docsify.js'; // Playwright
const isJSDOM = 'window' in global;
const isPlaywright = 'page' in global;

jest.setTimeout(35_000);
if (isPlaywright) {
  page.setDefaultNavigationTimeout(30_000);
  page.setDefaultTimeout(30_000);
}

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
 * @param {Boolean|Object|String} [options._logHTML] Logs HTML to console after initialization. Accepts CSS selector.
 * @param {Boolean} [options._logHTML.format=true] Formats HTML output
 * @param {String} [options._logHTML.selector='html'] CSS selector(s) to match and log HTML for
 * @returns {Promise<() => Promise<void>>}
 */
async function docsifyInit(options = {}) {
  const defaults = {
    config: {
      basePath: TEST_HOST,
      el: '#app',
      plugins: [
        /**
         * This plugin increments a `data-render-count="N"` attribute on the
         * `<body>` element after each markdown page render. F.e.
         * `data-render-count="1"`, `data-render-count="2"`, etc.
         *
         * The very first render from calling docsifyInit() will result in a
         * value of 1. Each following render (f.e. from clicking a link) will
         * increment once rendering of the new page is finished.
         *
         * We do this so that we can easily wait for a render to finish before
         * testing the state of the render result, or else we'll have flaky
         * tests (a "race condition").
         */
        function RenderCountPlugin(hook) {
          hook.init(() => {
            document.body.dataset.renderCount = 0;
          });

          hook.doneEach(() => {
            document.body.dataset.renderCount++;
          });
        },
      ],
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
    styleURLs: [],
    testURL: `${TEST_HOST}/docsify-init.html`,
    waitForSelector: '#main > *',
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

      const updateBasePath = config => {
        if (config.basePath) {
          config.basePath = new URL(config.basePath, TEST_HOST).href;
        }
      };

      // Config as function
      if (typeof options.config === 'function') {
        return function(vm) {
          const outsideConfig = options.config(vm);
          const config = {
            ...sharedConfig,
            ...outsideConfig,
            plugins: [
              ...sharedConfig.plugins,
              ...(outsideConfig?.plugins ?? []),
            ],
          };

          updateBasePath(config);

          return config;
        };
      }
      // Config as object
      else {
        const outsideConfig = options.config;
        const config = {
          ...sharedConfig,
          ...outsideConfig,
          plugins: [...sharedConfig.plugins, ...(outsideConfig?.plugins ?? [])],
        };

        updateBasePath(config);

        return config;
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
        ['README.md']: settings.markdown.homepage,
        ['_coverpage.md']: settings.markdown.coverpage,
        ['_navbar.md']: settings.markdown.navbar,
        ['_sidebar.md']: settings.markdown.sidebar,
      };

      const finalRoutes = Object.fromEntries(
        Object.entries({
          ...helperRoutes,
          ...options.routes,
        })
          // Remove items with falsey responseText
          .filter(([url, responseText]) => url && responseText)
          .map(([url, responseText]) => [
            // Convert relative to absolute URL
            new URL(url, settings.config.basePath || TEST_HOST).href,
            // Strip indentation from responseText
            stripIndent`${responseText}`,
          ])
      );

      return finalRoutes;
    },
    // Merge scripts and remove duplicates
    scriptURLs: []
      .concat(options.scriptURLs || '')
      .filter(url => url)
      .map(url => new URL(url, TEST_HOST).href),
    styleURLs: []
      .concat(options.styleURLs || '')
      .filter(url => url)
      .map(url => new URL(url, TEST_HOST).href),
  };

  // Routes
  const contentTypes = {
    css: 'text/css',
    html: 'text/html',
    js: 'application/javascript',
    json: 'application/json',
    md: 'text/markdown',
  };
  const reFileExtentionFromURL = new RegExp(
    '(?:.)(' + Object.keys(contentTypes).join('|') + ')(?:[?#].*)?$',
    'i'
  );

  if (isJSDOM) {
    // Replace the global XMLHttpRequest object
    mock.setup();
  }

  for (let [urlGlob, response] of Object.entries(settings.routes)) {
    const fileExtension = (urlGlob.match(reFileExtentionFromURL) || [])[1];
    const contentType = contentTypes[fileExtension];

    if (typeof response === 'string') {
      response = {
        status: 200,
        body: response,
      };
    }

    // Specifying contentType required for Webkit
    response.contentType = response.contentType || contentType || '';

    if (isJSDOM) {
      mock.get(urlGlob, (req, res) => {
        return res
          .status(response.status)
          .body(settings.routes[urlGlob])
          .header('Content-Type', contentType);
      });
    } else {
      await page.route(urlGlob, route => route.fulfill(response));
    }
  }

  if (isJSDOM) {
    // Proxy unhandled requests to real server(s)
    mock.use(proxy);
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
    // Convert config functions to strings
    const configString = JSON.stringify(settings.config, (key, val) =>
      typeof val === 'function' ? `__FN__${val.toString()}` : val
    );

    await page.evaluate(config => {
      // Restore config functions from strings
      const configObj = JSON.parse(config, (key, val) =>
        /^__FN__/.test(val)
          ? new Function(`return ${val.split('__FN__')[1]}`)()
          : val
      );

      window.$docsify = configObj;
    }, configString);
  }

  // Style URLs
  if (isJSDOM) {
    for (const url of settings.styleURLs) {
      const linkElm = document.createElement('link');

      linkElm.setAttribute('rel', 'stylesheet');
      linkElm.setAttribute('type', 'text/css');
      linkElm.setAttribute('href', url);
      document.head.appendChild(linkElm);
    }
  } else if (isPlaywright) {
    await Promise.all(settings.styleURLs.map(url => page.addStyleTag({ url })));
  }

  // JavaScript URLs
  if (isJSDOM) {
    for (const url of settings.scriptURLs) {
      const responseText = settings.routes[url] || (await axios.get(url)).data;
      const scriptElm = document.createElement('script');

      scriptElm.setAttribute('data-src', url);
      scriptElm.textContent = stripIndent`${responseText}`;
      document.head.appendChild(scriptElm);
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
      const scriptElm = document.createElement('script');

      scriptElm.textContent = stripIndent`${settings.script}`;
      document.head.appendChild(scriptElm);
    } else if (isPlaywright) {
      await page.addScriptTag({ content: settings.script });
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
    const selector =
      typeof settings._logHTML === 'string'
        ? settings._logHTML
        : settings._logHTML.selector;

    let htmlArr = [];

    if (selector) {
      if (isJSDOM) {
        htmlArr = [...document.querySelectorAll(selector)].map(
          elm => elm.outerHTML
        );
      } else {
        htmlArr = await page.$$eval(selector, elms =>
          elms.map(e => e.outerHTML)
        );
      }
    } else {
      htmlArr = [
        isJSDOM ? document.documentElement.outerHTML : await page.content(),
      ];
    }

    if (htmlArr.length) {
      htmlArr.forEach(html => {
        if (settings._logHTML.format !== false) {
          html = prettier.format(html, { parser: 'html' });
        }

        // eslint-disable-next-line no-console
        console.log(html);
      });
    } else {
      // eslint-disable-next-line no-console
      console.warn(`docsify-init(): unable to match selector '${selector}'`);
    }
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

  // We must use a separate renderCount variable outside of the
  // RenderCountPlugin, because the plugin runs in scope of the Playwright
  // browser context, not in scope of this file. We can't read
  // `document.body.renderCount` directly here.
  let renderCount = 0;

  /**
   * Call this function to wait for the render to finish any time you perform an
   * action that changes Docsify's route and causes a new markdown page to
   * render.
   *
   * This is needed only for e2e tests that run in playwright (so far, at least).
   *
   * We use page.waitForSelector here to wait for each render or else there is a
   * race condition where we will try to observe the state of the page between
   * clicking a link and when the new content is actually updated.
   */
  async function onceRendered() {
    // This function is only for playwright tests.
    if (isJSDOM) {
      return;
    }

    // Initial case: For the first render, there is a bug
    // (https://github.com/docsifyjs/docsify/issues/1732) that sometimes causes
    // doneEach to render twice.
    if (renderCount === 0) {
      renderCount = await Promise.race([
        page.waitForSelector(`body[data-render-count="1"]`).then(() => 1),
        page.waitForSelector(`body[data-render-count="2"]`).then(() => 2),
      ]);
    }
    // Successive cases after first render: doneEach fires once like
    // normal (so far).
    else {
      renderCount++;
      try {
        await page.waitForSelector(`body[data-render-count="${renderCount}"]`);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(
          'Render counting failed because doneEach fired an unexpected number of times (more than once). If this happens, please note this in issue https://github.com/docsifyjs/docsify/issues/1732'
        );
      }
    }
  }

  // Wait for the initial render.
  await onceRendered();

  // Now all tests need to call this any time they change Docsify navagtion
  // (f.e. clicking a link) to wait for render.
  return onceRendered;
}

module.exports = docsifyInit;
