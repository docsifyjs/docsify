import { search } from './search'

let dom

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
  const style = dom.create('style', code)
  dom.appendTo(dom.head, style)
}

function tpl (opts) {
  const html =
    `<input type="search" placeholder="${opts.placeholder}" />` +
      '<div class="results-panel"></div>' +
    '</div>'
  const el = dom.create('div', html)
  const aside = dom.find('aside')

  dom.toggleClass(el, 'search')
  dom.before(aside, el)
}

function bindEvents () {
  const $search = dom.find('div.search')
  const $input = dom.find($search, 'input')
  const $panel = dom.find($search, '.results-panel')

  // Prevent to Fold sidebar
  dom.on($search, 'click',
    e => e.target.tagName !== 'A' && e.stopPropagation())

  dom.on($input, 'input', e => {
    const value = e.target.value.trim()
    if (!value) {
      $panel.classList.remove('show')
      $panel.innerHTML = ''
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
    $panel.innerHTML = html || '<p class="empty">No Results!</p>'
  })
}

export default function (opts) {
  dom = Docsify.dom
  style()
  tpl(opts)
  bindEvents()
}
