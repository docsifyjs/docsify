module.exports = {
  //   GlobalSetup: '<rootDir>/e2e/setup.js',
  //   globalTeardown: '<rootDir>/e2e/teardown.js'
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  globalSetup: '<rootDir>/e2e/globalSetup.js',
  globalTeardown: '<rootDir>/e2e/globalTeardown.js',
  globals: {
    PORT: 3000,
    __LIVESERVER__: null
  }
}
