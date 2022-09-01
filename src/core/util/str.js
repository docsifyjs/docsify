export function startsWith(str, prefix) {
  return str.indexOf(prefix) === 0;
}

export function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function removeDocsifyIgnoreTag(str) {
  return str
    .replace(/<!-- {docsify-ignore} -->/, '')
    .replace(/{docsify-ignore}/, '')
    .replace(/<!-- {docsify-ignore-all} -->/, '')
    .replace(/{docsify-ignore-all}/, '')
    .trim();
}
