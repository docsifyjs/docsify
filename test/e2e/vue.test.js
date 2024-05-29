import { stripIndent } from 'common-tags';
import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

const vueURL = '/node_modules/vue/dist/vue.global.js';

test.describe('Vue.js Compatibility', () => {
  function getSharedConfig() {
    const config = {
      config: {
        vueComponents: {
          'button-counter': {
            template: `
              <button @click="counter++">{{ counter }}</button>
            `,
            data: function () {
              return {
                counter: 0,
              };
            },
          },
        },
        vueGlobalOptions: {
          data: () => ({
            counter: 0,
            msg: 'vueglobaloptions',
          }),
        },
        vueMounts: {
          '#vuemounts': {
            data() {
              return {
                counter: 0,
                msg: 'vuemounts',
              };
            },
          },
        },
      },
      markdown: {
        homepage: stripIndent`
          <div id="vuefor"><span v-for="i in 5">{{ i }}</span></div>

          <button-counter id="vuecomponent">---</button-counter>

          <div id="vueglobaloptions">
            <p v-text="msg">---</p>
            <button @click="counter += 1">+</button>
            <span>{{ counter }}<span>
          </div>

          <div id="vuemounts">
            <p v-text="msg">---</p>
            <button @click="counter += 1">+</button>
            <span>{{ counter }}<span>
          </div>

          <div id="vuescript">
            <p v-text="msg">---</p>
            <button @click="counter += 1">+</button>
            <span>{{ counter }}<span>
          </div>

          <script>
            const vueConfig = {
              data() {
                return {
                  counter: 0,
                  msg: 'vuescript'
                }
              },
            }
            const vueMountElm = '#vuescript';

            Vue.createApp(vueConfig).mount(vueMountElm);
          </script>
        `,
      },
    };

    return config;
  }

  // Tests
  // ----------------------------------------------------------------------------
  test('Parse templates and render content when import Vue resources', async ({
    page,
  }) => {
    const docsifyInitConfig = {
      config: {},
      markdown: {
        homepage: stripIndent`
            <div id="vuefor"><span v-for="i in 5">{{ i }}</span></div>
          `,
      },
    };

    docsifyInitConfig.scriptURLs = vueURL;

    await docsifyInit(docsifyInitConfig);
    await expect(page.locator('#vuefor')).toHaveText('12345');
  });

  for (const executeScript of [true, undefined]) {
    test(`renders content when executeScript is ${executeScript}`, async ({
      page,
    }) => {
      const docsifyInitConfig = getSharedConfig();

      docsifyInitConfig.config.executeScript = executeScript;
      docsifyInitConfig.scriptURLs = vueURL;

      await docsifyInit(docsifyInitConfig);

      // Static
      await expect(page.locator('#vuefor')).toHaveText('12345');
      await expect(page.locator('#vuecomponent')).toHaveText('0');
      await expect(page.locator('#vueglobaloptions p')).toHaveText(
        'vueglobaloptions',
      );
      await expect(page.locator('#vueglobaloptions > span')).toHaveText('0');
      await expect(page.locator('#vuemounts p')).toHaveText('vuemounts');
      await expect(page.locator('#vuemounts > span')).toHaveText('0');
      await expect(page.locator('#vuescript p')).toHaveText('vuescript');
      await expect(page.locator('#vuescript > span')).toHaveText('0');

      // Reactive
      await page.click('#vuecomponent');
      await expect(page.locator('#vuecomponent')).toHaveText('1');
      await page.click('#vueglobaloptions button');
      await expect(page.locator('#vueglobaloptions > span')).toHaveText('1');
      await page.click('#vuemounts button');
      await expect(page.locator('#vuemounts > span')).toHaveText('1');
      await page.click('#vuescript button');
      await expect(page.locator('#vuescript > span')).toHaveText('1');
    });
  }

  test('ignores content when Vue is not present', async ({ page }) => {
    const docsifyInitConfig = getSharedConfig();

    await docsifyInit(docsifyInitConfig);
    await page.evaluate(() => 'Vue' in window === false);
    await expect(page.locator('#vuefor')).toHaveText('{{ i }}');
    await expect(page.locator('#vuecomponent')).toHaveText('---');
    await expect(page.locator('#vueglobaloptions p')).toHaveText('---');
    await expect(page.locator('#vuemounts p')).toHaveText('---');
    await expect(page.locator('#vuescript p')).toHaveText('---');
  });

  test('ignores content when vueGlobalOptions is undefined', async ({
    page,
  }) => {
    const docsifyInitConfig = getSharedConfig();

    docsifyInitConfig.config.vueGlobalOptions = undefined;
    docsifyInitConfig.scriptURLs = vueURL;

    await docsifyInit(docsifyInitConfig);
    await expect(page.locator('#vuefor')).toHaveText('12345');
    await expect(page.locator('#vuecomponent')).toHaveText('0');
    await expect(page.locator('#vuecomponent')).toHaveText('0');
    // eslint-disable-next-line playwright/prefer-web-first-assertions
    expect(await page.locator('#vueglobaloptions p').innerText()).toBe('');
    await expect(page.locator('#vuemounts p')).toHaveText('vuemounts');
    await expect(page.locator('#vuescript p')).toHaveText('vuescript');
  });

  test('ignores content when vueMounts is undefined', async ({ page }) => {
    const docsifyInitConfig = getSharedConfig();

    docsifyInitConfig.config.vueMounts['#vuemounts'] = undefined;
    docsifyInitConfig.scriptURLs = vueURL;

    await docsifyInit(docsifyInitConfig);
    await expect(page.locator('#vuefor')).toHaveText('12345');
    await expect(page.locator('#vuecomponent')).toHaveText('0');
    await expect(page.locator('#vueglobaloptions p')).toHaveText(
      'vueglobaloptions',
    );
    await expect(page.locator('#vuemounts p')).toHaveText('vueglobaloptions');
    await expect(page.locator('#vuescript p')).toHaveText('vuescript');
  });

  test('ignores <script> when executeScript is false', async ({ page }) => {
    const docsifyInitConfig = getSharedConfig();

    docsifyInitConfig.config.executeScript = false;
    docsifyInitConfig.scriptURLs = vueURL;

    await docsifyInit(docsifyInitConfig);
    await expect(page.locator('#vuescript p')).toHaveText('vueglobaloptions');
  });
});
