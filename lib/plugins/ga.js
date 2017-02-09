this.D = this.D || {};
this.D.GA = (function () {
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
  window.ga('set', 'page', location.href);
  window.ga('send', 'pageview');
}

var install = function () {
  if (!window.Docsify || !window.Docsify.installed) {
    console.error('[Docsify] Please load docsify.js first.');
    return
  }

  if (!window.$docsify.ga) {
    console.error('[Docsify] ga is required.');
    return
  }

  collect();
  window.$docsify.plugins = [].concat(window.$docsify.plugins, collect);
};

var ga = install();

return ga;

}());
