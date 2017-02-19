this.D = this.D || {};
(function () {
'use strict';

var INDEXS = {};
var helper;

function escapeHtml (string) {
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
  };

  return String(string).replace(/[&<>"'\/]/g, function (s) { return entityMap[s]; })
}

function getAllPaths () {
  var paths = [];

  helper.dom.findAll('a')
    .map(function (node) {
      var href = node.href;
      var originHref = node.getAttribute('href');
      var path = helper.route.parse(href).path;

      if (path &&
        paths.indexOf(path) === -1 &&
        !helper.route.isAbsolutePath(originHref)) {
        paths.push(path);
      }
    });

  return paths
}

function saveData (maxAge) {
  localStorage.setItem('docsify.search.expires', Date.now() + maxAge);
  localStorage.setItem('docsify.search.index', JSON.stringify(INDEXS));
}

function genIndex (path, content) {
  if ( content === void 0 ) content = '';

  var tokens = window.marked.lexer(content);
  var toURL = Docsify.route.toURL;
  var index = {};
  var slug;

  tokens.forEach(function (token) {
    if (token.type === 'heading' && token.depth <= 2) {
      slug = toURL(path, { id: token.text });
      index[slug] = { slug: slug, title: token.text, body: '' };
    } else {
      if (!slug) { return }
      if (!index[slug]) {
        index[slug] = { slug: slug, title: '', body: '' };
      } else {
        if (index[slug].body) {
          index[slug].body += '\n' + (token.text || '');
        } else {
          index[slug].body = token.text;
        }
      }
    }
  });

  return index
}

function search (keywords) {
  var matchingResults = [];
  var data = [];
  Object.keys(INDEXS).forEach(function (key) {
    data = data.concat(Object.keys(INDEXS[key]).map(function (page) { return INDEXS[key][page]; }));
  });

  keywords = keywords.trim().split(/[\s\-\，\\/]+/);

  var loop = function ( i ) {
    var post = data[i];
    var isMatch = false;
    var resultStr = '';
    var postTitle = post.title && post.title.trim();
    var postContent = post.body && post.body.trim();
    var postUrl = post.slug || '';

    if (postTitle !== '' && postContent !== '') {
      keywords.forEach(function (keyword, i) {
        var regEx = new RegExp(keyword, 'gi');
        var indexTitle = -1;
        var indexContent = -1;

        indexTitle = postTitle.search(regEx);
        indexContent = postContent.search(regEx);

        if (indexTitle < 0 && indexContent < 0) {
          isMatch = false;
        } else {
          isMatch = true;
          if (indexContent < 0) { indexContent = 0; }

          var start = 0;
          var end = 0;

          start = indexContent < 11 ? 0 : indexContent - 10;
          end = start === 0 ? 70 : indexContent + keyword.length + 60;

          if (end > postContent.length) { end = postContent.length; }

          var matchContent = '...' +
            escapeHtml(postContent)
              .substring(start, end)
              .replace(regEx, ("<em class=\"search-keyword\">" + keyword + "</em>")) +
              '...';

          resultStr += matchContent;
        }
      });

      if (isMatch) {
        var matchingPost = {
          title: escapeHtml(postTitle),
          content: resultStr,
          url: postUrl
        };

        matchingResults.push(matchingPost);
      }
    }
  };

  for (var i = 0; i < data.length; i++) loop( i );

  return matchingResults
}

function init$1 (config, vm) {
  helper = Docsify;

  var isAuto = config.paths === 'auto';
  var isExpired = localStorage.getItem('docsify.search.expires') < Date.now();

  INDEXS = JSON.parse(localStorage.getItem('docsify.search.index'));

  if (isExpired) {
    INDEXS = {};
  } else if (!isAuto) {
    return
  }

  var paths = isAuto ? getAllPaths() : config.paths;
  var len = paths.length;
  var count = 0;

  paths.forEach(function (path) {
    if (INDEXS[path]) { return count++ }

    helper
      .get(vm.$getFile(path))
      .then(function (result) {
        INDEXS[path] = genIndex(path, result);
        len === ++count && saveData(config.maxAge);
      });
  });
}

var dom;

function style () {
  var code = "\n.sidebar {\n  padding-top: 0;\n}\n\n.search {\n  margin-bottom: 20px;\n  padding: 6px;\n  border-bottom: 1px solid #eee;\n}\n\n.search .results-panel {\n  display: none;\n}\n\n.search .results-panel.show {\n  display: block;\n}\n\n.search input {\n  outline: none;\n  border: none;\n  width: 100%;\n  padding: 7px;\n  line-height: 22px;\n  font-size: 14px;\n}\n\n.search h2 {\n  font-size: 17px;\n  margin: 10px 0;\n}\n\n.search a {\n  text-decoration: none;\n  color: inherit;\n}\n\n.search .matching-post {\n  border-bottom: 1px solid #eee;\n}\n\n.search .matching-post:last-child {\n  border-bottom: 0;\n}\n\n.search p {\n  font-size: 14px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n\n.search p.empty {\n  text-align: center;\n}";
  var style = dom.create('style', code);
  dom.appendTo(dom.head, style);
}

function tpl (opts) {
  var html =
    "<input type=\"search\" />" +
      '<div class="results-panel"></div>' +
    '</div>';
  var el = dom.create('div', html);
  var aside = dom.find('aside');

  dom.toggleClass(el, 'search');
  dom.before(aside, el);
}

function bindEvents () {
  var $search = dom.find('div.search');
  var $input = dom.find($search, 'input');
  var $panel = dom.find($search, '.results-panel');

  // Prevent to Fold sidebar
  dom.on($search, 'click',
    function (e) { return e.target.tagName !== 'A' && e.stopPropagation(); });

  dom.on($input, 'input', function (e) {
    var value = e.target.value.trim();
    if (!value) {
      $panel.classList.remove('show');
      $panel.innerHTML = '';
      return
    }
    var matchs = search(value);

    var html = '';

    matchs.forEach(function (post) {
      html += "<div class=\"matching-post\">\n  <h2><a href=\"" + (post.url) + "\">" + (post.title) + "</a></h2>\n  <p>" + (post.content) + "</p>\n</div>";
    });

    $panel.classList.add('show');
    $panel.innerHTML = html || '<p class="empty">No Results!</p>';
  });
}

function updatePlaceholder (text, path) {
  var $input = dom.getNode('.search input[type="search"]');

  if (typeof text === 'string') {
    $input.placeholder = text;
  } else {
    var match = Object.keys(text).find(function (key) { return path.indexOf(key) > -1; });
    $input.placeholder = text[match];
  }
}

function init$$1 (opts) {
  dom = Docsify.dom;
  style();
  tpl(opts);
  bindEvents();
}

function update (opts, vm) {
  updatePlaceholder(opts.placeholder, vm.route.path);
}

var CONFIG = {
  placeholder: 'Type to search',
  paths: 'auto',
  maxAge: 86400000 // 1 day
};

var install = function (hook, vm) {
  var util = Docsify.util;
  var opts = vm.config.search || CONFIG;

  if (Array.isArray(opts)) {
    CONFIG.paths = opts;
  } else if (typeof opts === 'object') {
    CONFIG.paths = Array.isArray(opts.paths) ? opts.paths : 'auto';
    CONFIG.maxAge = util.isPrimitive(opts.maxAge) ? opts.maxAge : CONFIG.maxAge;
    CONFIG.placeholder = opts.placeholder || CONFIG.placeholder;
  }

  var isAuto = CONFIG.paths === 'auto';

  hook.mounted(function (_) {
    init$$1(CONFIG);
    !isAuto && init$1(CONFIG, vm);
  });
  hook.doneEach(function (_) {
    update(CONFIG, vm);
    isAuto && init$1(CONFIG, vm);
  });
};

window.$docsify.plugins = [].concat(install, window.$docsify.plugins);

}());
