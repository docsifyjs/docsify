/* eslint-disable no-console */
// Inspired by https://github.com/egoist/vue-ga/blob/master/src/index.js
function appendScript(id) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id='+id;
    document.body.appendChild(script);
  }

  function init(id) {
    appendScript(id);

    window.dataLayer = window.dataLayer || [];

    gtag = function() {dataLayer.push(arguments)};
    gtag('js', new Date());

    gtag('config', id, {
        send_page_view: false, // Disable automatic pageview
        debug_mode: (location.hostname === 'localhost') ? true : false
    });
  }

  function collect() {
    if (typeof gtag === 'undefined') {
      init($docsify.gtag);
    }

    gtag('event', 'page_view', {
        page_title: location.hash,
        page_location: location.href
    });
  }

  const install = function (hook) {
    if (!$docsify.gtag) {
        console.error('[Docsify] gtag is required.');
        return;
      }

    hook.beforeEach(collect);
  };

  $docsify.plugins = [].concat(install, $docsify.plugins);
