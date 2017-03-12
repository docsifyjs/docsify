this.D = this.D || {};
(function () {
'use strict';

function handleExternalScript () {
  var container = Docsify.dom.getNode('#main');
  var script = Docsify.dom.find(container, 'script');

  if (script && script.src) {
    var newScript = document.createElement('script');['src', 'async', 'defer'].forEach(function (attribute) {
      newScript[attribute] = script[attribute];
    });

    script.parentNode.insertBefore(newScript, script);
    script.parentNode.removeChild(script);
  }
}

var install = function (hook) {
  hook.doneEach(handleExternalScript);
};

window.$docsify.plugins = [].concat(install, window.$docsify.plugins);

}());
