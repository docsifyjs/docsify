import { getAndRemoveConfig } from '../utils';
import { slugify } from './slugify';

export const headingCompiler = ({ renderer, router, _self }) =>
  (renderer.code = (text, level) => {
    let { str, config } = getAndRemoveConfig(text);
    const nextToc = { level, title: str };

    if (/<!-- {docsify-ignore} -->/g.test(str)) {
      str = str.replace('<!-- {docsify-ignore} -->', '');
      nextToc.title = str;
      nextToc.ignoreSubHeading = true;
    }

    if (/<!-- {docsify-ignore-all} -->/g.test(str)) {
      str = str.replace('<!-- {docsify-ignore-all} -->', '');
      nextToc.title = str;
      nextToc.ignoreAllSubs = true;
    }

    const slug = slugify(config.id || str);
    const url = router.toURL(router.getCurrentPath(), { id: slug });
    nextToc.slug = url;
    _self.toc.push(nextToc);

    return `<h${level} id="${slug}"><a href="${url}" data-id="${slug}" class="anchor"><span>${str}</span></a></h${level}>`;
  });
