// Small ESM wrapper, used in the importmap for 'prismjs', to import PrismJS by
// tricking its CommonJS format to see module.exports.

const __prismCjs = await fetch('/node_modules/prismjs/prism.js').then(res =>
  res.text(),
);

// Emulate CommonJS environment
const module = { exports: {} };
// eslint-disable-next-line no-unused-vars
const exports = module.exports;

// Evaluate the CommonJS code with module.exports in scope
eval(__prismCjs);

// Export the Prism object
const _Prism = module.exports;
export default _Prism;

// Also make Prism global because Docsify expects it by importing from
// 'prismjs/components/prism-markup-templating.js' in the compiler.
// @ts-expect-error FIXME get rid of this ugly global dependency hack in Docsify.
window.Prism = _Prism;

// @ts-expect-error
// eslint-disable-next-line no-undef
console.log('Prism loaded:', Prism);
