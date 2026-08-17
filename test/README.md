# Docsify Testing

## Environment

- [Jest](https://jestjs.io): A test framework used for assertions, mocks, spies, etc.
- [Playwright](https://playwright.dev): A test automation tool for launching browsers and manipulating the DOM.

## Test files

- Unit tests located in `/test/unit/` and use [Jest](https://jestjs.io).
- Integration tests are located in `/test/integration/` and use [Jest](https://jestjs.io).
- E2E tests are located in `/test/e2e/` and use [Jest](https://jestjs.io) + [Playwright](https://playwright.dev).

## CLI commands

```bash
# Run all tests
npm t

# Run test types
npm run test:e2e
npm run test:integration
npm run test:unit
```

### Unit / Integration (Jest)

```bash
# Run test file(s)
npm run test:unit -- -i ./path/to/file.test.js
npm run test:unit -- -i ./path/to/*.test.js

# Run test name(s)
npm run test:unit -- -t "my test"

# Run test name(s) in file
npm run test:unit -- -i ./path/to/file.test.js -t "my test"

# ------------------------------------------------------------------------------

# Update snapshots
npm run test:unit -- -u

# Update snapshots for test file(s)
npm run test:unit -- -u -i ./path/to/file.test.js
npm run test:unit -- -u -i ./path/to/*.test.js

# Update snapshots for test name(s)
npm run test:unit -- -u -t "my test"

# Update snapshots for test name(s) in file
npm run test:unit -- -u -i ./path/to/file.test.js -t "my test"
```

### E2E (Playwright)

```bash
# Run test file(s)
npm run test:e2e -- ./path/to/file.test.js
npm run test:e2e -- ./path/to/*.test.js

# Run test name(s)
npm run test:e2e -- -g "my test"

# Run test name(s) in file
npm run test:e2e -- ./path/to/file.test.js -g "my test"

# ------------------------------------------------------------------------------

# Update snapshots
npm run test:e2e -- -u

# Update snapshots for test file(s)
npm run test:e2e -- -u ./path/to/file.test.js
npm run test:e2e -- -u ./path/to/*.test.js

# Update snapshots for test name(s)
npm run test:e2e -- -u -g "my test"

# Update snapshots for test name(s) in file
npm run test:e2e -- -u ./path/to/file.test.js -g "my test"
```
