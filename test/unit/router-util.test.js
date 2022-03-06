const { resolvePath } = require('../../src/core/util');

// Suite
// -----------------------------------------------------------------------------
describe('router/util', () => {
  // resolvePath()
  // ---------------------------------------------------------------------------
  describe('resolvePath()', () => {
    test('resolvePath with filename', () => {
      const result = resolvePath('hello.md');

      expect(result).toBe('/hello.md');
    });

    test('resolvePath with ./', () => {
      const result = resolvePath('./hello.md');

      expect(result).toBe('/hello.md');
    });

    test('resolvePath with ../', () => {
      const result = resolvePath('test/../hello.md');

      expect(result).toBe('/hello.md');
    });
  });
});
