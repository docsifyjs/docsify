const liveServer = require('live-server')
const middleware = []

const params = {
  port: 3000,
  watch: ['lib', 'docs', 'themes'],
  middleware
}

liveServer.start(params)
