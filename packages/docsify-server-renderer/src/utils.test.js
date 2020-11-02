// @ts-check

import { isExternal } from './utils';
// import { docsifyInit } from '../helpers/docsify-init';

describe('isExternal', () => {
  test('detects whether links are external or not', async () => {
    // initJSDOM('', {
    //   url: 'http://127.0.0.1:3000',
    //   runScripts: 'dangerously',
    //   resources: 'usable',
    // });

    // docsifyInit();

    expect(isExternal).toBeInstanceOf(Function);
    expect(isExternal('/foo.md')).toBe(false);
    expect(isExternal('//foo.md')).toBe(true);
    expect(isExternal('//127.0.0.1:3000/foo.md')).toBe(false);
    expect(isExternal('http://127.0.0.1:3001/foo.md')).toBe(true);
    expect(isExternal('https://google.com/foo.md')).toBe(true);
    expect(isExternal('//google.com/foo.md')).toBe(true);
    expect(isExternal('/google.com/foo.md')).toBe(false);
  });
});
