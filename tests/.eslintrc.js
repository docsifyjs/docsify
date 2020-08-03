module.exports = {
  env: {
    'jest/globals': true,
  },
  extends: ['plugin:jest/recommended', 'plugin:jest/style'],
  globals: {
    TEST_URL: 'readonly',
    DOCS_PATH: 'readonly',
    LIB_PATH: 'readonly',
  },
  plugins: ['jest'],
};
