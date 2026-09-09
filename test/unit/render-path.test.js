import {
  resolveDocumentPath,
  resolvePathFromBase,
  resolveResourcePath,
} from '../../src/core/render/path.js';

describe('render/path', () => {
  describe('resolvePathFromBase', () => {
    test.each([
      ['/dir/image.png', '/', '/dir/image.png'],
      ['/dir/image.png', '/site/', '/site/dir/image.png'],
      ['../image.png', '/site/dir/', '/site/image.png'],
      [
        'image.png',
        'https://cdn.example.com/assets/',
        'https://cdn.example.com/assets/image.png',
      ],
    ])('resolves %s from %s', (path, basePath, expected) => {
      expect(resolvePathFromBase(path, basePath)).toBe(expected);
    });

    test('returns null for an invalid base', () => {
      expect(resolvePathFromBase('image.png', 'https://[')).toBeNull();
    });
  });

  describe('resolveResourcePath', () => {
    const defaults = {
      config: {},
      contentBase: '/site/',
      currentPath: '/dir/page',
    };

    test.each([
      ['/image.png', '/image.png'],
      ['/dir/image.png', '/dir/image.png'],
      ['image.png', '/site/dir/image.png'],
      ['./image.png', '/site/dir/image.png'],
      ['../image.png', '/site/image.png'],
      ['../dir/image.png', '/site/dir/image.png'],
    ])('resolves %s using standard web behavior', (href, expected) => {
      expect(resolveResourcePath(href, defaults)).toBe(expected);
    });

    test('uses resource-specific base paths before basePath', () => {
      expect(
        resolveResourcePath('/image.png', {
          ...defaults,
          config: {
            absoluteBasePath: '/assets/',
            basePath: '/ignored/',
          },
        }),
      ).toBe('/assets/image.png');

      expect(
        resolveResourcePath('image.png', {
          ...defaults,
          config: {
            relativeBasePath: '/assets/',
            basePath: '/ignored/',
          },
        }),
      ).toBe('/assets/image.png');
    });

    test('uses the element base path and falls back when it is invalid', () => {
      expect(
        resolveResourcePath('image.png', {
          ...defaults,
          elementBasePath: '/assets/',
        }),
      ).toBe('/assets/image.png');

      expect(
        resolveResourcePath('image.png', {
          ...defaults,
          elementBasePath: true,
        }),
      ).toBe('/site/dir/image.png');
    });
  });

  describe('resolveDocumentPath', () => {
    test('preserves default relative and absolute paths', () => {
      expect(resolveDocumentPath('guide.md', { config: {} })).toEqual({
        path: 'guide.md',
        rooted: false,
      });
      expect(resolveDocumentPath('/guide.md', { config: {} })).toEqual({
        path: '/guide.md',
        rooted: true,
      });
    });

    test('supports a per-element base path', () => {
      expect(
        resolveDocumentPath('guide.md', {
          config: {},
          elementBasePath: '/shared/',
        }),
      ).toEqual({ path: '/shared/guide.md', rooted: true });
    });

    test('keeps external basePath links as SPA routes', () => {
      expect(
        resolveDocumentPath('guide.md', {
          config: { basePath: 'https://cdn.example.com/docs/' },
        }),
      ).toEqual({ path: 'guide.md', rooted: false });
    });

    test('allows resource-specific external bases', () => {
      expect(
        resolveDocumentPath('guide.md', {
          config: { relativeBasePath: 'https://docs.example.com/' },
        }),
      ).toEqual({
        path: 'https://docs.example.com/guide.md',
        rooted: true,
      });
    });
  });
});
