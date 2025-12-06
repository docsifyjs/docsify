// The purpose of this service worker is to help with loading
// node_modules modules when using ES modules in the browser.
//
// Specifically, this service worker helps with non-standard module paths
// that do not include file extensions, such as:
//
//   /node_modules/some-lib/foo/bar
//   /node_modules/some-lib/foo/bar/
//
// In these cases, the service worker will try to resolve them to actual files
// by appending ".js" or "/index.js" as needed.
//
// This service worker only handles requests under /node_modules/.
// All other requests are passed through unmodified.

export {};

const scope = /** @type {ServiceWorkerGlobalScope} */ (
  /** @type {any} */ (self)
);

scope.addEventListener('install', event => {
  // Always activate worker immediately, for purposes of testing.
  event.waitUntil(scope.skipWaiting());
});

scope.addEventListener('activate', event => {
  // Always activate worker immediately, for purposes of testing.
  event.waitUntil(scope.clients.claim());
});

scope.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Don't handle non-node_modules paths
  if (!url.pathname.startsWith('/node_modules/')) {
    event.respondWith(fetch(url.href));
    return;
  }

  // 6
  // Special handling for non-standard module paths in node_modules

  const parts = url.pathname.split('/');
  const fileName = /** @type {string} */ (parts.pop());
  const ext = fileName.includes('.') ? fileName.split('.').pop() : '';

  // Handle imports like 'some-lib/foo/bar' without an extension.
  if (fileName !== '' && ext === '') {
    event.respondWith(
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async resolve => {
        try {
          // First try adding .js
          const response = await tryJs();
          const mimeType = response.headers.get('Content-Type') || '';
          if (response.ok && mimeType.includes('javascript')) {
            resolve(response);
          } else {
            throw new Error('Not JS');
          }
        } catch {
          // If that fails, try adding /index.js
          resolve(await tryIndexJs());
        }

        async function tryJs() {
          const tryJs = new URL(url);
          tryJs.href += '.js';
          const response = await fetch(tryJs);
          return response;
        }

        async function tryIndexJs() {
          const tryIndexJs = new URL(url);
          tryIndexJs.href += '/index.js';
          const response = await fetch(tryIndexJs);
          return response;
        }
      }),
    );

    return;
  }

  // Handle imports like 'some-lib/foo/bar/' (ending with a slash).
  if (fileName === '') {
    // adding index.js
    const tryIndexJs = new URL(url);
    tryIndexJs.href += 'index.js';

    event.respondWith(fetch(tryIndexJs));

    return;
  }

  // For all other cases, just fetch normally.
  event.respondWith(fetch(url));
});
