import { getAndRemoveConfig } from '../utils.js';
import { isAbsolutePath } from '../../router/util.js';

export const linkCompiler = ({
  renderer,
  router,
  linkTarget,
  linkRel,
  compiler,
}) =>
  (renderer.link = function ({ href, title = '', tokens }) {
    const attrs = [];
    const text = this.parser.parseInline(tokens) || '';
    const { str, config } = getAndRemoveConfig(title);
    linkTarget = config.target || linkTarget;
    linkRel =
      linkTarget === '_blank'
        ? compiler.config.externalLinkRel || 'noopener'
        : '';
    title = str;

    if (
      !isAbsolutePath(href) &&
      !compiler._matchNotCompileLink(href) &&
      !config.ignore
    ) {
      if (href === compiler.config.homepage) {
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
