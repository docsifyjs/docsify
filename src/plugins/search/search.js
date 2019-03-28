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

  query = query.trim()
  let keywords = query.split(/[\s\-，\\/]+/)
  if (keywords.length !== 1) {
    keywords = [].concat(query, keywords)
  }

  for (let i = 0; i < data.length; i++) {
    const post = data[i]
    let matchesScore = 0
    let resultStr = ''
    const postTitle = post.title && post.title.trim()
    const postContent = post.body && post.body.trim()
    const postUrl = post.slug || ''

    if (postTitle) {
      keywords.forEach( keyword => {
        // From https://github.com/sindresorhus/escape-string-regexp
        const regEx = new RegExp(
          keyword.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'),
          'gi'
        );
        let indexTitle = -1
        let indexContent = -1

        indexTitle = postTitle ? postTitle.search(regEx) : -1
        indexContent = postContent ? postContent.search(regEx) : -1

        if (indexTitle >= 0 || indexContent >= 0) {
          matchesScore += indexTitle >= 0 ? 3 : indexContent >= 0 ? 2 : 0;
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

      if (matchesScore > 0) {
        const matchingPost = {
          title: escapeHtml(postTitle),
          content: postContent ? resultStr : '',
          url: postUrl,
          score: matchesScore
        }

        matchingResults.push(matchingPost)
      }
    }
  }

  return matchingResults.sort((r1, r2) => r2.score - r1.score);
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
