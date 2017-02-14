import * as utils from './util'
import { scrollIntoView, activeLink } from './event'
import * as render from './render'
import Hook from './hook'

const OPTIONS = utils.merge({
  el: '#app',
  repo: '',
  maxLevel: 6,
  subMaxLevel: 0,
  loadSidebar: null,
  loadNavbar: null,
  homepage: 'README.md',
  coverpage: '',
  basePath: '',
  auto2top: false,
  name: '',
  themeColor: '',
  nameLink: window.location.pathname,
  ga: ''
}, window.$docsify)
const script = document.currentScript || [].slice.call(document.getElementsByTagName('script')).pop()

// load configuration for script attribute
if (script) {
  for (const prop in OPTIONS) {
    const val = script.getAttribute('data-' + utils.camel2kebab(prop))
    OPTIONS[prop] = utils.isNil(val) ? OPTIONS[prop] : (val || true)
  }
  if (OPTIONS.loadSidebar === true) OPTIONS.loadSidebar = '_sidebar.md'
  if (OPTIONS.loadNavbar === true) OPTIONS.loadNavbar = '_navbar.md'
  if (OPTIONS.coverpage === true) OPTIONS.coverpage = '_coverpage.md'
  if (OPTIONS.repo === true) OPTIONS.repo = ''
  if (OPTIONS.name === true) OPTIONS.name = ''
}

const hook = new Hook()

// utils
window.$docsify = OPTIONS
window.Docsify = {
  installed: true,
  utils: utils.merge({}, utils),
  hook
}

// load options
render.init()

let cacheRoute = null
let cacheXhr = null

const getAlias = function (route) {
  if (OPTIONS.alias[route]) {
    return getAlias(OPTIONS.alias[route])
  } else {
    return route
  }
}

const mainRender = function (cb) {
  let page
  let route = utils.getRoute()
  if (cacheRoute === route) return cb()

  let basePath = cacheRoute = OPTIONS.basePath + route

  if (!/\//.test(basePath)) {
    basePath = ''
  } else if (basePath && !/\/$/.test(basePath)) {
    basePath = basePath.match(/(\S*\/)[^\/]+$/)[1]
  }

  // replace route
  if (OPTIONS.alias && OPTIONS.alias['/' + route]) {
    route = getAlias('/' + route)
  } else {
    route = (OPTIONS.basePath + route).replace(/\/+/, '/')
  }

  if (!route) {
    page = OPTIONS.homepage || 'README.md'
  } else if (/\.md$/.test(route)) {
    page = route
  } else if (/\/$/.test(route)) {
    page = `${route}README.md`
  } else {
    page = `${route}.md`
  }

  // Render Cover page
  if (OPTIONS.coverpage && page === OPTIONS.homepage) {
    utils.load(OPTIONS.coverpage).then(render.renderCover)
  }

  cacheXhr && cacheXhr.abort && cacheXhr.abort()
  // Render markdown file
  cacheXhr = utils.load(page, 'GET', render.renderLoading)
  cacheXhr.then(result => {
    render.renderArticle(result)
    // clear cover
    if (OPTIONS.coverpage && page !== OPTIONS.homepage) render.renderCover()
    // render sidebar
    if (OPTIONS.loadSidebar) {
      const renderSidebar = result => { render.renderSidebar(result); cb() }

      utils.load(basePath + OPTIONS.loadSidebar).then(renderSidebar,
        _ => utils.load(OPTIONS.loadSidebar).then(renderSidebar))
    } else {
      cb()
    }
  }, _ => render.renderArticle(null))

  // Render navbar
  if (OPTIONS.loadNavbar) {
    utils.load(basePath + OPTIONS.loadNavbar).then(render.renderNavbar,
      _ => utils.load(OPTIONS.loadNavbar).then(render.renderNavbar))
  }
}

const Docsify = function () {
  setTimeout(_ => {
    ;[].concat(OPTIONS.plugins).forEach(fn => typeof fn === 'function' && fn(hook))
    window.Docsify.hook.emit('init')

    const dom = document.querySelector(OPTIONS.el) || document.body
    const replace = dom !== document.body
    const main = function () {
      mainRender(_ => {
        scrollIntoView()
        activeLink('nav')
        window.Docsify.hook.emit('doneEach')
      })
    }

    // Render app
    render.renderApp(dom, replace)
    main()
    if (!/^#\//.test(window.location.hash)) window.location.hash = '#/'
    window.addEventListener('hashchange', main)
    window.Docsify.hook.emit('ready')
  }, 0)
}

export default Docsify()
