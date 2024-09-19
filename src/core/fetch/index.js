/* eslint-disable no-unused-vars */
import { getParentPath, stringifyQuery } from '../router/util.js';
import { noop, isExternal } from '../util/core.js';
import { get } from '../util/ajax.js';

/** @typedef {import('../Docsify.js').Constructor} Constructor */

/**
 * @template {!Constructor} T
 * @param {T} Base - The class to extend
 */
export function Fetch(Base) {
  return class Fetch extends Base {
    #loadNested(path, qs, file, next, vm, first) {
      path = first ? path : path.replace(/\/$/, '');
      path = getParentPath(path);

      if (!path) {
        return;
      }

      get(
        vm.router.getFile(path + file) + qs,
        false,
        vm.config.requestHeaders,
      ).then(next, _error => this.#loadNested(path, qs, file, next, vm));
    }

    #last;

    #abort = () => this.#last && this.#last.abort && this.#last.abort();

    #request = (url, requestHeaders) => {
      this.#abort();
      this.#last = get(url, true, requestHeaders);
      return this.#last;
    };

    #get404Path = (path, config) => {
      const { notFoundPage, ext } = config;
      const defaultPath = '_404' + (ext || '.md');
      let key;
      let path404;

      switch (typeof notFoundPage) {
        case 'boolean':
          path404 = defaultPath;
          break;
        case 'string':
          path404 = notFoundPage;
          break;

        case 'object':
          key = Object.keys(notFoundPage)
            .sort((a, b) => b.length - a.length)
            .filter(k => path.match(new RegExp('^' + k)))[0];

          path404 = (key && notFoundPage[key]) || defaultPath;
          break;

        default:
          break;
      }

      return path404;
    };

    _loadSideAndNav(path, qs, loadSidebar, cb) {
      return () => {
        const renderSidebar = result => {
          this._renderSidebar(result);
          cb();
        };

        if (!loadSidebar) {
          // Although, we don't load sidebar from sidebar file, we still need call the render to auto generate sidebar from headings toc
          renderSidebar();
          return;
        }

        // Load sidebar from the sidebar file
        this.#loadNested(path, qs, loadSidebar, renderSidebar, this, true);
      };
    }

    _fetch(cb = noop) {
      const { query } = this.route;
      const { path } = this.route;

      // Prevent loading remote content via URL hash
      // Ex: https://foo.com/#//bar.com/file.md
      if (isExternal(path)) {
        history.replaceState(null, '', '#');
        this.router.normalize();
      } else {
        const qs = stringifyQuery(query, ['id']);
        const { loadNavbar, requestHeaders, loadSidebar } = this.config;
        // Abort last request

        const file = this.router.getFile(path);

        this.isRemoteUrl = isExternal(file);
        // Current page is html
        this.isHTML = /\.html$/g.test(file);

        // create a handler that should be called if content was fetched successfully
        const contentFetched = (text, opt, response) => {
          this.route.response = response;
          this._renderMain(
            text,
            opt,
            this._loadSideAndNav(path, qs, loadSidebar, cb),
          );
        };

        // and a handler that is called if content failed to fetch
        const contentFailedToFetch = (_error, response) => {
          this.route.response = response;
          this._fetchFallbackPage(path, qs, cb) || this._fetch404(file, qs, cb);
        };

        // attempt to fetch content from a virtual route, and fallback to fetching the actual file
        if (!this.isRemoteUrl) {
          this.matchVirtualRoute(path).then(contents => {
            if (typeof contents === 'string') {
              contentFetched(contents);
            } else {
              this.#request(file + qs, requestHeaders).then(
                contentFetched,
                contentFailedToFetch,
              );
            }
          });
        } else {
          // if the requested url is not local, just fetch the file
          this.#request(file + qs, requestHeaders).then(
            contentFetched,
            contentFailedToFetch,
          );
        }

        // Load nav
        loadNavbar &&
          this.#loadNested(
            path,
            qs,
            loadNavbar,
            text => this._renderNav(text),
            this,
            true,
          );
      }
    }

    _fetchCover() {
      const { coverpage, requestHeaders } = this.config;
      const query = this.route.query;
      const root = getParentPath(this.route.path);

      if (coverpage) {
        let path = null;
        const routePath = this.route.path;
        if (typeof coverpage === 'string') {
          if (routePath === '/') {
            path = coverpage;
          }
        } else if (Array.isArray(coverpage)) {
          path = coverpage.indexOf(routePath) > -1 && '_coverpage';
        } else {
          const cover = coverpage[routePath];
          path = cover === true ? '_coverpage' : cover;
        }

        const coverOnly = Boolean(path) && this.config.onlyCover;
        if (path) {
          path = this.router.getFile(root + path);
          this.coverIsHTML = /\.html$/g.test(path);
          get(path + stringifyQuery(query, ['id']), false, requestHeaders).then(
            text => this._renderCover(text, coverOnly),
          );
        } else {
          this._renderCover(null, coverOnly);
        }

        return coverOnly;
      }
    }

    $fetch(cb = noop, onNavigate = this.onNavigate.bind(this)) {
      const done = () => {
        this.callHook('doneEach');
        cb();
      };

      const onlyCover = this._fetchCover();

      if (onlyCover) {
        done();
      } else {
        this._fetch(() => {
          onNavigate();
          done();
        });
      }
    }

    _fetchFallbackPage(path, qs, cb = noop) {
      const { requestHeaders, fallbackLanguages, loadSidebar } = this.config;

      if (!fallbackLanguages) {
        return false;
      }

      const local = path.split('/')[1];

      if (fallbackLanguages.indexOf(local) === -1) {
        return false;
      }

      const newPath = this.router.getFile(
        path.replace(new RegExp(`^/${local}`), ''),
      );
      const req = this.#request(newPath + qs, requestHeaders);

      req.then(
        (text, opt) =>
          this._renderMain(
            text,
            opt,
            this._loadSideAndNav(path, qs, loadSidebar, cb),
          ),
        _error => this._fetch404(path, qs, cb),
      );

      return true;
    }

    /**
     * Load the 404 page
     * @param {String} path URL to be loaded
     * @param {*} qs TODO: define
     * @param {Function} cb Callback
     * @returns {Boolean} True if the requested page is not found
     * @private
     */
    _fetch404(path, qs, cb = noop) {
      const { loadSidebar, requestHeaders, notFoundPage } = this.config;

      const fnLoadSideAndNav = this._loadSideAndNav(path, qs, loadSidebar, cb);
      if (notFoundPage) {
        const path404 = this.#get404Path(path, this.config);

        this.#request(this.router.getFile(path404), requestHeaders).then(
          (text, opt) => this._renderMain(text, opt, fnLoadSideAndNav),
          _error => this._renderMain(null, {}, fnLoadSideAndNav),
        );
        return true;
      }

      this._renderMain(null, {}, fnLoadSideAndNav);
      return false;
    }

    initFetch() {
      const { loadSidebar } = this.config;

      this.$fetch(_ => this.callHook('ready'));
    }
  };
}
