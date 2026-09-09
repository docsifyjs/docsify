import { escapeHtml, getAndRemoveConfig } from '../utils.js';
import { isAbsolutePath } from '../../router/util.js';
import { resolveDocumentPath } from '../path.js';

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
    const isAbsolute = isAbsolutePath(href);
    const isNotCompilable = compiler._matchNotCompileLink(href);
    const isMailto = href.startsWith('mailto:');

    linkTarget = config.target || linkTarget;
    linkRel =
      linkTarget === '_blank'
        ? compiler.config.externalLinkRel || 'noopener'
        : '';
    title = str;

    if (!isAbsolute && !isNotCompilable && !config.ignore) {
      if (href === compiler.config.homepage) {
        href = 'README';
      }
      const resolved = resolveDocumentPath(href, {
        config: compiler.config,
        elementBasePath: config.basepath,
      });

      if (isAbsolutePath(resolved.path)) {
        href = resolved.path;
        attrs.push(`target="${linkTarget}"`);
        if (linkRel !== '') {
          attrs.push(`rel="${linkRel}"`);
        }
      } else {
        href = router.toURL(resolved.path, null, router.getCurrentPath());

        if (resolved.rooted && router.mode === 'hash') {
          href = `/${href}`;
        }
      }

      if (config.target && !isMailto && !attrs.length) {
        attrs.push(`target="${linkTarget}"`);
      }
    } else {
      if (!isAbsolute && href.startsWith('./')) {
        href = router
          .toURL(href, null, router.getCurrentPath())
          .replace(/^#\//, '/');
      }

      if (!isMailto) {
        attrs.push(`target="${linkTarget}"`);
        if (linkRel !== '') {
          attrs.push(`rel="${linkRel}"`);
        }
      }
    }

    if (config.disabled) {
      attrs.push('disabled');
      href = 'javascript:void(0)';
    }

    if (config.class) {
      let classes = config.class;
      if (Array.isArray(config.class)) {
        classes = config.class.join(' ');
      }
      attrs.push(`class="${classes}"`);
    }

    if (config.id) {
      attrs.push(`id="${config.id}"`);
    }

    if (title) {
      attrs.push(`title="${escapeHtml(title)}"`);
    }

    return /* html */ `<a href="${escapeHtml(href)}" ${attrs.join(' ')}>${text}</a>`;
  });
