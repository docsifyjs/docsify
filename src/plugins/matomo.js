function appendScript(options) {
  const script = document.createElement('script');
  script.async = true;
  script.src = options.host + '/matomo.js';
  document.body.appendChild(script);
}

const window = /** @type {any} */ (globalThis);

function init(options) {
  window._paq = window._paq || [];
  window._paq.push(['trackPageView']);
  window._paq.push(['enableLinkTracking']);
  setTimeout(() => {
    appendScript(options);
    window._paq.push(['setTrackerUrl', options.host + '/matomo.php']);
    window._paq.push(['setSiteId', String(options.id)]);
  }, 0);
}

function collect() {
  if (!window._paq) {
    init(window.$docsify.matomo);
  }
  window._paq.push(['setCustomUrl', window.location.hash.substr(1)]);
  window._paq.push(['setDocumentTitle', document.title]);
  window._paq.push(['trackPageView']);
}

const install = function (hook) {
  if (!window.$docsify.matomo) {
    // eslint-disable-next-line no-console
    console.error('[Docsify] matomo is required.');
    return;
  }

  hook.beforeEach(collect);
};

window.$docsify = window.$docsify || {};
window.$docsify.plugins = [install, ...(window.$docsify.plugins || [])];

export {};
