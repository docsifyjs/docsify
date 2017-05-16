var serveStatic = require('serve-static')
var http = require('http')
var fs = require('fs')

http.createServer(function (req, res) {
  serveStatic('.')(req, res, function () {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(fs.readFileSync('dev.html'))
  })
}).listen(3000, '0.0.0.0')

console.log(`\nListening at http://0.0.0.0:3000\n`)
