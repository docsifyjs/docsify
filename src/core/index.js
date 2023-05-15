import { documentReady } from './util/dom';
import { Docsify } from './Docsify';

/**
 * Run Docsify
 */
const runDocsify = () => {
  // eslint-disable-next-line no-unused-vars
  documentReady(_ => new Docsify());
};

if (window.DOCSIFY_DEFER) {
  window.runDocsify = runDocsify;
} else {
  window.runDocsify = () => {};
  runDocsify();
}
