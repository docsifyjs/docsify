let INDEXS = {}
let helper

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

  helper.dom.findAll('a:not([data-nosearch])').forEach(node => {
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

function getAllLocalStorageData() {
  const strData = localStorage.getItem('docsify.search');
  return strData ? JSON.parse(strData) : {};
}

function getLocalStorageData() {
  const data = getAllLocalStorageData();
  return data[window.location.hostname] || {};
}

function setLocalStorageData(hostnameData) {
  const data = getAllLocalStorageData();
  data[window.location.hostname] = hostnameData;
  localStorage.setItem('docsify.search', JSON.stringify(data));
}

function saveData(maxAge) {
  setLocalStorageData({
    expiration: Date.now() + maxAge,
    index: INDEXS,
  });
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

  query = query.trim()
  let keywords = query.split(/[\s\-，\\/]+/)
  if (keywords.length !== 1) {
    keywords = [].concat(query, keywords)
  }

  for (let i = 0; i < data.length; i++) {
    const post = data[i]
    let isMatch = false
    let resultStr = ''
    const postTitle = post.title && post.title.trim()
    const postContent = post.body && post.body.trim()
    const postUrl = post.slug || ''

    if (postTitle && postContent) {
      keywords.forEach(keyword => {
        // From https://github.com/sindresorhus/escape-string-regexp
        const regEx = new RegExp(
          keyword.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'),
          'gi'
        )
        let indexTitle = -1
        let indexContent = -1

        indexTitle = postTitle && postTitle.search(regEx)
        indexContent = postContent && postContent.search(regEx)

        if (indexTitle < 0 && indexContent < 0) {
          isMatch = false
        } else {
          isMatch = true
          if (indexContent < 0) {
            indexContent = 0
          }

          let start = 0
          let end = 0

          start = indexContent < 11 ? 0 : indexContent - 10
          end = start === 0 ? 70 : indexContent + keyword.length + 60

          if (end > postContent.length) {
            end = postContent.length
          }

          const matchContent =
            '...' +
            escapeHtml(postContent)
              .substring(start, end)
              .replace(regEx, `<em class="search-keyword">${keyword}</em>`) +
            '...'

          resultStr += matchContent
        }
      })

      if (isMatch) {
        const matchingPost = {
          title: escapeHtml(postTitle),
          content: resultStr,
          url: postUrl
        }

        matchingResults.push(matchingPost)
      }
    }
  }

  return matchingResults
}

export function init(config, vm) {
  helper = Docsify

  const isAuto = config.paths === 'auto'
  const lsData = getLocalStorageData();
  const isExpired = (!lsData.expiration
                     || (lsData.expiration < Date.now()));

  INDEXS = lsData.index || {};

  if (isExpired) {
    INDEXS = {}
  } else if (!isAuto) {
    return
  }

  let paths = isAuto ? getAllPaths(vm.router) : config.paths
  paths = paths.filter(path => !(path in INDEXS))

  const len = paths.length
  let count = 0
  let indexChanged = false

  const updateCount = () => {
    if ((len === ++count) && indexChanged) {
      saveData(config.maxAge)
    }
  }

  paths.forEach(path => {
    helper
      .get(vm.router.getFile(path), false, vm.config.requestHeaders)
      .then(result => {
        indexChanged = true
        INDEXS[path] = genIndex(path, result, vm.router, config.depth)
        updateCount()
      }, updateCount)
  })
}
