import initGlobalAPI from '../../src/core/global-api.js';

// Suite
// -----------------------------------------------------------------------------
describe('Global APIs', function () {
  // Tests
  // ---------------------------------------------------------------------------
  test('APIs are available', () => {
    initGlobalAPI();

    expect(typeof window.Docsify).toBe('object');
    expect(typeof window.Docsify.util).toBe('object');
    expect(typeof window.Docsify.dom).toBe('object');
    expect(typeof window.Docsify.get).toBe('function');
    expect(typeof window.Docsify.slugify).toBe('function');
    expect(typeof window.Docsify.version).toBe('string');
    expect(typeof window.DocsifyCompiler).toBe('function');
    expect(typeof window.marked).toBe('function');
    expect(typeof window.Prism).toBe('object');
  });
});
