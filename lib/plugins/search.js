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

function getAllPaths (router) {
  var paths = [];

  helper.dom.findAll('a:not([data-nosearch])')
    .map(function (node) {
      var href = node.href;
      var originHref = node.getAttribute('href');
      var path = router.parse(href).path;

      if (path &&
        paths.indexOf(path) === -1 &&
        !Docsify.util.isAbsolutePath(originHref)) {
        paths.push(path);
      }
    });

  return paths
}

function saveData (maxAge) {
  localStorage.setItem('docsify.search.expires', Date.now() + maxAge);
  localStorage.setItem('docsify.search.index', JSON.stringify(INDEXS));
}

function genIndex (path, content, router, depth) {
  if ( content === void 0 ) content = '';

  var tokens = window.marked.lexer(content);
  var slugify = window.Docsify.slugify;
  var index = {};
  var slug;

  tokens.forEach(function (token) {
    if (token.type === 'heading' && token.depth <= depth) {
      slug = router.toURL(path, { id: slugify(token.text) });
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
  slugify.clear();
  return index
}

function search (keywords) {
  var matchingResults = [];
  var data = [];
  Object.keys(INDEXS).forEach(function (key) {
    data = data.concat(Object.keys(INDEXS[key]).map(function (page) { return INDEXS[key][page]; }));
  });

  keywords = [].concat(keywords, keywords.trim().split(/[\s\-\，\\/]+/));

  var loop = function ( i ) {
    var post = data[i];
    var isMatch = false;
    var resultStr = '';
    var postTitle = post.title && post.title.trim();
    var postContent = post.body && post.body.trim();
    var postUrl = post.slug || '';

    if (postTitle && postContent) {
      keywords.forEach(function (keyword, i) {
        var regEx = new RegExp(keyword, 'gi');
        var indexTitle = -1;
        var indexContent = -1;

        indexTitle = postTitle && postTitle.search(regEx);
        indexContent = postContent && postContent.search(regEx);

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

  var paths = isAuto ? getAllPaths(vm.router) : config.paths;
  var len = paths.length;
  var count = 0;

  paths.forEach(function (path) {
    if (INDEXS[path]) { return count++ }

    helper
      .get(vm.router.getFile(path))
      .then(function (result) {
        INDEXS[path] = genIndex(path, result, vm.router, config.depth);
        len === ++count && saveData(config.maxAge);
      });
  });
}

var NO_DATA_TEXT = '';

function style () {
  var code = "\n.sidebar {\n  padding-top: 0;\n}\n\n.search {\n  margin-bottom: 20px;\n  padding: 6px;\n  border-bottom: 1px solid #eee;\n}\n\n.search .results-panel {\n  display: none;\n}\n\n.search .results-panel.show {\n  display: block;\n}\n\n.search input {\n  outline: none;\n  border: none;\n  width: 100%;\n  padding: 7px;\n  line-height: 22px;\n  font-size: 14px;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\n.search h2 {\n  font-size: 17px;\n  margin: 10px 0;\n}\n\n.search a {\n  text-decoration: none;\n  color: inherit;\n}\n\n.search .matching-post {\n  border-bottom: 1px solid #eee;\n}\n\n.search .matching-post:last-child {\n  border-bottom: 0;\n}\n\n.search p {\n  font-size: 14px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n\n.search p.empty {\n  text-align: center;\n}";
  var style = Docsify.dom.create('style', code);
  Docsify.dom.appendTo(Docsify.dom.head, style);
}

function tpl (opts, defaultValue) {
  if ( defaultValue === void 0 ) defaultValue = '';

  var html =
    "<input type=\"search\" value=\"" + defaultValue + "\" />" +
      '<div class="results-panel"></div>' +
    '</div>';
  var el = Docsify.dom.create('div', html);
  var aside = Docsify.dom.find('aside');

  Docsify.dom.toggleClass(el, 'search');
  Docsify.dom.before(aside, el);
}

function doSearch (value) {
  var $search = Docsify.dom.find('div.search');
  var $panel = Docsify.dom.find($search, '.results-panel');

  if (!value) {
    $panel.classList.remove('show');
    $panel.innerHTML = '';
    return
  }
  var matchs = search(value);

  var html = '';
  matchs.forEach(function (post) {
    html += "<div class=\"matching-post\">\n<h2><a href=\"" + (post.url) + "\">" + (post.title) + "</a></h2>\n<p>" + (post.content) + "</p>\n</div>";
  });

  $panel.classList.add('show');
  $panel.innerHTML = html || ("<p class=\"empty\">" + NO_DATA_TEXT + "</p>");
}

function bindEvents () {
  var $search = Docsify.dom.find('div.search');
  var $input = Docsify.dom.find($search, 'input');

  var timeId;
  // Prevent to Fold sidebar
  Docsify.dom.on($search, 'click',
    function (e) { return e.target.tagName !== 'A' && e.stopPropagation(); });
  Docsify.dom.on($input, 'input', function (e) {
    clearTimeout(timeId);
    timeId = setTimeout(function (_) { return doSearch(e.target.value.trim()); }, 100);
  });
}

function updatePlaceholder (text, path) {
  var $input = Docsify.dom.getNode('.search input[type="search"]');

  if (!$input) { return }
  if (typeof text === 'string') {
    $input.placeholder = text;
  } else {
    var match = Object.keys(text).filter(function (key) { return path.indexOf(key) > -1; })[0];
    $input.placeholder = text[match];
  }
}

function updateNoData (text, path) {
  if (typeof text === 'string') {
    NO_DATA_TEXT = text;
  } else {
    var match = Object.keys(text).filter(function (key) { return path.indexOf(key) > -1; })[0];
    NO_DATA_TEXT = text[match];
  }
}

function init$$1 (opts, vm) {
  var keywords = vm.router.parse().query.s;

  style();
  tpl(opts, keywords);
  bindEvents();
  keywords && setTimeout(function (_) { return doSearch(keywords); }, 500);
}

function update (opts, vm) {
  updatePlaceholder(opts.placeholder, vm.route.path);
  updateNoData(opts.noData, vm.route.path);
}

var CONFIG = {
  placeholder: 'Type to search',
  noData: 'No Results!',
  paths: 'auto',
  depth: 2,
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
    CONFIG.noData = opts.noData || CONFIG.noData;
    CONFIG.depth = opts.depth || CONFIG.depth;
  }

  var isAuto = CONFIG.paths === 'auto';

  hook.mounted(function (_) {
    init$$1(CONFIG, vm);
    !isAuto && init$1(CONFIG, vm);
  });
  hook.doneEach(function (_) {
    update(CONFIG, vm);
    isAuto && init$1(CONFIG, vm);
  });
};

$docsify.plugins = [].concat(install, $docsify.plugins);

}());
