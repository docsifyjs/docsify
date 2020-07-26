// Jest-Playwrigth Config
process.env.JEST_PLAYWRIGHT_CONFIG =
  './tests/e2e/config/jest-playwright.config.js';

module.exports = {
  projects: [
    // Unit Tests (Jest)
    {
      displayName: 'unit',
      setupFilesAfterEnv: ['<rootDir>/tests/unit/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/tests/unit/*.test.js'],
      // testPathIgnorePatterns: ['example.test'],
    },
    // Integration Tests (Jest)
    {
      displayName: 'integration',
      setupFilesAfterEnv: ['<rootDir>/tests/unit/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/tests/integration/*.test.js'],
      // testPathIgnorePatterns: ['example.test'],
    },
    // E2E Tests (Jest + Playwright)
    {
      displayName: 'e2e',
      globalSetup: './tests/e2e/config/jest.setup.js',
      globalTeardown: './tests/e2e/config/jest.teardown.js',
      preset: 'jest-playwright-preset',
      setupFilesAfterEnv: ['<rootDir>/tests/e2e/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/tests/e2e/*.test.js'],
      // testPathIgnorePatterns: ['example.test'],
    },
  ],
};
