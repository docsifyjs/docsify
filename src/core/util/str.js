export function removeDocsifyIgnoreTag(str) {
  return str
    .replace(/<!-- {docsify-ignore} -->/, '')
    .replace(/{docsify-ignore}/, '')
    .replace(/<!-- {docsify-ignore-all} -->/, '')
    .replace(/{docsify-ignore-all}/, '')
    .trim();
}
