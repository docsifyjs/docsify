import { isExternal, noop } from '../../util/core.js';
import { on } from '../../util/dom.js';
import { parseQuery, getPath } from '../util.js';
import { History } from './base.js';

export class HTML5History extends History {
  mode = 'history';

  getCurrentPath() {
    const base = this.getBasePath();
    let path = window.location.pathname;

    if (base && path.indexOf(base) === 0) {
      path = path.slice(base.length);
    }

    return (path || '/') + window.location.search + window.location.hash;
  }

  onchange(cb = noop) {
    on('click', e => {
      const el = e.target.tagName === 'A' ? e.target : e.target.parentNode;

      if (el && el.tagName === 'A' && !isExternal(el.href)) {
        e.preventDefault();
        const url = el.href;
        window.history.pushState({ key: url }, '', url);
        cb({ event: e, source: 'navigate' });
      }
    });

    on('popstate', e => {
      cb({ event: e, source: 'history' });
    });
  }

  /**
   * Parse the url
   * @param {string} [path=location.href] URL to be parsed
   * @return {object} { path, query }
   */
  parse(path = location.href) {
    let query = '';

    const queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1);
      path = path.slice(0, queryIndex);
    }

    const base = getPath(location.origin);
    const baseIndex = path.indexOf(base);

    if (baseIndex > -1) {
      path = path.slice(baseIndex + base.length);
    }

    return {
      path,
      file: this.getFile(path),
      query: parseQuery(query),
      response: {},
    };
  }
}
