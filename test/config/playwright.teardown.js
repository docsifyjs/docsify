const server = require('./server.js');

module.exports = async config => {
  server.stop();
};
