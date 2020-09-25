const path = require('path');
const { TEST_URL, DOCS_URL, LIB_URL } = require('./test/config/server.js');

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
  globalSetup: './test/config/jest.setup.js',
  globalTeardown: './test/config/jest.teardown.js',
  resetModules: true,
  restoreMocks: true,
};

// Jest-Playwrigth Config
process.env.JEST_PLAYWRIGHT_CONFIG = './test/config/jest-playwright.config.js';

module.exports = {
  projects: [
    // Unit Tests (Jest)
    {
      ...sharedConfig,
      displayName: 'unit',
      setupFilesAfterEnv: ['<rootDir>/test/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/test/unit/*.test.js'],
      testURL: TEST_URL,
    },
    // Integration Tests (Jest)
    {
      ...sharedConfig,
      displayName: 'integration',
      setupFilesAfterEnv: ['<rootDir>/test/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/test/integration/*.test.js'],
      testURL: TEST_URL,
    },
    // E2E Tests (Jest + Playwright)
    {
      ...sharedConfig,
      displayName: 'e2e',
      preset: 'jest-playwright-preset',
      setupFilesAfterEnv: [
        '<rootDir>/test/config/jest-playwright.setup-tests.js',
      ],
      testMatch: ['<rootDir>/test/e2e/*.test.js'],
    },
  ],
};
