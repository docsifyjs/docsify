// Borrowed from https://j11y.io/snippets/getting-a-fully-qualified-url.
/**
 * @param {string} url
 * @returns {string}
 */
export function qualifyURL(url) {
  const img = document.createElement('img');
  img.src = url; // set string url
  url = img.src; // get qualified url
  img.src = ''; // prevent the server request
  return url;
}

/**
 * @param {string} url
 * @returns {boolean}
 */
export function isExternal(url) {
  url = qualifyURL(url);
  url = new URL(url);
  return url.origin !== location.origin;
}
