const server = require('./server.js');

module.exports = async () => {
  server.stop();
};
