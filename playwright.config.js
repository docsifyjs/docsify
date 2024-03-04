import { devices } from '@playwright/test';
import { testConfig } from './server.configs.js';

const { hostname, port } = testConfig;
const TEST_HOST = `http://${hostname}:${port}`;

process.env.TEST_HOST = TEST_HOST;

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  // Setup / Teardown
  globalSetup: './test/config/playwright.setup.js',
  globalTeardown: './test/config/playwright.teardown.js',

  // Test Execution
  expect: {
    timeout: 5000,
  },
  retries: process.env.CI ? 2 : 0, // Retry on CI only
  testDir: './test/e2e',
  timeout: 30 * 1000,
  workers: process.env.CI ? 1 : undefined, // No parallel tests on CI
  forbidOnly: !!process.env.CI, // Fail on CI if test.only in source

  // Output
  outputDir: './_playwright-results/', // screenshots, videos, traces, etc.
  reporter: [
    [
      'html',
      {
        open: 'never',
        outputFolder: '_playwright-report',
      },
    ],
  ],
  snapshotDir: './test/e2e/__snapshots__',

  // Config - Shared
  // See https://playwright.dev/docs/api/class-testoptions
  use: {
    actionTimeout: 0,
    baseURL: TEST_HOST, // Allow relative page.goto() (e.g. `await page.goto('/')`).
    trace: 'on-first-retry',
  },

  // Projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] }
    // },
  ],
};

export default config;
