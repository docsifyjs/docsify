import { markdownToTxt } from '../../src/plugins/search/markdown-to-txt.js';

describe('search markdown to text', () => {
  test.each([
    ['**a *formatted* word**', 'a formatted word'],
    ['**a `code` word**', 'a code word'],
    ['**[link](https://example.org)**', 'link https://example.org'],
    ['**plain bold text**', 'plain bold text'],
  ])('extracts nested inline content from %s', (markdown, expected) => {
    expect(markdownToTxt(markdown)).toBe(expected);
  });
});
