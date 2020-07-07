const path = require('path');
const liveServer = require('live-server');
const { serverIP, serverPort } = require('./helpers/server.js');

module.exports = async () => {
  global.__SERVER__ = liveServer;

  liveServer.start({
    host: serverIP,
    port: serverPort,
    root: path.resolve(__dirname, 'fixtures'),
    open: false,
    logLevel: 0,
    mount: [
      ['/docs', path.resolve(__dirname, '../docs')],
      ['/lib', path.resolve(__dirname, '../lib')],
    ],
  });
};
