import { jest } from '@jest/globals';
import {
  hasPinnedDocsifyVersion,
  isDocsifyScriptUrl,
  warnIfUnpinnedDocsifyVersion,
} from '../../src/core/version-check.js';

describe('Docsify script version check', () => {
  test.each([
    'https://cdn.jsdelivr.net/npm/docsify@5.0.0/dist/docsify.js',
    'https://unpkg.com/docsify@5.0.0/dist/docsify.js',
    'https://cdn.bootcdn.net/ajax/libs/docsify/5.0.0/docsify.js',
    'https://cdnjs.cloudflare.com/ajax/libs/docsify/5.0.0/docsify.js',
    'https://cdn.jsdelivr.net/npm/docsify@5/dist/docsify.module.js',
    'https://unpkg.com/docsify@5.0/dist/docsify.module.min.js',
    'https://unpkg.com/docsify@5.0.0-rc.1/dist/docsify.module.js',
    '/assets/docsify-5.0.0.js',
    '/assets/docsify.5.0.0.min.js',
    '/assets/docsify-5.0.0.module.min.js',
    '/docsify/5.0.0/docsify.js',
    '/assets/docsify.js?v=5',
    '/assets/docsify.js?version=5.0.0',
  ])('recognizes a pinned version in %s', scriptUrl => {
    expect(hasPinnedDocsifyVersion(scriptUrl)).toBe(true);
  });

  test.each([
    'https://cdn.jsdelivr.net/npm/docsify/dist/docsify.js',
    'https://unpkg.com/docsify@latest/dist/docsify.js',
    'https://cdn.bootcdn.net/ajax/libs/docsify/latest/docsify.js',
    'https://cdnjs.cloudflare.com/ajax/libs/docsify/2026/docsify.js',
    '/assets/docsify.js',
    '/2026/assets/docsify.js',
    '/assets/docsify-a1b2c3.js',
    '/assets/docsify.js?cache=5.0.0',
    '/assets/docsify.js?v=20260903',
    '/assets/docsify.js#version=5.0.0',
    'not a valid URL%',
  ])(
    'does not mistake an unpinned URL for a pinned version in %s',
    scriptUrl => {
      expect(hasPinnedDocsifyVersion(scriptUrl)).toBe(false);
    },
  );

  test.each([
    'https://cdn.jsdelivr.net/npm/docsify/dist/docsify.module.js',
    'https://unpkg.com/docsify/dist/module.js',
    'https://cdn.bootcdn.net/ajax/libs/docsify/5.0.0/module.js',
    'https://cdnjs.cloudflare.com/ajax/libs/docsify/5.0.0/module.js',
    '/assets/docsify.module.js',
  ])('recognizes a Docsify ESM distribution URL in %s', scriptUrl => {
    expect(isDocsifyScriptUrl(scriptUrl)).toBe(true);
  });

  test.each([
    '/assets/app.js',
    '/assets/vendor.js?v=5.0.0',
    'file:///project/docsify/src/core/module.js',
  ])('ignores a non-Docsify application bundle URL in %s', scriptUrl => {
    expect(isDocsifyScriptUrl(scriptUrl)).toBe(false);
  });

  test('does not warn without a URL or for a pinned URL', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    warnIfUnpinnedDocsifyVersion();
    warnIfUnpinnedDocsifyVersion(
      'https://cdn.jsdelivr.net/npm/docsify@5.0.0/dist/docsify.js',
    );

    expect(consoleError).not.toHaveBeenCalled();
  });

  test('emits one forceful error for an unpinned URL', () => {
    const scriptUrl = 'https://cdn.jsdelivr.net/npm/docsify/dist/docsify.js';
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    warnIfUnpinnedDocsifyVersion(scriptUrl);
    warnIfUnpinnedDocsifyVersion(scriptUrl);

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('This site WILL BREAK'),
    );
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining(scriptUrl),
    );
  });
});
