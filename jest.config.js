const path = require('path');
const { TEST_URL, DOCS_URL, LIB_URL } = require('./test/e2e/config/server.js');

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
};

// Jest-Playwrigth Config
process.env.JEST_PLAYWRIGHT_CONFIG =
  './test/e2e/config/jest-playwright.config.js';

module.exports = {
  projects: [
    // Unit Tests (Jest)
    {
      ...sharedConfig,
      displayName: 'unit',
      setupFilesAfterEnv: ['<rootDir>/test/unit/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/test/unit/*.test.js'],
      testURL: TEST_URL,
    },
    // Integration Tests (Jest)
    {
      ...sharedConfig,
      displayName: 'integration',
      setupFilesAfterEnv: ['<rootDir>/test/unit/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/test/integration/*.test.js'],
      testURL: TEST_URL,
    },
    // E2E Tests (Jest + Playwright)
    {
      ...sharedConfig,
      displayName: 'e2e',
      globalSetup: './test/e2e/config/jest.setup.js',
      globalTeardown: './test/e2e/config/jest.teardown.js',
      preset: 'jest-playwright-preset',
      setupFilesAfterEnv: ['<rootDir>/test/e2e/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/test/e2e/*.test.js'],
    },
  ],
};
