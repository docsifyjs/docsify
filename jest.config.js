import { testConfig } from './server.configs.js';

const { hostname, port } = testConfig;
const TEST_HOST = `http://${hostname}:${port}`;
const sharedConfig = {
  errorOnDeprecated: true,
  globalSetup: './test/config/jest.setup.js',
  globalTeardown: './test/config/jest.teardown.js',
  prettierPath: null, // Fix for Jest v29 and Prettier v3 (https://github.com/jestjs/jest/issues/14305)
  resetModules: true,
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/test/config/jest.setup-tests.js'],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    url: `${TEST_HOST}/_blank.html`,
  },
};

process.env.TEST_HOST = TEST_HOST;

export default {
  transform: {},
  projects: [
    // Unit Tests
    {
      displayName: 'unit',
      ...sharedConfig,
      testMatch: ['<rootDir>/test/unit/*.test.js'],
    },
    // Integration Tests
    {
      displayName: 'integration',
      ...sharedConfig,
      testMatch: ['<rootDir>/test/integration/*.test.js'],
    },
  ],
};
