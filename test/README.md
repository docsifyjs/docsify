# Docsify Testing

## Environment

- [Jest](https://jestjs.io): A test framework used for assertions, mocks, spies, etc.
- [Playwright](https://playwright.dev): A test automation tool for launching browsers and manipulating the DOM.
- [Jest-Playwright](https://github.com/playwright-community/jest-playwright): A Jest preset that simplifies using Jest and Playwright together

## Test files

- E2E tests are located in `/test/e2e/` and use [Jest](https://jestjs.io) + [Playwright](https://playwright.dev).
- Integration tests are located in `/test/integration/` and use [Jest](https://jestjs.io).
- Unit tests located in `/test/unit/` and use [Jest](https://jestjs.io).

## Global Variables

- `process.env.TEST_HOST`: Test server ip:port

## CLI commands

```bash
# Run all tests
npm run test

# Run test types
npm run test:e2e
npm run test:integration
npm run test:unit

# Run test file
npm run test -- -i /path/to/file.test.js

# Run matching test files
npm run test -- -i /path/to/*.test.js

# Run matching test name(s)
npm run test -- -t \"describe() or test() name\"

# Run matching test name(s) in file
npm run test -- -i /path/to/file.test.js -t \"describe() or test() name\"

# Run all example tests
npm run test -- -i /test/**/example.test.js

# Run specific example test file
npm run test -- -i /path/to/example.test.js

# ------------------------------------------------------------------------------

# Update snapshots for matching test files
npm run test -- -u -i /path/to/*.test.js

# Update snapshots for matching test name(s)
npm run test -- -u -t \"describe() or test() name\"

# Update snapshots for matching test name(s) in file
npm run test -- -u -i /path/to/file.test.js -t \"describe() or test() name\"

# ------------------------------------------------------------------------------

# Start manual test server instance. Useful for previewing test fixtures.
# Root: /test/e2e/fixtures/
# Routes: /docs, /lib,
node ./test/config/server.js --start
```

## Resource

- [UI Testing Best Practices](https://github.com/NoriSte/ui-testing-best-practices)
- [Using Jest with Playwright](https://playwright.tech/blog/using-jest-with-playwright)
