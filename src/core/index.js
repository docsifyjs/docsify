import Prism from 'prismjs';
import marked from 'marked';
import { initMixin } from './init';
import { routerMixin } from './router';
import { renderMixin } from './render';
import { fetchMixin } from './fetch';
import { eventMixin } from './event';
import initGlobalAPI from './global-api';
import { Compiler as DocsifyCompiler } from './render/compiler';
import * as util from './util';
import * as dom from './util/dom';
import { slugify } from './render/slugify';
import { get } from './fetch/ajax';

export function Docsify() {
  this._init();
}

const proto = Docsify.prototype;

initMixin(proto);
routerMixin(proto);
renderMixin(proto);
fetchMixin(proto);
eventMixin(proto);

/**
 * Global API
 */
initGlobalAPI(); // deprecated

// Rollup assigns all exports from this file onto a single DOCSIFY global.
export { util, dom, get, slugify, DocsifyCompiler, marked, Prism };
export const version = '__VERSION__';

/**
 * Run Docsify
 */
// eslint-disable-next-line no-unused-vars
dom.documentReady(_ => new Docsify());
