import {
  init as initComponent,
  update as updateComponent,
} from './component.js';
import { init as initSearch } from './search.js';

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
          const sidebarToggleElm = document.querySelector('.sidebar-toggle');
          const searchElm = sidebarElm?.querySelector('input[type="search"]');
          const isSidebarHidden = sidebarElm?.getBoundingClientRect().x < 0;

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
$docsify.plugins = [install, ...($docsify.plugins || [])];
