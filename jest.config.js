const path = require('path');
const { TEST_URL, DOCS_URL, LIB_URL } = require('./tests/e2e/config/server.js');

const sharedConfig = {
  errorOnDeprecated: true,
  globals: {
    DOCS_PATH: path.resolve(__dirname, 'docs'),
    DOCS_URL,
    LIB_PATH: path.resolve(__dirname, 'lib'),
    LIB_URL,
    SRC_PATH: path.resolve(__dirname, 'src'),
    TEST_URL,
  },
  resetModules: true,
  restoreMocks: true,
  // testPathIgnorePatterns: ['example.test'],
};

// Jest-Playwrigth Config
process.env.JEST_PLAYWRIGHT_CONFIG =
  './tests/e2e/config/jest-playwright.config.js';

module.exports = {
  projects: [
    // Unit Tests (Jest)
    {
      ...sharedConfig,
      displayName: 'unit',
      setupFilesAfterEnv: ['<rootDir>/tests/unit/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/tests/unit/*.test.js'],
      testURL: TEST_URL,
    },
    // Integration Tests (Jest)
    {
      ...sharedConfig,
      displayName: 'integration',
      setupFilesAfterEnv: ['<rootDir>/tests/unit/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/tests/integration/*.test.js'],
      testURL: TEST_URL,
    },
    // E2E Tests (Jest + Playwright)
    {
      ...sharedConfig,
      displayName: 'e2e',
      globalSetup: './tests/e2e/config/jest.setup.js',
      globalTeardown: './tests/e2e/config/jest.teardown.js',
      preset: 'jest-playwright-preset',
      setupFilesAfterEnv: ['<rootDir>/tests/e2e/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/tests/e2e/*.test.js'],
    },
  ],
};
