let INDEXS = {}
let helper

function escapeHtml (string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
  }

  return String(string).replace(/[&<>"'\/]/g, s => entityMap[s])
}

function getAllPaths (router) {
  const paths = []

  helper.dom.findAll('a:not([data-nosearch])')
    .map(node => {
      const href = node.href
      const originHref = node.getAttribute('href')
      const path = router.parse(href).path

      if (path &&
        paths.indexOf(path) === -1 &&
        !Docsify.util.isAbsolutePath(originHref)) {
        paths.push(path)
      }
    })

  return paths
}

function saveData (maxAge) {
  localStorage.setItem('docsify.search.expires', Date.now() + maxAge)
  localStorage.setItem('docsify.search.index', JSON.stringify(INDEXS))
}

export function genIndex (path, content = '', router, depth) {
  const tokens = window.marked.lexer(content)
  const slugify = window.Docsify.slugify
  const index = {}
  let slug

  tokens.forEach(token => {
    if (token.type === 'heading' && token.depth <= depth) {
      slug = router.toURL(path, { id: slugify(token.text) })
      index[slug] = { slug, title: token.text, body: '' }
    } else {
      if (!slug) return
      if (!index[slug]) {
        index[slug] = { slug, title: '', body: '' }
      } else {
        if (index[slug].body) {
          index[slug].body += '\n' + (token.text || '')
        } else {
          index[slug].body = token.text
        }
      }
    }
  })
  slugify.clear()
  return index
}

export function search (keywords) {
  const matchingResults = []
  let data = []
  Object.keys(INDEXS).forEach(key => {
    data = data.concat(Object.keys(INDEXS[key]).map(page => INDEXS[key][page]))
  })

  keywords = [].concat(keywords, keywords.trim().split(/[\s\-\，\\/]+/))

  for (let i = 0; i < data.length; i++) {
    const post = data[i]
    let isMatch = false
    let resultStr = ''
    const postTitle = post.title && post.title.trim()
    const postContent = post.body && post.body.trim()
    const postUrl = post.slug || ''

    if (postTitle && postContent) {
      keywords.forEach((keyword, i) => {
        const regEx = new RegExp(keyword, 'gi')
        let indexTitle = -1
        let indexContent = -1

        indexTitle = postTitle && postTitle.search(regEx)
        indexContent = postContent && postContent.search(regEx)

        if (indexTitle < 0 && indexContent < 0) {
          isMatch = false
        } else {
          isMatch = true
          if (indexContent < 0) indexContent = 0

          let start = 0
          let end = 0

          start = indexContent < 11 ? 0 : indexContent - 10
          end = start === 0 ? 70 : indexContent + keyword.length + 60

          if (end > postContent.length) end = postContent.length

          const matchContent = '...' +
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

export function init (config, vm) {
  helper = Docsify

  const isAuto = config.paths === 'auto'
  const isExpired = localStorage.getItem('docsify.search.expires') < Date.now()

  INDEXS = JSON.parse(localStorage.getItem('docsify.search.index'))

  if (isExpired) {
    INDEXS = {}
  } else if (!isAuto) {
    return
  }

  const paths = isAuto ? getAllPaths(vm.router) : config.paths
  const len = paths.length
  let count = 0

  paths.forEach(path => {
    if (INDEXS[path]) return count++

    helper
      .get(vm.router.getFile(path))
      .then(result => {
        INDEXS[path] = genIndex(path, result, vm.router, config.depth)
        len === ++count && saveData(config.maxAge)
      })
  })
}

