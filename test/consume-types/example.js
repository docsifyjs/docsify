// This file demonstrates consuming Docsify as an ES Module with TypeScript types.
// Things to try:
// - Running 'Go to Definition' on `Docsify` should take you to the source JS
//   file, not only the declaration file.
// - Import from any subpath, and the type definitions should be visible.

// Import the service worker registration script. This is needed to re-map
// imports when using ES Modules in the browser, as some of Docsify's
// dependencies are not available as ES Modules by default (CommonJS) or have
// non-standard import paths like 'some-lib/some-subpath' without a file
// extension, or expecting to import `index.js` from a folder, f.e.
// 'some-lib/some-subpath.js' or 'some-lib/some-subpath/index.js'.
// FIXME Replace ancient non-ESM dependencies with modern libraries.
import './register-sw.js';

// FIXME hack: import prismjs first to ensure global Prism is set up, as
// Docsify's graph (the import to
// 'prismjs/components/prism-markup-templating.js') depends on Prism being
// global first.
await import('prismjs');

// Import Docsify *after* prismjs or there will be a runtime error. See the
// importmap, and prism.js for more details.
//
// NOTE: we have to use `await import` instead of `import` statements because
// Prism being global is not statically analyzable by the ES Module system so it
// will try to execute Docsify's graph before prism.js has finished executed.
// This is very odd, I didn't think this was possible.
const { Docsify } = await import('docsify');

const d = new Docsify({
  el: '#app',
  name: 'Vanilla ESM TypeScript Example',
  themeColor: 'deeppink',
  hideSidebar: false,

  // @ts-expect-error invalid property to test that type checking works
  blahblah: 123,
});

console.log(d);

// @ts-expect-error global types not available to ESM
window.Docsify;

export {};
