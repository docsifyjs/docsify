// @ts-check

import progressbar from '../render/progressbar.js';
import { noop } from './core.js';

/** @typedef {{updatedAt: string}} CacheOpt */
/** @typedef {{content: string, opt: CacheOpt}} CacheItem */
/** @typedef {{ok: boolean, status: number, statusText: string}} ResponseStatus */
/** @type {Record<string, CacheItem>} */

const cache = {};

/**
 * Ajax GET implementation
 * @param {string} url Resource URL
 * @param {boolean} [hasBar=false] Has progress bar
 * @param {String[]} headers Array of headers
 * @return A Promise-like response with error callback (error callback is not Promise-like)
 */
// TODO update to using fetch() + Streams API instead of XMLHttpRequest. See an
// example of download progress calculation using fetch() here:
// https://streams.spec.whatwg.org/demos/
export function get(url, hasBar = false, headers = {}) {
  const xhr = new XMLHttpRequest();
  const cached = cache[url];

  if (cached) {
    return { then: cb => cb(cached.content, cached.opt), abort: noop };
  }

  xhr.open('GET', url);
  for (const i of Object.keys(headers)) {
    xhr.setRequestHeader(i, headers[i]);
  }

  xhr.send();

  return {
    /**
     * @param {(text: string, opt: CacheOpt, response: ResponseStatus) => void} success
     * @param {(event: ProgressEvent<XMLHttpRequestEventTarget>, response: ResponseStatus) => void} error
     */
    then(success, error = noop) {
      const getResponseStatus = event => ({
        ok: event.target.status >= 200 && event.target.status < 300,
        status: event.target.status,
        statusText: event.target.statusText,
      });

      if (hasBar) {
        const id = setInterval(
          _ =>
            progressbar({
              step: Math.floor(Math.random() * 5 + 1),
            }),
          500,
        );

        xhr.addEventListener('progress', progressbar);
        xhr.addEventListener('loadend', evt => {
          progressbar(evt);
          clearInterval(id);
        });
      }

      xhr.addEventListener('error', event => {
        error(event, getResponseStatus(event));
      });

      xhr.addEventListener('load', event => {
        const target = /** @type {XMLHttpRequest} */ (event.target);

        if (target.status >= 400) {
          error(event, getResponseStatus(event));
        } else {
          if (typeof target.response !== 'string') {
            throw new TypeError('Unsupported content type.');
          }

          const result = (cache[url] = {
            content: target.response,
            opt: {
              updatedAt: xhr.getResponseHeader('last-modified') ?? '',
            },
          });

          success(result.content, result.opt, getResponseStatus(event));
        }
      });
    },
    abort: _ => xhr.readyState !== 4 && xhr.abort(),
  };
}
