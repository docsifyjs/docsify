module.exports = async () => {
  const server = (await import('./server')).default;
  server.stop();
};
