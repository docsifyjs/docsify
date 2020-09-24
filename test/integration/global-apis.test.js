import initGlobalAPI from '../../src/core/global-api.js';

// Suite
// -----------------------------------------------------------------------------
describe('Global APIs', function() {
  // Tests
  // ---------------------------------------------------------------------------
  test('APIs are available', () => {
    initGlobalAPI();

    expect(typeof window.Docsify).toEqual('object');
    expect(typeof window.Docsify.util).toEqual('object');
    expect(typeof window.Docsify.dom).toEqual('object');
    expect(typeof window.Docsify.get).toEqual('function');
    expect(typeof window.Docsify.slugify).toEqual('function');
    expect(typeof window.Docsify.version).toEqual('string');
    expect(typeof window.DocsifyCompiler).toEqual('function');
    expect(typeof window.marked).toEqual('function');
    expect(typeof window.Prism).toEqual('object');
  });
});
