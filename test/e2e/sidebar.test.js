const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe('Sidebar Tests', function() {
  // Tests
  // ---------------------------------------------------------------------------
  test('Active Test', async () => {
    const docsifyInitConfig = {
      markdown: {
        sidebar: `
          - [Test Space](test%20space)
          - [Test _](test_foo)
          - [Test -](test-foo)
          - [Test .](test.foo)
          - [Test >](test>foo)
          - [Test](test)
        `,
      },
      routes: {
        '/test space.md': `
          # Test Space
        `,
        '/test_foo.md': `
          # Test _
        `,
        '/test-foo.md': `
          # Test -
        `,
        '/test.foo.md': `
          # Test .
        `,
        '/test>foo.md': `
          # Test >
        `,
        '/test.md': `
          # Test page
        `,
      },
    };

    await docsifyInit(docsifyInitConfig);
    await page.click('a[href="#/test%20space"]');
    await expect(page).toEqualText(
      '.sidebar-nav li[class=active]',
      'Test Space'
    );
    expect(page.url()).toMatch(/\/test%20space$/);

    await page.click('a[href="#/test_foo"]');
    await expect(page).toEqualText('.sidebar-nav li[class=active]', 'Test _');
    expect(page.url()).toMatch(/\/test_foo$/);

    await page.click('a[href="#/test-foo"]');
    await expect(page).toEqualText('.sidebar-nav li[class=active]', 'Test -');
    expect(page.url()).toMatch(/\/test-foo$/);

    await page.click('a[href="#/test.foo"]');
    await expect(page).toEqualText('.sidebar-nav li[class=active]', 'Test .');
    expect(page.url()).toMatch(/\/test.foo$/);

    await page.click('a[href="#/test>foo"]');
    await expect(page).toEqualText('.sidebar-nav li[class=active]', 'Test >');
    expect(page.url()).toMatch(/\/test%3Efoo$/);

    await page.click('a[href="#/test"]');
    await expect(page).toEqualText('.sidebar-nav li[class=active]', 'Test');
    expect(page.url()).toMatch(/\/test$/);
  });
});
