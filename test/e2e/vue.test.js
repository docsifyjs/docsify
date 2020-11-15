const stripIndent = require('common-tags/lib/stripIndent');
const docsifyInit = require('../helpers/docsify-init');

const vueURLs = [
  '/node_modules/vue2/dist/vue.js',
  '/node_modules/vue3/dist/vue.global.js',
];

describe('Vue.js Compatibility', function() {
  function getSharedConfig() {
    const config = {
      config: {
        vueComponents: {
          'button-counter': {
            template: `
              <button @click="counter++">{{ counter }}</button>
            `,
            data: function() {
              return {
                counter: 0,
              };
            },
          },
        },
        vueGlobalOptions: {
          data: function() {
            return {
              counter: 0,
              msg: 'vueglobaloptions',
            };
          },
        },
        vueMounts: {
          '#vuemounts': {
            data: function() {
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
            const vueVersion = Number(window.Vue.version.charAt(0));

            if (vueVersion === 2) {
              new Vue(vueConfig).$mount(vueMountElm);
            }
            else if (vueVersion === 3) {
              Vue.createApp(vueConfig).mount(vueMountElm);
            }
          </script>
        `,
      },
    };

    return config;
  }

  // Tests
  // ---------------------------------------------------------------------------
  for (const vueURL of vueURLs) {
    const vueVersion = Number(vueURL.match(/vue(\d+)/)[1]); // 2|3

    describe(`Vue v${vueVersion}`, function() {
      for (const executeScript of [true, undefined]) {
        test(`renders content when executeScript is ${executeScript}`, async () => {
          const docsifyInitConfig = getSharedConfig();

          docsifyInitConfig.config.executeScript = executeScript;
          docsifyInitConfig.scriptURLs = vueURL;

          await docsifyInit(docsifyInitConfig);

          // Static
          await expect(page).toEqualText('#vuefor', '12345');
          await expect(page).toEqualText('#vuecomponent', '0');
          await expect(page).toEqualText(
            '#vueglobaloptions p',
            'vueglobaloptions'
          );
          await expect(page).toEqualText('#vueglobaloptions span', '0');
          await expect(page).toEqualText('#vuemounts p', 'vuemounts');
          await expect(page).toEqualText('#vuemounts span', '0');
          await expect(page).toEqualText('#vuescript p', 'vuescript');
          await expect(page).toEqualText('#vuescript span', '0');

          // Reactive
          await page.click('#vuecomponent');
          await expect(page).toEqualText('#vuecomponent', '1');
          await page.click('#vueglobaloptions button');
          await expect(page).toEqualText('#vueglobaloptions span', '1');
          await page.click('#vuemounts button');
          await expect(page).toEqualText('#vuemounts span', '1');
          await page.click('#vuescript button');
          await expect(page).toEqualText('#vuescript span', '1');
        });
      }

      test(`ignores content when Vue is not present`, async () => {
        const docsifyInitConfig = getSharedConfig();

        await docsifyInit(docsifyInitConfig);
        await page.evaluate(() => {
          return 'Vue' in window === false;
        });
        await expect(page).toEqualText('#vuefor', '{{ i }}');
        await expect(page).toEqualText('#vuecomponent', '---');
        await expect(page).toEqualText('#vueglobaloptions p', '---');
        await expect(page).toEqualText('#vuemounts p', '---');
        await expect(page).toEqualText('#vuescript p', '---');
      });

      test(`ignores content when vueComponents, vueMounts, and vueGlobalOptions are undefined`, async () => {
        const docsifyInitConfig = getSharedConfig();

        docsifyInitConfig.config.vueComponents = undefined;
        docsifyInitConfig.config.vueGlobalOptions = undefined;
        docsifyInitConfig.config.vueMounts = undefined;
        docsifyInitConfig.scriptURLs = vueURL;

        await docsifyInit(docsifyInitConfig);
        await expect(page).toEqualText('#vuefor', '{{ i }}');
        await expect(page).toEqualText('#vuecomponent', '---');
        await expect(page).toEqualText('#vueglobaloptions p', '---');
        await expect(page).toEqualText('#vuemounts p', '---');
        await expect(page).toEqualText('#vuescript p', 'vuescript');
      });

      test(`ignores content when vueGlobalOptions is undefined`, async () => {
        const docsifyInitConfig = getSharedConfig();

        docsifyInitConfig.config.vueGlobalOptions = undefined;
        docsifyInitConfig.scriptURLs = vueURL;

        await docsifyInit(docsifyInitConfig);
        await expect(page).toEqualText('#vuefor', '12345');
        await expect(page).toEqualText('#vuecomponent', '0');
        expect(await page.innerText('#vueglobaloptions p')).toBe('');
        await expect(page).toEqualText('#vuemounts p', 'vuemounts');
        await expect(page).toEqualText('#vuescript p', 'vuescript');
      });

      test(`ignores content when vueMounts is undefined`, async () => {
        const docsifyInitConfig = getSharedConfig();

        docsifyInitConfig.config.vueMounts['#vuemounts'] = undefined;
        docsifyInitConfig.scriptURLs = vueURL;

        await docsifyInit(docsifyInitConfig);
        await expect(page).toEqualText('#vuefor', '12345');
        await expect(page).toEqualText('#vuecomponent', '0');
        await expect(page).toEqualText(
          '#vueglobaloptions p',
          'vueglobaloptions'
        );
        await expect(page).toEqualText('#vuemounts p', 'vueglobaloptions');
        await expect(page).toEqualText('#vuescript p', 'vuescript');
      });

      test(`ignores <script> when executeScript is false`, async () => {
        const docsifyInitConfig = getSharedConfig();

        docsifyInitConfig.config.executeScript = false;
        docsifyInitConfig.scriptURLs = vueURL;

        await docsifyInit(docsifyInitConfig);
        await expect(page).toEqualText('#vuescript p', 'vueglobaloptions');
      });
    });
  }
});
