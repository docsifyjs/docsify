this.D = this.D || {};
(function () {
'use strict';

// From https://github.com/egoist/vue-ga/blob/master/src/index.js
function appendScript () {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.google-analytics.com/analytics.js';
  document.body.appendChild(script);
}

function init (id) {
  if (!window.ga) {
    appendScript();
    window.ga = window.ga || function () {
      (window.ga.q = window.ga.q || []).push(arguments);
    };
    window.ga.l = Number(new Date());
    window.ga('create', id, 'auto');
  }
}

function collect () {
  init(window.$docsify.ga);
  window.ga('set', 'page', location.hash);
  window.ga('send', 'pageview');
}

var install = function (hook) {
  if (!window.$docsify.ga) {
    console.error('[Docsify] ga is required.');
    return
  }

  hook.beforeEach(collect);
};

window.$docsify.plugins = [].concat(install, window.$docsify.plugins);

}());
