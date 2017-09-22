import { search } from './search'

let NO_DATA_TEXT = ''

function style () {
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
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
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
}`

  Docsify.dom.style(code)
}

function tpl (opts, defaultValue = '') {
  const html =
    `<input type="search" value="${defaultValue}" />` +
    '<div class="results-panel"></div>' +
    '</div>'
  const el = Docsify.dom.create('div', html)
  const aside = Docsify.dom.find('aside')

  Docsify.dom.toggleClass(el, 'search')
  Docsify.dom.before(aside, el)
}

function doSearch (value) {
  const $search = Docsify.dom.find('div.search')
  const $panel = Docsify.dom.find($search, '.results-panel')

  if (!value) {
    $panel.classList.remove('show')
    $panel.innerHTML = ''
    return
  }
  const matchs = search(value)

  let html = ''
  matchs.forEach(post => {
    html += `<div class="matching-post">
<h2><a href="${post.url}">${post.title}</a></h2>
<p>${post.content}</p>
</div>`
  })

  $panel.classList.add('show')
  $panel.innerHTML = html || `<p class="empty">${NO_DATA_TEXT}</p>`
}

function bindEvents () {
  const $search = Docsify.dom.find('div.search')
  const $input = Docsify.dom.find($search, 'input')

  let timeId
  // Prevent to Fold sidebar
  Docsify.dom.on(
    $search,
    'click',
    e => e.target.tagName !== 'A' && e.stopPropagation()
  )
  Docsify.dom.on($input, 'input', e => {
    clearTimeout(timeId)
    timeId = setTimeout(_ => doSearch(e.target.value.trim()), 100)
  })
}

function updatePlaceholder (text, path) {
  const $input = Docsify.dom.getNode('.search input[type="search"]')

  if (!$input) return
  if (typeof text === 'string') {
    $input.placeholder = text
  } else {
    const match = Object.keys(text).filter(key => path.indexOf(key) > -1)[0]
    $input.placeholder = text[match]
  }
}

function updateNoData (text, path) {
  if (typeof text === 'string') {
    NO_DATA_TEXT = text
  } else {
    const match = Object.keys(text).filter(key => path.indexOf(key) > -1)[0]
    NO_DATA_TEXT = text[match]
  }
}

export function init (opts, vm) {
  const keywords = vm.router.parse().query.s

  style()
  tpl(opts, keywords)
  bindEvents()
  keywords && setTimeout(_ => doSearch(keywords), 500)
}

export function update (opts, vm) {
  updatePlaceholder(opts.placeholder, vm.route.path)
  updateNoData(opts.noData, vm.route.path)
}
