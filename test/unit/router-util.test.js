import { resolvePath } from '../../src/core/util/index.js';
import {
  findLinkByHref,
  getClickedLink,
  getSidebarNavigationTarget,
  isCurrentContextNavigation,
} from '../../src/core/router/util.js';

// Suite
// -----------------------------------------------------------------------------
describe('router/util', () => {
  describe('navigation click helpers', () => {
    test('finds a link from a nested click target', () => {
      document.body.innerHTML = '<a href="/guide"><span>Guide</span></a>';
      const spanElm = /** @type {HTMLElement} */ (
        document.querySelector('span')
      );
      const event = new MouseEvent('click', { bubbles: true });

      spanElm.dispatchEvent(event);

      expect(getClickedLink(event)).toBe(document.querySelector('a'));
    });

    test.each([
      ['alternate button', { button: 1 }],
      ['Alt modifier', { altKey: true }],
      ['Control modifier', { ctrlKey: true }],
      ['Meta modifier', { metaKey: true }],
      ['Shift modifier', { shiftKey: true }],
    ])('ignores %s clicks', (name, eventInit) => {
      const linkElm = document.createElement('a');
      const event = new MouseEvent('click', {
        button: 0,
        ...eventInit,
      });

      expect(isCurrentContextNavigation(event, linkElm)).toBe(false);
    });

    test('ignores cancelled, download, and new-context navigation', () => {
      const linkElm = document.createElement('a');
      const cancelledEvent = new MouseEvent('click', {
        button: 0,
        cancelable: true,
      });

      cancelledEvent.preventDefault();
      expect(isCurrentContextNavigation(cancelledEvent, linkElm)).toBe(false);

      linkElm.setAttribute('download', '');
      expect(isCurrentContextNavigation(new MouseEvent('click'), linkElm)).toBe(
        false,
      );

      linkElm.removeAttribute('download');
      linkElm.target = '_blank';
      expect(isCurrentContextNavigation(new MouseEvent('click'), linkElm)).toBe(
        false,
      );
    });

    test('describes a sidebar link by class and URL', () => {
      document.body.innerHTML = `
        <aside class="sidebar">
          <a class="app-name-link" href="/guide">Docsify</a>
          <nav>
            <a class="page-link" href="/guide">Guide</a>
          </nav>
        </aside>
      `;
      const linkElm = /** @type {HTMLAnchorElement} */ (
        document.querySelector('.page-link')
      );

      expect(getSidebarNavigationTarget(linkElm)).toEqual({
        className: 'page-link',
        href: linkElm.href,
      });
    });

    test('finds encoded URLs without using them as selectors', () => {
      const href = '#/say%22hi';

      document.body.innerHTML = `<nav><a href="${href}">Link</a></nav>`;
      const navElm = /** @type {HTMLElement} */ (document.querySelector('nav'));

      expect(findLinkByHref(navElm, href)).toBe(document.querySelector('a'));
    });
  });

  // resolvePath()
  // ---------------------------------------------------------------------------
  describe('resolvePath()', () => {
    test('resolvePath with filename', () => {
      const result = resolvePath('hello.md');

      expect(result).toBe('/hello.md');
    });

    test('resolvePath with ./', () => {
      const result = resolvePath('./hello.md');

      expect(result).toBe('/hello.md');
    });

    test('resolvePath with ../', () => {
      const result = resolvePath('test/../hello.md');

      expect(result).toBe('/hello.md');
    });
  });
});
