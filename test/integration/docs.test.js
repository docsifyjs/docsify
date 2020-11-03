import _fs from 'fs';
import path from 'path';
import { jest } from '@jest/globals';
import docsifyInit from '../helpers/docsify-init';

const fs = _fs.promises;

// Suite
// -----------------------------------------------------------------------------
describe('Docs Site', function () {
  // Tests
  // ---------------------------------------------------------------------------
  test('coverpage renders and is unchanged', async () => {
    // Override Math.random implementation to prevent random gradient values
    // used as background image from causing test to fail
    const mathSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    await docsifyInit({
      markdown: {
        homepage: '# Hello World',
        coverpage: await fs.readFile(
          path.resolve(DOCS_PATH, '_coverpage.md'),
          'utf8'
        ),
      },
      // _logHTML: true,
    });

    const coverpageElm = document.querySelector('section.cover');

    // Test snapshots
    expect(mathSpy).toHaveBeenCalled();
    expect(coverpageElm).not.toBeNull();
    expect(coverpageElm.outerHTML).toMatchSnapshot();
  });

  test('sidebar renders and is unchanged', async () => {
    await docsifyInit({
      markdown: {
        homepage: '# Hello World',
        sidebar: await fs.readFile(
          path.resolve(DOCS_PATH, '_sidebar.md'),
          'utf8'
        ),
      },
      // _logHTML: true,
    });

    const sidebarElm = document.querySelector('.sidebar');

    // Test snapshots
    expect(sidebarElm).not.toBeNull();
    expect(sidebarElm.outerHTML).toMatchSnapshot();
  });

  test('navbar renders and is unchanged', async () => {
    await docsifyInit({
      markdown: {
        homepage: '# Hello World',
        navbar: await fs.readFile(
          path.resolve(DOCS_PATH, '_navbar.md'),
          'utf8'
        ),
      },
      // _logHTML: true,
    });

    const navbarElm = document.querySelector('nav.app-nav');

    // Test snapshots
    expect(navbarElm).not.toBeNull();
    expect(navbarElm.outerHTML).toMatchSnapshot();
  });
});
