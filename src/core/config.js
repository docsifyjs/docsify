import { stripIndent } from 'common-tags';
import { hyphenate, isPrimitive } from './util/core.js';
/** @import { Docsify } from './Docsify.js' */
/** @import { Hooks } from './init/lifecycle.js' */

const currentScript = document.currentScript;

const defaultDocsifyConfig = () => ({
  alias: /** @type {Record<string, string>} */ ({}),
  auto2top: false,
  autoHeader: false,
  basePath: '',
  catchPluginErrors: true,
  cornerExternalLinkTarget:
    /** @type {'_blank' | '_self' | '_parent' | '_top'  | '_unfencedTop'} */ (
      '_blank'
    ),
  coverpage: /** @type {boolean | string} */ (''),
  el: '#app',
  executeScript: /** @type {null | boolean} */ (null),
  ext: '.md',
  externalLinkRel: /** @type {'noopener' | string} */ ('noopener'), // TODO string union type based on spec
  externalLinkTarget:
    /** @type {'_blank' | '_self' | '_parent' | '_top'  | '_unfencedTop'} */ (
      '_blank'
    ),
  fallbackLanguages: /** @type {null | string[]} */ (null),
  fallbackDefaultLanguage: '',
  formatUpdated: /** @type {string | ((updatedAt: string) => string)} */ (''),
  pageTitleFormatter: /** @type {null | ((name: string) => string)} */ (null),
  /** For the frontmatter plugin. */
  frontMatter: /** @type {Record<string, TODO> | null} */ (null),
  hideSidebar: false,
  homepage: 'README.md',
  keyBindings:
    /** @type {false | { [commandName: string]: { bindings: string[]; callback: Function } }} */ ({}),
  loadNavbar: /** @type {null | boolean | string} */ (null),
  loadSidebar: /** @type {null | boolean | string} */ (null),
  logo: false,
  markdown: null,
  maxLevel: 6,
  mergeNavbar: false,
  name: /** @type {boolean | string} */ (''),
  nameLink: window.location.pathname,
  nativeEmoji: false,
  noCompileLinks: /** @type {string[]} */ ([]),
  noEmoji: false,
  notFoundPage: /** @type {boolean | string | Record<string, string>} */ (
    false
  ),
  onlyCover: false,
  plugins: /** @type {Plugin[]} */ ([]),
  relativePath: false,
  repo: /** @type {string} */ (''),
  requestHeaders: /** @type {Record<string, string>} */ ({}),
  routerMode: /** @type {'hash' | 'history'} */ 'hash',
  routes: /** @type {Record<string, string | RouteHandler>} */ ({}),
  skipLink: /** @type {false | string | Record<string, string>} */ (
    'Skip to main content'
  ),
  subMaxLevel: 0,
  vueComponents: /** @type {Record<string, TODO>} */ ({}),
  vueGlobalOptions: /** @type {Record<string, TODO>} */ ({}),
  vueMounts: /** @type {Record<string, TODO>} */ ({}),

  // Deprecations //////////////////

  /** @deprecated */
  get themeColor() {
    return this.__themeColor;
  },
  set themeColor(value) {
    if (value) {
      this.__themeColor = value;

      // eslint-disable-next-line no-console
      console.warn(
        stripIndent(`
          $docsify.themeColor is deprecated as of v5. Use the "--theme-color" CSS property to customize your theme color.
          <style>
            :root {
              --theme-color: deeppink;
            }
          </style>
        `).trim(),
      );
    }
  },
  __themeColor: '',

  /** @deprecated */
  get topMargin() {
    return this.__topMargin;
  },
  set topMargin(value) {
    if (value) {
      this.__topMargin = value;

      // eslint-disable-next-line no-console
      console.warn(
        stripIndent(`
          $docsify.topMargin is deprecated as of v5. Use the "--scroll-padding-top" CSS property to specify a scroll margin when using a sticky navbar.
          <style>
            :root {
              --scroll-padding-top: 10px;
            }
          </style>
        `).trim(),
      );
    }
  },
  __topMargin: 0,
});

/** @typedef {ReturnType<typeof defaultDocsifyConfig>} DocsifyConfig */

/**
 * @param {import('./Docsify.js').Docsify} vm
 * @param {Partial<DocsifyConfig>} config
 * @returns {DocsifyConfig}
 */
export default function (vm, config = {}) {
  config = Object.assign(
    defaultDocsifyConfig(),

    // Handle non-function configs no matter what (f.e. plugins assign options onto it)
    window.$docsify,

    // Also handle function config (the app can specificy a function, and plugins will assign options onto it)
    typeof window.$docsify === 'function' ? window.$docsify(vm) : undefined,

    // Finally, user config passed directly to the instance has priority.
    config,
  );

  // Merge default and user-specified key bindings
  if (config.keyBindings !== false) {
    config.keyBindings = Object.assign(
      // Default
      {
        toggleSidebar: {
          bindings: ['\\'],
          callback(/** @type {KeyboardEvent} */ e) {
            const toggleElm = /** @type {HTMLElement} */ (
              document.querySelector('.sidebar-toggle-button')
            );

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
    for (const prop of /** @type {(keyof DocsifyConfig)[]} */ (
      Object.keys(config)
    )) {
      const val = script.getAttribute('data-' + hyphenate(prop));

      if (isPrimitive(val)) {
        // eslint-disable-next-line no-console
        console.warn(
          `DEPRECATION: data-* attributes on the docsify global script (f.e. ${
            'data-' + hyphenate(prop)
          }) are deprecated.`,
        );

        // @ts-expect-error too dynamic for TS
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

  if (config.name === true) {
    config.name = '';
  }

  return /** @type {DocsifyConfig} */ (config);
}

/** @typedef {any} TODO */

/** @typedef {(hooks: Hooks, vm: Docsify) => void} Plugin */

/**
 @typedef {(
    ((route: string, matched: RegExpMatchArray) => string) |
    ((route: string, matched: RegExpMatchArray, next: (markdown?: string) => void) => void)
 )} RouteHandler - Given a route, provides the markdown to render for that route.
 */

/**
@typedef {
  {
    subMaxLevel: number,
    themeColor: string,
    topMargin: number,
  }
} DocsifyConfigOld
*/
