import { removeAtag } from '../../src/core/render/utils';

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
});
