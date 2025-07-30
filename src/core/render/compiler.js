import { marked } from 'marked';
import { isAbsolutePath, getPath, getParentPath } from '../router/util.js';
import { isFn, cached, isPrimitive } from '../util/core.js';
import { tree as treeTpl } from './tpl.js';
import { genTree } from './gen-tree.js';
import { slugify } from './slugify.js';
import { emojify } from './emojify.js';
import { getAndRemoveConfig } from './utils.js';
import { imageCompiler } from './compiler/image.js';
import { headingCompiler } from './compiler/heading.js';
import { highlightCodeCompiler } from './compiler/code.js';
import { paragraphCompiler } from './compiler/paragraph.js';
import { taskListCompiler } from './compiler/taskList.js';
import { taskListItemCompiler } from './compiler/taskListItem.js';
import { linkCompiler } from './compiler/link.js';
import { compileMedia } from './compiler/media.js';

const cachedLinks = {};

export class Compiler {
  constructor(config, router) {
    this.config = config;
    this.router = router;
    this.cacheTree = {};
    this.toc = [];
    this.cacheTOC = {};
    this.linkTarget = config.externalLinkTarget || '_blank';
    this.linkRel =
      this.linkTarget === '_blank' ? config.externalLinkRel || 'noopener' : '';
    this.contentBase = router.getBasePath();

    this.renderer = this._initRenderer();
    let compile;
    const mdConf = config.markdown || {};

    if (isFn(mdConf)) {
      compile = mdConf(marked, this.renderer);
    } else {
      marked.setOptions(
        Object.assign(mdConf, {
          renderer: Object.assign(this.renderer, mdConf.renderer),
        }),
      );
      compile = marked;
    }

    this._marked = compile;
    this.compile = text => {
      let isCached = true;

      // FIXME: this is not cached.
      const result = cached(_ => {
        isCached = false;
        let html = '';

        if (!text) {
          return text;
        }

        if (isPrimitive(text)) {
          html = compile(text);
        } else {
          html = compile.parser(text);
        }

        html = config.noEmoji ? html : emojify(html, config.nativeEmoji);
        slugify.clear();

        return html;
      })(text);

      const curFileName = this.router.parse().file;

      if (isCached) {
        this.toc = this.cacheTOC[curFileName];
      } else {
        this.cacheTOC[curFileName] = [...this.toc];
      }

      return result;
    };
  }

  /**
   * Pulls content from file and renders inline on the page as a embedded item.
   *
   * This allows you to embed different file types on the returned
   * page.
   * The basic format is:
   * ```
   *   [filename](_media/example.md ':include')
   * ```
   *
   * @param {string}   href   The href to the file to embed in the page.
   * @param {string}   title  Title of the link used to make the embed.
   *
   * @return {type} Return value description.
   */
  compileEmbed(href, title) {
    const { str, config } = getAndRemoveConfig(title);
    let embed;
    title = str;

    if (config.include) {
      if (!isAbsolutePath(href)) {
        href = getPath(
          this.contentBase,
          getParentPath(this.router.getCurrentPath()),
          href,
        );
      }

      let media;
      if (config.type && (media = compileMedia[config.type])) {
        embed = media.call(this, href, title);
        embed.type = config.type;
      } else {
        let type = 'code';
        if (/\.(md|markdown)/.test(href)) {
          type = 'markdown';
        } else if (/\.mmd/.test(href)) {
          type = 'mermaid';
        } else if (/\.html?/.test(href)) {
          type = 'iframe';
        } else if (/\.(mp4|ogg)/.test(href)) {
          type = 'video';
        } else if (/\.mp3/.test(href)) {
          type = 'audio';
        }

        embed = compileMedia[type](href, title);
        embed.type = type;
      }

      embed.fragment = config.fragment;

      return embed;
    }
  }

  _matchNotCompileLink(link) {
    const links = this.config.noCompileLinks || [];

    for (const n of links) {
      const re = cachedLinks[n] || (cachedLinks[n] = new RegExp(`^${n}$`));

      if (re.test(link)) {
        return link;
      }
    }
  }

  _initRenderer() {
    const renderer = new marked.Renderer();
    const { linkTarget, linkRel, router, contentBase } = this;
    // Supports mermaid
    const origin = {};

    // renderer customizers
    origin.heading = headingCompiler({
      renderer,
      router,
      compiler: this,
    });
    origin.code = highlightCodeCompiler({ renderer });
    origin.link = linkCompiler({
      renderer,
      router,
      linkTarget,
      linkRel,
      compiler: this,
    });
    origin.paragraph = paragraphCompiler({ renderer });
    origin.image = imageCompiler({ renderer, contentBase, router });
    origin.list = taskListCompiler({ renderer });
    origin.listitem = taskListItemCompiler({ renderer });

    renderer.origin = origin;

    return renderer;
  }

  /**
   * Compile sidebar, it uses _sidebar.md (or specific file) or the content's headings toc to render sidebar.
   * @param {String} text Text content from the sidebar file, maybe empty
   * @param {Number} level Type of heading (h<level> tag)
   * @returns {String} Sidebar element
   */
  sidebar(text, level) {
    const { toc } = this;
    const currentPath = this.router.getCurrentPath();
    let html = '';

    // compile sidebar from _sidebar.md
    if (text) {
      return this.compile(text);
    }
    // compile sidebar from content's headings toc
    for (let i = 0; i < toc.length; i++) {
      if (toc[i].ignoreSubHeading) {
        const deletedHeaderLevel = toc[i].depth;
        toc.splice(i, 1);
        // Remove headers who are under current header
        for (
          let j = i;
          j < toc.length && deletedHeaderLevel < toc[j].depth;
          j++
        ) {
          toc.splice(j, 1) && j-- && i++;
        }

        i--;
      }
    }

    const tree = this.cacheTree[currentPath] || genTree(toc, level);
    html = treeTpl(tree);
    this.cacheTree[currentPath] = tree;
    return html;
  }

  /**
   * When current content redirect to a new path file, clean pre content headings toc
   */
  resetToc() {
    this.toc = [];
  }

  /**
   * Compile sub sidebar
   * @param {Number} level Type of heading (h<level> tag)
   * @returns {String} Sub-sidebar element
   */
  subSidebar(level) {
    const currentPath = this.router.getCurrentPath();
    const { cacheTree, toc } = this;

    toc[0] && toc[0].ignoreAllSubs && toc.splice(0);
    // remove the first heading from the toc if it is a top-level heading
    toc[0] && toc[0].depth === 1 && toc.shift();

    for (let i = 0; i < toc.length; i++) {
      toc[i].ignoreSubHeading && toc.splice(i, 1) && i--;
    }

    const tree = cacheTree[currentPath] || genTree(toc, level);

    cacheTree[currentPath] = tree;
    this.toc = [];
    return treeTpl(tree);
  }

  /**
   * Compile the text to generate HTML heading element based on the level
   * @param {*} text Text content, for now it is only from the _sidebar.md file
   * @param {*} level Type of heading (h<level> tag), for now it is always 1
   * @returns
   */
  header(text, level) {
    const tokenHeading = {
      type: 'heading',
      raw: text,
      depth: level,
      text: text,
      tokens: [{ type: 'text', raw: text, text: text }],
    };
    return this.renderer.heading(tokenHeading);
  }

  /**
   * Compile cover page
   * @param {Text} text Text content
   * @returns {String} Cover page
   */
  cover(text) {
    const cacheToc = this.toc.slice();
    const html = this.compile(text);

    this.toc = cacheToc.slice();

    return html;
  }
}
