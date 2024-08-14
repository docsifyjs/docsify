import {
  getAndRemoveConfig,
  removeAtag,
  getAndRemoveDocsifyIgnoreConfig,
} from '../utils.js';
import { slugify } from '../slugify.js';

export const headingCompiler = ({ renderer, router, compiler }) =>
  (renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    let { str, config } = getAndRemoveConfig(text);
    const nextToc = { depth, title: str };

    const { content, ignoreAllSubs, ignoreSubHeading } =
      getAndRemoveDocsifyIgnoreConfig(str);
    str = content.trim();

    nextToc.title = removeAtag(str);
    nextToc.ignoreAllSubs = ignoreAllSubs;
    nextToc.ignoreSubHeading = ignoreSubHeading;
    const slug = slugify(config.id || str);
    const url = router.toURL(router.getCurrentPath(), { id: slug });
    nextToc.slug = url;
    compiler.toc.push(nextToc);

    // Note: tabindex="-1" allows programmatically focusing on heading
    // elements after navigation. This is preferred over focusing on the link
    // within the heading because it matches the focus behavior of screen
    // readers when navigating page content.
    return `<h${depth} id="${slug}" tabindex="-1"><a href="${url}" data-id="${slug}" class="anchor"><span>${str}</span></a></h${depth}>`;
  });
