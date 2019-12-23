module.exports = {
  //   GlobalSetup: '<rootDir>/e2e/setup.js',
  //   globalTeardown: '<rootDir>/e2e/teardown.js'
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  testEnvironment: '<rootDir>/e2e/babel_testEnvironment.js'
}
