import { stripIndent } from 'common-tags';
import docsifyInit from '../helpers/docsify-init.js';
import { waitForText } from '../helpers/wait-for.js';

// Suite
// -----------------------------------------------------------------------------
describe('render', function () {
  // Helpers
  // ---------------------------------------------------------------------------
  describe('helpers', () => {
    beforeEach(async () => {
      await docsifyInit();
    });

    test('important content', () => {
      const output = window.marked('!> Important content');

      expect(output).toMatchInlineSnapshot(
        `"<p class="callout important">Important content</p>"`,
      );
    });

    test('general tip', () => {
      const output = window.marked('?> General tip');

      expect(output).toMatchInlineSnapshot(
        `"<p class="callout tip">General tip</p>"`,
      );
    });
  });

  // Lists
  // ---------------------------------------------------------------------------
  describe('lists', function () {
    beforeEach(async () => {
      await docsifyInit();
    });

    test('as unordered task list', async function () {
      const output = window.marked(stripIndent`
        - [x] Task 1
        - [ ] Task 2
        - [ ] Task 3
      `);

      expect(output).toMatchInlineSnapshot(
        '"<ul class="task-list"><li class="task-list-item"><label><input checked="" disabled="" type="checkbox"> Task 1</label></li><li class="task-list-item"><label><input disabled="" type="checkbox"> Task 2</label></li><li class="task-list-item"><label><input disabled="" type="checkbox"> Task 3</label></li></ul>"',
      );
    });

    test('as ordered task list', async function () {
      const output = window.marked(stripIndent`
        1. [ ] Task 1
        2. [x] Task 2
      `);

      expect(output).toMatchInlineSnapshot(
        '"<ol class="task-list"><li class="task-list-item"><label><input disabled="" type="checkbox"> Task 1</label></li><li class="task-list-item"><label><input checked="" disabled="" type="checkbox"> Task 2</label></li></ol>"',
      );
    });

    test('normal unordered', async function () {
      const output = window.marked(stripIndent`
        - [linktext](link)
        - just text
      `);

      expect(output).toMatchInlineSnapshot(
        '"<ul ><li><a href="#/link" >linktext</a></li><li>just text</li></ul>"',
      );
    });

    test('unordered with custom start', async function () {
      const output = window.marked(stripIndent`
        1. first
        2. second

        text

        3. third
      `);

      expect(output).toMatchInlineSnapshot(
        '"<ol ><li>first</li><li>second</li></ol><p>text</p><ol start="3"><li>third</li></ol>"',
      );
    });

    test('nested', async function () {
      const output = window.marked(stripIndent`
        - 1
        - 2
          - 2 a
          - 2 b
        - 3
      `);

      expect(output).toMatchInlineSnapshot(
        '"<ul ><li>1</li><li>2<ul ><li>2 a</li><li>2 b</li></ul></li><li>3</li></ul>"',
      );
    });
  });

  // Images
  // ---------------------------------------------------------------------------
  describe('images', function () {
    beforeEach(async () => {
      await docsifyInit();
    });

    test('regular', async function () {
      const output = window.marked('![alt text](http://imageUrl)');

      expect(output).toMatchInlineSnapshot(
        '"<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text"  /></p>"',
      );
    });

    test('class', async function () {
      const output = window.marked(
        "![alt text](http://imageUrl ':class=someCssClass')",
      );

      expect(output).toMatchInlineSnapshot(
        '"<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text" class="someCssClass" /></p>"',
      );
    });

    test('id', async function () {
      const output = window.marked(
        "![alt text](http://imageUrl ':id=someCssID')",
      );

      expect(output).toMatchInlineSnapshot(
        '"<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text" id="someCssID" /></p>"',
      );
    });

    test('no-zoom', async function () {
      const output = window.marked("![alt text](http://imageUrl ':no-zoom')");

      expect(output).toMatchInlineSnapshot(
        '"<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text" data-no-zoom /></p>"',
      );
    });

    test('width and height', async function () {
      const output = window.marked(
        "![alt text](http://imageUrl ':size=WIDTHxHEIGHT')",
      );

      expect(output).toMatchInlineSnapshot(
        '"<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text" width="WIDTH" height="HEIGHT" /></p>"',
      );
    });

    test('width', async function () {
      const output = window.marked("![alt text](http://imageUrl ':size=50')");

      expect(output).toMatchInlineSnapshot(
        '"<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text" width="50" /></p>"',
      );
    });
  });

  // Headings
  // ---------------------------------------------------------------------------
  describe('headings', function () {
    beforeEach(async () => {
      await docsifyInit();
    });

    test('h1', async function () {
      const output = window.marked('# h1 tag');

      expect(output).toMatchInlineSnapshot(
        '"<h1 id="h1-tag" tabindex="-1"><a href="#/?id=h1-tag" data-id="h1-tag" class="anchor"><span>h1 tag</span></a></h1>"',
      );
    });

    test('h2', async function () {
      const output = window.marked('## h2 tag');

      expect(output).toMatchInlineSnapshot(
        '"<h2 id="h2-tag" tabindex="-1"><a href="#/?id=h2-tag" data-id="h2-tag" class="anchor"><span>h2 tag</span></a></h2>"',
      );
    });

    test('h3', async function () {
      const output = window.marked('### h3 tag');

      expect(output).toMatchInlineSnapshot(
        '"<h3 id="h3-tag" tabindex="-1"><a href="#/?id=h3-tag" data-id="h3-tag" class="anchor"><span>h3 tag</span></a></h3>"',
      );
    });

    test('h4', async function () {
      const output = window.marked('#### h4 tag');

      expect(output).toMatchInlineSnapshot(
        '"<h4 id="h4-tag" tabindex="-1"><a href="#/?id=h4-tag" data-id="h4-tag" class="anchor"><span>h4 tag</span></a></h4>"',
      );
    });

    test('h5', async function () {
      const output = window.marked('##### h5 tag');

      expect(output).toMatchInlineSnapshot(
        '"<h5 id="h5-tag" tabindex="-1"><a href="#/?id=h5-tag" data-id="h5-tag" class="anchor"><span>h5 tag</span></a></h5>"',
      );
    });

    test('h6', async function () {
      const output = window.marked('###### h6 tag');

      expect(output).toMatchInlineSnapshot(
        '"<h6 id="h6-tag" tabindex="-1"><a href="#/?id=h6-tag" data-id="h6-tag" class="anchor"><span>h6 tag</span></a></h6>"',
      );
    });
  });

  // Links
  // ---------------------------------------------------------------------------
  describe('link', function () {
    beforeEach(async () => {
      await docsifyInit();
    });

    test('regular', async function () {
      const output = window.marked('[alt text](http://url)');

      expect(output).toMatchInlineSnapshot(
        '"<p><a href="http://url" target="_blank"  rel="noopener">alt text</a></p>"',
      );
    });

    test('linkrel', async function () {
      // const { docsify } = await init('default', {
      //   externalLinkTarget: '_blank',
      //   externalLinkRel: 'noopener',
      // });
      const output = window.marked('[alt text](http://www.example.com)');

      expect(output).toMatchInlineSnapshot(
        '"<p><a href="http://www.example.com" target="_blank"  rel="noopener">alt text</a></p>"',
      );
    });

    test('disabled', async function () {
      const output = window.marked("[alt text](http://url ':disabled')");

      expect(output).toMatchInlineSnapshot(
        '"<p><a href="javascript:void(0)" target="_blank"  rel="noopener" disabled>alt text</a></p>"',
      );
    });

    test('target for absolute path', async function () {
      const output = window.marked("[alt text](http://url ':target=_self')");

      expect(output).toMatchInlineSnapshot(
        '"<p><a href="http://url" target="_self" >alt text</a></p>"',
      );
    });

    test('target for relative path', async function () {
      const output = window.marked("[alt text](/url ':target=_blank')");

      expect(output).toMatchInlineSnapshot(
        '"<p><a href="#/url" target="_blank">alt text</a></p>"',
      );
    });

    test('class', async function () {
      const output = window.marked(
        "[alt text](http://url ':class=someCssClass')",
      );

      expect(output).toMatchInlineSnapshot(
        '"<p><a href="http://url" target="_blank"  rel="noopener" class="someCssClass">alt text</a></p>"',
      );
    });

    test('id', async function () {
      const output = window.marked("[alt text](http://url ':id=someCssID')");

      expect(output).toMatchInlineSnapshot(
        '"<p><a href="http://url" target="_blank"  rel="noopener" id="someCssID">alt text</a></p>"',
      );
    });
  });

  // Skip Link
  // ---------------------------------------------------------------------------
  describe('skip link', () => {
    test('renders default skip link and label', async () => {
      await docsifyInit();

      const elm = document.getElementById('skip-to-content');
      const expectText = 'Skip to main content';

      expect(elm.textContent).toBe(expectText);
      expect(elm.outerHTML).toMatchInlineSnapshot(
        `"<button type="button" id="skip-to-content" class="primary">Skip to main content</button>"`,
      );
    });

    test('renders custom label from config string', async () => {
      const expectText = 'test';

      await docsifyInit({
        config: {
          skipLink: expectText,
        },
      });

      const elm = document.getElementById('skip-to-content');

      expect(elm.textContent).toBe(expectText);
    });

    test('renders custom label from config object', async () => {
      const getSkipLinkText = () =>
        document.getElementById('skip-to-content').textContent;

      await docsifyInit({
        config: {
          skipLink: {
            '/dir1/dir2/': 'baz',
            '/dir1/': 'bar',
          },
        },
      });

      window.location.hash = '/dir1/dir2/';
      await waitForText('#skip-to-content', 'baz');
      expect(getSkipLinkText()).toBe('baz');

      window.location.hash = '/dir1/';
      await waitForText('#skip-to-content', 'bar');
      expect(getSkipLinkText()).toBe('bar');

      // Fallback to default
      window.location.hash = '';
      await waitForText('#skip-to-content', 'Skip to main content');
      expect(getSkipLinkText()).toBe('Skip to main content');
    });

    test('does not render skip link when false', async () => {
      await docsifyInit({
        config: {
          skipLink: false,
        },
      });
      const elm = document.getElementById('skip-to-content') || false;

      expect(elm).toBe(false);
    });
  });
});
