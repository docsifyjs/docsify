// @ts-check
import { isExternal } from './utils';

describe('isExternal', () => {
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
  });
});
