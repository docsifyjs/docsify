import { stripIndent } from 'common-tags';
import { hyphenate, isPrimitive } from './util/core.js';

const currentScript = document.currentScript;

/** @param {import('./Docsify.js').Docsify} vm */
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
      notFoundPage: false,
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
        if (value) {
          this.__themeColor = value;

          // eslint-disable-next-line no-console
          console.warn(
            stripIndent(`
              $docsify.themeColor is deprecated. Use the "--theme-color" theme property to set your theme color.
              <style>
                :root {
                  --theme-color: deeppink;
                }
              </style>
            `).trim(),
          );
        }
      },
    },

    typeof window.$docsify === 'function'
      ? window.$docsify(vm)
      : window.$docsify,
  );

  // Merge default and user-specified key bindings
  if (config.keyBindings !== false) {
    config.keyBindings = Object.assign(
      // Default
      {
        toggleSidebar: {
          bindings: ['\\'],
          callback(e) {
            const toggleElm = document.querySelector('.sidebar-toggle-button');

            if (toggleElm) {
              toggleElm.click();
            }
          },
        },
      },
      // User-specified
      config.keyBindings,
    );
  }

  const script =
    currentScript ||
    Array.from(document.getElementsByTagName('script')).filter(n =>
      /docsify\./.test(n.src),
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
