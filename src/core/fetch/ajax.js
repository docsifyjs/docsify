// @ts-check
/* eslint-disable no-unused-vars */
import progressbar from '../render/progressbar.js';
import { noop } from '../util/core.js';

/** @typedef {{updatedAt: string}} CacheOpt */

/** @typedef {{content: string, opt: CacheOpt}} CacheItem */

/** @type {Record<string, CacheItem>} */
const cache = {};

/**
 * Ajax GET implmentation
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
     * @param {(text: string, opt: CacheOpt) => void} success
     * @param {(event: ProgressEvent<XMLHttpRequestEventTarget>) => void} error
     */
    then(success, error = noop) {
      if (hasBar) {
        const id = setInterval(
          _ =>
            progressbar({
              step: Math.floor(Math.random() * 5 + 1),
            }),
          500
        );

        xhr.addEventListener('progress', progressbar);
        xhr.addEventListener('loadend', evt => {
          progressbar(evt);
          clearInterval(id);
        });
      }

      xhr.addEventListener('error', error);
      xhr.addEventListener('load', event => {
        const target = /** @type {XMLHttpRequest} */ (event.target);
        if (target.status >= 400) {
          error(event);
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

          success(result.content, result.opt);
        }
      });
    },
    abort: _ => xhr.readyState !== 4 && xhr.abort(),
  };
}
