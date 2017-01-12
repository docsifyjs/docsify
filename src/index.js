import { load, camel2kebab, isNil, getRoute, merge } from './util'
import { scrollIntoView, activeLink } from './event'
import * as render from './render'

const OPTIONS = merge({
  el: '#app',
  repo: '',
  maxLevel: 6,
  subMaxLevel: 0,
  sidebar: '',
  sidebarToggle: false,
  loadSidebar: null,
  loadNavbar: null,
  router: false,
  homepage: 'README.md',
  coverpage: '',
  basePath: '',
  auto2top: false,
  name: '',
  nameLink: window.location.pathname
}, window.$docsify)
const script = document.currentScript || [].slice.call(document.getElementsByTagName('script')).pop()

// load configuration for script attribute
if (script) {
  for (const prop in OPTIONS) {
    const val = script.getAttribute('data-' + camel2kebab(prop))
    OPTIONS[prop] = isNil(val) ? OPTIONS[prop] : (val || true)
  }
  if (OPTIONS.loadSidebar === true) OPTIONS.loadSidebar = '_sidebar.md'
  if (OPTIONS.loadNavbar === true) OPTIONS.loadNavbar = '_navbar.md'
  if (OPTIONS.coverpage === true) OPTIONS.coverpage = '_coverpage.md'
  if (OPTIONS.sidebar) OPTIONS.sidebar = window[OPTIONS.sidebar]
}

// load options
render.init(OPTIONS)

let cacheRoute = null
let cacheXhr = null

const mainRender = function (cb) {
  const route = OPTIONS.basePath + getRoute()
  if (cacheRoute === route) return cb()

  let basePath = cacheRoute = route

  if (!/\//.test(basePath)) {
    basePath = ''
  } else if (basePath && !/\/$/.test(basePath)) {
    basePath = basePath.match(/(\S*\/)[^\/]+$/)[1]
  }

  let page
  if (!route) {
    page = OPTIONS.homepage || 'README.md'
  } else if (/\/$/.test(route)) {
    page = `${route}README.md`
  } else {
    page = `${route}.md`
  }

  // Render Cover page
  if (OPTIONS.coverpage && page === OPTIONS.homepage) {
    load(OPTIONS.coverpage).then(render.renderCover)
  }

  cacheXhr && cacheXhr.abort && cacheXhr.abort()
  // Render markdown file
  cacheXhr = load(page, 'GET', render.renderLoading)
  cacheXhr.then(result => {
    render.renderArticle(result)
    // clear cover
    if (OPTIONS.coverpage && page !== OPTIONS.homepage) render.renderCover()
    // render sidebar
    if (OPTIONS.loadSidebar) {
      load(basePath + OPTIONS.loadSidebar)
        .then(result => {
          render.renderSidebar(result)
          cb()
        })
    } else {
      cb()
    }
  }, _ => render.renderArticle(null))

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
      scrollIntoView()
      activeLink('nav')
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
