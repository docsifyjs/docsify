const VERSION = String.raw`v?(?:0|[1-9]\d?)(?:\.(?:0|[1-9]\d*)){0,2}(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?`;
const VERSION_VALUE = new RegExp(`^${VERSION}$`);
const VERSION_PATHS = [
  new RegExp(`(?:^|/)docsify@${VERSION}(?:/|$)`, 'i'),
  new RegExp(`(?:^|/)docsify/${VERSION}(?:/|$)`, 'i'),
  new RegExp(
    `(?:^|/)docsify(?:\\.module)?[-.]${VERSION}(?:\\.min)?\\.js$`,
    'i',
  ),
  new RegExp(
    `(?:^|/)docsify[-.]${VERSION}(?:\\.module)?(?:\\.min)?\\.js$`,
    'i',
  ),
];

let hasWarned = false;

/** @param {string} value */
function parseUrl(value) {
  try {
    return new URL(value, 'https://docsify.js.org');
  } catch {
    return null;
  }
}

/** @param {string} pathname */
function decodePathname(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

/** @param {string} scriptUrl */
export function hasPinnedDocsifyVersion(scriptUrl) {
  const url = parseUrl(scriptUrl);

  if (!url) {
    return false;
  }

  if (
    ['v', 'version'].some(param =>
      url.searchParams.getAll(param).some(value => VERSION_VALUE.test(value)),
    )
  ) {
    return true;
  }

  const pathname = decodePathname(url.pathname);

  return VERSION_PATHS.some(pattern => pattern.test(pathname));
}

/** @param {string} scriptUrl */
export function isDocsifyScriptUrl(scriptUrl) {
  const url = parseUrl(scriptUrl);

  if (!url) {
    return false;
  }

  const pathname = decodePathname(url.pathname);
  const filename = pathname.split('/').pop() || '';

  if (/^docsify(?:[.@_-].*)?\.js$/i.test(filename)) {
    return true;
  }

  switch (url.hostname) {
    case 'cdn.jsdelivr.net':
      return /^\/(?:npm\/docsify|gh\/docsifyjs\/docsify)(?:@|\/)/i.test(
        pathname,
      );
    case 'unpkg.com':
      return /^\/docsify(?:@|\/)/i.test(pathname);
    case 'cdn.bootcdn.net':
    case 'cdnjs.cloudflare.com':
      return /^\/ajax\/libs\/docsify\//i.test(pathname);
    default:
      return false;
  }
}

/** @param {string | undefined} scriptUrl */
export function warnIfUnpinnedDocsifyVersion(scriptUrl) {
  if (!scriptUrl || hasWarned || hasPinnedDocsifyVersion(scriptUrl)) {
    return;
  }

  hasWarned = true;

  // eslint-disable-next-line no-console
  console.error(
    `[Docsify] Unpinned version detected in the Docsify script URL: ${scriptUrl}\n` +
      'This site WILL BREAK when that URL begins serving a future major version and may break unexpectedly on minor or patch updates. ' +
      'Pin Docsify to a version in the URL (for example, docsify@5.0.0).',
  );
}
