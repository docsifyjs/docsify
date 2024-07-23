import {
  removeAtag,
  getAndRemoveConfig,
  getAndRemoveDocsifyIgnoreConfig,
} from '../../src/core/render/utils.js';
import { tree } from '../../src/core/render/tpl.js';
import { slugify } from '../../src/core/render/slugify.js';

// Suite
// -----------------------------------------------------------------------------
describe('core/render/utils', () => {
  // removeAtag()
  // ---------------------------------------------------------------------------
  describe('removeAtag()', () => {
    test('removeAtag from a link', () => {
      const result = removeAtag('<a href="www.example.com">content</a>');

      expect(result).toBe('content');
    });
  });

  // getAndRemoveDocsifyIgnoreConfig()
  // ---------------------------------------------------------------------------
  describe('getAndRemoveDocsifyIgnoreConfig()', () => {
    test('getAndRemoveDocsifyIgnoreConfig from <!-- {docsify-ignore} -->', () => {
      const { content, ignoreAllSubs, ignoreSubHeading } =
        getAndRemoveDocsifyIgnoreConfig(
          'My Ignore Title<!-- {docsify-ignore} -->',
        );
      expect(content).toBe('My Ignore Title');
      expect(ignoreSubHeading).toBeTruthy();
      expect(ignoreAllSubs === undefined).toBeTruthy();
    });

    test('getAndRemoveDocsifyIgnoreConfig from <!-- {docsify-ignore-all} -->', () => {
      const { content, ignoreAllSubs, ignoreSubHeading } =
        getAndRemoveDocsifyIgnoreConfig(
          'My Ignore Title<!-- {docsify-ignore-all} -->',
        );
      expect(content).toBe('My Ignore Title');
      expect(ignoreAllSubs).toBeTruthy();
      expect(ignoreSubHeading === undefined).toBeTruthy();
    });

    test('getAndRemoveDocsifyIgnoreConfig from {docsify-ignore}', () => {
      const { content, ignoreAllSubs, ignoreSubHeading } =
        getAndRemoveDocsifyIgnoreConfig('My Ignore Title{docsify-ignore}');
      expect(content).toBe('My Ignore Title');
      expect(ignoreSubHeading).toBeTruthy();
      expect(ignoreAllSubs === undefined).toBeTruthy();
    });

    test('getAndRemoveDocsifyIgnoreConfig from {docsify-ignore-all}', () => {
      const { content, ignoreAllSubs, ignoreSubHeading } =
        getAndRemoveDocsifyIgnoreConfig('My Ignore Title{docsify-ignore-all}');
      expect(content).toBe('My Ignore Title');
      expect(ignoreAllSubs).toBeTruthy();
      expect(ignoreSubHeading === undefined).toBeTruthy();
    });
  });

  // getAndRemoveConfig()
  // ---------------------------------------------------------------------------
  describe('getAndRemoveConfig()', () => {
    test('parse a headling config which is no leading quoto', () => {
      const result = getAndRemoveConfig('Test :id=myTitle');

      expect(result).toMatchObject({
        config: { id: 'myTitle' },
        str: 'Test',
      });
    });

    test('parse simple classes config', () => {
      const result = getAndRemoveConfig(
        "[filename](_media/example.md ':class=foo bar')",
      );

      expect(result).toMatchObject({
        config: { class: 'foo', class_appened_props: 'bar' },
        str: '[filename](_media/example.md )',
      });
    });

    test('parse simple no config', () => {
      const result = getAndRemoveConfig('[filename](_media/example.md )');

      expect(result).toMatchObject({
        config: {},
        str: '[filename](_media/example.md )',
      });
    });

    test('parse simple config with emoji and no config', () => {
      const result = getAndRemoveConfig(
        'I use the :emoji: but it should be fine with :code=js',
      );

      expect(result).toMatchObject({
        config: {},
        str: 'I use the :emoji: but it should be fine with :code=js',
      });
    });

    test('parse config with invalid data attributes but we can swallow them', () => {
      const result = getAndRemoveConfig(
        "[filename](_media/example.md ':include :class=myClz myClz2 myClz3 :invalid=bar :invalid2 test')",
      );

      expect(result).toMatchObject({
        config: {
          include: true,
          class: 'myClz',
          class_appened_props: 'myClz2 myClz3',
        },
        str: '[filename](_media/example.md )',
      });
    });

    test('parse config with double quotes configs string', () => {
      const result = getAndRemoveConfig(
        '[filename](_media/example.md ":type=code js :include")',
      );

      expect(result).toMatchObject({
        config: {
          include: true,
          type: 'code',
          type_appened_props: 'js',
        },
        str: '[filename](_media/example.md )',
      });
    });

    test('parse config with double quotes and loose leading/ending quotos', () => {
      const result = getAndRemoveConfig(
        '[filename](_media/example.md "   :target=_self        :type=code js :include            ")',
      );

      expect(result).toMatchObject({
        config: {
          include: true,
          type: 'code',
          type_appened_props: 'js',
          target: '_self',
        },
        str: '[filename](_media/example.md )',
      });
    });

    test('parse config with some custom appened configs which we could use in further', () => {
      const result = getAndRemoveConfig(
        '[filename](_media/example.md " :type=code lang=js highlight=false :include  ")',
      );

      expect(result).toMatchObject({
        config: {
          include: true,
          type: 'code',
          type_appened_props: 'lang=js highlight=false',
        },
        str: '[filename](_media/example.md )',
      });
    });

    test('parse config with naughty complex string', () => {
      const result = getAndRemoveConfig(
        "It should work :dog: and the ::dog2:: and the ::dog3::dog4::  '    :id=myTitle :type=code js :include'",
      );

      expect(result).toMatchObject({
        config: {
          id: 'myTitle',
          type: 'code',
          type_appened_props: 'js',
          include: true,
        },
        str: 'It should work :dog: and the ::dog2:: and the ::dog3::dog4::',
      });
    });

    test('parse config with multi config arguments', () => {
      const result = getAndRemoveConfig(
        "[filename](_media/example.md ':include :class=myClz myClz2 myClz3 :target=_blank')",
      );

      expect(result).toMatchObject({
        config: {
          include: true,
          class: 'myClz',
          class_appened_props: 'myClz2 myClz3',
          target: '_blank',
        },
        str: '[filename](_media/example.md )',
      });
    });
  });

  describe('core/render/tpl', () => {
    test('remove html tag in tree', () => {
      const result = tree([
        {
          level: 2,
          slug: '#/cover?id=basic-usage',
          title: '<span style="color:red">Basic usage</span>',
        },
        {
          level: 2,
          slug: '#/cover?id=custom-background',
          title: 'Custom background',
        },
        {
          level: 2,
          slug: '#/cover?id=test',
          title:
            '<img src="/docs/_media/favicon.ico" data-origin="/_media/favicon.ico" alt="ico">Test',
        },
      ]);

      expect(result).toBe(
        /* html */ '<ul class="app-sub-sidebar"><li><a class="section-link" href="#/cover?id=basic-usage" title="Basic usage"><span style="color:red">Basic usage</span></a></li><li><a class="section-link" href="#/cover?id=custom-background" title="Custom background">Custom background</a></li><li><a class="section-link" href="#/cover?id=test" title="Test"><img src="/docs/_media/favicon.ico" data-origin="/_media/favicon.ico" alt="ico">Test</a></li></ul>',
      );
    });
  });

  describe('core/render/slugify', () => {
    test('slugify()', () => {
      const result = slugify(
        'Bla bla bla <svg aria-label="broken" class="broken" viewPort="0 0 1 1"><circle cx="0.5" cy="0.5"/></svg>',
      );
      const result2 = slugify(
        'Another <span style="font-size: 1.2em" class="foo bar baz">broken <span class="aaa">example</span></span>',
      );
      expect(result).toBe('bla-bla-bla-');
      expect(result2).toBe('another-broken-example');
    });
  });
});
