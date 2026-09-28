const currentScript = /** @type {HTMLScriptElement | null} */ (
  document.currentScript
);

/** @type {string | undefined} */
let moduleUrl;

export function getDocsifyScript() {
  return (
    currentScript ||
    Array.from(document.getElementsByTagName('script')).find(script =>
      /docsify\./.test(script.src),
    )
  );
}

export function getDocsifyModuleUrl() {
  return moduleUrl;
}

/** @param {string} url */
export function setDocsifyModuleUrl(url) {
  moduleUrl = url;
}
