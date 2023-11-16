import { getAndRemoveConfig } from '../utils.js';
import { isAbsolutePath, getPath, getParentPath } from '../../router/util.js';

export const linkCompiler = ({
  renderer,
  router,
  linkTarget,
  linkRel,
  compilerClass,
}) =>
  (renderer.link = (href, title = '', text) => {
    let attrs = [];
    const { str, config } = getAndRemoveConfig(title);
    linkTarget = config.target || linkTarget;
    linkRel =
      linkTarget === '_blank'
        ? compilerClass.config.externalLinkRel || 'noopener'
        : '';
    title = str;

    if (!config.ignore && !compilerClass._matchNotCompileLink(href)) {
      if (!isAbsolutePath(href)) {
        href = router.toURL(href, null, router.getCurrentPath());
      } else {
        attrs.push(
          href.indexOf('mailto:') === 0 ? '' : `target="${linkTarget}"`
        );
        attrs.push(
          href.indexOf('mailto:') === 0
            ? ''
            : linkRel !== ''
            ? ` rel="${linkRel}"`
            : ''
        );
      }
    }

    if (config.disabled) {
      attrs.push('disabled');
      href = 'javascript:void(0)';
    }

    if (config.class) {
      attrs.push(`class="${config.class}"`);
    }

    if (config.id) {
      attrs.push(`id="${config.id}"`);
    }

    if (title) {
      attrs.push(`title="${title}"`);
    }

    return /* html */ `<a href="${href}" ${attrs.join(' ')}>${text}</a>`;
  });
