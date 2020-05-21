// @ts-check
/* eslint-disable no-global-assign */
require = require('esm')(
  module /* , options */
); /* eslint-disable-line no-global-assign */
const { expect } = require('chai');
const { initJSDOM } = require('../_helper');

initJSDOM();

const { Renderer } = require('../../packages/docsify-server-renderer/index');

describe('pacakges/docsify-server-render', function() {
  it('toURL', function() {
    expect(Renderer).to.be.an.instanceof(Function);
    expect('foo').equal('foo');
  });
});
