import { jest } from '@jest/globals';
import docsifyInit from '../helpers/docsify-init.js';

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
      config: {
        coverpage: '_coverpage.md',
      },
      markdown: {
        homepage: '# Hello World',
      },
      waitForSelector: '.cover-main > *',
    });

    const coverpageElm = document.querySelector('section.cover');

    // Test snapshots
    expect(mathSpy).toHaveBeenCalled();
    expect(coverpageElm).not.toBeNull();
    expect(coverpageElm.outerHTML).toMatchSnapshot();
  });

  test('sidebar renders and is unchanged', async () => {
    await docsifyInit({
      config: {
        loadSidebar: '_sidebar.md',
      },
      markdown: {
        homepage: '# Hello World',
      },
      waitForSelector: '.sidebar-nav > ul',
    });

    const sidebarElm = document.querySelector('.sidebar');

    // Test snapshots
    expect(sidebarElm).not.toBeNull();
    expect(sidebarElm.outerHTML).toMatchSnapshot();
  });

  test('navbar renders and is unchanged', async () => {
    await docsifyInit({
      config: {
        loadNavbar: '_navbar.md',
      },
      markdown: {
        homepage: '# Hello World',
      },
      waitForSelector: '.app-nav > ul',
    });

    const navbarElm = document.querySelector('nav.app-nav');

    // Test snapshots
    expect(navbarElm).not.toBeNull();
    expect(navbarElm.outerHTML).toMatchSnapshot();
  });

  test('navbar appends the current path to language links when enabled', async () => {
    await docsifyInit({
      config: {
        loadNavbar: '_navbar.md',
        navbarPreservePath: true,
      },
      markdown: {
        homepage: '# Hello World',
        navbar: `
          - [English](/en-us/)
          - [简体中文](/zh-cn/)
          - [Guide](/guide)
          - [Anchor](#section)
          - [External](https://example.com/)
        `,
      },
      testURL: `${process.env.TEST_HOST}/docsify-init.html#/en-us/guide/start`,
      waitForSelector: '.app-nav > ul',
    });

    const links = Object.fromEntries(
      [...document.querySelectorAll('.app-nav a')].map(link => [
        link.textContent,
        link.getAttribute('href'),
      ]),
    );

    expect(links).toEqual({
      English: '#/en-us/guide/start',
      简体中文: '#/zh-cn/guide/start',
      Guide: '#/guide',
      Anchor: '#/en-us/guide/start?id=section',
      External: 'https://example.com/',
    });
  });

  test('navbar appends the current path in history mode and merged navbars', async () => {
    await docsifyInit({
      config: {
        loadNavbar: '_navbar.md',
        mergeNavbar: true,
        navbarPreservePath: true,
        routerMode: 'history',
      },
      markdown: {
        homepage: '# Hello World',
        navbar: `
          - [English](/en-us/)
          - [简体中文](/zh-cn/)
        `,
      },
      testURL: `${process.env.TEST_HOST}/en-us/guide/start`,
      waitForSelector: '.app-nav-merged > ul',
    });

    document.querySelectorAll('.app-nav, .app-nav-merged').forEach(nav => {
      expect([...nav.querySelectorAll('a')].map(link => link.href)).toEqual([
        `${process.env.TEST_HOST}/en-us/guide/start`,
        `${process.env.TEST_HOST}/zh-cn/guide/start`,
      ]);
    });
  });
});
