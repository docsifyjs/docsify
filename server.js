import liveServer from 'live-server';
import { qualifyURL } from './packages/docsify-server-renderer/src/utils';

const isSSR = !!process.env.SSR;
const middleware = [];
const port = 3000;

main();

async function main() {
  if (isSSR) {
    // Using JSDom here because the server relies on a small subset of DOM APIs.
    // The URL used here serves no purpose other than to give JSDOM an HTTP
    // URL to operate under (it probably can be anything).
    initJSDOM('', { url: 'http://127.0.0.1:' + port });

    const { Renderer, getServerHTMLTemplate } = await import(
      './packages/docsify-server-renderer/index'
    );

    const renderer = new Renderer({
      template: getServerHTMLTemplate(),
      config: {
        name: 'docsify',
        repo: 'docsifyjs/docsify',
        // Do not use URLs for SSR mode. Specify only an absolute or relative file path.
        // basePath: 'https://docsify.js.org/',
        basePath: '/docs', // TODO if not set while in SSR mode, code tries to operate on an undefined value. Set a default.
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
      const url = new URL(qualifyURL(req.url));

      // Only handle markdown files or folders.
      if (/(\.md|\/[^.]*)$/.test(url.pathname)) {
        // ^ See the related getFileName() function.
        renderer.renderToString(req.url).then(html => res.end(html));
        return;
      }

      // TODO there *must* be edge cases. Add an option to force certain files?
      console.log('Skipping markdown handling of file ' + req.url);

      return next();
    });
  }

  const params = {
    port,
    watch: ['lib', 'docs', 'themes'],
    middleware,
  };

  liveServer.start(params);
}

async function initJSDOM(markup, options) {
  const { JSDOM } = (await import('jsdom')).default;
  const dom = new JSDOM(markup, options);

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.location = dom.window.location;
  global.XMLHttpRequest = dom.window.XMLHttpRequest;

  return dom;
}
