/* eslint-disable no-unused-vars */
import mediumZoom from 'medium-zoom';

const matchesSelector =
  Element.prototype.matches ||
  Element.prototype.webkitMatchesSelector ||
  Element.prototype.msMatchesSelector;

function install(hook) {
  let zoom;

  hook.doneEach(_ => {
    let elms = Array.apply(
      null,
      document.querySelectorAll(
        '.markdown-section img:not(.emoji):not([data-no-zoom])'
      )
    );

    elms = elms.filter(elm => matchesSelector.call(elm, 'a img') === false);

    if (zoom) {
      zoom.detach();
    }

    zoom = mediumZoom(elms);
  });
}

$docsify.plugins = [].concat(install, $docsify.plugins);
