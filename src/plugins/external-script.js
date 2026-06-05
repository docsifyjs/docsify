const window = /** @type {any} */ (globalThis);

function handleExternalScript() {
  const container = Docsify.dom.getNode('#main');
  const scripts = /** @type {HTMLScriptElement[]} */ (
    Docsify.dom.findAll(container, 'script')
  );

  for (const script of scripts) {
    if (script.src) {
      const newScript = document.createElement('script');

      Array.from(script.attributes).forEach(attribute => {
        newScript[attribute.name] = attribute.value;
      });

      script.before(newScript);
      script.remove();
    }
  }
}

const install = function (hook) {
  hook.doneEach(handleExternalScript);
};

window.$docsify = window.$docsify || {};
window.$docsify.plugins = [install, ...(window.$docsify.plugins || [])];

export {};
