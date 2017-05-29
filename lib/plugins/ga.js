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
  var ga = window.ga;

  if (!ga) {
    appendScript();
    ga = ga || function () {
      (ga.q = ga.q || []).push(arguments);
    };
    ga.l = Number(new Date());
    ga('create', id, 'auto');
  }
  return ga
}

function collect () {
  var ga = init($docsify.ga);

  ga('set', 'page', location.hash);
  ga('send', 'pageview');
}

var install = function (hook) {
  if (!$docsify.ga) {
    console.error('[Docsify] ga is required.');
    return
  }

  hook.beforeEach(collect);
};

$docsify.plugins = [].concat(install, $docsify.plugins);

}());
