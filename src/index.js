import { load, camel2kebab, isNil, getRoute } from './util'
import * as render from './render'

const OPTIONS = {
  el: '#app',
  repo: '',
  maxLevel: 6,
  sidebar: '',
  sidebarToggle: false,
  loadSidebar: null,
  loadNavbar: null,
  router: false
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

// load options
render.config(OPTIONS)

const mainRender = function () {
  const route = getRoute()
  let basePath = route

  if (!/\/$/.test(basePath)) basePath = basePath.match(/(\S+\/)[^\/]+$/)[1]

  // Render markdown file
  load(/\/$/.test(route) ? `${route}README.md` : `${route}.md`)
    .then(render.renderArticle, _ => render.renderArticle(null))

  // Render sidebar
  if (OPTIONS.loadSidebar) {
    load(basePath + OPTIONS.loadSidebar).then(render.renderSidebar)
  }

  // Render navbar
  if (OPTIONS.loadNavbar) {
    load(basePath + OPTIONS.loadNavbar).then(render.renderNavbar)
  }
}

const Docsify = function () {
  const dom = document.querySelector(OPTIONS.el) || document.body
  const replace = dom !== document.body

  // Render app
  render.renderApp(dom, replace)
  mainRender()
  if (OPTIONS.router) window.addEventListener('hashchange', mainRender)
}

export default Docsify()
