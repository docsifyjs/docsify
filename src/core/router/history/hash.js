import { isExternal, noop } from '../../util/core.js';
import { on } from '../../util/dom.js';
import { parseQuery, cleanPath, replaceSlug } from '../util.js';
import { History } from './base.js';

function replaceHash(path) {
  const i = location.href.indexOf('#');
  location.replace(location.href.slice(0, i >= 0 ? i : 0) + '#' + path);
}

export class HashHistory extends History {
  mode = 'hash';

  getBasePath() {
    const path = window.location.pathname || '';
    const base = this.config.basePath;

    // This handles the case where Docsify is served off an
    // explicit file path, i.e.`/base/index.html#/blah`. This
    // prevents the `/index.html` part of the URI from being
    // remove during routing.
    // See here: https://github.com/docsifyjs/docsify/pull/1372
    const basePath = path.endsWith('.html')
      ? path + '#/' + base
      : path + '/' + base;
    return /^(\/|https?:)/g.test(base) ? base : cleanPath(basePath);
  }

  getCurrentPath() {
    // We can't use location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    const href = location.href;
    const index = href.indexOf('#');
    return index === -1 ? '' : href.slice(index + 1);
  }

  /** @param {((params: {source: TODO}) => void)} [cb] */
  onchange(cb = noop) {
    // The hashchange event does not tell us if it originated from
    // a clicked link or by moving back/forward in the history;
    // therefore we set a `navigating` flag when a link is clicked
    // to be able to tell these two scenarios apart
    let navigating = false;

    on('click', e => {
      const el = e.target.tagName === 'A' ? e.target : e.target.parentNode;

      if (el && el.tagName === 'A' && !isExternal(el.href)) {
        navigating = true;
      }
    });

    on('hashchange', e => {
      const source = navigating ? 'navigate' : 'history';
      navigating = false;
      cb({ event: e, source });
    });
  }

  normalize() {
    let path = this.getCurrentPath();

    path = replaceSlug(path);

    if (path.charAt(0) === '/') {
      return replaceHash(path);
    }

    replaceHash('/' + path);
  }

  /**
   * Parse the url
   * @param {string} [path=location.href] URL to be parsed
   * @return {object} { path, query }
   */
  parse(path = location.href) {
    let query = '';

    const hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      path = path.slice(hashIndex + 1);
    }

    const queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1);
      path = path.slice(0, queryIndex);
    }

    return {
      path,
      file: this.getFile(path, true),
      query: parseQuery(query),
      response: {},
    };
  }

  toURL(path, params, currentRoute) {
    return '#' + super.toURL(path, params, currentRoute);
  }
}

/** @typedef {any} TODO */
