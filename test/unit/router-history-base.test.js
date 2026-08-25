import { History } from '../../src/core/router/history/base.js';

class MockHistory extends History {
  mode = 'hash';

  parse(path) {
    return { path };
  }
}

// Suite
// -----------------------------------------------------------------------------
describe('router/history/base', () => {
  // Setup & Teardown
  // ---------------------------------------------------------------------------
  let history;

  // resolvePath: true
  // ---------------------------------------------------------------------------
  describe('relativePath: true', () => {
    // Setup & Teardown
    // -------------------------------------------------------------------------
    beforeEach(() => {
      history = new MockHistory({ relativePath: true });
    });

    // Tests
    // -------------------------------------------------------------------------
    test('toURL', () => {
      const url = history.toURL('guide.md', {}, '/zh-ch/');

      expect(url).toBe('/zh-ch/guide');
    });

    test('toURL with double dot', () => {
      const url = history.toURL('../README.md', {}, '/zh-ch/');

      expect(url).toBe('/README');
    });

    test('toURL child path', () => {
      const url = history.toURL('config/example.md', {}, '/zh-ch/');

      expect(url).toBe('/zh-ch/config/example');
    });

    test('toURL absolute path', () => {
      const url = history.toURL('/README', {}, '/zh-ch/');

      expect(url).toBe('/README');
    });
  });

  // resolvePath: false
  // ---------------------------------------------------------------------------
  describe('relativePath: false', () => {
    // Setup & Teardown
    // -------------------------------------------------------------------------
    beforeEach(() => {
      history = new MockHistory({ relativePath: false });
    });

    // Tests
    // -------------------------------------------------------------------------
    test('toURL', () => {
      const url = history.toURL('README', {}, '/zh-ch/');

      expect(url).toBe('/README');
    });
  });

  describe('default path behavior', () => {
    beforeEach(() => {
      history = new MockHistory({ relativePath: true });
    });

    test('resolves relative links from the current page', () => {
      expect(history.toURL('guide.md', {}, '/dir/page')).toBe('/dir/guide');
      expect(history.toURL('../guide.md', {}, '/dir/page')).toBe('/guide');
    });

    test('keeps absolute links rooted', () => {
      expect(history.toURL('/guide.md', {}, '/dir/page')).toBe('/guide');
    });
  });

  // getFile test
  // ---------------------------------------------------------------------------
  describe('getFile', () => {
    // Tests
    // -------------------------------------------------------------------------
    test('path is url', () => {
      const file = history.getFile('https://some/raw/url/README.md');

      expect(file).toBe('https://some/raw/url/README.md');
    });
    test('path is url, but ext is .html', () => {
      const file = history.getFile('https://foo.com/index.html');

      expect(file).toBe('https://foo.com/index.html');
    });
    test('path is url, but with parameters', () => {
      const file = history.getFile(
        'https://some/raw/url/README.md?token=Mytoken',
      );

      expect(file).toBe('https://some/raw/url/README.md?token=Mytoken');
    });
    test('path is url, but ext is different', () => {
      history = new MockHistory({ ext: '.ext' });

      const file = history.getFile('https://some/raw/url/README.md');

      expect(file).toBe('https://some/raw/url/README.md.ext');
    });

    test('does not duplicate a configured local base path', () => {
      history = new MockHistory({ basePath: '/docs/' });

      expect(history.getFile('/docs/guide')).toBe('/docs/guide.md');
    });
  });
});
