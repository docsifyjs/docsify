import {
  init as initComponent,
  update as updateComponent,
} from './component.js';
import { init as initSearch } from './search.js';

/**
 * @type {{
 *   placeholder: string;
 *   noData: string;
 *   paths: string[] | 'auto';
 *   depth: number;
 *   maxAge: number;
 *   namespace?: string;
 *   pathNamespaces?: RegExp | string[];
 *   keyBindings: string[];
 *   insertAfter?: string;
 *   insertBefore?: string;
 * }} */
const CONFIG = {
  placeholder: 'Type to search',
  noData: 'No Results!',
  paths: 'auto',
  depth: 2,
  maxAge: 86400000, // 1 day
  namespace: undefined,
  pathNamespaces: undefined,
  keyBindings: ['/', 'meta+k', 'ctrl+k'],
  insertAfter: undefined, // CSS selector
  insertBefore: undefined, // CSS selector
};

const install = function (hook, vm) {
  const { util } = Docsify;
  const opts = vm.config.search || CONFIG;

  if (Array.isArray(opts)) {
    CONFIG.paths = opts;
  } else if (typeof opts === 'object') {
    CONFIG.paths = Array.isArray(opts.paths) ? opts.paths : 'auto';
    CONFIG.maxAge = util.isPrimitive(opts.maxAge) ? opts.maxAge : CONFIG.maxAge;
    CONFIG.placeholder = opts.placeholder || CONFIG.placeholder;
    CONFIG.noData = opts.noData || CONFIG.noData;
    CONFIG.depth = opts.depth || CONFIG.depth;
    CONFIG.namespace = opts.namespace || CONFIG.namespace;
    CONFIG.pathNamespaces = opts.pathNamespaces || CONFIG.pathNamespaces;
    CONFIG.keyBindings = opts.keyBindings || CONFIG.keyBindings;
  }

  const isAuto = CONFIG.paths === 'auto';

  hook.init(() => {
    const { keyBindings } = vm.config;

    // Add key bindings
    if (keyBindings.constructor === Object) {
      keyBindings.focusSearch = {
        bindings: CONFIG.keyBindings,
        callback(e) {
          const sidebarElm = document.querySelector('.sidebar');
          const sidebarToggleElm = /** @type {HTMLElement} */ (
            document.querySelector('.sidebar-toggle')
          );
          const searchElm = /** @type {HTMLInputElement | null} */ (
            sidebarElm?.querySelector('input[type="search"]')
          );
          const isSidebarHidden =
            (sidebarElm?.getBoundingClientRect().x ?? 0) < 0;

          isSidebarHidden && sidebarToggleElm?.click();

          setTimeout(() => searchElm?.focus(), isSidebarHidden ? 250 : 0);
        },
      };
    }
  });
  hook.mounted(_ => {
    initComponent(CONFIG, vm);
    !isAuto && initSearch(CONFIG, vm);
  });
  hook.doneEach(_ => {
    updateComponent(CONFIG, vm);
    isAuto && initSearch(CONFIG, vm);
  });
};

window.$docsify = window.$docsify || {};
window.$docsify.plugins = [install, ...(window.$docsify.plugins || [])];
