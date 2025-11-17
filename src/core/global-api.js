import * as prism from 'prismjs';
import { marked } from 'marked';
import * as util from './util/index.js';
import * as dom from './util/dom.js';
import { Compiler } from './render/compiler.js';
import { slugify } from './render/slugify.js';
import { get } from './util/ajax.js';

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
