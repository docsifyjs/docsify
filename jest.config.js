// Jest-Playwrigth Config
process.env.JEST_PLAYWRIGHT_CONFIG =
  './tests/e2e/config/jest-playwright.config.js';

module.exports = {
  projects: [
    // Unit Tests (Jest)
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/*.test.js'],
    },
    // Integration Tests (Jest)
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/*.test.js'],
    },
    // E2E Tests (Jest + Playwright)
    {
      displayName: 'e2e',
      globalSetup: './tests/e2e/config/jest.setup.js',
      globalTeardown: './tests/e2e/config/jest.teardown.js',
      preset: 'jest-playwright-preset',
      testMatch: ['<rootDir>/tests/e2e/*.test.js'],
    },
  ],
};
