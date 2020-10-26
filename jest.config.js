const { globals: serverGlobals } = require('./test/config/server.js');

const sharedConfig = {
  errorOnDeprecated: true,
  globals: {
    ...serverGlobals, // BLANK_URL, TEST_HOST
  },
  globalSetup: './test/config/jest.setup.js',
  globalTeardown: './test/config/jest.teardown.js',
  resetModules: true,
  restoreMocks: true,
};

module.exports = {
  // Adding globals to config root for easier importing into .eslint.js, but
  // as of Jest 26.4.2 these globals need to be added to each project config
  // as well.
  globals: sharedConfig.globals,
  projects: [
    // Unit Tests (Jest)
    {
      ...sharedConfig,
      displayName: 'unit',
      setupFilesAfterEnv: ['<rootDir>/test/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/test/unit/*.test.js'],
      testURL: serverGlobals.BLANK_URL,
    },
    // Integration Tests (Jest)
    {
      ...sharedConfig,
      displayName: 'integration',
      setupFilesAfterEnv: ['<rootDir>/test/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/test/integration/*.test.js'],
      testURL: serverGlobals.BLANK_URL,
    },
    // E2E Tests (Jest + Playwright)
    {
      ...sharedConfig,
      displayName: 'e2e',
      preset: 'jest-playwright-preset',
      setupFilesAfterEnv: [
        '<rootDir>/test/config/jest-playwright.setup-tests.js',
      ],
      testEnvironmentOptions: {
        'jest-playwright': {
          // prettier-ignore
          browsers: [
            'chromium',
            'firefox',
            'webkit',
          ],
          launchOptions: {
            // headless: false,
            // devtools: true,
          },
        },
      },
      testMatch: ['<rootDir>/test/e2e/*.test.js'],
    },
  ],
};
