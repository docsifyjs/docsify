const path = require('path');
const liveServer = require('live-server');

const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 3001;

function startServer() {
  liveServer.start({
    host: SERVER_HOST,
    port: SERVER_PORT,
    root: path.resolve(__dirname, '../fixtures'),
    open: false,
    logLevel: 0,
    mount: [
      ['/docs', path.resolve(__dirname, '../../../docs')],
      ['/lib', path.resolve(__dirname, '../../../lib')],
    ],
  });
}

function stopServer() {
  liveServer.shutdown();
}

module.exports = {
  start: startServer,
  stop: stopServer,
  URL: `http://${SERVER_HOST}:${SERVER_PORT}`,
};
