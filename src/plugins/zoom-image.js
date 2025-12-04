import mediumZoom from 'medium-zoom';

function install(hook) {
  let zoom;

  hook.doneEach(_ => {
    let elms = /** @type {HTMLElement[]} */ (
      Array.from(
        document.querySelectorAll(
          '.markdown-section img:not(.emoji):not([data-no-zoom])',
        ),
      )
    );

    Docsify.dom.style(
      `.medium-zoom-image--opened,.medium-zoom-overlay{z-index:999}`,
    );

    elms = elms.filter(elm => !elm.matches('a img'));

    if (zoom) {
      zoom.detach();
    }

    zoom = mediumZoom(elms, { background: 'var(--color-bg)' });
  });
}

window.$docsify = window.$docsify || {};
window.$docsify.plugins = [install, ...(window.$docsify.plugins || [])];
