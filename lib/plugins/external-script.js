this.D = this.D || {};
(function () {
'use strict';

var scriptReg = /<script[^>]*src=["|'](.*)["|']>[^\w]*<\/script>/;
var asyncReg = /<script[^>]*\s+async/;
var deferReg = /<script[^>]*\s+defer/;

function handleExternalScript (html) {
  var scriptMatch = html.match(scriptReg);

  if (scriptMatch && scriptMatch.length > 1) {
    var script = document.createElement('script');
    script.src = scriptMatch[1];

    if (asyncReg.test(scriptMatch[0])) { script.setAttribute('async', ''); }
    if (deferReg.test(scriptMatch[0])) { script.setAttribute('defer', ''); }

    var target = document.querySelector('#main');
    target.appendChild(script);
  }
}

var install = function (hook) {
  hook.afterEach(handleExternalScript);
};

window.$docsify.plugins = [].concat(install, window.$docsify.plugins);

}());
