import { load, camel2kebab, isNil, getRoute } from './util'
import { activeLink, scrollIntoView } from './event'
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

let cacheRoute = null
let cacheXhr = null

const mainRender = function (cb) {
  const route = getRoute()
  if (cacheRoute === route) return cb()
  let wait
  let basePath = cacheRoute = route

  if (!/\//.test(basePath)) {
    basePath = ''
  } else if (basePath && !/\/$/.test(basePath)) {
    basePath = basePath.match(/(\S*\/)[^\/]+$/)[1]
  }

  cacheXhr && cacheXhr.abort && cacheXhr.abort()
  // Render markdown file
  cacheXhr = load(
    (!route || /\/$/.test(route)) ? `${route}README.md` : `${route}.md`,
    'GET',
    render.renderLoading)

  cacheXhr.then(result => {
    render.renderArticle(result)
    if (OPTIONS.loadSidebar) {
      if (wait === false) cb()
      wait = false
    } else {
      cb()
    }
  }, _ => render.renderArticle(null))

  // Render sidebar
  if (OPTIONS.loadSidebar) {
    load(basePath + OPTIONS.loadSidebar).then(result => {
      render.renderSidebar(result)
      if (wait === false) cb()
      wait = false
    })
  }

  // Render navbar
  if (OPTIONS.loadNavbar) {
    load(basePath + OPTIONS.loadNavbar).then(render.renderNavbar)
  }
}

const Docsify = function () {
  const dom = document.querySelector(OPTIONS.el) || document.body
  const replace = dom !== document.body
  const main = function () {
    mainRender(_ => {
      activeLink('aside.sidebar', true)
      scrollIntoView()
    })
  }

  // Render app
  render.renderApp(dom, replace)
  main()
  if (OPTIONS.router) {
    if (!/^#\//.test(window.location.hash)) window.location.hash = '#/'
    window.addEventListener('hashchange', main)
  }
}

export default Docsify()
