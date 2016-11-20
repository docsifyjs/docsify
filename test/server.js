const server = require('http').createServer()
const buffet = require('buffet')({ root: './test' })

server.on('request', buffet)

server.listen(6677, function () {
  console.log('Ready! Listening on http://localhost:6677')
})
