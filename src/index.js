import { load, camel2kebab, isNil } from './util'
import * as render from './render'

const OPTIONS = {
  el: '#app',
  repo: '',
  maxLevel: 6,
  sidebar: '',
  loadSidebar: null,
  loadNavbar: null
}
const script = document.currentScript || [].slice.call(document.getElementsByTagName('script')).pop()

// load configuration for script attribute
if (script) {
  for (const prop in OPTIONS) {
    const val = script.getAttribute('data-' + camel2kebab(prop))
    OPTIONS[prop] = isNil(val) ? OPTIONS[prop] : (val || true)
  }
  if (OPTIONS.loadSidebar === true) OPTIONS.loadSidebar = '_sidebar.md'
  if (OPTIONS.loadNavbar === true) OPTIONS.loadNavbar = '_navbar.md'
  if (OPTIONS.sidebar) OPTIONS.sidebar = window[OPTIONS.sidebar]
}

const Docsify = function () {
  const dom = document.querySelector(OPTIONS.el) || document.body
  const replace = dom !== document.body
  let loc = document.location.pathname

  if (/\/$/.test(loc)) loc += 'README'

  // Render app
  render.renderApp(dom, replace, OPTIONS)

  // Render markdown file
  load(`${loc}.md`)
    .then(render.renderArticle, _ => render.renderArticle())

  // Render sidebar
  if (OPTIONS.loadSidebar) {
    load(OPTIONS.loadSidebar)
      .then(content => render.renderSidebar(content, OPTIONS))
  }

  // Render navbar
  if (OPTIONS.loadNavbar) {
    load(OPTIONS.loadNavbar)
      .then(content => render.renderNavbar(content, OPTIONS))
  }
}

export default Docsify()
