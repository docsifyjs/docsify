import { getAndRemoveConfig } from '../utils.js';
import { isAbsolutePath, getPath, getParentPath } from '../../router/util.js';

export const imageCompiler = ({ renderer, contentBase, router }) =>
  (renderer.image = ({ href, title, text }) => {
    let url = href;
    const attrs = [];

    const { str, config } = getAndRemoveConfig(title);
    title = str;

    if (config['no-zoom']) {
      attrs.push('data-no-zoom');
    }

    if (title) {
      attrs.push(`title="${title}"`);
    }

    if (config.size) {
      const [width, height] = config.size.split('x');
      if (height) {
        attrs.push(`width="${width}" height="${height}"`);
      } else {
        attrs.push(`width="${width}"`);
      }
    }

    if (config.class) {
      attrs.push(`class="${config.class}"`);
    }

    if (config.id) {
      attrs.push(`id="${config.id}"`);
    }

    if (!isAbsolutePath(href)) {
      url = getPath(contentBase, getParentPath(router.getCurrentPath()), href);
    }

    return /* html */ `<img src="${url}" data-origin="${href}" alt="${text}" ${attrs.join(
      ' ',
    )} />`;
  });
