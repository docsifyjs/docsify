import { getAndRemoveConfig, removeAtag } from '../utils';
import { slugify } from './slugify';

export const headingCompiler = ({ renderer, router, _self }) =>
  (renderer.code = (text, level) => {
    let { str, config } = getAndRemoveConfig(text);
    const nextToc = { level, title: removeAtag(str) };

    if (/<!-- {docsify-ignore} -->/g.test(str)) {
      str = str.replace('<!-- {docsify-ignore} -->', '');
      nextToc.title = removeAtag(str);
      nextToc.ignoreSubHeading = true;
    }

    if (/{docsify-ignore}/g.test(str)) {
      str = str.replace('{docsify-ignore}', '');
      nextToc.title = removeAtag(str);
      nextToc.ignoreSubHeading = true;
    }

    if (/<!-- {docsify-ignore-all} -->/g.test(str)) {
      str = str.replace('<!-- {docsify-ignore-all} -->', '');
      nextToc.title = removeAtag(str);
      nextToc.ignoreAllSubs = true;
    }

    if (/{docsify-ignore-all}/g.test(str)) {
      str = str.replace('{docsify-ignore-all}', '');
      nextToc.title = removeAtag(str);
      nextToc.ignoreAllSubs = true;
    }

    const slug = slugify(config.id || str);
    const url = router.toURL(router.getCurrentPath(), { id: slug });
    nextToc.slug = url;
    _self.toc.push(nextToc);

    return `<h${level} id="${slug}"><a href="${url}" data-id="${slug}" class="anchor"><span>${str}</span></a></h${level}>`;
  });
