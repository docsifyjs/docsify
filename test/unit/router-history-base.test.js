import { History } from '../../src/core/router/history/base.js';

class MockHistory extends History {
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
});
