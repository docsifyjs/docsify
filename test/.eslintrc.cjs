// const jestConfig = require('../jest.config.js');

module.exports = {
  env: {
    'jest/globals': true,
  },
  extends: ['plugin:jest/recommended', 'plugin:jest/style'],
  // TODO No imports of ESM in eslint yet.
  // globals: jestConfig.globals,
  plugins: ['jest'],
};
