import { getAndRemoveConfig } from '../utils';
import { isAbsolutePath } from '../../router/util';

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

    if (
      !isAbsolutePath(href) &&
      !compilerClass._matchNotCompileLink(href) &&
      !config.ignore
    ) {
      if (href === compilerClass.config.homepage) {
        href = 'README';
      }

      href = router.toURL(href, null, router.getCurrentPath());
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
          : ''
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

    return `<a href="${href}" ${attrs.join(' ')}>${text}</a>`;
  });
