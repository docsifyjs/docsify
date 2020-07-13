const path = require('path');
const liveServer = require('live-server');
const { host, port } = require('./server.js');

module.exports = async () => {
  global.__SERVER__ = liveServer; // Instance reference for teardown script

  liveServer.start({
    host,
    port,
    root: path.resolve(__dirname, '../fixtures'),
    open: false,
    logLevel: 0,
    mount: [
      ['/docs', path.resolve(__dirname, '../../../docs')],
      ['/lib', path.resolve(__dirname, '../../../lib')],
    ],
  });
};
