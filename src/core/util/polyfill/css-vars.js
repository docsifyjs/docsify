import * as dom from '../dom';
import { get } from '../../fetch/ajax';

function replaceVar(block, color) {
  block.innerHTML = block.innerHTML.replace(
    /var\(\s*--theme-color.*?\)/g,
    color
  );
}

// TODO Do we need this? Every browser has CSS vars nowadays. Is this even being used?

export default function(color) {
  // Variable support
  if (window.CSS && window.CSS.supports && window.CSS.supports('(--v:red)')) {
    return;
  }

  const styleBlocks = dom.findAll('style:not(.inserted),link');
  [].forEach.call(styleBlocks, block => {
    if (block.nodeName === 'STYLE') {
      replaceVar(block, color);
    } else if (block.nodeName === 'LINK') {
      const href = block.getAttribute('href');

      if (!/\.css$/.test(href)) {
        return;
      }

      get(href).then(res => {
        const style = <style>{res}</style>;

        dom.head.appendChild(style);
        replaceVar(style, color);
      });
    }
  });
}
