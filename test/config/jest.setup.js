const server = require('./server.js');

module.exports = async () => {
  await server.startAsync();
};
