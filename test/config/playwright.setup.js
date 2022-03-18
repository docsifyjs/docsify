const server = require('./server.js');

module.exports = async config => {
  await server.startAsync();
};
