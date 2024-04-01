import stripIndent from 'strip-indent';
import { hyphenate, isPrimitive } from './util/core.js';

const currentScript = document.currentScript;

/**
@typedef {
  {
      auto2top: boolean
      autoHeader: boolean
      basePath: string
      catchPluginErrors: boolean
      cornerExternalLinkTarget: '_blank' | '_self' | '_parent' | '_top'  | '_unfencedTop'
      coverpage: boolean | string
      el: string
      executeScript: null | boolean
      ext: string
      externalLinkRel: 'noopener' | string
      externalLinkTarget: '_blank' | '_self' | '_parent' | '_top'  | '_unfencedTop'
      formatUpdated: string
      ga: string
      homepage: string
      keyBindings: false | {
        [commandName: string]: {
          bindings: string[]
          callback: Function
        }
      }
      loadNavbar: null | boolean | string
      loadSidebar: null | boolean | string
      maxLevel: number
      mergeNavbar: boolean
      name: boolean | string
      nameLink: string
      nativeEmoji: boolean
      noCompileLinks: string[]
      noEmoji: boolean
      notFoundPage: boolean | string | Record<string, string>
      plugins: Function[]
      relativePath: boolean
      repo: boolean | string
      routes: Record<string, string | Function>
      routerMode: 'hash' | 'history'
      subMaxLevel: number,
      topMargin: number,

      themeColor: string,
  }
} DocsifyConfig
*/

/**
 * @param {import('./Docsify.js').Docsify} vm
 * @param {Partial<DocsifyConfig>} config
 * @returns {DocsifyConfig}
 */
export default function (vm, config = {}) {
  if (window.$docsify) {
    console.warn(
      'DEPRECATION: The global $docsify config variable is deprecated. See the latest getting started docs. https://docsify.js.org/#/quickstart'
    );
  }

  config = Object.assign(
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
      keyBindings: {},
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
      : window.$docsify,

    config
  );

  // Merge default and user-specified key bindings
  if (config.keyBindings !== false) {
    config.keyBindings = Object.assign(
      // Default
      {
        toggleSidebar: {
          bindings: ['\\'],
          callback(e) {
            const toggleElm = document.querySelector('.sidebar-toggle');

            if (toggleElm) {
              toggleElm.click();
              toggleElm.focus();
            }
          },
        },
      },
      // User-specified
      config.keyBindings
    );
  }

  const script =
    currentScript ||
    Array.from(document.getElementsByTagName('script')).filter(n =>
      /docsify\./.test(n.src)
    )[0];

  if (script) {
    for (const prop of Object.keys(config)) {
      const val = script.getAttribute('data-' + hyphenate(prop));

      if (isPrimitive(val)) {
        console.warn(
          `DEPRECATION: data-* attributes on the docsify global script (f.e. ${
            'data-' + hyphenate(prop)
          }) are deprecated.`
        );
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

  return /** @type {DocsifyConfig} */ (config);
}
