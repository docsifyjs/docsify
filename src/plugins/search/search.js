let INDEXS = {}

const LOCAL_STORAGE = {
  EXPIRE_KEY: 'docsify.search.expires',
  INDEX_KEY: 'docsify.search.index'
}

function resolveExpireKey(namespace) {
  return namespace ? `${LOCAL_STORAGE.EXPIRE_KEY}/${namespace}` : LOCAL_STORAGE.EXPIRE_KEY
}
function resolveIndexKey(namespace) {
  return namespace ? `${LOCAL_STORAGE.INDEX_KEY}/${namespace}` : LOCAL_STORAGE.INDEX_KEY
}

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
  }

  return String(string).replace(/[&<>"'/]/g, s => entityMap[s])
}

function getAllPaths(router) {
  const paths = []

  Docsify.dom.findAll('.sidebar-nav a:not(.section-link):not([data-nosearch])').forEach(node => {
    const href = node.href
    const originHref = node.getAttribute('href')
    const path = router.parse(href).path

    if (
      path &&
      paths.indexOf(path) === -1 &&
      !Docsify.util.isAbsolutePath(originHref)
    ) {
      paths.push(path)
    }
  })

  return paths
}

function saveData(maxAge, expireKey, indexKey) {
  localStorage.setItem(expireKey, Date.now() + maxAge)
  localStorage.setItem(indexKey, JSON.stringify(INDEXS))
}

export function genIndex(path, content = '', router, depth) {
  const tokens = window.marked.lexer(content)
  const slugify = window.Docsify.slugify
  const index = {}
  let slug

  tokens.forEach(token => {
    if (token.type === 'heading' && token.depth <= depth) {
      slug = router.toURL(path, {id: slugify(token.text)})
      index[slug] = {slug, title: token.text, body: ''}
    } else {
      if (!slug) {
        return
      }
      if (!index[slug]) {
        index[slug] = {slug, title: '', body: ''}
      } else if (index[slug].body) {
        index[slug].body += '\n' + (token.text || '')
      } else {
        index[slug].body = token.text
      }
    }
  })
  slugify.clear()
  return index
}

/**
 * @param {String} query
 * @returns {Array}
 */
export function search(query) {
  const matchingResults = []
  let data = []
  Object.keys(INDEXS).forEach(key => {
    data = data.concat(Object.keys(INDEXS[key]).map(page => INDEXS[key][page]))
  })

  var options = {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.45,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [{
      name: 'title',
      weight: 0.75
    }, {
      name: 'body',
      weight: 0.25
    }]
  };
  var fuse = new Fuse(data, options);
  var result = fuse.search(query);

  var highlighter = function(resultItem){
    resultItem.matches.forEach((matchItem) => {
      var text = resultItem.item[matchItem.key];
      var result = []
      var matches = [].concat(matchItem.indices);
      var pair = matches.shift()
      
      for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i)
        if (pair && i == pair[0]) {
          result.push('<em class="search-keyword">')
        }
        result.push(char)
        if (pair && i == pair[1]) {
          result.push('</em>')
          pair = matches.shift()
        }
      }
      resultItem.highlight = result.join('');

      if(resultItem.children && resultItem.children.length > 0){
        resultItem.children.forEach((child) => {
          highlighter(child);
        });
      }
    });
  };

  result.forEach((resultItem) => {
    highlighter(resultItem);
  });

  var resultFormatted = result.map(function(obj) {
    var postTitle = escapeHtml(obj.item.title);
    var postContent = obj.highlight;
    var postUrl = obj.item.slug || '';

    return {
      title: postTitle,
      content: postContent,
      url: postUrl
    };
    });

  return resultFormatted;
}

export function init(config, vm) {
  const isAuto = config.paths === 'auto'

  const expireKey = resolveExpireKey(config.namespace)
  const indexKey = resolveIndexKey(config.namespace)

  const isExpired = localStorage.getItem(expireKey) < Date.now()

  INDEXS = JSON.parse(localStorage.getItem(indexKey))

  if (isExpired) {
    INDEXS = {}
  } else if (!isAuto) {
    return
  }

  const paths = isAuto ? getAllPaths(vm.router) : config.paths
  const len = paths.length
  let count = 0

  paths.forEach(path => {
    if (INDEXS[path]) {
      return count++
    }

    Docsify
      .get(vm.router.getFile(path), false, vm.config.requestHeaders)
      .then(result => {
        INDEXS[path] = genIndex(path, result, vm.router, config.depth)
        len === ++count && saveData(config.maxAge, expireKey, indexKey)
      })
  })
}
