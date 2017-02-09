this.D = this.D || {};
this.D.Search = (function () {
'use strict';

var INDEXS = {};
var CONFIG = {
  placeholder: 'Type to search',
  paths: 'auto',
  maxAge: 86400000 // 1 day
};

var isObj = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
};

var escapeHtml = function (string) {
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };

  return String(string).replace(/[&<>"'\/]/g, function (s) { return entityMap[s]; })
};

/**
 * find all filepath from A tag
 */
var getAllPaths = function () {
  var paths = [];[].slice.call(document.querySelectorAll('a'))
    .map(function (node) {
      var href = node.href;
      if (/#\/[^#]*?$/.test(href)) {
        var path = href.replace(/^[^#]+#/, '');

        if (paths.indexOf(path) <= 0) { paths.push(path); }
      }
    });

  return paths
};

/**
 * return file path
 */
var genFilePath = function (path) {
  var basePath = window.$docsify.basePath;
  var filePath = /\/$/.test(path) ? (path + "README.md") : (path + ".md");

  filePath = basePath + filePath;

  return filePath.replace(/\/+/g, '/')
};

/**
 * generate index
 */
var genIndex = function (path, content) {
  if ( content === void 0 ) content = '';

  INDEXS[path] = { slug: '', title: '', body: '' };
  var slug;

  content
    // remove PRE and TEMPLATE tag
    .replace(/<template[^>]*?>[\s\S]+?<\/template>/g, '')
    // find all html tag
    .replace(/<(\w+)([^>]*?)>([\s\S]+?)<\//g, function (match, tag, attr, html) {
      // remove all html tag
      var text = html.replace(/<[^>]+>/g, '');

      // tag is headline
      if (/^h\d$/.test(tag)) {
        // <h1 id="xxx"></h1>
        var id = attr.match(/id="(\S+)"/)[1];

        slug = ("#/" + path + "#" + id).replace(/\/+/, '/');
        INDEXS[slug] = { slug: slug, title: text, body: '' };
      } else {
        // other html tag
        if (!INDEXS[slug]) {
          INDEXS[slug] = {};
        } else {
          if (INDEXS[slug].body && INDEXS[slug].body.length) {
            INDEXS[slug].body += '\n' + text;
          } else {
            INDEXS[slug].body = text;
          }
        }
      }
    });
};

/**
 * component
 */
var SearchComponent = function SearchComponent () {
  if (this.rendered) { return }

  this.style();

  var el = document.createElement('div');
  var aside = document.querySelector('aside');

  el.classList.add('search');
  aside.insertBefore(el, aside.children[0]);
  this.render(el);
  this.rendered = true;
  this.bindEvent();
};

SearchComponent.prototype.style = function style () {
  var code = "\n      .sidebar {\n        padding-top: 0;\n      }\n\n      .search {\n        margin-bottom: 20px;\n        padding: 6px;\n        border-bottom: 1px solid #eee;\n      }\n\n      .search .results-panel {\n        display: none;\n      }\n\n      .search .results-panel.show {\n        display: block;\n      }\n\n      .search input {\n        outline: none;\n        border: none;\n        width: 100%;\n        padding: 7px;\n        line-height: 22px;\n        font-size: 14px;\n      }\n\n      .search h2 {\n        font-size: 17px;\n        margin: 10px 0;\n      }\n\n      .search a {\n        text-decoration: none;\n        color: inherit;\n      }\n\n      .search .matching-post {\n        border-bottom: 1px solid #eee;\n      }\n\n      .search .matching-post:last-child {\n        border-bottom: 0;\n      }\n\n      .search p {\n        font-size: 14px;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        display: -webkit-box;\n        -webkit-line-clamp: 2;\n        -webkit-box-orient: vertical;\n      }\n\n      .search p.empty {\n        text-align: center;\n      }\n    ";
  var style = document.createElement('style');

  style.innerHTML = code;
  document.head.appendChild(style);
};

SearchComponent.prototype.render = function render (dom) {
  dom.innerHTML = "<input type=\"search\" placeholder=\"" + (CONFIG.placeholder) + "\" /><div class=\"results-panel\"></div>";
};

SearchComponent.prototype.bindEvent = function bindEvent () {
    var this$1 = this;

  var input = document.querySelector('.search input');
  var panel = document.querySelector('.results-panel');

  input.addEventListener('input', function (e) {
    var target = e.target;

    if (target.value.trim() !== '') {
      var matchingPosts = this$1.search(target.value);
      var html = '';

      matchingPosts.forEach(function (post, index) {
        html += "\n          <div class=\"matching-post\">\n            <h2><a href=\"" + (post.url) + "\">" + (post.title) + "</a></h2>\n            <p>" + (post.content) + "</p>\n          </div>\n          ";
      });
      if (panel.classList.contains('results-panel')) {
        panel.classList.add('show');
        panel.innerHTML = html || '<p class="empty">No Results!</p>';
      }
    } else {
      if (panel.classList.contains('results-panel')) {
        panel.classList.remove('show');
        panel.innerHTML = '';
      }
    }
  });
};

// From [weex website] https://weex-project.io/js/common.js
SearchComponent.prototype.search = function search (keywords) {
  var matchingResults = [];
  var data = Object.keys(INDEXS).map(function (key) { return INDEXS[key]; });

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
            postContent
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
};

var searchPlugin = function () {
  var isAuto = CONFIG.paths === 'auto';
  var isExpired = localStorage.getItem('docsify.search.expires') < Date.now();

  INDEXS = JSON.parse(localStorage.getItem('docsify.search.index'));

  if (isExpired) {
    INDEXS = {};
  } else if (!isAuto) {
    return
  }

  var count = 0;
  var paths = isAuto ? getAllPaths() : CONFIG.paths;
  var len = paths.length;
  var ref = window.Docsify.utils;
  var load = ref.load;
  var marked = ref.marked;
  var slugify = ref.slugify;
  var done = function () {
    localStorage.setItem('docsify.search.expires', Date.now() + CONFIG.maxAge);
    localStorage.setItem('docsify.search.index', JSON.stringify(INDEXS));
  };

  paths.forEach(function (path) {
    if (INDEXS[path]) { return count++ }

    load(genFilePath(path)).then(function (content) {
      genIndex(path, marked(content));
      slugify.clear();
      count++;

      if (len === count) { done(); }
    });
  });
};

var install = function () {
  if (!window.Docsify || !window.Docsify.installed) {
    console.error('[Docsify] Please load docsify.js first.');
    return
  }

  window.$docsify.plugins = [].concat(window.$docsify.plugins, searchPlugin);

  var userConfig = window.$docsify.search;
  var isNil = window.Docsify.utils.isNil;

  if (Array.isArray(userConfig)) {
    CONFIG.paths = userConfig;
  } else if (isObj(userConfig)) {
    CONFIG.paths = Array.isArray(userConfig.paths) ? userConfig.paths : 'auto';
    CONFIG.maxAge = isNil(userConfig.maxAge) ? CONFIG.maxAge : userConfig.maxAge;
    CONFIG.placeholder = userConfig.placeholder || CONFIG.placeholder;
  }

  new SearchComponent();
};

var search = install();

return search;

}());
