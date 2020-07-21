# Docsify Testing

### Environment

- [Jest](https://jestjs.io): A test framework used for assertions, mocks, spies, etc.
- [Playwright](https://playwright.dev): A test automation tool for launching browsers and manipulating the DOM.
- [Jest-Playwright](https://github.com/playwright-community/jest-playwright): A Jest preset that simplifies using Jest and Playwright together

### Test files

- E2E tests are located in `/tests/e2e/` and use [Jest](https://jestjs.io) and [Playwright](https://playwright.dev).
- Integration tests are located in `/tests/integration/` and use [Jest](https://jestjs.io).
- Unit tests located in `/tests/unit/` and use [Jest](https://jestjs.io).

### CLI commands

```shell
# Run all tests
npm run test:jest

# Run test types
npm run test:jest-e2e
npm run test:jest-integration
npm run test:jest-unit

# Run test file
npm run test:jest -- -i /path/to/file.test.js

# Run matching test files
npm run test:jest -- -i /path/to/*.test.js

# Run matching test name(s)
npm run test:jest -- -t \"describe() or test() name\"

# Run matching test name(s) in file
npm run test:jest -- -i /path/to/file.test.js -t \"describe() or test() name\"

# Run all example tests
npm run test:jest -- -i /tests/**/example.test.js --testPathIgnorePatterns

# Run specific example test file
npm run test:jest -- -i /path/to/example.test.js --testPathIgnorePatterns

# ------------------------------------------------------------------------------

# Update snapshots for matching test files
npm run test:jest -- -u -i /path/to/*.test.js

# Update snapshots for matching test name(s)
npm run test:jest -- -u -t \"describe() or test() name\"

# Update snapshots for matching test name(s) in file
npm run test:jest -- -u -i /path/to/file.test.js -t \"describe() or test() name\"
```

### Resource

- [UI Testing Best Practices](https://github.com/NoriSte/ui-testing-best-practices)
- [Using Jest with Playwright](https://playwright.tech/blog/using-jest-with-playwright)
