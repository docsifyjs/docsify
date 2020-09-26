const stripIndent = require('common-tags/lib/stripIndent');

/**
 * Jest helper for creating test-specific mocks of docsify's custom ajax "get"
 * function.
 *
 * @example
 * test('ajax test', () => {
 *   const mockAjax = doMockAjax({
 *     'README.md': '# Hello World',
 *     'path/to/file.html': `
 *        <p>This is multi-line content
 *        using a template literal.</p>
 *      `
 *   });
 *   // ...
 * });
 *
 * @param {Object} markdownMap Object containing { path: responseText } mapping
 * @returns {Object} Jest mock for "get" in /src/core/fetch/ajax.js module
 */
function doMockAjax(markdownMap) {
  const mockAjax = jest.doMock(`${SRC_PATH}/core/fetch/ajax.js`, () => ({
    get: jest.fn(url => {
      url = new URL(url, TEST_URL).href;

      const markdownMatch =
        markdownMap[
          Object.keys(markdownMap).find(key =>
            url.toLowerCase().includes(key.toLowerCase())
          )
        ];
      const markdownReturn = markdownMatch ? stripIndent`${markdownMatch}` : '';
      const opts = {
        updatedAt: 'Wed Jan 01 2020 10:00:00 GMT-0400',
      };

      return {
        then(success) {
          success(markdownReturn, opts);
        },
      };
    }),
  }));

  return mockAjax;
}

export default doMockAjax;
