(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('marked'), require('prismjs')) :
  typeof define === 'function' && define.amd ? define(['marked', 'prismjs'], factory) :
  (global.Docsify = factory(global.marked,global.Prism));
}(this, (function (marked,Prism) { 'use strict';

marked = 'default' in marked ? marked['default'] : marked;
Prism = 'default' in Prism ? Prism['default'] : Prism;

var ajax = function (url, options) {
  if ( options === void 0 ) options = {};

  var xhr = new XMLHttpRequest();

  xhr.open(options.method || 'get', url);
  xhr.send();

  return {
    then: function (cb) { return xhr.addEventListener('load', cb); }
  }
};

var renderer = new marked.Renderer();

/**
 * render anchor tag
 * @link https://github.com/chjj/marked#overriding-renderer-methods
 */
renderer.heading = function (text, level) {
  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return '<h' + level + '><a name="' + escapedText + '" class="anchor" href="#' +
     escapedText + '"><span class="header-link"></span></a>' + text +
     '</h' + level + '>'
};

marked.setOptions({
  highlight: function highlight (code, lang) {
    return Prism.highlight(code, Prism.languages[lang])
  }
});

var render = function (content) {
  return marked(content, { renderer: renderer })
};

var Docsify = function Docsify (opts) {
  if ( opts === void 0 ) opts = {};

  Docsify.installed = true;

  this.dom = document.querySelector(opts.el || 'body');
  this.loc = document.location.pathname;
  this.loc = this.loc === '/' ? 'README' : this.loc;
  this.load();
};

Docsify.prototype.load = function load () {
    var this$1 = this;

  ajax(((this.loc) + ".md")).then(function (res) {
    var target = res.target;
    if (target.status >= 400) {
      this$1.render('not found');
    } else {
      this$1.render(res.target.response);
    }
  });
};

Docsify.prototype.render = function render$1 (content) {
  this.dom.innerHTML = render(content);
};

window.addEventListener('load', function () {
  if (Docsify.installed) { return }
  new Docsify();
});

return Docsify;

})));
