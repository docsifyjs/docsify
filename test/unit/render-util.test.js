const { removeAtag } = require(`${SRC_PATH}/core/render/utils`);
const { tree } = require(`${SRC_PATH}/core/render/tpl`);

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

describe('core/render/tpl', () => {
  describe('remove html tag in tree', () => {
    test('remove span and img', () => {
      const result = tree([
        {
          level: 2,
          slug: '#/cover?id=basic-usage',
          title: '<span style="color:red">Basic usage</span>',
        },
        {
          level: 2,
          slug: '#/cover?id=custom-background',
          title: 'Custom background',
        },
        {
          level: 2,
          slug: '#/cover?id=test',
          title:
            '<img src="/docs/_media/favicon.ico" data-origin="/_media/favicon.ico" alt="ico">Test',
        },
      ]);

      expect(result).toEqual(
        `<ul class="app-sub-sidebar"><li><a class="section-link" href="#/cover?id=basic-usage" title="Basic usage"><span style="color:red">Basic usage</span></a></li><li><a class="section-link" href="#/cover?id=custom-background" title="Custom background">Custom background</a></li><li><a class="section-link" href="#/cover?id=test" title="Test"><img src="/docs/_media/favicon.ico" data-origin="/_media/favicon.ico" alt="ico">Test</a></li></ul>`
      );
    });
  });
});
