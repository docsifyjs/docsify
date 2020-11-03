// This has to be a CommonJS file because Jest currently imports it using
// `require()` instead of `import` (to be continued)...

module.exports = async () => {
  // ...(continued) but we can use import in here to transition back into ESM land.
  const server = (await import('./server')).default;

  await server.startAsync();
};
