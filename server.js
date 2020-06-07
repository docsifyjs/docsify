const liveServer = require('live-server')
const isSSR = !!process.env.SSR
const middleware = []

if (isSSR) {
  const Renderer = require('./packages/docsify-server-renderer/build.js')
  const renderer = new Renderer({
    template: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>docsify</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="/themes/vue.css" title="vue">
  </head>
  <body>
    <!--inject-app-->
    <!--inject-config-->
  <script src="/lib/docsify.js"></script>
  </body>
  </html>`,
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
          'https://raw.githubusercontent.com/docsifyjs/docsify/master/CHANGELOG'
      }
    },
    path: './'
  })

  middleware.push(function(req, res, next) {
    if (/\.(css|js)$/.test(req.url)) {
      return next()
    }
    renderer.renderToString(req.url).then(html => res.end(html))
  })
}

const params = {
  port: 3000,
  watch: ['lib', 'docs', 'themes'],
  middleware
}

liveServer.start(params)
