/* global fail */
import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('Configuration options', () => {
  test('catchPluginErrors:true (handles uncaught errors)', async ({ page }) => {
    let consoleMsg, errorMsg;

    page.on('console', msg => (consoleMsg = msg.text()));
    page.on('pageerror', err => (errorMsg = err.message));

    await docsifyInit({
      config: {
        catchPluginErrors: true,
        plugins: [
          function (hook, vm) {
            hook.init(function () {
              fail();
            });
            hook.beforeEach(markdown => {
              return `${markdown}\n\nbeforeEach`;
            });
          },
        ],
      },
      markdown: {
        homepage: '# Hello World',
      },
      // _logHTML: true,
    });

    const mainElm = page.locator('#main');

    expect(errorMsg).toBeUndefined();
    expect(consoleMsg).toContain('Docsify plugin error');
    await expect(mainElm).toContainText('Hello World');
    await expect(mainElm).toContainText('beforeEach');
  });

  test('catchPluginErrors:false (throws uncaught errors)', async ({ page }) => {
    let consoleMsg, errorMsg;

    page.on('console', msg => (consoleMsg = msg.text()));
    page.on('pageerror', err => (errorMsg = err.message));

    await docsifyInit({
      config: {
        catchPluginErrors: false,
        plugins: [
          function (hook, vm) {
            hook.ready(function () {
              fail();
            });
          },
        ],
      },
      markdown: {
        homepage: '# Hello World',
      },
      // _logHTML: true,
    });

    expect(consoleMsg).toBeUndefined();
    expect(errorMsg).toContain('fail');
  });
});

test.describe('keyBindings', () => {
  test('handles focusContent binding (default)', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          <input type="text">
        `,
      },
    };

    const textFieldElm = page.locator('input[type="text"]');

    await docsifyInit(docsifyInitConfig);

    await expect(textFieldElm).not.toBeFocused();
    await page.keyboard.press("'");
    await expect(textFieldElm).toBeFocused();
  });

  test('handles toggleSidebar binding (default)', async ({ page }) => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          # Heading 1
        `,
      },
    };

    await docsifyInit(docsifyInitConfig);

    const bodyElm = page.locator('body');

    await expect(bodyElm).not.toHaveClass(/close/);
    await page.keyboard.press('\\');
    await expect(bodyElm).toHaveClass(/close/);
  });

  test('handles custom binding', async ({ page }) => {
    const docsifyInitConfig = {
      config: {
        keyBindings: {
          customBinding: {
            bindings: 'z',
            callback(e) {
              const elm = document.querySelector('main input[type="text"]');

              elm.value = 'foo';
            },
          },
        },
      },
      markdown: {
        homepage: `
          <input type="text">
        `,
      },
    };

    const inputElm = page.locator('main input[type="text"]');

    await docsifyInit(docsifyInitConfig);

    await expect(inputElm).toHaveValue('');
    await page.keyboard.press('z');
    await expect(inputElm).toHaveValue('foo');
  });

  test('ignores event when focused on text input elements', async ({
    page,
  }) => {
    const docsifyInitConfig = {
      config: {
        keyBindings: {
          customBinding: {
            bindings: 'z',
            callback(e) {
              document.body.setAttribute('data-foo', '');
            },
          },
        },
      },
      markdown: {
        homepage: `
          <input type="text">
          <select>
            <option>foo</option>
          </select>
          <textarea></textarea>
        `,
      },
    };

    const bodyElm = page.locator('body');
    const inputElm = page.locator('input[type="text"]');
    const selectElm = page.locator('select');
    const textareaElm = page.locator('textarea');

    await docsifyInit(docsifyInitConfig);

    await inputElm.focus();
    await expect(inputElm).toHaveValue('');
    await page.keyboard.press('z');
    await expect(inputElm).toHaveValue('z');
    await inputElm.blur();

    await textareaElm.focus();
    await expect(textareaElm).toHaveValue('');
    await page.keyboard.press('z');
    await expect(textareaElm).toHaveValue('z');
    await textareaElm.blur();

    await selectElm.focus();
    await page.keyboard.press('z');
    await selectElm.blur();

    await expect(bodyElm).not.toHaveAttribute('data-foo');
    await page.keyboard.press('z');
    await expect(bodyElm).toHaveAttribute('data-foo');
  });
});
