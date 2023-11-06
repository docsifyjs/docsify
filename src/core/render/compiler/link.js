import { getAndRemoveConfig } from '../utils.js';
import { isAbsolutePath, getPath, getParentPath } from '../../router/util.js';

const GET_EXTENSION_REGEXP = /(?:\.([^.]+))?$/;
const GET_REDUNDANT_DOTS = /\/\.\//g;

export const linkCompiler = ({
  renderer,
  contentBase,
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
        if (href === compilerClass.config.homepage) {
          href = 'README';
        } else {
          const ext = GET_EXTENSION_REGEXP.exec(href)[1];
          if (!ext || ext === 'md') {
            href = router.toURL(href, null, router.getCurrentPath());
          } else {
            href = getPath(
              contentBase,
              getParentPath(router.getCurrentPath()),
              href
            );
          }

          href = href.replace(GET_REDUNDANT_DOTS, '/');
        }
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
