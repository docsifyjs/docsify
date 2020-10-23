import mock from 'xhr-mock';

const windowKeys = JSON.parse(JSON.stringify(Object.keys(window)));

// Lifecycle Hooks
// -----------------------------------------------------------------------------
// Soft-reset jsdom. This clears the DOM and removes all attribute from the
// root element, however it does not undo changes made to jsdom globals like
// the window or document object. Tests requiring a full jsdom reset should be
// stored in separate files, as this is the only way (?) to do a complete
// reset of JSDOM with Jest.
beforeEach(async () => {
  const rootElm = document.documentElement;

  // Remove elements (faster the setting innerHTML)
  while (rootElm.firstChild) {
    rootElm.removeChild(rootElm.firstChild);
  }

  // Remove jest/docsify side-effects
  Object.keys(window)
    .filter(key => !windowKeys.includes(key))
    .forEach(key => {
      delete window[key];
    });

  // Remove attributes
  [...rootElm.attributes].forEach(attr => rootElm.removeAttribute(attr.name));

  // Restore base elements
  rootElm.innerHTML = '<html><head></head><body></body></html>';
});

afterEach(async () => {
  // Restore the global XMLHttpRequest object to its original state
  mock.teardown();
});
