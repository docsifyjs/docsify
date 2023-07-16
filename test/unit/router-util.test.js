import { resolvePath } from '../../src/core/util/index.js';

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
