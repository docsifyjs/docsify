import { merge, hyphenate, isPrimitive } from './util/core'

const config = merge({
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
  autoHeader: false,
  executeScript: null,
  noEmoji: false,
  ga: '',
  mergeNavbar: false,
  formatUpdated: '',
  externalLinkTarget: '_blank',
  routerMode: 'hash',
  noCompileLinks: []
}, window.$docsify)

const script = document.currentScript ||
  [].slice.call(document.getElementsByTagName('script'))
    .filter(n => /docsify\./.test(n.src))[0]

if (script) {
  for (const prop in config) {
    const val = script.getAttribute('data-' + hyphenate(prop))

    if (isPrimitive(val)) {
      config[prop] = val === '' ? true : val
    }
  }

  if (config.loadSidebar === true) config.loadSidebar = '_sidebar.md'
  if (config.loadNavbar === true) config.loadNavbar = '_navbar.md'
  if (config.coverpage === true) config.coverpage = '_coverpage.md'
  if (config.repo === true) config.repo = ''
  if (config.name === true) config.name = ''
}

window.$docsify = config

export default config
