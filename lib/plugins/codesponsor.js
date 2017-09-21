(function () {
'use strict';

var DEFAULT_OPTIONS = {
  theme: 'light',
  image: 'show'
};

function tpl (id, options) {
  var qs = [];

  for (var key in options) {
    qs.push((key + "=" + (options[key])));
  }

  var div = Docsify.dom.create('div');

  Docsify.dom.toggleClass(div, 'codesponsor');
  div.innerHTML = "<iframe\n      scrolling=0\n      frameborder=0\n      width=250\n      height=250\n      id=\"code-sponsor-embed-iframe\"\n      src=\"https://app.codesponsor.io/widgets/" + id + "?" + (qs.join('&')) + "\">\n    </iframe>";

  return div
}

function appIframe (id, opts) {
  var html = tpl(id, opts);

  Docsify.dom.before(Docsify.dom.find('section.content'), html);
}

function appendStyle () {
  Docsify.dom.style("\n    .codesponsor {\n      position: relative;\n      float: right;\n      right: 10px;\n      top: 10px;\n    }\n\n    @media screen and (min-width: 1600px) {\n      body.sticky .codesponsor {\n        position: fixed;\n      }\n\n      .codesponsor {\n        position: absolute;\n        bottom: 10px;\n        top: auto;\n        float: none;\n      }\n    }\n  ");
}

var install = function (hook, vm) {
  var config = vm.config.codesponsor;
  var id;

  if (typeof config === 'string') {
    id = config;
    config = {};
  } else {
    id = config.id;
  }

  var opts = Docsify.util.merge(DEFAULT_OPTIONS, config);

  if (!id) {
    throw Error('codesponsor plugin need id')
  }

  if (Docsify.util.isMobile) {
    return
  }

  // Append style
  hook.ready(function () {
    appendStyle();
    appIframe(id, opts);
  });
};

window.$docsify.plugins = [].concat(install, window.$docsify.plugins);

}());
