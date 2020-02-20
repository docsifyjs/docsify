import { initMixin } from './init';
import { routerMixin } from './router';
import { renderMixin } from './render';
import { fetchMixin } from './fetch';
import { eventMixin } from './event';
import initGlobalAPI from './global-api';

/**
 * Fork https://github.com/bendrucker/document-ready/blob/master/index.js
 * @param {Function} callback The callbacack to be called when the page is loaded
 * @returns {Number|void} If the page is already laoded returns the result of the setTimeout callback,
 *  otherwise it only attaches the callback to the DOMContentLoaded event
 */
function ready(callback) {
  const state = document.readyState;

  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0);
  }

  document.addEventListener('DOMContentLoaded', callback);
}

function Docsify() {
  this._init();
}

const proto = Docsify.prototype;

initMixin(proto);
routerMixin(proto);
renderMixin(proto);
fetchMixin(proto);
eventMixin(proto);

/**
 * Global API
 */
initGlobalAPI();

/**
 * Run Docsify
 */
// eslint-disable-next-line no-unused-vars
ready(_ => new Docsify());
