import { merge, hyphenate, isPrimitive, hasOwn } from './util/core';

const currentScript = document.currentScript;

/** @param {import('./Docsify').Docsify} vm */
export default function (vm) {
  const config = merge(
    {
      auto2top: false,
      autoHeader: false,
      basePath: '',
      catchPluginErrors: true,
      cornerExternalLinkTarget: '_blank',
      coverpage: '',
      crossOriginLinks: [],
      el: '#app',
      executeScript: null,
      ext: '.md',
      externalLinkRel: 'noopener',
      externalLinkTarget: '_blank',
      formatUpdated: '',
      ga: '',
      homepage: 'README.md',
      loadNavbar: null,
      loadSidebar: null,
      maxLevel: 6,
      mergeNavbar: false,
      name: '',
      nameLink: window.location.pathname,
      nativeEmoji: false,
      noCompileLinks: [],
      noEmoji: false,
      notFoundPage: true,
      relativePath: false,
      repo: '',
      routes: {},
      routerMode: 'hash',
      subMaxLevel: 0,
      themeColor: '',
      topMargin: 0,
    },
    typeof window.$docsify === 'function'
      ? window.$docsify(vm)
      : window.$docsify
  );

  const script =
    currentScript ||
    [].slice
      .call(document.getElementsByTagName('script'))
      .filter(n => /docsify\./.test(n.src))[0];

  if (script) {
    for (const prop in config) {
      if (hasOwn.call(config, prop)) {
        const val = script.getAttribute('data-' + hyphenate(prop));

        if (isPrimitive(val)) {
          config[prop] = val === '' ? true : val;
        }
      }
    }
  }

  if (config.loadSidebar === true) {
    config.loadSidebar = '_sidebar' + config.ext;
  }

  if (config.loadNavbar === true) {
    config.loadNavbar = '_navbar' + config.ext;
  }

  if (config.coverpage === true) {
    config.coverpage = '_coverpage' + config.ext;
  }

  if (config.repo === true) {
    config.repo = '';
  }

  if (config.name === true) {
    config.name = '';
  }

  window.$docsify = config;

  return config;
}
