import { waitForSelector } from './wait-for-selector';
import doMockAjax from './do-mock-ajax.js';

const prettier = require('prettier');
const stripIndent = require('common-tags/lib/stripIndent');

/**
 * Jest+JSDOM helper for dynamically creating custom docsify sites.
 *
 * @param {Object} options options object
 * @param {Function|Object} [options.config] docsify configuration (merged with default)
 * @param {String} [options.html] HTML content set using documentElement.innerHTML
 * @param {Object} [options.markdown] Docsify markdown content
 * @param {String} [options.markdown.coverpage] coverpage markdown
 * @param {String} [options.markdown.homepage] homepage markdown
 * @param {String} [options.markdown.navbar] navbar markdown
 * @param {String} [options.markdown.sidebar] sidebar markdown
 * @param {Object} [options.routes] custom routes as { path: response }
 * @param {String} [options.script] JS to inject via <script> tag
 * @param {string|String[]} [options.scriptURLs] External JS to inject via <script src="..."> tag(s)
 * @param {String} [options.style] CSS to inject via <style> tag
 * @param {string|String[]} [options.styleURLs=['/lib/themes/vue.css']] External CSS to inject via <link rel="stylesheet"> tag(s)
 * @param {String} [options.url] URL to set as window.location.href
 * @param {String} [options.waitForSelector='#main'] Element to wait for before returning promsie
 * @param {Boolean} [options._logHTML] Logs formatted HTML to console after initialization
 * @returns {Promise} Promise object represents the sum of a and b
 */
async function docsifyInit(options = {}) {
  const defaults = {
    config: {
      el: '#app',
    },
    html: stripIndent`
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
    styleURLs: ['/lib/themes/vue.css'],
    url: TEST_URL,
    waitForSelector: '#main',
  };
  const settings = {
    ...defaults,
    ...options,
    get config() {
      const sharedConfig = {
        ...defaults.config,
        coverpage: Boolean(settings.markdown.coverpage),
        loadNavbar: Boolean(settings.markdown.navbar),
        loadSidebar: Boolean(settings.markdown.sidebar),
      };

      // Config function
      if (typeof options.config === 'function') {
        return function(vm) {
          return {
            ...sharedConfig,
            ...options.config(vm),
          };
        };
      }
      // Config object
      else {
        return {
          ...sharedConfig,
          ...options.config,
        };
      }
    },
    markdown: {
      ...defaults.markdown,
      ...options.markdown,
    },
    get routes() {
      return {
        'README.md': settings.markdown.homepage,
        '_coverpage.md': settings.markdown.coverpage,
        '_navbar.md': settings.markdown.navbar,
        '_sidebar.md': settings.markdown.sidebar,
        ...options.routes,
      };
    },
  };

  // Convert settings to Arrays if necessary
  ['scriptURLs', 'styleURLs'].forEach(key => {
    if (!Array.isArray(settings[key])) {
      settings[key] = [settings[key]];
    }
  });

  // Routes (mock docsify ajax lib)
  doMockAjax(settings.routes);

  // Set window title and URL
  window.history.pushState({}, 'docsify', settings.url);

  // Set document HTML
  document.documentElement.innerHTML = settings.html;

  // Docsify configuration
  window.$docsify = settings.config;

  // Style URLs
  for (const styleURL of settings.styleURLs) {
    const html = `<link rel="stylesheet" type="text/css" href="${styleURL}">`;

    document.head.insertAdjacentHTML('beforeend', html);
  }
  // Style
  if (settings.style) {
    const headElm = document.querySelector('head');
    const styleElm = document.createElement('style');

    styleElm.textContent = stripIndent`${settings.style}`;
    headElm.appendChild(styleElm);
  }

  // JavaScript URLs
  for (const scriptURL of settings.scriptURLs) {
    const html = `<script src="${scriptURL}"></script>`;

    document.body.insertAdjacentHTML('beforeend', html);
  }
  // JavaScript
  if (settings.script) {
    const bodyElm = document.querySelector('body');
    const scriptElm = document.createElement('script');

    scriptElm.textContent = stripIndent`${settings.script}`;
    bodyElm.appendChild(scriptElm);
  }

  // Initialize docsify
  require('../../../src/core');

  // Docsify "Ready"
  await waitForSelector(settings.waitForSelector);

  if (settings._logHTML) {
    // eslint-disable-next-line no-console
    console.log(
      prettier.format(document.documentElement.innerHTML, { parser: 'html' })
    );
  }

  // Return promise
  return Promise.resolve();
}

export default docsifyInit;
