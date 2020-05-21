/* eslint-disable no-global-assign */
// Load ES6 modules in Node.js on the fly
require = require('esm')(
  module /* , options */
); /* eslint-disable-line no-global-assign */

const path = require('path');
const { expect } = require('chai');

const { JSDOM } = require('jsdom');

function ready(callback) {
  const state = document.readyState;

  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0);
  }

  document.addEventListener('DOMContentLoaded', callback);
}

module.exports.initJSDOM = initJSDOM;
function initJSDOM(markup = '') {
  const dom = new JSDOM(markup);

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.location = dom.window.location;
  global.XMLHttpRequest = dom.window.XMLHttpRequest;

  return dom;
}

module.exports.init = function(
  fixture = 'default',
  config = {},
  markup = null
) {
  if (markup === null || markup === undefined) {
    markup = `<!DOCTYPE html>
		<html>
		  <head></head>
		  <body>
		  	<div id="app"></div>
		  	<script>
		  		window.$docsify = ${JSON.stringify(config, null, 2)}
		  	</script>
		  </body>
		</html>`;
  }

  const rootPath = path.join(__dirname, 'fixtures', fixture);

  const dom = initJSDOM(markup);
  dom.reconfigure({ url: 'file:///' + rootPath });

  // Mimic src/core/index.js but for Node.js
  function Docsify() {
    this._init();
  }

  const proto = Docsify.prototype;

  const { initMixin } = require('../src/core/init');
  const { routerMixin } = require('../src/core//router');
  const { renderMixin } = require('../src/core//render');
  const { fetchMixin } = require('../src/core/fetch');
  const { eventMixin } = require('../src/core//event');

  initMixin(proto);
  routerMixin(proto);
  renderMixin(proto);
  fetchMixin(proto);
  eventMixin(proto);

  const NOT_INIT_PATTERN = '<!--main-->';

  return new Promise(resolve => {
    ready(() => {
      const docsify = new Docsify();
      // NOTE: I was not able to get it working with a callback, but polling works usually at the first time
      const id = setInterval(() => {
        if (
          dom.window.document.body.innerHTML.indexOf(NOT_INIT_PATTERN) === -1
        ) {
          clearInterval(id);
          return resolve({
            docsify: docsify,
            dom: dom,
          });
        }
      }, 10);
    });
  });
};

module.exports.expectSameDom = function(actual, expected) {
  const WHITESPACES_BETWEEN_TAGS = />(\s\s+)</g;
  function replacer(match, group1) {
    return match.replace(group1, '');
  }

  expect(actual.replace(WHITESPACES_BETWEEN_TAGS, replacer).trim()).equal(
    expected.replace(WHITESPACES_BETWEEN_TAGS, replacer).trim()
  );
};
