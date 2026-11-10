// OneTag AI "ask this page" button — https://onetagai.com
// Visitors type a question and get an answer drawn from the page they are reading.

const window = /** @type {any} */ (globalThis);

function install(hook, vm) {
  const config = vm.config.onetag;
  const options = typeof config === 'string' ? { key: config } : { ...config };

  if (!options.key) {
    // eslint-disable-next-line no-console
    console.error('[Docsify] onetag key is required.');
    return;
  }

  hook.mounted(_ => {
    const script = document.createElement('script');

    script.async = true;
    script.src = 'https://onetagai.com/widget.js';

    // Answers are drawn from the rendered page, not from the sidebar or navbar.
    Object.assign(script.dataset, {
      ref: 'docsify',
      source: '.markdown-section',
      ...options,
    });

    document.body.appendChild(script);
  });
}

window.$docsify = window.$docsify || {};
window.$docsify.plugins = [install, ...(window.$docsify.plugins || [])];

export {};
