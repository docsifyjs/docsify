import prism from 'prismjs';
import { marked } from 'marked';
import * as util from './util/index.js';
import * as dom from './util/dom.js';
import { Compiler } from './render/compiler.js';
import { slugify } from './render/slugify.js';
import { get } from './util/ajax.js';

// TODO This is deprecated, kept for backwards compatibility. Remove in a
// major release. We'll tell people to get everything from the DOCSIFY global
// when using the global build, but we'll highly recommend for them to import
// from the ESM build (f.e. dist/docsify.esm.js and dist/docsify.min.esm.js).
export default function initGlobalAPI() {
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
