import { getAndRemoveConfig } from '../utils.js';
import { isAbsolutePath } from '../../router/util.js';

export const linkCompiler = ({
  renderer,
  router,
  linkTarget,
  linkRel,
  compilerClass,
}) =>
  (renderer.link = (href, title = '', text) => {
    const attrs = [];
    const { str, config } = getAndRemoveConfig(title);
    linkTarget = config.target || linkTarget;
    linkRel =
      linkTarget === '_blank'
        ? compilerClass.config.externalLinkRel || 'noopener'
        : '';
    title = str;

    if (
      !isAbsolutePath(href) &&
      !compilerClass._matchNotCompileLink(href) &&
      !config.ignore
    ) {
      if (href === compilerClass.config.homepage) {
        href = 'README';
      }

      href = router.toURL(href, null, router.getCurrentPath());

      if (config.target) {
        href.indexOf('mailto:') !== 0 && attrs.push(`target="${linkTarget}"`);
      }
    } else {
      if (!isAbsolutePath(href) && href.slice(0, 2) === './') {
        href =
          document.URL.replace(/\/(?!.*\/).*/, '/').replace('#/./', '') + href;
      }
      attrs.push(href.indexOf('mailto:') === 0 ? '' : `target="${linkTarget}"`);
      attrs.push(
        href.indexOf('mailto:') === 0
          ? ''
          : linkRel !== ''
            ? ` rel="${linkRel}"`
            : '',
      );
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
