import mediumZoom from 'medium-zoom';

function install(hook) {
  let zoom;

  hook.doneEach(_ => {
    let elms = Array.from(
      document.querySelectorAll(
        '.markdown-section img:not(.emoji):not([data-no-zoom])'
      )
    );

    elms = elms.filter(elm => !elm.matches('a img'));

    if (zoom) {
      zoom.detach();
    }

    zoom = mediumZoom(elms);
  });
}

window.$docsify = window.$docsify || {};
$docsify.plugins = [install, ...($docsify.plugins || [])];
