import * as dom from '../dom';
import { get } from '../../fetch/ajax';

function replaceVar(block, color) {
  block.innerHTML = block.innerHTML.replace(
    /var\(\s*--theme-color.*?\)/g,
    color
  );
}

export default function (color) {
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
        const style = dom.create('style', res);

        dom.head.appendChild(style);
        replaceVar(style, color);
      });
    }
  });
}
