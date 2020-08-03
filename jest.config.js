const path = require('path');
const { TEST_URL, DOCS_URL, LIB_URL } = require('./tests/e2e/config/server.js');

const sharedConfig = {
  errorOnDeprecated: true,
  globals: {
    TEST_URL,
  },
  resetModules: true,
  restoreMocks: true,
  // testPathIgnorePatterns: ['example.test'],
};

const sharedUnitIntegration = {
  globals: {
    ...sharedConfig.globals,
    DOCS_PATH: path.resolve(__dirname, 'docs'),
    LIB_PATH: path.resolve(__dirname, 'lib'),
  },
  testURL: TEST_URL,
};

// Jest-Playwrigth Config
process.env.JEST_PLAYWRIGHT_CONFIG =
  './tests/e2e/config/jest-playwright.config.js';

module.exports = {
  projects: [
    // Unit Tests (Jest)
    {
      ...sharedConfig,
      ...sharedUnitIntegration,
      displayName: 'unit',
      setupFilesAfterEnv: ['<rootDir>/tests/unit/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/tests/unit/*.test.js'],
    },
    // Integration Tests (Jest)
    {
      ...sharedConfig,
      ...sharedUnitIntegration,
      displayName: 'integration',
      setupFilesAfterEnv: ['<rootDir>/tests/unit/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/tests/integration/*.test.js'],
    },
    // E2E Tests (Jest + Playwright)
    {
      ...sharedConfig,
      displayName: 'e2e',
      globals: {
        ...sharedConfig.globals,
        DOCS_URL,
        LIB_URL,
      },
      globalSetup: './tests/e2e/config/jest.setup.js',
      globalTeardown: './tests/e2e/config/jest.teardown.js',
      preset: 'jest-playwright-preset',
      setupFilesAfterEnv: ['<rootDir>/tests/e2e/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/tests/e2e/*.test.js'],
    },
  ],
};
