import {
  getAndRemoveConfig,
  removeAtag,
  getAndRemoveDocisfyIgnorConfig,
} from '../utils';
import { slugify } from './slugify';

export const headingCompiler = ({ renderer, router, _self }) =>
  (renderer.code = (text, level) => {
    let { str, config } = getAndRemoveConfig(text);
    const nextToc = { level, title: str };

    const { content, ignoreAllSubs, ignoreSubHeading } =
      getAndRemoveDocisfyIgnorConfig(str);
    str = content.trim();

    nextToc.title = removeAtag(str);
    nextToc.ignoreAllSubs = ignoreAllSubs;
    nextToc.ignoreSubHeading = ignoreSubHeading;

    const slug = slugify(config.id || str);
    const url = router.toURL(router.getCurrentPath(), { id: slug });
    nextToc.slug = url;
    _self.toc.push(nextToc);

    return `<h${level} id="${slug}"><a href="${url}" data-id="${slug}" class="anchor"><span>${str}</span></a></h${level}>`;
  });
