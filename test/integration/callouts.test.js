import { waitForFunction, waitForText } from '../helpers/wait-for.js';
import docsifyInit from '../helpers/docsify-init.js';

describe('callouts', () => {
  test('render fully after returning to a previously visited page', async () => {
    const calloutText = 'This callout should remain fully rendered.';

    await docsifyInit({
      testURL: '/docsify-init.html#/custom-navbar',
      markdown: {
        sidebar: `
          - [Custom Navbar](custom-navbar)
          - [Configuration](configuration)
        `,
      },
      routes: {
        'custom-navbar.md': `
          > [!IMPORTANT]
          > ${calloutText}
        `,
        'configuration.md': '# Configuration',
      },
    });

    expect(await waitForText('#main', calloutText)).toBeTruthy();
    expect(document.querySelector('#main .callout.important')).toBeTruthy();

    document.querySelector('a[href="#/configuration"]').click();
    expect(
      await waitForFunction(() =>
        /#\/configuration$/.test(window.location.href),
      ),
    ).toBeTruthy();
    expect(await waitForText('#main', 'Configuration')).toBeTruthy();

    document.querySelector('a[href="#/custom-navbar"]').click();
    expect(
      await waitForFunction(() =>
        /#\/custom-navbar$/.test(window.location.href),
      ),
    ).toBeTruthy();
    expect(await waitForText('#main', calloutText)).toBeTruthy();
    expect(document.querySelector('#main .callout.important')).toBeTruthy();
  });
});
