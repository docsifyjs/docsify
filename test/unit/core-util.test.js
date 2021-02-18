const { isExternal } = require('../../src/core/util');

// Core util
// -----------------------------------------------------------------------------
describe('core/util', () => {
  // isExternal()
  // ---------------------------------------------------------------------------
  describe('isExternal()', () => {
    // cases non external
    test('non external local url with one /', () => {
      const result = isExternal(`/${location.host}/docsify/demo.md`);

      expect(result).toBeFalsy();
    });

    test('non external local url with two //', () => {
      const result = isExternal(`//${location.host}/docsify/demo.md`);

      expect(result).toBeFalsy();
    });

    test('non external local url with three ///', () => {
      const result = isExternal(`///${location.host}/docsify/demo.md`);

      expect(result).toBeFalsy();
    });

    test('non external local url with more /', () => {
      const result = isExternal(
        `//////////////////${location.host}/docsify/demo.md`
      );

      expect(result).toBeFalsy();
    });

    test('non external url with one /', () => {
      const result = isExternal('/example.github.io/docsify/demo.md');

      expect(result).toBeFalsy();
    });

    // cases is external
    test('external url with two //', () => {
      const result = isExternal('/docsify/demo.md');

      expect(result).toBeFalsy();
    });

    test('external url with three ///', () => {
      const result = isExternal('///example.github.io/docsify/demo.md');

      expect(result).toBeTruthy();
    });

    test('external url with more /', () => {
      const result = isExternal(
        '//////////////////example.github.io/docsify/demo.md'
      );

      expect(result).toBeTruthy();
    });
  });
});
