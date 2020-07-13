// Suite
// -----------------------------------------------------------------------------
describe(`Example Tests`, function() {
  // Tests
  // ---------------------------------------------------------------------------
  test('javascript (node)', async () => {
    function add(...addends) {
      return addends.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );
    }
    const testValue = add(1, 2, 3);

    expect(testValue).toBe(6);
  });

  test('dom manipulation (jsdom)', async () => {
    const testText = 'This is a test';
    const testHTML = `<h1>Test</h1><p>${testText}</p>`;

    // Inject HTML
    document.body.innerHTML = testHTML;

    // Add class to <body> element and verify
    document.body.classList.add('foo');

    // Test HTML
    expect(document.body.getAttribute('class')).toEqual('foo');
    expect(document.body.textContent).toMatch(/Test/);
    expect(document.querySelectorAll('p')).toHaveLength(1);
    expect(document.querySelector('p').textContent).toBe(testText);
    expect(document.querySelector('table')).toBeNull();
  });
});
