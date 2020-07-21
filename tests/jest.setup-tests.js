const isJSDOM =
  global && global.navigator && global.navigator.userAgent.match(/jsdom/);

beforeEach(() => {
  // Soft-reset jsdom. This clears the DOM and removes all attribute from the
  // root element, however it does not undo changes made to jsdom globals like
  // window or document. For a full jsdom reset, tests requiring a full jsdom
  // reset should be stored in separate files.
  if (isJSDOM) {
    const rootElm = document.documentElement;

    // Remove elements (faster the setting innerHTML)
    while (rootElm.firstChild) {
      rootElm.removeChild(rootElm.firstChild);
    }

    // Remove attributes
    [...rootElm.attributes].forEach(attr => rootElm.removeAttribute(attr.name));

    // Restore base elements
    rootElm.innerHTML = '<html><head></head><body></body></html>';
  }
});
