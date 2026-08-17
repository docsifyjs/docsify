import { documentReady } from './util/dom.js';
import { Docsify } from './Docsify.js';
import initGlobalAPI from './global-api.js';

/**
 * Global API
 */
initGlobalAPI();

/**
 * Run Docsify
 */
documentReady(() => new Docsify());
