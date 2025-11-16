import * as prism from 'prismjs';
import { marked } from 'marked';
import * as util from './util/index.js';
import * as dom from './util/dom.js';
import { Compiler } from './render/compiler.js';
import { slugify } from './render/slugify.js';
import { get } from './util/ajax.js';

/**
 * @deprecated This is deprecated, kept for backwards compatibility. It will be
 * Removed in a major release. Get everything from the DOCSIFY global when using
 * the global build, but we highly recommend to import Docsify using standard
 * import syntax.
 */
export default function initGlobalAPI() {
  console.warn(
    'DEPRECATION: The Docsify global script is deprecated. See the latest getting started docs. https://docsify.js.org/#/quickstart',
  );

  window.Docsify = {
    util,
    dom,
    get,
    slugify,
    version: '__VERSION__',
  };
  window.DocsifyCompiler = Compiler;
  window.marked = marked;
  window.Prism = prism;
}
