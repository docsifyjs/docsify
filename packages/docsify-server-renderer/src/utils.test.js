// @ts-check
import { isExternal } from './utils';

describe('server-render/utils', () => {
  describe('isExternal()', () => {
    test('detects whether links are external or not', async () => {
      // Note, Jest tests operate under the origin "http://127.0.0.1:3001"

      expect(isExternal).toBeInstanceOf(Function);
      expect(isExternal('/foo.md')).toBe(false);
      expect(isExternal('//foo.md')).toBe(true);
      expect(isExternal('foo.md')).toBe(false);
      expect(isExternal('//127.0.0.1:3000/foo.md')).toBe(true);
      expect(isExternal('//127.0.0.1:3001/foo.md')).toBe(false);
      expect(isExternal('http://127.0.0.1:3000/foo.md')).toBe(true);
      expect(isExternal('https://127.0.0.1:3000/foo.md')).toBe(true);
      expect(isExternal('http://127.0.0.1:3001/foo.md')).toBe(false);
      expect(isExternal('https://127.0.0.1:3001/foo.md')).toBe(true);
      expect(isExternal('https://google.com/foo.md')).toBe(true);
      expect(isExternal('//google.com/foo.md')).toBe(true);
      expect(isExternal('/google.com/foo.md')).toBe(false);
      expect(isExternal('google.com')).toBe(false);
      expect(isExternal('google.com/foo.md')).toBe(false);
      expect(isExternal('#foo')).toBe(false);
      expect(isExternal('?foo')).toBe(false);
    });

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
      const result = isExternal('//docsify/demo.md');

      expect(result).toBeTruthy();
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
