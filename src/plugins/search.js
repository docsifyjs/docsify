let INDEXS = {}
const CONFIG = {
  placeholder: 'Type to search',
  paths: 'auto',
  maxAge: 86400000 // 1 day
}

const isObj = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

const escapeHtml = function (string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  }

  return String(string).replace(/[&<>"'\/]/g, s => entityMap[s])
}

/**
 * find all filepath from A tag
 */
const getAllPaths = function () {
  const paths = []

  ;[].slice.call(document.querySelectorAll('a'))
    .map(node => {
      const href = node.href
      if (/#\/[^#]*?$/.test(href)) {
        const path = href.replace(/^[^#]+#/, '')

        if (paths.indexOf(path) <= 0) paths.push(path)
      }
    })

  return paths
}

/**
 * return file path
 */
const genFilePath = function (path) {
  const basePath = window.$docsify.basePath
  let filePath = /\/$/.test(path) ? `${path}README.md` : `${path}.md`

  filePath = basePath + filePath

  return filePath.replace(/\/+/g, '/')
}

/**
 * generate index
 */
const genIndex = function (path, content = '') {
  INDEXS[path] = { slug: '', title: '', body: '' }
  let slug

  content
    // remove PRE and TEMPLATE tag
    .replace(/<template[^>]*?>[\s\S]+?<\/template>/g, '')
    // find all html tag
    .replace(/<(\w+)([^>]*?)>([\s\S]+?)<\//g, (match, tag, attr, html) => {
      // remove all html tag
      const text = html.replace(/<[^>]+>/g, '')

      // tag is headline
      if (/^h\d$/.test(tag)) {
        // <h1 id="xxx"></h1>
        const id = attr.match(/id="(\S+)"/)[1]

        slug = `#/${path}#${id}`.replace(/\/+/, '/')
        INDEXS[slug] = { slug, title: text, body: '' }
      } else {
        // other html tag
        if (!INDEXS[slug]) {
          INDEXS[slug] = {}
        } else {
          if (INDEXS[slug].body && INDEXS[slug].body.length) {
            INDEXS[slug].body += '\n' + text
          } else {
            INDEXS[slug].body = text
          }
        }
      }
    })
}

/**
 * component
 */
class SearchComponent {
  constructor () {
    if (this.rendered) return

    this.style()

    const el = document.createElement('div')
    const aside = document.querySelector('aside')

    el.classList.add('search')
    aside.insertBefore(el, aside.children[0])
    this.render(el)
    this.rendered = true
    this.bindEvent()
  }

  style () {
    const code = `
      .sidebar {
        padding-top: 0;
      }

      .search {
        margin-bottom: 20px;
        padding: 6px;
        border-bottom: 1px solid #eee;
      }

      .search .results-panel {
        display: none;
      }

      .search .results-panel.show {
        display: block;
      }

      .search input {
        outline: none;
        border: none;
        width: 100%;
        padding: 7px;
        line-height: 22px;
        font-size: 14px;
      }

      .search h2 {
        font-size: 17px;
        margin: 10px 0;
      }

      .search a {
        text-decoration: none;
        color: inherit;
      }

      .search .matching-post {
        border-bottom: 1px solid #eee;
      }

      .search .matching-post:last-child {
        border-bottom: 0;
      }

      .search p {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .search p.empty {
        text-align: center;
      }
    `
    const style = document.createElement('style')

    style.innerHTML = code
    document.head.appendChild(style)
  }

  render (dom) {
    dom.innerHTML = `<input type="search" placeholder="${CONFIG.placeholder}" /><div class="results-panel"></div>`
  }

  bindEvent () {
    const search = document.querySelector('.search')
    const input = search.querySelector('.search input')
    const panel = search.querySelector('.results-panel')

    search.addEventListener('click', e => e.target.tagName !== 'A' && e.stopPropagation())
    input.addEventListener('input', e => {
      const target = e.target

      if (target.value.trim() !== '') {
        const matchingPosts = this.search(target.value)
        let html = ''

        matchingPosts.forEach(function (post, index) {
          html += `
          <div class="matching-post">
            <h2><a href="${post.url}">${post.title}</a></h2>
            <p>${post.content}</p>
          </div>
          `
        })
        if (panel.classList.contains('results-panel')) {
          panel.classList.add('show')
          panel.innerHTML = html || '<p class="empty">No Results!</p>'
        }
      } else {
        if (panel.classList.contains('results-panel')) {
          panel.classList.remove('show')
          panel.innerHTML = ''
        }
      }
    })
  }

  // From [weex website] https://weex-project.io/js/common.js
  search (keywords) {
    const matchingResults = []
    const data = Object.keys(INDEXS).map(key => INDEXS[key])

    keywords = keywords.trim().split(/[\s\-\，\\/]+/)

    for (let i = 0; i < data.length; i++) {
      const post = data[i]
      let isMatch = false
      let resultStr = ''
      const postTitle = post.title && post.title.trim()
      const postContent = post.body && post.body.trim()
      const postUrl = post.slug || ''

      if (postTitle !== '' && postContent !== '') {
        keywords.forEach((keyword, i) => {
          const regEx = new RegExp(keyword, 'gi')
          let indexTitle = -1
          let indexContent = -1

          indexTitle = postTitle.search(regEx)
          indexContent = postContent.search(regEx)

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
              postContent
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
}

const searchPlugin = function () {
  const isAuto = CONFIG.paths === 'auto'
  const isExpired = localStorage.getItem('docsify.search.expires') < Date.now()

  INDEXS = JSON.parse(localStorage.getItem('docsify.search.index'))

  if (isExpired) {
    INDEXS = {}
  } else if (!isAuto) {
    return
  }

  let count = 0
  const paths = isAuto ? getAllPaths() : CONFIG.paths
  const len = paths.length
  const { load, marked, slugify } = window.Docsify.utils
  const done = () => {
    localStorage.setItem('docsify.search.expires', Date.now() + CONFIG.maxAge)
    localStorage.setItem('docsify.search.index', JSON.stringify(INDEXS))
  }

  paths.forEach(path => {
    if (INDEXS[path]) return count++

    load(genFilePath(path)).then(content => {
      genIndex(path, marked(content))
      slugify.clear()
      count++

      if (len === count) done()
    })
  })
}

const install = function () {
  if (!window.Docsify || !window.Docsify.installed) {
    console.error('[Docsify] Please load docsify.js first.')
    return
  }

  window.$docsify.plugins = [].concat(window.$docsify.plugins, searchPlugin)

  const userConfig = window.$docsify.search
  const isNil = window.Docsify.utils.isNil

  if (Array.isArray(userConfig)) {
    CONFIG.paths = userConfig
  } else if (isObj(userConfig)) {
    CONFIG.paths = Array.isArray(userConfig.paths) ? userConfig.paths : 'auto'
    CONFIG.maxAge = isNil(userConfig.maxAge) ? CONFIG.maxAge : userConfig.maxAge
    CONFIG.placeholder = userConfig.placeholder || CONFIG.placeholder
  }

  new SearchComponent()
}

export default install()
