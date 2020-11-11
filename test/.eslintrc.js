const jestConfig = require('../jest.config.js');

module.exports = {
  env: {
    'jest/globals': true,
  },
  extends: ['plugin:jest/recommended', 'plugin:jest/style'],
  globals: jestConfig.globals,
  plugins: ['jest'],
};
