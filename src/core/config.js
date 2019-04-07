import {merge, hyphenate, isPrimitive, hasOwn} from './util/core'

export default function () {
  const config = merge(
    {
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
      ext: '.md',
      mergeNavbar: false,
      formatUpdated: '',
      externalLinkTarget: '_blank',
      routerMode: 'hash',
      noCompileLinks: [],
      relativePath: false
    },
    window.$docsify
  )

  const script =
    document.currentScript ||
    [].slice
      .call(document.getElementsByTagName('script'))
      .filter(n => /docsify\./.test(n.src))[0]

  if (script) {
    for (const prop in config) {
      if (hasOwn.call(config, prop)) {
        const val = script.getAttribute('data-' + hyphenate(prop))

        if (isPrimitive(val)) {
          config[prop] = val === '' ? true : val
        }
      }
    }

    if (config.loadSidebar === true) {
      config.loadSidebar = '_sidebar' + config.ext
    }
    if (config.loadNavbar === true) {
      config.loadNavbar = '_navbar' + config.ext
    }
    if (config.coverpage === true) {
      config.coverpage = '_coverpage' + config.ext
    }
    if (config.repo === true) {
      config.repo = ''
    }
    if (config.name === true) {
      config.name = ''
    }
  }

  window.$docsify = config

  return config
}
