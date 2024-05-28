// From ./ga.js

function appendScript(id) {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.body.appendChild(script);
}

// global site tag instance initialized
function initGlobalSiteTag(id) {
  appendScript(id);

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  window.gtag('js', new Date());
  window.gtag('config', id);
}

// add additional products to your tag
// https://developers.google.com/tag-platform/gtagjs/install
function initAdditionalTag(id) {
  window.gtag('config', id);
}

function init(ids) {
  if (Array.isArray(ids)) {
    // set the first id to be a global site tag
    initGlobalSiteTag(ids[0]);

    // the rest ids
    ids.forEach((id, index) => {
      if (index > 0) {
        initAdditionalTag(id);
      }
    });
  } else {
    initGlobalSiteTag(ids);
  }
}

function collect() {
  if (!window.gtag) {
    init($docsify.gtag);
  }

  // usage: https://developers.google.com/analytics/devguides/collection/gtagjs/pages
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: location.href,
    page_path: location.pathname,
  });
}

const install = function (hook) {
  if (!$docsify.gtag) {
    // eslint-disable-next-line no-console
    console.error('[Docsify] gtag is required.');
    return;
  }

  hook.beforeEach(collect);
};

window.$docsify = window.$docsify || {};
$docsify.plugins = [install, ...($docsify.plugins || [])];
