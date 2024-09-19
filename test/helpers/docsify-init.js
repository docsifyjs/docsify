/* globals page */
import _mock, { proxy } from 'xhr-mock';

import axios from 'axios';
import prettier from 'prettier';
import { stripIndent } from 'common-tags';
import { waitForSelector } from './wait-for.js';

const mock = _mock.default;
const docsifyPATH = '../../dist/docsify.js'; // JSDOM
const docsifyURL = '/dist/docsify.js'; // Playwright

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
 * @param {String|String[]} [options.styleURLs=['/dist/themes/core.css']] External CSS to inject via <link rel="stylesheet"> tag(s)
 * @param {String} [options.testURL] URL to set as window.location.href
 * @param {String} [options.waitForSelector='#main'] Element to wait for before returning promise
 * @param {Boolean|Object|String} [options._logHTML] Logs HTML to console after initialization. Accepts CSS selector.
 * @param {Boolean} [options._logHTML.format=true] Formats HTML output
 * @param {String} [options._logHTML.selector='html'] CSS selector(s) to match and log HTML for
 * @returns {Promise}
 */
async function docsifyInit(options = {}) {
  const isJSDOM = 'window' in global;
  const isPlaywright = 'page' in global;

  const defaults = {
    config: {
      basePath: process.env.TEST_HOST,
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
    styleURLs: [],
    testURL: `${process.env.TEST_HOST}/docsify-init.html`,
    waitForSelector: '#main > *:first-child',
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
          config.basePath = new URL(
            config.basePath,
            process.env.TEST_HOST,
          ).href;
        }
      };

      // Config as function
      if (typeof options.config === 'function') {
        return function (vm) {
          const config = { ...sharedConfig, ...options.config(vm) };

          updateBasePath(config);

          return config;
        };
      }
      // Config as object
      else {
        const config = { ...sharedConfig, ...options.config };

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
          .map(([key, markdown]) => [key, stripIndent`${markdown}`]),
      );
    },
    get routes() {
      const helperRoutes = {
        [settings.testURL]: stripIndent`${settings.html}`,
        'README.md': settings.markdown.homepage,
        '_coverpage.md': settings.markdown.coverpage,
        '_navbar.md': settings.markdown.navbar,
        '_sidebar.md': settings.markdown.sidebar,
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
            new URL(url, settings.config.basePath || process.env.TEST_HOST)
              .href,
            // Strip indentation from responseText
            stripIndent`${responseText}`,
          ]),
      );

      return finalRoutes;
    },
    // Merge scripts and remove duplicates
    scriptURLs: []
      .concat(options.scriptURLs || '')
      .filter(url => url)
      .map(url => new URL(url, process.env.TEST_HOST).href),
    styleURLs: []
      .concat(options.styleURLs || '')
      .filter(url => url)
      .map(url => new URL(url, process.env.TEST_HOST).href),
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
    'i',
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
      typeof val === 'function' ? `__FN__${val.toString()}` : val,
    );

    await page.evaluate(config => {
      // Restore config functions from strings
      const configObj = JSON.parse(config, (key, val) => {
        if (/^__FN__/.test(val)) {
          let source = val.split('__FN__')[1];

          // f.e. `foo() {}` or `'bar!?'() {}` without the `function ` prefix
          const isConcise =
            !source.includes('function') && !source.includes('=>');

          if (isConcise) {
            source = `{ ${source} }`;
          } else {
            source = `{ _: ${source} }`;
          }

          return new Function(/* js */ `
            const o = ${source}
            const keys = Object.keys(o)
            return o[keys[0]]
          `)();
        } else {
          return val;
        }
      });

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
      await import(docsifyPATH);
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
      await page.evaluate(
        data => {
          const headElm = document.querySelector('head');
          const styleElm = document.createElement('style');

          styleElm.textContent = data;
          headElm.appendChild(styleElm);
        },
        stripIndent`${settings.style}`,
      );
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
    // await page.waitForSelector(settings.waitForSelector);
    await page.locator(settings.waitForSelector).waitFor();
    await page.waitForLoadState('load');
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
          elm => elm.outerHTML,
        );
      } else {
        htmlArr = await page.evaluateAll(selector, elms =>
          elms.map(e => e.outerHTML),
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

        console.log(html);
      });
    } else {
      console.warn(`docsify-init(): unable to match selector '${selector}'`);
    }
  }

  return Promise.resolve();
}

export default docsifyInit;
