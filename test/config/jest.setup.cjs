module.exports = async () => {
  const server = await import('./server');
  await server.startServerAsync();
};
