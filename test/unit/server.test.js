// @ts-check
/* eslint-disable no-global-assign */
require = require('esm')(
  module /* , options */
); /* eslint-disable-line no-global-assign */
const { expect } = require('chai');
const { initJSDOM } = require('../_helper');

initJSDOM();

const {
  Renderer,
  getDefaultTemplate,
} = require('../../packages/docsify-server-renderer/index');

describe('pacakges/docsify-server-render', function() {
  it('renders content', function() {
    const renderer = new Renderer({
      template: getDefaultTemplate(),
      config: {
        name: 'docsify',
        repo: 'docsifyjs/docsify',
        basePath: 'https://docsify.js.org/',
        loadNavbar: true,
        loadSidebar: true,
        subMaxLevel: 3,
        auto2top: true,
        alias: {
          '/de-de/changelog': '/changelog',
          '/zh-cn/changelog': '/changelog',
          '/changelog':
            'https://raw.githubusercontent.com/docsifyjs/docsify/master/CHANGELOG',
        },
      },
      // path: './', // not used for anything?
    });

    expect(renderer).to.be.an.instanceof(Renderer);
  });
});
