// @ts-check

// const { initJSDOM } = require('../_helper');

// const port = 9754;
// const docsifySite = 'http://127.0.0.1:' + port;

// initJSDOM();

import {
  Renderer,
  getServerHTMLTemplate,
} from '../../packages/docsify-server-renderer/index';

describe('pacakges/docsify-server-render', function() {
  it('renders content', async function() {
    const renderer = new Renderer({
      template: getServerHTMLTemplate(),
      config: {
        name: 'docsify',
        repo: 'docsifyjs/docsify',
        // basePath: 'https://docsify.js.org/',
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
    });

    await renderer.renderToString('/changelog');

    expect(renderer).toBeInstanceOf(Renderer);
  });
});
