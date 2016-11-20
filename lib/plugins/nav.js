(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Docsify = global.Docsify || {}, global.Docsify.Nav = factory());
}(this, (function () { 'use strict';

var Nav = function () {
  console.log(this);
};
Nav.name = 'Doscify.Nav';

if (window.Docsify) {
  window.Docsify.use(Nav);
}

return Nav;

})));
