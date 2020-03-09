import { getAndRemoveConfig } from '../compiler';
import { isAbsolutePath } from '../../router/util';

export const linkCompiler = ({ renderer, router, linkTarget, compilerClass }) =>
  (renderer.link = (href, title = '', text) => {
    let attrs = [];
    const { str, config } = getAndRemoveConfig(title);

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
      if (!isAbsolutePath(href) && href.startsWith('./')) {
        href =
          document.URL.replace(/\/(?!.*\/).*/, '/').replace('#/./', '') + href;
      }
      attrs.push(href.indexOf('mailto:') === 0 ? '' : `target="${linkTarget}"`);
    }

    if (config.target) {
      attrs.push(`target="${config.target}"`);
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
