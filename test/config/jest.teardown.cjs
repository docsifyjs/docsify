module.exports = async () => {
  const server = await import('./server');
  server.stopServer();
};
