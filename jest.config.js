import { TEST_HOST } from './test/config/server.js';

const sharedConfig = {
  errorOnDeprecated: true,
  globals: {
    // TODO avoid globals.
    TEST_HOST,
  },
  globalSetup: './test/config/jest.setup.js',
  globalTeardown: './test/config/jest.teardown.js',
  resetModules: true,
  restoreMocks: true,
  testEnvironment: 'jsdom',
};

export default {
  transform: {},
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
      testURL: `${TEST_HOST}/_blank.html`,
    },
    // Integration Tests (Jest)
    {
      ...sharedConfig,
      displayName: 'integration',
      setupFilesAfterEnv: ['<rootDir>/test/config/jest.setup-tests.js'],
      testMatch: ['<rootDir>/test/integration/*.test.js'],
      testURL: `${TEST_HOST}/_blank.html`,
    },
    // E2E Tests (Playwright)
    // WIP, porting to official playwright test runner
    // {
    //   ...sharedConfig,
    //   displayName: 'e2e',
    //   preset: 'jest-playwright-preset',
    //   setupFilesAfterEnv: [
    //     '<rootDir>/test/config/jest-playwright.setup-tests.js',
    //   ],
    //   testEnvironmentOptions: {
    //     'jest-playwright': {
    //       // prettier-ignore
    //       browsers: [
    //         'chromium',
    //         'firefox',
    //         'webkit',
    //       ],
    //       launchOptions: {
    //         // headless: false,
    //         // devtools: true,
    //       },
    //     },
    //   },
    //   testMatch: ['<rootDir>/test/e2e/*.test.js'],
    // },
  ],
};
