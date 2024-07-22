import { getAndRemoveConfig } from '../utils.js';
import { isAbsolutePath } from '../../router/util.js';

export const linkCompiler = ({
  renderer,
  router,
  linkTarget,
  linkRel,
  compilerClass,
}) =>
  (renderer.link = function ({ href, title = '', tokens }) {
    const attrs = [];
    const text = this.parser.parseInline(tokens) || '';
    const { config } = getAndRemoveConfig(title);
    linkTarget = config.target || linkTarget;
    linkRel =
      linkTarget === '_blank'
        ? compilerClass.config.externalLinkRel || 'noopener'
        : '';

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
      let classes = config.class;
      if (config.class_appened_props) {
        classes = `${config.config.class} ${config.class_appened_props}`;
      }
      attrs.push(`class="${classes}"`);
    }

    if (config.id) {
      attrs.push(`id="${config.id}"`);
    }

    if (config.ignore_appened_props) {
      attrs.push(`title="${config.ignore_appened_props}"`);
    }

    return /* html */ `<a href="${href}" ${attrs.join(' ')}>${text}</a>`;
  });
