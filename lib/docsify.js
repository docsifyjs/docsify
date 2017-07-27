(function () {
'use strict';

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  }
}

/**
 * Hyphenate a camelCase string.
 */
var hyphenate = cached(function (str) {
  return str.replace(/([A-Z])/g, function (m) { return '-' + m.toLowerCase(); })
});

/**
 * Simple Object.assign polyfill
 */
var merge = Object.assign || function (to) {
  var arguments$1 = arguments;

  var hasOwn = Object.prototype.hasOwnProperty;

  for (var i = 1; i < arguments.length; i++) {
    var from = Object(arguments$1[i]);

    for (var key in from) {
      if (hasOwn.call(from, key)) {
        to[key] = from[key];
      }
    }
  }

  return to
};

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Check if value is function
 */
function isFn (obj) {
  return typeof obj === 'function'
}

var config = merge({
  el: '#app',
  repo: '',
  maxLevel: 6,
  subMaxLevel: 0,
  loadSidebar: null,
  loadNavbar: null,
  homepage: 'README.md',
  coverpage: '',
  basePath: '',
  auto2top: false,
  name: '',
  themeColor: '',
  nameLink: window.location.pathname,
  autoHeader: false,
  executeScript: null,
  noEmoji: false,
  ga: '',
  mergeNavbar: false,
  formatUpdated: '',
  externalLinkTarget: '_blank',
  routerModel: 'hash',
  noCompileLinks: []
}, window.$docsify);

var script = document.currentScript ||
  [].slice.call(document.getElementsByTagName('script'))
    .filter(function (n) { return /docsify\./.test(n.src); })[0];

if (script) {
  for (var prop in config) {
    var val = script.getAttribute('data-' + hyphenate(prop));

    if (isPrimitive(val)) {
      config[prop] = val === '' ? true : val;
    }
  }

  if (config.loadSidebar === true) { config.loadSidebar = '_sidebar.md'; }
  if (config.loadNavbar === true) { config.loadNavbar = '_navbar.md'; }
  if (config.coverpage === true) { config.coverpage = '_coverpage.md'; }
  if (config.repo === true) { config.repo = ''; }
  if (config.name === true) { config.name = ''; }
}

window.$docsify = config;

function initLifecycle (vm) {
  var hooks = [
    'init',
    'mounted',
    'beforeEach',
    'afterEach',
    'doneEach',
    'ready'
  ];

  vm._hooks = {};
  vm._lifecycle = {};
  hooks.forEach(function (hook) {
    var arr = vm._hooks[hook] = [];
    vm._lifecycle[hook] = function (fn) { return arr.push(fn); };
  });
}

function callHook (vm, hook, data, next) {
  if ( next === void 0 ) next = noop;

  var queue = vm._hooks[hook];

  var step = function (index) {
    var hook = queue[index];
    if (index >= queue.length) {
      next(data);
    } else {
      if (typeof hook === 'function') {
        if (hook.length === 2) {
          hook(data, function (result) {
            data = result;
            step(index + 1);
          });
        } else {
          var result = hook(data);
          data = result !== undefined ? result : data;
          step(index + 1);
        }
      } else {
        step(index + 1);
      }
    }
  };

  step(0);
}

var cacheNode = {};

/**
 * Get Node
 * @param  {String|Element} el
 * @param  {Boolean} noCache
 * @return {Element}
 */
function getNode (el, noCache) {
  if ( noCache === void 0 ) noCache = false;

  if (typeof el === 'string') {
    if (typeof window.Vue !== 'undefined') {
      return find(el)
    }
    el = noCache ? find(el) : (cacheNode[el] || (cacheNode[el] = find(el)));
  }

  return el
}

var $ = document;

var body = $.body;

var head = $.head;

/**
 * Find element
 * @example
 * find('nav') => document.querySelector('nav')
 * find(nav, 'a') => nav.querySelector('a')
 */
function find (el, node) {
  return node ? el.querySelector(node) : $.querySelector(el)
}

/**
 * Find all elements
 * @example
 * findAll('a') => [].slice.call(document.querySelectorAll('a'))
 * findAll(nav, 'a') => [].slice.call(nav.querySelectorAll('a'))
 */
function findAll (el, node) {
  return [].slice.call(node ? el.querySelectorAll(node) : $.querySelectorAll(el))
}

function create (node, tpl) {
  node = $.createElement(node);
  if (tpl) { node.innerHTML = tpl; }
  return node
}

function appendTo (target, el) {
  return target.appendChild(el)
}

function before (target, el) {
  return target.insertBefore(el, target.children[0])
}

function on (el, type, handler) {
  isFn(type)
    ? window.addEventListener(el, type)
    : el.addEventListener(type, handler);
}

function off (el, type, handler) {
  isFn(type)
    ? window.removeEventListener(el, type)
    : el.removeEventListener(type, handler);
}

/**
 * Toggle class
 *
 * @example
 * toggleClass(el, 'active') => el.classList.toggle('active')
 * toggleClass(el, 'add', 'active') => el.classList.add('active')
 */
function toggleClass (el, type, val) {
  el && el.classList[val ? type : 'toggle'](val || type);
}


var dom = Object.freeze({
	getNode: getNode,
	$: $,
	body: body,
	head: head,
	find: find,
	findAll: findAll,
	create: create,
	appendTo: appendTo,
	before: before,
	on: on,
	off: off,
	toggleClass: toggleClass
});

var inBrowser = typeof window !== 'undefined';

var isMobile = inBrowser && document.body.clientWidth <= 600;

/**
 * @see https://github.com/MoOx/pjax/blob/master/lib/is-supported.js
 */
var supportsPushState = inBrowser && (function () {
  // Borrowed wholesale from https://github.com/defunkt/jquery-pjax
  return window.history &&
    window.history.pushState &&
    window.history.replaceState &&
    // pushState isn’t reliable on iOS until 5.
    !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)
})();

/**
 * Render github corner
 * @param  {Object} data
 * @return {String}
 */
function corner (data) {
  if (!data) { return '' }
  if (!/\/\//.test(data)) { data = 'https://github.com/' + data; }
  data = data.replace(/^git\+/, '');

  return (
  "<a href=\"" + data + "\" class=\"github-corner\" aria-label=\"View source on Github\">" +
    '<svg viewBox="0 0 250 250" aria-hidden="true">' +
      '<path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>' +
      '<path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>' +
      '<path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>' +
    '</svg>' +
  '</a>')
}

/**
 * Render main content
 */
function main (config) {
  var aside = (
    '<button class="sidebar-toggle">' +
      '<div class="sidebar-toggle-button">' +
        '<span></span><span></span><span></span>' +
      '</div>' +
    '</button>' +
    '<aside class="sidebar">' +
      (config.name
        ? ("<h1><a class=\"app-name-link\" data-nosearch>" + (config.name) + "</a></h1>")
        : '') +
      '<div class="sidebar-nav"><!--sidebar--></div>' +
    '</aside>');

  return (isMobile ? (aside + "<main>") : ("<main>" + aside)) +
      '<section class="content">' +
        '<article class="markdown-section" id="main"><!--main--></article>' +
      '</section>' +
    '</main>'
}

/**
 * Cover Page
 */
function cover () {
  var SL = ', 100%, 85%';
  var bgc = 'linear-gradient(to left bottom, ' +
  "hsl(" + (Math.floor(Math.random() * 255) + SL) + ") 0%," +
  "hsl(" + (Math.floor(Math.random() * 255) + SL) + ") 100%)";

  return "<section class=\"cover\" style=\"background: " + bgc + "\">" +
    '<div class="cover-main"></div>' +
    '<div class="mask"></div>' +
  '</section>'
}

/**
 * Render tree
 * @param  {Array} tree
 * @param  {String} tpl
 * @return {String}
 */
function tree (toc, tpl) {
  if ( tpl === void 0 ) tpl = '';

  if (!toc || !toc.length) { return '' }

  toc.forEach(function (node) {
    tpl += "<li><a class=\"section-link\" href=\"" + (node.slug) + "\">" + (node.title) + "</a></li>";
    if (node.children) {
      tpl += "<li><ul class=\"children\">" + (tree(node.children)) + "</li></ul>";
    }
  });

  return tpl
}

function helper (className, content) {
  return ("<p class=\"" + className + "\">" + (content.slice(5).trim()) + "</p>")
}

function theme (color) {
  return ("<style>:root{--theme-color: " + color + ";}</style>")
}

var barEl;
var timeId;

/**
 * Init progress component
 */
function init () {
  var div = create('div');

  div.classList.add('progress');
  appendTo(body, div);
  barEl = div;
}
/**
 * Render progress bar
 */
var progressbar = function (ref) {
  var loaded = ref.loaded;
  var total = ref.total;
  var step = ref.step;

  var num;

  !barEl && init();

  if (step) {
    num = parseInt(barEl.style.width || 0, 10) + step;
    num = num > 80 ? 80 : num;
  } else {
    num = Math.floor(loaded / total * 100);
  }

  barEl.style.opacity = 1;
  barEl.style.width = num >= 95 ? '100%' : num + '%';

  if (num >= 95) {
    clearTimeout(timeId);
    timeId = setTimeout(function (_) {
      barEl.style.opacity = 0;
      barEl.style.width = '0%';
    }, 200);
  }
};

var cache = {};

/**
 * Simple ajax get
 * @param {string} url
 * @param {boolean} [hasBar=false] has progress bar
 * @return { then(resolve, reject), abort }
 */
function get (url, hasBar) {
  if ( hasBar === void 0 ) hasBar = false;

  var xhr = new XMLHttpRequest();
  var on = function () {
    xhr.addEventListener.apply(xhr, arguments);
  };
  var cached$$1 = cache[url];

  if (cached$$1) {
    return { then: function (cb) { return cb(cached$$1.content, cached$$1.opt); }, abort: noop }
  }

  xhr.open('GET', url);
  xhr.send();

  return {
    then: function (success, error) {
      if ( error === void 0 ) error = noop;

      if (hasBar) {
        var id = setInterval(function (_) { return progressbar({
          step: Math.floor(Math.random() * 5 + 1)
        }); }, 500);

        on('progress', progressbar);
        on('loadend', function (evt) {
          progressbar(evt);
          clearInterval(id);
        });
      }

      on('error', error);
      on('load', function (ref) {
        var target = ref.target;

        if (target.status >= 400) {
          error(target);
        } else {
          var result = cache[url] = {
            content: target.response,
            opt: {
              updatedAt: xhr.getResponseHeader('last-modified')
            }
          };

          success(result.content, result.opt);
        }
      });
    },
    abort: function (_) { return xhr.readyState !== 4 && xhr.abort(); }
  }
}

function replaceVar (block, color) {
  block.innerHTML = block.innerHTML
    .replace(/var\(\s*--theme-color.*?\)/g, color);
}

var cssVars = function (color) {
  // Variable support
  if (window.CSS &&
      window.CSS.supports &&
      window.CSS.supports('(--v:red)')) { return }

  var styleBlocks = findAll('style:not(.inserted),link');[].forEach.call(styleBlocks, function (block) {
    if (block.nodeName === 'STYLE') {
      replaceVar(block, color);
    } else if (block.nodeName === 'LINK') {
      var href = block.getAttribute('href');

      if (!/\.css$/.test(href)) { return }

      get(href).then(function (res) {
        var style = create('style', res);

        head.appendChild(style);
        replaceVar(style, color);
      });
    }
  });
};

var RGX = /([^{]*?)\w(?=\})/g;

var dict = {
	YYYY: 'getFullYear',
	YY: 'getYear',
	MM: function (d) {
		return d.getMonth() + 1;
	},
	DD: 'getDate',
	HH: 'getHours',
	mm: 'getMinutes',
	ss: 'getSeconds'
};

var tinydate = function (str) {
	var parts=[], offset=0;
	str.replace(RGX, function (key, _, idx) {
		// save preceding string
		parts.push(str.substring(offset, idx - 1));
		offset = idx += key.length + 1;
		// save function
		parts.push(function(d){
			return ('00' + (typeof dict[key]==='string' ? d[dict[key]]() : dict[key](d))).slice(-key.length);
		});
	});

	if (offset !== str.length) {
		parts.push(str.substring(offset));
	}

	return function (arg) {
		var out='', i=0, d=arg||new Date();
		for (; i<parts.length; i++) {
			out += (typeof parts[i]==='string') ? parts[i] : parts[i](d);
		}
		return out;
	};
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var marked = createCommonjsModule(function (module, exports) {
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var this$1 = this;

  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this$1.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this$1.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this$1.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this$1.tokens.push({
        type: 'code',
        text: !this$1.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this$1.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this$1.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this$1.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this$1.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this$1.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this$1.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this$1.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this$1.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this$1.token(cap, top, true);

      this$1.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this$1.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this$1.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this$1.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this$1.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this$1.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) { loose = next; }
        }

        this$1.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this$1.token(item, false, bq);

        this$1.tokens.push({
          type: 'list_item_end'
        });
      }

      this$1.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this$1.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: this$1.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this$1.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this$1.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this$1.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this$1.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this$1.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this$1.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this$1.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var this$1 = this;

  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this$1.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this$1.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this$1.mangle(cap[1].substring(7))
          : this$1.mangle(cap[1]);
        href = this$1.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this$1.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this$1.inLink && (cap = this$1.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this$1.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this$1.rules.tag.exec(src)) {
      if (!this$1.inLink && /^<a /i.test(cap[0])) {
        this$1.inLink = true;
      } else if (this$1.inLink && /^<\/a>/i.test(cap[0])) {
        this$1.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this$1.options.sanitize
        ? this$1.options.sanitizer
          ? this$1.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this$1.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.inLink = true;
      out += this$1.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this$1.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this$1.rules.reflink.exec(src))
        || (cap = this$1.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this$1.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this$1.inLink = true;
      out += this$1.outputLink(cap, link);
      this$1.inLink = false;
      continue;
    }

    // strong
    if (cap = this$1.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.strong(this$1.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this$1.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.em(this$1.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this$1.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this$1.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this$1.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.del(this$1.output(cap[1]));
      continue;
    }

    // text
    if (cap = this$1.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.text(escape(this$1.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) { return text; }
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) { return text; }
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  var this$1 = this;

  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this$1.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var this$1 = this;

  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this$1.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  var this$1 = this;

  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this$1.token.align[i] };
        cell += this$1.renderer.tablecell(
          this$1.inline.output(this$1.token.header[i]),
          { header: true, align: this$1.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this$1.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this$1.renderer.tablecell(
            this$1.inline.output(row[j]),
            { header: false, align: this$1.token.align[j] }
          );
        }

        body += this$1.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this$1.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this$1.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this$1.token.type === 'text'
          ? this$1.parseText()
          : this$1.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this$1.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities 
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') { return ':'; }
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) { return new RegExp(regex, opt); }
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var arguments$1 = arguments;

  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments$1[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) { return done(); }

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) { return done(err); }
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) { opt = merge({}, marked.defaults, opt); }
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

{
  module.exports = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : commonjsGlobal);
}());
});

var prism = createCommonjsModule(function (module) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					// Check for existence for IE8
					return o.map && o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				env.element.textContent = env.code;
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i=0, pos = 0; i<strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && p < to; ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						/*
						 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
						 */
						if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					}

					if (!match) {
						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}
 	// In worker
	_self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}, false);

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if ('object' !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof commonjsGlobal !== 'undefined') {
	commonjsGlobal.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/i,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if(Array.prototype.forEach) { // Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();
});

/**
 * gen toc tree
 * @link https://github.com/killercup/grock/blob/5280ae63e16c5739e9233d9009bc235ed7d79a50/styles/solarized/assets/js/behavior.coffee#L54-L81
 * @param  {Array} toc
 * @param  {Number} maxLevel
 * @return {Array}
 */
function genTree (toc, maxLevel) {
  var headlines = [];
  var last = {};

  toc.forEach(function (headline) {
    var level = headline.level || 1;
    var len = level - 1;

    if (level > maxLevel) { return }
    if (last[len]) {
      last[len].children = (last[len].children || []).concat(headline);
    } else {
      headlines.push(headline);
    }
    last[level] = headline;
  });

  return headlines
}

var cache$1 = {};
var re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,.\/:;<=>?@\[\]^`{|}~]/g;

function slugify (str) {
  if (typeof str !== 'string') { return '' }

  var slug = str.toLowerCase().trim()
    .replace(/<[^>\d]+>/g, '')
    .replace(re, '')
    .replace(/\s/g, '-')
    .replace(/-+/g, '-')
    .replace(/^(\d)/, '_$1');
  var count = cache$1[slug];

  count = cache$1.hasOwnProperty(slug) ? (count + 1) : 0;
  cache$1[slug] = count;

  if (count) {
    slug = slug + '-' + count;
  }

  return slug
}

slugify.clear = function () {
  cache$1 = {};
};

function replace (m, $1) {
  return '<img class="emoji" src="https://assets-cdn.github.com/images/icons/emoji/' + $1 + '.png" alt="' + $1 + '" />'
}

function emojify (text) {
  return text
    .replace(/<(pre|template|code)[^>]*?>[\s\S]+?<\/(pre|template|code)>/g, function (m) { return m.replace(/:/g, '__colon__'); })
    .replace(/:(\w+?):/ig, (inBrowser && window.emojify) || replace)
    .replace(/__colon__/g, ':')
}

var decode = decodeURIComponent;
var encode = encodeURIComponent;

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  // Simple parse
  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');

    res[parts[0]] = parts[1] && decode(parts[1]);
  });

  return res
}

function stringifyQuery (obj) {
  var qs = [];

  for (var key in obj) {
    qs.push(obj[key]
      ? ((encode(key)) + "=" + (encode(obj[key]))).toLowerCase()
      : encode(key));
  }

  return qs.length ? ("?" + (qs.join('&'))) : ''
}

function getPath () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return cleanPath(args.join('/'))
}

var isAbsolutePath = cached(function (path) {
  return /(:|(\/{2}))/g.test(path)
});

var getParentPath = cached(function (path) {
  return /\/$/g.test(path)
    ? path
    : (path = path.match(/(\S*\/)[^\/]+$/))
      ? path[1]
      : ''
});

var cleanPath = cached(function (path) {
  return path
    .replace(/^\/+/, '/')
    .replace(/([^:])\/{2,}/g, '$1/')
});

var cachedLinks = {};

var Compiler = function Compiler (config, router) {
  this.config = config;
  this.router = router;
  this.cacheTree = {};
  this.toc = [];
  this.linkTarget = config.externalLinkTarget || '_blank';
  this.contentBase = router.getBasePath();

  var renderer = this._initRenderer();
  var compile;
  var mdConf = config.markdown || {};

  if (isFn(mdConf)) {
    compile = mdConf(marked, renderer);
  } else {
    marked.setOptions(merge(mdConf, {
      renderer: merge(renderer, mdConf.renderer)
    }));
    compile = marked;
  }

  this.compile = cached(function (text) {
    var html = '';

    if (!text) { return text }

    html = compile(text);
    html = config.noEmoji ? html : emojify(html);
    slugify.clear();

    return html
  });
};

Compiler.prototype.matchNotCompileLink = function matchNotCompileLink (link) {
  var links = this.config.noCompileLinks;

  for (var i = 0; i < links.length; i++) {
    var n = links[i];
    var re = cachedLinks[n] || (cachedLinks[n] = new RegExp(("^" + n + "$")));

    if (re.test(link)) {
      return link
    }
  }
};

Compiler.prototype._initRenderer = function _initRenderer () {
  var renderer = new marked.Renderer();
  var ref = this;
    var linkTarget = ref.linkTarget;
    var router = ref.router;
    var contentBase = ref.contentBase;
  var _self = this;
  /**
   * render anchor tag
   * @link https://github.com/chjj/marked#overriding-renderer-methods
   */
  renderer.heading = function (text, level) {
    var nextToc = { level: level, title: text };

    if (/{docsify-ignore}/g.test(text)) {
      text = text.replace('{docsify-ignore}', '');
      nextToc.title = text;
      nextToc.ignoreSubHeading = true;
    }

    if (/{docsify-ignore-all}/g.test(text)) {
      text = text.replace('{docsify-ignore-all}', '');
      nextToc.title = text;
      nextToc.ignoreAllSubs = true;
    }

    var slug = slugify(text);
    var url = router.toURL(router.getCurrentPath(), { id: slug });
    nextToc.slug = url;
    _self.toc.push(nextToc);

    return ("<h" + level + " id=\"" + slug + "\"><a href=\"" + url + "\" data-id=\"" + slug + "\" class=\"anchor\"><span>" + text + "</span></a></h" + level + ">")
  };
  // highlight code
  renderer.code = function (code, lang) {
      if ( lang === void 0 ) lang = '';

    var hl = prism.highlight(code, prism.languages[lang] || prism.languages.markup);

    return ("<pre v-pre data-lang=\"" + lang + "\"><code class=\"lang-" + lang + "\">" + hl + "</code></pre>")
  };
  renderer.link = function (href, title, text) {
    var blank = '';

    if (!/:|(\/{2})/.test(href) &&
      !_self.matchNotCompileLink(href) &&
      !/(\s?:ignore)(\s\S+)?$/.test(title)) {
      href = router.toURL(href, null, router.getCurrentPath());
    } else {
      blank = " target=\"" + linkTarget + "\"";
      title = title && title.replace(/:ignore/g, '').trim();
    }

    if (title) {
      title = " title=\"" + title + "\"";
    }
    return ("<a href=\"" + href + "\"" + (title || '') + blank + ">" + text + "</a>")
  };
  renderer.paragraph = function (text) {
    if (/^!&gt;/.test(text)) {
      return helper('tip', text)
    } else if (/^\?&gt;/.test(text)) {
      return helper('warn', text)
    }
    return ("<p>" + text + "</p>")
  };
  renderer.image = function (href, title, text) {
    var url = href;
    var titleHTML = title ? (" title=\"" + title + "\"") : '';

    if (!isAbsolutePath(href)) {
      url = getPath(contentBase, href);
    }

    return ("<img src=\"" + url + "\" data-origin=\"" + href + "\" alt=\"" + text + "\"" + titleHTML + ">")
  };

  return renderer
};

/**
 * Compile sidebar
 */
Compiler.prototype.sidebar = function sidebar (text, level) {
  var currentPath = this.router.getCurrentPath();
  var html = '';

  if (text) {
    html = this.compile(text);
    html = html && html.match(/<ul[^>]*>([\s\S]+)<\/ul>/g)[0];
  } else {
    var tree$$1 = this.cacheTree[currentPath] || genTree(this.toc, level);
    html = tree(tree$$1, '<ul>');
    this.cacheTree[currentPath] = tree$$1;
  }

  return html
};

/**
 * Compile sub sidebar
 */
Compiler.prototype.subSidebar = function subSidebar (level) {
  if (!level) {
    this.toc = [];
    return
  }
  var currentPath = this.router.getCurrentPath();
  var ref = this;
    var cacheTree = ref.cacheTree;
    var toc = ref.toc;

  toc[0] && toc[0].ignoreAllSubs && (this.toc = []);
  toc[0] && toc[0].level === 1 && toc.shift();
  toc.forEach(function (node, i) {
    node.ignoreSubHeading && toc.splice(i, 1);
  });

  var tree$$1 = cacheTree[currentPath] || genTree(toc, level);

  cacheTree[currentPath] = tree$$1;
  this.toc = [];
  return tree(tree$$1, '<ul class="app-sub-sidebar">')
};

Compiler.prototype.article = function article (text) {
  return this.compile(text)
};

/**
 * Compile cover page
 */
Compiler.prototype.cover = function cover$$1 (text) {
  var cacheToc = this.toc.slice();
  var html = this.compile(text);

  this.toc = cacheToc.slice();

  return html
};

var title = $.title;
/**
 * Toggle button
 */
function btn (el, router) {
  var toggle = function (_) { return body.classList.toggle('close'); };

  el = getNode(el);
  on(el, 'click', function (e) {
    e.stopPropagation();
    toggle();
  });

  var sidebar = getNode('.sidebar');

  isMobile && on(body, 'click', function (_) { return body.classList.contains('close') && toggle(); }
  );
  on(sidebar, 'click', function (_) { return setTimeout((function (_) { return getAndActive(router, sidebar, true, true); }, 0)); }
  );
}

function sticky () {
  var cover = getNode('section.cover');
  if (!cover) { return }
  var coverHeight = cover.getBoundingClientRect().height;

  if (window.pageYOffset >= coverHeight || cover.classList.contains('hidden')) {
    toggleClass(body, 'add', 'sticky');
  } else {
    toggleClass(body, 'remove', 'sticky');
  }
}

/**
 * Get and active link
 * @param  {object} router
 * @param  {string|element}  el
 * @param  {Boolean} isParent   acitve parent
 * @param  {Boolean} autoTitle  auto set title
 * @return {element}
 */
function getAndActive (router, el, isParent, autoTitle) {
  el = getNode(el);

  var links = findAll(el, 'a');
  var hash = router.toURL(router.getCurrentPath());
  var target;

  links
    .sort(function (a, b) { return b.href.length - a.href.length; })
    .forEach(function (a) {
      var href = a.getAttribute('href');
      var node = isParent ? a.parentNode : a;

      if (hash.indexOf(href) === 0 && !target) {
        target = a;
        toggleClass(node, 'add', 'active');
      } else {
        toggleClass(node, 'remove', 'active');
      }
    });

  if (autoTitle) {
    $.title = target ? ((target.innerText) + " - " + title) : title;
  }

  return target
}

var nav = {};
var hoverOver = false;

function highlight () {
  var sidebar = getNode('.sidebar');
  var anchors = findAll('.anchor');
  var wrap = find(sidebar, '.sidebar-nav');
  var active = find(sidebar, 'li.active');
  var top = body.scrollTop;
  var last;

  for (var i = 0, len = anchors.length; i < len; i += 1) {
    var node = anchors[i];

    if (node.offsetTop > top) {
      if (!last) { last = node; }
      break
    } else {
      last = node;
    }
  }
  if (!last) { return }
  var li = nav[last.getAttribute('data-id')];

  if (!li || li === active) { return }

  active && active.classList.remove('active');
  li.classList.add('active');
  active = li;

  // scroll into view
  // https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js#L282-L297
  if (!hoverOver && body.classList.contains('sticky')) {
    var height = sidebar.clientHeight;
    var curOffset = 0;
    var cur = active.offsetTop + active.clientHeight + 40;
    var isInView = (
      active.offsetTop >= wrap.scrollTop &&
      cur <= wrap.scrollTop + height
    );
    var notThan = cur - curOffset < height;
    var top$1 = isInView
      ? wrap.scrollTop
      : notThan
        ? curOffset
        : cur - height;

    sidebar.scrollTop = top$1;
  }
}

function scrollActiveSidebar (router) {
  if (isMobile) { return }

  var sidebar = getNode('.sidebar');
  var lis = findAll(sidebar, 'li');

  for (var i = 0, len = lis.length; i < len; i += 1) {
    var li = lis[i];
    var a = li.querySelector('a');
    if (!a) { continue }
    var href = a.getAttribute('href');

    if (href !== '/') {
      href = router.parse(href).query.id;
    }

    nav[decodeURIComponent(href)] = li;
  }

  off('scroll', highlight);
  on('scroll', highlight);
  on(sidebar, 'mouseover', function () { hoverOver = true; });
  on(sidebar, 'mouseleave', function () { hoverOver = false; });
}

function scrollIntoView (id) {
  var section = find('#' + id);
  section && section.scrollIntoView();
}

var scrollEl = $.scrollingElement || $.documentElement;

function scroll2Top (offset) {
  if ( offset === void 0 ) offset = 0;

  scrollEl.scrollTop = offset === true ? 0 : Number(offset);
}

function executeScript () {
  var script = findAll('.markdown-section>script')
      .filter(function (s) { return !/template/.test(s.type); })[0];
  if (!script) { return false }
  var code = script.innerText.trim();
  if (!code) { return false }

  setTimeout(function (_) {
    window.__EXECUTE_RESULT__ = new Function(code)();
  }, 0);
}

function formatUpdated (html, updated, fn) {
  updated = typeof fn === 'function'
    ? fn(updated)
    : typeof fn === 'string'
      ? tinydate(fn)(new Date(updated))
      : updated;

  return html.replace(/{docsify-updated}/g, updated)
}

function renderMain (html) {
  if (!html) {
    // TODO: Custom 404 page
    html = 'not found';
  }

  this._renderTo('.markdown-section', html);
  // Render sidebar with the TOC
  !this.config.loadSidebar && this._renderSidebar();

  // execute script
  if (this.config.executeScript !== false &&
      typeof window.Vue !== 'undefined' &&
      !executeScript()) {
    setTimeout(function (_) {
      var vueVM = window.__EXECUTE_RESULT__;
      vueVM && vueVM.$destroy && vueVM.$destroy();
      window.__EXECUTE_RESULT__ = new window.Vue().$mount('#main');
    }, 0);
  } else {
    this.config.executeScript && executeScript();
  }
}

function renderNameLink (vm) {
  var el = getNode('.app-name-link');
  var nameLink = vm.config.nameLink;
  var path = vm.route.path;

  if (!el) { return }

  if (isPrimitive(vm.config.nameLink)) {
    el.setAttribute('href', nameLink);
  } else if (typeof nameLink === 'object') {
    var match = Object.keys(nameLink).filter(function (key) { return path.indexOf(key) > -1; })[0];

    el.setAttribute('href', nameLink[match]);
  }
}

function renderMixin (proto) {
  proto._renderTo = function (el, content, replace) {
    var node = getNode(el);
    if (node) { node[replace ? 'outerHTML' : 'innerHTML'] = content; }
  };

  proto._renderSidebar = function (text) {
    var ref = this.config;
    var maxLevel = ref.maxLevel;
    var subMaxLevel = ref.subMaxLevel;
    var loadSidebar = ref.loadSidebar;

    this._renderTo('.sidebar-nav', this.compiler.sidebar(text, maxLevel));
    var activeEl = getAndActive(this.router, '.sidebar-nav', true, true);
    if (loadSidebar && activeEl) {
      activeEl.parentNode.innerHTML += (this.compiler.subSidebar(subMaxLevel) || '');
    } else {
      // reset toc
      this.compiler.subSidebar();
    }
    // bind event
    this._bindEventOnRendered(activeEl);
  };

  proto._bindEventOnRendered = function (activeEl) {
    var ref = this.config;
    var autoHeader = ref.autoHeader;
    var auto2top = ref.auto2top;

    scrollActiveSidebar(this.router);

    if (autoHeader && activeEl) {
      var main$$1 = getNode('#main');
      var firstNode = main$$1.children[0];
      if (firstNode && firstNode.tagName !== 'H1') {
        var h1 = create('h1');
        h1.innerText = activeEl.innerText;
        before(main$$1, h1);
      }
    }

    auto2top && scroll2Top(auto2top);
  };

  proto._renderNav = function (text) {
    text && this._renderTo('nav', this.compiler.compile(text));
    getAndActive(this.router, 'nav');
  };

  proto._renderMain = function (text, opt) {
    var this$1 = this;
    if ( opt === void 0 ) opt = {};

    if (!text) {
      return renderMain.call(this, text)
    }

    callHook(this, 'beforeEach', text, function (result) {
      var html = this$1.isHTML ? result : this$1.compiler.compile(result);
      if (opt.updatedAt) {
        html = formatUpdated(html, opt.updatedAt, this$1.config.formatUpdated);
      }

      callHook(this$1, 'afterEach', html, function (text) { return renderMain.call(this$1, text); });
    });
  };

  proto._renderCover = function (text) {
    var el = getNode('.cover');
    if (!text) {
      toggleClass(el, 'remove', 'show');
      return
    }
    toggleClass(el, 'add', 'show');

    var html = this.coverIsHTML ? text : this.compiler.cover(text);
    var m = html.trim().match('<p><img.*?data-origin="(.*?)"[^a]+alt="(.*?)">([^<]*?)</p>$');

    if (m) {
      if (m[2] === 'color') {
        el.style.background = m[1] + (m[3] || '');
      } else {
        var path = m[1];

        toggleClass(el, 'add', 'has-mask');
        if (!isAbsolutePath(m[1])) {
          path = getPath(this.router.getBasePath(), m[1]);
        }
        el.style.backgroundImage = "url(" + path + ")";
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center center';
      }
      html = html.replace(m[0], '');
    }

    this._renderTo('.cover-main', html);
    sticky();
  };

  proto._updateRender = function () {
    // render name link
    renderNameLink(this);
  };
}

function initRender (vm) {
  var config = vm.config;

  // Init markdown compiler
  vm.compiler = new Compiler(config, vm.router);

  var id = config.el || '#app';
  var navEl = find('nav') || create('nav');

  var el = find(id);
  var html = '';
  var navAppendToTarget = body;

  if (el) {
    if (config.repo) {
      html += corner(config.repo);
    }
    if (config.coverpage) {
      html += cover();
    }

    html += main(config);
    // Render main app
    vm._renderTo(el, html, true);
  } else {
    vm.rendered = true;
  }

  if (config.mergeNavbar && isMobile) {
    navAppendToTarget = find('.sidebar');
  } else {
    navEl.classList.add('app-nav');

    if (!config.repo) {
      navEl.classList.add('no-badge');
    }
  }

  // Add nav
  before(navAppendToTarget, navEl);

  if (config.themeColor) {
    $.head.appendChild(
      create('div', theme(config.themeColor)).firstElementChild
    );
    // Polyfll
    cssVars(config.themeColor);
  }
  vm._updateRender();
  toggleClass(body, 'ready');
}

var cached$1 = {};

function getAlias (path, alias, last) {
  var match = Object.keys(alias).filter(function (key) {
    var re = cached$1[key] || (cached$1[key] = new RegExp(("^" + key + "$")));
    return re.test(path) && path !== last
  })[0];

  return match ? getAlias(path.replace(cached$1[match], alias[match]), alias, path) : path
}

function getFileName (path) {
  return /\.(md|html)$/g.test(path)
    ? path
    : /\/$/g.test(path)
      ? (path + "README.md")
      : (path + ".md")
}

var History = function History (config) {
  this.config = config;
};

History.prototype.getBasePath = function getBasePath () {
  return this.config.basePath
};

History.prototype.getFile = function getFile (path, isRelative) {
  path = path || this.getCurrentPath();

  var ref = this;
    var config = ref.config;
  var base = this.getBasePath();

  path = config.alias ? getAlias(path, config.alias) : path;
  path = getFileName(path);
  path = path === '/README.md' ? (config.homepage || path) : path;
  path = isAbsolutePath(path) ? path : getPath(base, path);

  if (isRelative) {
    path = path.replace(new RegExp(("^" + base)), '');
  }

  return path
};

History.prototype.onchange = function onchange (cb) {
    if ( cb === void 0 ) cb = noop;

  cb();
};

History.prototype.getCurrentPath = function getCurrentPath () {};

History.prototype.normalize = function normalize () {};

History.prototype.parse = function parse () {};

History.prototype.toURL = function toURL () {};

function replaceHash (path) {
  var i = location.href.indexOf('#');
  location.replace(
    location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  );
}

var replaceSlug = cached(function (path) {
  return path.replace('#', '?id=')
});

var HashHistory = (function (History$$1) {
  function HashHistory (config) {
    History$$1.call(this, config);
    this.mode = 'hash';
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  HashHistory.prototype.getBasePath = function getBasePath () {
    var path = window.location.pathname || '';
    var base = this.config.basePath;

    return /^(\/|https?:)/g.test(base)
      ? base
      : cleanPath(path + '/' + base)
  };

  HashHistory.prototype.getCurrentPath = function getCurrentPath () {
    // We can't use location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    var href = location.href;
    var index = href.indexOf('#');
    return index === -1 ? '' : href.slice(index + 1)
  };

  HashHistory.prototype.onchange = function onchange (cb) {
    if ( cb === void 0 ) cb = noop;

    on('hashchange', cb);
  };

  HashHistory.prototype.normalize = function normalize () {
    var path = this.getCurrentPath();

    path = replaceSlug(path);

    if (path.charAt(0) === '/') { return replaceHash(path) }
    replaceHash('/' + path);
  };

  /**
   * Parse the url
   * @param {string} [path=location.herf]
   * @return {object} { path, query }
   */
  HashHistory.prototype.parse = function parse (path) {
    if ( path === void 0 ) path = location.href;

    var query = '';

    var hashIndex = path.indexOf('#');
    if (hashIndex) {
      path = path.slice(hashIndex + 1);
    }

    var queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1);
      path = path.slice(0, queryIndex);
    }

    return {
      path: path,
      file: this.getFile(path, true),
      query: parseQuery(query)
    }
  };

  HashHistory.prototype.toURL = function toURL (path, params, currentRoute) {
    var local = currentRoute && path[0] === '#';
    var route = this.parse(replaceSlug(path));

    route.query = merge({}, route.query, params);
    path = route.path + stringifyQuery(route.query);
    path = path.replace(/\.md(\?)|\.md$/, '$1');

    if (local) { path = currentRoute + path; }

    return cleanPath('#/' + path)
  };

  return HashHistory;
}(History));

var HTML5History = (function (History$$1) {
  function HTML5History (config) {
    History$$1.call(this, config);
    this.mode = 'history';
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.getCurrentPath = function getCurrentPath () {
    var base = this.getBasePath();
    var path = window.location.pathname;

    if (base && path.indexOf(base) === 0) {
      path = path.slice(base.length);
    }

    return (path || '/') + window.location.search + window.location.hash
  };

  HTML5History.prototype.onchange = function onchange (cb) {
    if ( cb === void 0 ) cb = noop;

    on('click', function (e) {
      var el = e.target.tagName === 'A'
        ? e.target
        : e.target.parentNode;

      if (el.tagName === 'A' && !/_blank/.test(el.target)) {
        e.preventDefault();
        var url = el.href;
        window.history.pushState({ key: url }, '', url);
        cb();
      }
    });

    on('popstate', cb);
  };

  /**
   * Parse the url
   * @param {string} [path=location.href]
   * @return {object} { path, query }
   */
  HTML5History.prototype.parse = function parse (path) {
    if ( path === void 0 ) path = location.href;

    var query = '';

    var queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1);
      path = path.slice(0, queryIndex);
    }

    var base = getPath(location.origin);
    var baseIndex = path.indexOf(base);

    if (baseIndex > -1) {
      path = path.slice(baseIndex + base.length);
    }

    return {
      path: path,
      file: this.getFile(path),
      query: parseQuery(query)
    }
  };

  HTML5History.prototype.toURL = function toURL (path, params, currentRoute) {
    var local = currentRoute && path[0] === '#';
    var route = this.parse(path);

    route.query = merge({}, route.query, params);
    path = route.path + stringifyQuery(route.query);
    path = path.replace(/\.md(\?)|\.md$/, '$1');

    if (local) { path = currentRoute + path; }

    return cleanPath('/' + path)
  };

  return HTML5History;
}(History));

function routerMixin (proto) {
  proto.route = {};
}

var lastRoute = {};

function updateRender (vm) {
  vm.router.normalize();
  vm.route = vm.router.parse();
  body.setAttribute('data-page', vm.route.file);
}

function initRouter (vm) {
  var config = vm.config;
  var mode = config.routerMode || 'hash';
  var router;

  if (mode === 'history' && supportsPushState) {
    router = new HTML5History(config);
  } else {
    router = new HashHistory(config);
  }

  vm.router = router;
  updateRender(vm);
  lastRoute = vm.route;

  router.onchange(function (_) {
    updateRender(vm);
    vm._updateRender();

    if (lastRoute.path === vm.route.path) {
      vm.$resetEvents();
      return
    }

    vm.$fetch();
    lastRoute = vm.route;
  });
}

function eventMixin (proto) {
  proto.$resetEvents = function () {
    scrollIntoView(this.route.query.id);
    getAndActive(this.router, 'nav');
  };
}

function initEvent (vm) {
  // Bind toggle button
  btn('button.sidebar-toggle', vm.router);
  // Bind sticky effect
  if (vm.config.coverpage) {
    !isMobile && on('scroll', sticky);
  } else {
    body.classList.add('sticky');
  }
}

function loadNested (path, file, next, vm, first) {
  path = first ? path : path.replace(/\/$/, '');
  path = getParentPath(path);

  if (!path) { return }

  get(vm.router.getFile(path + file))
    .then(next, function (_) { return loadNested(path, file, next, vm); });
}

function fetchMixin (proto) {
  var last;
  proto._fetch = function (cb) {
    var this$1 = this;
    if ( cb === void 0 ) cb = noop;

    var ref = this.route;
    var path = ref.path;
    var ref$1 = this.config;
    var loadNavbar = ref$1.loadNavbar;
    var loadSidebar = ref$1.loadSidebar;

    // Abort last request
    last && last.abort && last.abort();

    last = get(this.router.getFile(path), true);

    // Current page is html
    this.isHTML = /\.html$/g.test(path);

    var loadSideAndNav = function () {
      if (!loadSidebar) { return cb() }

      var fn = function (result) { this$1._renderSidebar(result); cb(); };

      // Load sidebar
      loadNested(path, loadSidebar, fn, this$1, true);
    };

    // Load main content
    last.then(function (text, opt) {
      this$1._renderMain(text, opt);
      loadSideAndNav();
    },
    function (_) {
      this$1._renderMain(null);
      loadSideAndNav();
    });

    // Load nav
    loadNavbar &&
    loadNested(path, loadNavbar, function (text) { return this$1._renderNav(text); }, this, true);
  };

  proto._fetchCover = function () {
    var this$1 = this;

    var ref = this.config;
    var coverpage = ref.coverpage;
    var root = getParentPath(this.route.path);
    var path = this.router.getFile(root + coverpage);

    if (this.route.path !== '/' || !coverpage) {
      this._renderCover();
      return
    }

    this.coverIsHTML = /\.html$/g.test(path);
    get(path)
      .then(function (text) { return this$1._renderCover(text); });
  };

  proto.$fetch = function (cb) {
    var this$1 = this;
    if ( cb === void 0 ) cb = noop;

    this._fetchCover();
    this._fetch(function (result) {
      this$1.$resetEvents();
      callHook(this$1, 'doneEach');
      cb();
    });
  };
}

function initFetch (vm) {
  var ref = vm.config;
  var loadSidebar = ref.loadSidebar;

  // server-client renderer
  if (vm.rendered) {
    var activeEl = getAndActive(vm.router, '.sidebar-nav', true, true);
    if (loadSidebar && activeEl) {
      activeEl.parentNode.innerHTML += window.__SUB_SIDEBAR__;
    }
    vm._bindEventOnRendered(activeEl);
    vm._fetchCover();
    vm.$resetEvents();
    callHook(vm, 'doneEach');
    callHook(vm, 'ready');
  } else {
    vm.$fetch(function (_) { return callHook(vm, 'ready'); });
  }
}

function initMixin (proto) {
  proto._init = function () {
    var vm = this;
    vm.config = config || {};

    initLifecycle(vm); // Init hooks
    initPlugin(vm); // Install plugins
    callHook(vm, 'init');
    initRouter(vm); // Add router
    initRender(vm); // Render base DOM
    initEvent(vm); // Bind events
    initFetch(vm); // Fetch data
    callHook(vm, 'mounted');
  };
}

function initPlugin (vm) {
  [].concat(vm.config.plugins).forEach(function (fn) { return isFn(fn) && fn(vm._lifecycle, vm); });
}



var util = Object.freeze({
	cached: cached,
	hyphenate: hyphenate,
	merge: merge,
	isPrimitive: isPrimitive,
	noop: noop,
	isFn: isFn,
	inBrowser: inBrowser,
	isMobile: isMobile,
	supportsPushState: supportsPushState,
	parseQuery: parseQuery,
	stringifyQuery: stringifyQuery,
	getPath: getPath,
	isAbsolutePath: isAbsolutePath,
	getParentPath: getParentPath,
	cleanPath: cleanPath
});

var initGlobalAPI = function () {
  window.Docsify = { util: util, dom: dom, get: get, slugify: slugify };
  window.DocsifyCompiler = Compiler;
  window.marked = marked;
  window.Prism = prism;
};

function Docsify () {
  this._init();
}

var proto = Docsify.prototype;

initMixin(proto);
routerMixin(proto);
renderMixin(proto);
fetchMixin(proto);
eventMixin(proto);

/**
 * Global API
 */
initGlobalAPI();

/**
 * Version
 */
Docsify.version = '4.2.6';

/**
 * Run Docsify
 */
setTimeout(function (_) { return new Docsify(); }, 0);

}());
