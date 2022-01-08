module.exports = {
  presets: [
    ['babel-preset-solid', { generate: 'dom', hydratable: true }],
    ['@babel/preset-env', { targets: { node: 'current' } }],
  ],
};
