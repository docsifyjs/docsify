/* eslint-disable no-global-assign */
require = require('esm')(
  module /* , options */
); /* eslint-disable-line no-global-assign */
const { expect } = require('chai');
const { History } = require('../../src/core/router/history/base');

class MockHistory extends History {
  parse(path) {
    return { path };
  }
}

describe('router/history/base', function() {
  describe('relativePath true', function() {
    let history;

    beforeEach(function() {
      history = new MockHistory({ relativePath: true });
    });

    it('toURL', function() {
      // WHEN
      const url = history.toURL('guide.md', {}, '/zh-ch/');

      // THEN
      expect(url).equal('/zh-ch/guide');
    });

    it('toURL with double dot', function() {
      // WHEN
      const url = history.toURL('../README.md', {}, '/zh-ch/');

      // THEN
      expect(url).equal('/README');
    });

    it('toURL child path', function() {
      // WHEN
      const url = history.toURL('config/example.md', {}, '/zh-ch/');

      // THEN
      expect(url).equal('/zh-ch/config/example');
    });

    it('toURL absolute path', function() {
      // WHEN
      const url = history.toURL('/README', {}, '/zh-ch/');

      // THEN
      expect(url).equal('/README');
    });
  });

  it('toURL without relative path', function() {
    const history = new MockHistory({ relativePath: false });

    // WHEN
    const url = history.toURL('README', {}, '/zh-ch/');

    // THEN
    expect(url).equal('/README');
  });
});
