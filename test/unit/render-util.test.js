const { removeAtag, escapeHtml } = require(`${SRC_PATH}/core/render/utils`);

// Suite
// -----------------------------------------------------------------------------
describe('core/render/utils', () => {
  // removeAtag()
  // ---------------------------------------------------------------------------
  describe('removeAtag()', () => {
    test('removeAtag from a link', () => {
      const result = removeAtag('<a href="www.example.com">content</a>');

      expect(result).toEqual('content');
    });
  });

  // escapeHtml()
  // ---------------------------------------------------------------------------
  describe('escapeHtml()', () => {
    test('escape html', () => {
      const result = escapeHtml('<a href="www.example.com">content</a>');

      expect(result).toEqual(
        '&lt;a href=&quot;www.example.com&quot;&gt;content&lt;/a&gt;'
      );
    });
  });
});
