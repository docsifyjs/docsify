(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var zoomImage = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  module.exports = factory();
}(commonjsGlobal, (function () { 'use strict';

var windowWidth = function () { return document.documentElement.clientWidth; };
var windowHeight = function () { return document.documentElement.clientHeight; };

var elemOffset = function (elem) {
  var rect = elem.getBoundingClientRect();
  var docElem = document.documentElement;
  var win = window;
  return {
    top: rect.top + win.pageYOffset - docElem.clientTop,
    left: rect.left + win.pageXOffset - docElem.clientLeft
  }
};

var once = function (elem, type, handler) {
  var fn = function (e) {
    e.target.removeEventListener(type, fn);
    handler();
  };
  elem.addEventListener(type, fn);
};

var Size = function Size(w, h) {
  this.w = w;
  this.h = h;
};

var ZoomImage = function ZoomImage(img, offset) {
  this.img = img;
  this.preservedTransform = img.style.transform;
  this.wrap = null;
  this.overlay = null;
  this.offset = offset;
};

ZoomImage.prototype.forceRepaint = function forceRepaint () {
  var _ = this.img.offsetWidth;
  return
};

ZoomImage.prototype.zoom = function zoom () {
  var size = new Size(this.img.naturalWidth, this.img.naturalHeight);

  this.wrap = document.createElement('div');
  this.wrap.classList.add('zoom-img-wrap');
  this.img.parentNode.insertBefore(this.wrap, this.img);
  this.wrap.appendChild(this.img);

  this.img.classList.add('zoom-img');
  this.img.setAttribute('data-action', 'zoom-out');

  this.overlay = document.createElement('div');
  this.overlay.classList.add('zoom-overlay');
  document.body.appendChild(this.overlay);

  this.forceRepaint();
  var scale = this.calculateScale(size);

  this.forceRepaint();
  this.animate(scale);

  document.body.classList.add('zoom-overlay-open');
};

ZoomImage.prototype.calculateScale = function calculateScale (size) {
  var maxScaleFactor = size.w / this.img.width;

  var viewportWidth = (windowWidth() - this.offset);
  var viewportHeight = (windowHeight() - this.offset);
  var imageAspectRatio = size.w / size.h;
  var viewportAspectRatio = viewportWidth / viewportHeight;

  if (size.w < viewportWidth && size.h < viewportHeight) {
    return maxScaleFactor
  } else if (imageAspectRatio < viewportAspectRatio) {
    return (viewportHeight / size.h) * maxScaleFactor
  }
  return (viewportWidth / size.w) * maxScaleFactor
};

ZoomImage.prototype.animate = function animate (scale) {
  var imageOffset = elemOffset(this.img);
  var scrollTop = window.pageYOffset;

  var viewportX = (windowWidth() / 2);
  var viewportY = scrollTop + (windowHeight() / 2);

  var imageCenterX = imageOffset.left + (this.img.width / 2);
  var imageCenterY = imageOffset.top + (this.img.height / 2);

  var tx = viewportX - imageCenterX;
  var ty = viewportY - imageCenterY;
  var tz = 0;

  var imgTr = "scale(" + scale + ")";
  var wrapTr = "translate3d(" + tx + "px, " + ty + "px, " + tz + "px)";

  this.img.style.transform = imgTr;
  this.wrap.style.transform = wrapTr;
};

ZoomImage.prototype.dispose = function dispose () {
  if (this.wrap === null || this.wrap.parentNode === null) {
    return
  }
  this.img.classList.remove('zoom-img');
  this.img.setAttribute('data-action', 'zoom');

  this.wrap.parentNode.insertBefore(this.img, this.wrap);
  this.wrap.parentNode.removeChild(this.wrap);

  document.body.removeChild(this.overlay);
  document.body.classList.remove('zoom-overlay-transitioning');
};

ZoomImage.prototype.close = function close () {
    var this$1 = this;

  document.body.classList.add('zoom-overlay-transitioning');
  this.img.style.transform = this.preservedTransform;
  if (this.img.style.length === 0) {
    this.img.removeAttribute('style');
  }
  this.wrap.style.transform = 'none';

  once(this.img, 'transitionend', function () {
    this$1.dispose();
    // remove class should happen after dispose. Otherwise,
    // a new click event could fire and create a duplicate ZoomImage for
    // the same <img> element.
    document.body.classList.remove('zoom-overlay-open');
  });
};

/**
 * Pure JavaScript implementation of zoom.js.
 *
 * Original preamble:
 * zoom.js - It's the best way to zoom an image
 * @version v0.0.2
 * @link https://github.com/fat/zoom.js
 * @license MIT
 *
 * Needs a related CSS file to work. See the README at
 * https://github.com/nishanths/zoom.js for more info.
 *
 * This is a fork of the original zoom.js implementation by @fat.
 * Copyrights for the original project are held by @fat. All other copyright
 * for changes in the fork are held by Nishanth Shanmugham.
 *
 * Copyright (c) 2013 @fat
 * The MIT License. Copyright © 2016 Nishanth Shanmugham.
 */

var current = null;
var offset = 80;
var initialScrollPos = -1;
var initialTouchPos = -1;

function handleScroll() {
  if (initialScrollPos === -1) {
    initialScrollPos = window.pageYOffset;
  }

  var deltaY = Math.abs(initialScrollPos - window.pageYOffset);
  if (deltaY >= 40) {
    closeCurrent();
  }
}

function handleKeyup(e) {
  if (e.keyCode === 27) {
    closeCurrent();
  }
}

function handleTouchStart(e) {
  var t = e.touches[0];
  if (t === null) {
    return
  }

  initialTouchPos = t.pageY;
  e.target.addEventListener('touchmove', handleTouchMove);
}

function handleTouchMove(e) {
  var t = e.touches[0];
  if (t === null) {
    return
  }

  if (Math.abs(t.pageY - initialTouchPos) > 10) {
    closeCurrent();
    e.target.removeEventListener('touchmove', handleTouchMove);
  }
}

function handleClick() {
  closeCurrent();
}

function addCloseListeners() {
  document.addEventListener('scroll', handleScroll);
  document.addEventListener('keyup', handleKeyup);
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('click', handleClick, true);
}

function removeCloseListeners() {
  document.removeEventListener('scroll', handleScroll);
  document.removeEventListener('keyup', handleKeyup);
  document.removeEventListener('touchstart', handleTouchStart);
  document.removeEventListener('click', handleClick, true);
}

function closeCurrent(force) {
  if (current === null) {
    return
  }
  if (force) {
    current.dispose();
  } else {
    current.close();
  }
  removeCloseListeners();
  current = null;
}

function prepareZoom(e) {
  if (document.body.classList.contains('zoom-overlay-open')) {
    return
  }

  if (e.metaKey || e.ctrlKey) {
    window.open((e.target.getAttribute('data-original') || e.target.src), '_blank');
    return
  }

  if (e.target.width >= windowWidth() - offset) {
    return
  }

  closeCurrent(true);

  current = new ZoomImage(e.target, offset);
  current.zoom();

  addCloseListeners();
}

var zoom = function (el) {
  el.setAttribute('data-action', 'zoom');
  el.addEventListener('click', prepareZoom);
  return function () { return el.removeEventListener('click', prepareZoom); }
};

return zoom;

})));
});

var style = "img[data-action=\"zoom\"] {\n  cursor: pointer;\n  cursor: -webkit-zoom-in;\n  cursor: zoom-in;\n}\n.zoom-img,\n.zoom-img-wrap {\n  position: relative;\n  z-index: 666;\n  transition: -webkit-transform 300ms cubic-bezier(.2,0,.2,1);\n  transition: transform 300ms cubic-bezier(.2,0,.2,1);\n  transition: transform 300ms cubic-bezier(.2,0,.2,1), -webkit-transform 300ms cubic-bezier(.2,0,.2,1);\n}\n.zoom-overlay {\n  z-index: 420;\n  background: #fff;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 300ms;\n}\n.zoom-overlay-open .zoom-overlay {\n  opacity: 1;\n}\n.zoom-overlay-open {\n  cursor: pointer;\n  cursor: -webkit-zoom-out;\n  cursor: zoom-out;\n}\n.zoom-overlay-transitioning {\n  cursor: default;\n}\n.zoom-overlay-open.zoom-overlay-transitioning .zoom-overlay{\n  opacity: 0;\n}\n";

function install (hook) {
  var dom = Docsify.dom;
  var destroys;

  // add style
  dom.appendTo(dom.head, dom.create('style', style));

  hook.doneEach(function (_) {
    var images = dom.findAll('img:not(.emoji)');

    if (Array.isArray(destroys) && destroys.length) {
      destroys.forEach(function (o) { return o(); });
      destroys = [];
    }

    destroys = images.map(zoomImage);
  });
}

$docsify.plugins = [].concat(install, $docsify.plugins);

}());
