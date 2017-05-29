var serveStatic = require('serve-static')
var http = require('http')
var fs = require('fs')
var Renderer = require('./packages/docsify-server-renderer/build.js')

var renderer = new Renderer({
  template: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>docsify</title>
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
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
    repo: 'qingwei-li/docsify',
    basePath: 'https://docsify.js.org/',
    loadNavbar: true,
    loadSidebar: true,
    subMaxLevel: 3,
    auto2top: true,
    alias: {
      '/de-de/changelog': '/changelog',
      '/zh-cn/changelog': '/changelog',
      '/changelog': 'https://raw.githubusercontent.com/QingWei-Li/docsify/master/CHANGELOG'
    }
  },
  path: './'
})

http.createServer(function (req, res) {
  serveStatic('.')(req, res, function () {
    // TEST SSR
    // renderer.renderToString(req.url)
      // .then(html => res.end(html))

    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end(fs.readFileSync('dev.html'))
  })
}).listen(3000, '0.0.0.0')

console.log(`\nListening at http://0.0.0.0:3000\n`)

