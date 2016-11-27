var serveStatic = require('serve-static')
var http = require('http')
var fs = require('fs')

http.createServer(function (req, res) {
  serveStatic('.')(req, res, function () {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end(fs.readFileSync('404.dev.html'))
  })
}).listen(3000)

console.log(`\nListening at http://localhost:3000\n`)
