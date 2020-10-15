const stripIndent = require('common-tags/lib/stripIndent');
const docsifyInit = require('../helpers/docsify-init');

const vueURLs = [
  `${NODE_MODULES_URL}/vue2/dist/vue.js`,
  `${NODE_MODULES_URL}/vue3/dist/vue.global.js`,
];

describe('Vue.js Compatibility', function() {
  function getSharedConfig() {
    const config = {
      config: {
        vueGlobalOptions: {
          data: function() {
            return {
              counter: 0,
              msg: 'vueglobaloptions',
            };
          },
        },
        vueOptions: {
          '#vueoptions': {
            data: function() {
              return {
                counter: 0,
                msg: 'vueoptions',
              };
            },
          },
        },
      },
      markdown: {
        homepage: stripIndent`
          # <span v-for="i in 5">{{ i }}</span>

          <div id="vueoptions">
            <p v-text="msg">---</p>
            <button v-on:click="counter += 1">+</button>
            <span>{{ counter }}<span>
          </div>

          <div id="vueglobaloptions">
            <p v-text="msg">---</p>
            <button v-on:click="counter += 1">+</button>
            <span>{{ counter }}<span>
          </div>

          <div id="vuescript">
            <p v-text="msg">---</p>
            <button v-on:click="counter += 1">+</button>
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
  describe('Ignores Vue', function() {
    test(`content when Vue is not present`, async () => {
      const docsifyInitConfig = getSharedConfig();

      await docsifyInit(docsifyInitConfig);
      await page.evaluate(() => {
        return 'Vue' in window === false;
      });
      await expect(page).toEqualText('h1', '{{ i }}');
      await expect(page).toEqualText('#vueglobaloptions p', '---');
      await expect(page).toEqualText('#vueoptions p', '---');
      await expect(page).toEqualText('#vuescript p', '---');
    });

    test(`content when vueOptions and vueGlobalOptions are undefined`, async () => {
      const docsifyInitConfig = getSharedConfig();

      docsifyInitConfig.config.vueGlobalOptions = undefined;
      docsifyInitConfig.config.vueOptions = undefined;
      docsifyInitConfig.scriptURLs = vueURLs[0];

      await docsifyInit(docsifyInitConfig);
      await expect(page).toEqualText('h1', '{{ i }}');
      await expect(page).toEqualText('#vueglobaloptions p', '---');
      await expect(page).toEqualText('#vueoptions p', '---');
      await expect(page).toEqualText('#vuescript p', 'vuescript');
    });

    test(`content when vueGlobalOptions data is undefined`, async () => {
      const docsifyInitConfig = getSharedConfig();

      docsifyInitConfig.config.vueGlobalOptions.data = undefined;
      docsifyInitConfig.scriptURLs = vueURLs[0];

      await docsifyInit(docsifyInitConfig);
      await expect(page).toEqualText('h1', '{{ i }}');
      await expect(page).toEqualText('#vueoptions p', 'vueoptions');
      await expect(page).toEqualText('#vueglobaloptions p', '---');
      await expect(page).toEqualText('#vuescript p', 'vuescript');
    });

    test(`content when vueOptions data is undefined`, async () => {
      const docsifyInitConfig = getSharedConfig();

      docsifyInitConfig.config.vueOptions['#vueoptions'].data = undefined;
      docsifyInitConfig.scriptURLs = vueURLs[0];

      await docsifyInit(docsifyInitConfig);
      await expect(page).toEqualText('h1', '12345');
      await expect(page).toEqualText('#vueoptions p', 'vueglobaloptions');
      await expect(page).toEqualText('#vueglobaloptions p', 'vueglobaloptions');
      await expect(page).toEqualText('#vuescript p', 'vuescript');
    });

    test(`<script> when executeScript is false`, async () => {
      const docsifyInitConfig = getSharedConfig();

      docsifyInitConfig.config.executeScript = false;
      docsifyInitConfig.scriptURLs = vueURLs[0];

      await docsifyInit(docsifyInitConfig);
      await expect(page).toEqualText('#vuescript p', 'vueglobaloptions');
    });
  });

  describe('Renders Vue', function() {
    for (const vueURL of vueURLs) {
      const vueVersion = Number(vueURL.match(/vue(\d+)/)[1]); // 2|3

      for (const executeScript of [true, undefined]) {
        test(`Vue v${vueVersion}: renders when executeScript is ${executeScript}`, async () => {
          const docsifyInitConfig = getSharedConfig(vueVersion);

          docsifyInitConfig.config.executeScript = executeScript;
          docsifyInitConfig.scriptURLs = vueURL;

          await docsifyInit(docsifyInitConfig);

          // Static data
          await expect(page).toEqualText('h1', '12345');
          await expect(page).toEqualText('#vueoptions p', 'vueoptions');
          await expect(page).toEqualText(
            '#vueglobaloptions p',
            'vueglobaloptions'
          );
          await expect(page).toEqualText('#vuescript p', 'vuescript');

          // Reactive data
          await expect(page).toEqualText('#vueoptions span', '0');
          await page.click('#vueoptions button');
          await expect(page).toEqualText('#vueoptions span', '1');
          await expect(page).toEqualText('#vueglobaloptions span', '0');
          await page.click('#vueglobaloptions button');
          await expect(page).toEqualText('#vueglobaloptions span', '1');
          await expect(page).toEqualText('#vuescript span', '0');
          await page.click('#vuescript button');
          await expect(page).toEqualText('#vuescript span', '1');
        });
      }
    }
  });
});
