import stripIndent from 'strip-indent';
import { hyphenate, isPrimitive } from './util/core.js';

const currentScript = document.currentScript;

/** @param {import('./Docsify').Docsify} vm */
export default function (vm) {
  const config = Object.assign(
    {
      auto2top: false,
      autoHeader: false,
      basePath: '',
      catchPluginErrors: true,
      cornerExternalLinkTarget: '_blank',
      coverpage: '',
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
      plugins: [],
      relativePath: false,
      repo: '',
      routes: {},
      routerMode: 'hash',
      subMaxLevel: 0,
      // themeColor: '',
      topMargin: 0,

      // Deprecations //////////////////

      __themeColor: '',
      get themeColor() {
        return this.__themeColor;
      },
      set themeColor(value) {
        this.__themeColor = value;
        console.warn(
          stripIndent(/* html */ `
            $docsify.themeColor is deprecated. Use a --theme-color property in your style sheet. Example:
            <style>
              :root {
                --theme-color: deeppink;
              }
            </style>
          `).trim()
        );
      },
    },

    typeof window.$docsify === 'function'
      ? window.$docsify(vm)
      : window.$docsify
  );

  const script =
    currentScript ||
    Array.from(document.getElementsByTagName('script')).filter(n =>
      /docsify\./.test(n.src)
    )[0];

  if (script) {
    for (const prop of Object.keys(config)) {
      const val = script.getAttribute('data-' + hyphenate(prop));

      if (isPrimitive(val)) {
        config[prop] = val === '' ? true : val;
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
