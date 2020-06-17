const liveServer = require('live-server');
const isSSR = !!process.env.SSR;
const middleware = [];

if (isSSR) {
  const { initJSDOM } = require('./test/_helper');

  const dom = initJSDOM('', {
    url: 'https://127.0.0.1:3000',
  });

  require = require('esm')(module /* , options */);

  const {
    Renderer,
    getDefaultTemplate,
  } = require('./packages/docsify-server-renderer/index');

  debugger;

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
