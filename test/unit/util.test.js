/* eslint-disable no-global-assign */
require = require('esm')(
  module /* , options */
); /* eslint-disable-line no-global-assign */
const { expect } = require('chai');
const { resolvePath } = require('../../src/core/router/util');

describe('router/util', function() {
  it('resolvePath', async function() {
    // WHEN
    const result = resolvePath('hello.md');

    // THEN
    expect(result).equal('/hello.md');
  });

  it('resolvePath with dot', async function() {
    // WHEN
    const result = resolvePath('./hello.md');

    // THEN
    expect(result).equal('/hello.md');
  });

  it('resolvePath with two dots', async function() {
    // WHEN
    const result = resolvePath('test/../hello.md');

    // THEN
    expect(result).equal('/hello.md');
  });
});
