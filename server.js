// const liveServer = require('live-server');
import liveServer from 'live-server';
const isSSR = !!process.env.SSR;
const middleware = [];

main();

async function main() {
  if (isSSR) {
    // Using JSDom here because the server relies on a small subset of DOM APIs.
    // The URL used here serves no purpose other than to give JSDOM an HTTP
    // URL to operate under (it probably can be anything).
    initJSDOM('', { url: 'https://127.0.0.1:3000' });

    // const requireESM = require('esm')(module /* , options */);
    // const { Renderer, getServerHTMLTemplate } = requireESM(
    //   './packages/docsify-server-renderer/index'
    // );

    const { Renderer, getServerHTMLTemplate } = await import(
      // './packages/docsify-server-renderer/index.js'
      './packages/docsify-server-renderer/index'
    );

    const renderer = new Renderer({
      template: getServerHTMLTemplate(),
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
    });

    middleware.push(function(req, res, next) {
      if (/\.(css|js)$/.test(req.url)) {
        return next();
      }
      renderer.renderToString(req.url).then(html => res.end(html));
    });
  }

  const params = {
    port: 3000,
    watch: ['lib', 'docs', 'themes'],
    middleware,
  };

  liveServer.start(params);
}

async function initJSDOM(markup, options) {
  // const { JSDOM } = require('jsdom');
  const { JSDOM } = (await import('jsdom')).default;
  const dom = new JSDOM(markup, options);

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.location = dom.window.location;
  global.XMLHttpRequest = dom.window.XMLHttpRequest;

  return dom;
}
