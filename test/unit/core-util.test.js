import { cached, isExternal } from '../../src/core/util/index.js';

// Core util
// -----------------------------------------------------------------------------
describe('core/util', () => {
  describe('cached()', () => {
    test('memoizes falsy return values', () => {
      let calls = 0;
      const fn = cached(() => {
        calls += 1;
        return '';
      });

      expect(fn('same-key')).toBe('');
      expect(fn('same-key')).toBe('');
      expect(calls).toBe(1);
    });

    test('memoizes undefined return values', () => {
      let calls = 0;
      const fn = cached(() => {
        calls += 1;
        return undefined;
      });

      expect(fn('same-key')).toBeUndefined();
      expect(fn('same-key')).toBeUndefined();
      expect(calls).toBe(1);
    });
  });

  // isExternal()
  // ---------------------------------------------------------------------------
  describe('isExternal()', () => {
    // cases non-external
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
        `//////////////////${location.host}/docsify/demo.md`,
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
        '//////////////////example.github.io/docsify/demo.md',
      );

      expect(result).toBeTruthy();
    });

    test('external url with one \\', () => {
      const result = isExternal('/\\example.github.io/docsify/demo.md');

      expect(result).toBeTruthy();
    });

    test('external url with two \\', () => {
      const result = isExternal('/\\\\example.github.io/docsify/demo.md');

      expect(result).toBeTruthy();
    });
  });
});
