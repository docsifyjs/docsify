import docsifyInit from '../helpers/docsify-init';

describe('Vue.js Rendering', function () {
  const vueURLs = [
    `${NODE_MODULES_URL}/vue2/dist/vue.js`,
    `${NODE_MODULES_URL}/vue3/dist/vue.global.js`,
  ];

  // Tests
  // ---------------------------------------------------------------------------
  test(`ignores Vue content when window.Vue is not present`, async () => {
    await docsifyInit({
      markdown: {
        homepage: `
          <div id="test">test<span v-for="i in 5">{{ i }}</span></div>
        `,
      },
    });

    await page.evaluate(() => {
      return 'Vue' in window === false;
    });
    await expect(page).toEqualText('#test', 'test{{ i }}');
  });

  describe('Basic rendering', function () {
    for (const vueURL of vueURLs) {
      const vueVersion = vueURL.match(/vue(\d+)/)[1]; // vue2|vue3

      for (const executeScript of ['unspecified', true, false]) {
        test(`handles Vue v${vueVersion}.x basic rendering when executeScript is ${executeScript}`, async () => {
          const docsifyInitConfig = {
            markdown: {
              homepage: `
                <div id="test">test<span v-for="i in 5">{{ i }}</span></div>
              `,
            },
            scriptURLs: vueURL,
          };

          if (executeScript !== 'unspecified') {
            docsifyInitConfig.config = {
              executeScript,
            };
          }

          await docsifyInit(docsifyInitConfig);

          await expect(page).toEqualText('#test', 'test12345');
        });
      }
    }
  });

  describe('Advanced usage', function () {
    const testData = {
      vue2: {
        markdown: `
          <div id="test">
            <button v-on:click="counter += 1">+</button>
            <span>{{ counter }}<span>
          </div>

          <script>
            new Vue({
              el: '#test',
              data() {
                return {
                  counter: 0
                }
              },
            });
          </script>
        `,
      },
      vue3: {
        markdown: `
          <div id="test">
            <button v-on:click="counter += 1">+</button>
            <span>{{ counter }}<span>
          </div>

          <script>
            Vue.createApp({
              data() {
                return {
                  counter: 0
                }
              },
            }).mount('#test');
          </script>
        `,
      },
    };

    for (const vueURL of vueURLs) {
      const vueVersion = vueURL.match(/vue(\d+)/)[1]; // vue2|vue3
      const vueData = testData[`vue${vueVersion}`];

      for (const executeScript of ['unspecified', true]) {
        test(`handles Vue v${vueVersion}.x advanced usage when executeScript is ${executeScript}`, async () => {
          const docsifyInitConfig = {
            markdown: {
              homepage: vueData.markdown,
            },
            scriptURLs: vueURL,
          };

          if (executeScript !== 'unspecified') {
            docsifyInitConfig.config = {
              executeScript,
            };
          }

          await docsifyInit(docsifyInitConfig);

          await expect(page).toEqualText('#test span', '0');
          await page.click('#test button');
          await expect(page).toEqualText('#test span', '1');
        });
      }

      test(`handles Vue v${vueVersion}.x advanced usage when executeScript is false`, async () => {
        const docsifyInitConfig = {
          config: {
            executeScript: false,
          },
          markdown: {
            homepage: vueData.markdown,
          },
          scriptURLs: vueURL,
        };

        await docsifyInit(docsifyInitConfig);

        const textContent = await page.textContent('#test span');
        expect(textContent).toBe('');
      });
    }
  });
});
