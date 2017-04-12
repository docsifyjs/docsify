this.D = this.D || {};
(function () {
'use strict';

function handleExternalScript () {
  var container = Docsify.dom.getNode('#main');
  var scripts = Docsify.dom.findAll(container, 'script');

  var loop = function ( i ) {
    var script = scripts[i];

    if (script && script.src) {
      var newScript = document.createElement('script');['src', 'async', 'defer'].forEach(function (attribute) {
        newScript[attribute] = script[attribute];
      });

      script.parentNode.insertBefore(newScript, script);
      script.parentNode.removeChild(script);
    }
  };

  for (var i = scripts.length; i--;) loop( i );
}

var install = function (hook) {
  hook.doneEach(handleExternalScript);
};

window.$docsify.plugins = [].concat(install, window.$docsify.plugins);

}());
