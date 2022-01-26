const docsifyInit = require('../helpers/docsify-init');

describe('Docsify', function() {
  describe('config options', () => {
    test('allows $docsify configuration to be a function', async () => {
      const testConfig = jest.fn(vm => {
        expect(vm).toBeInstanceOf(Object);
        expect(vm.constructor.name).toEqual('Docsify');
        expect(vm.$fetch).toBeInstanceOf(Function);
        expect(vm.$resetEvents).toBeInstanceOf(Function);
        expect(vm.route).toBeInstanceOf(Object);
      });

      await docsifyInit({
        config: testConfig,
      });

      expect(typeof Docsify).toEqual('object');
      expect(testConfig).toHaveBeenCalled();
    });

    describe('config.el', () => {
      it('accepts an element instance', async () => {
        const config = jest.fn(() => {
          const app = document.querySelector('#app');
          expect(app).toBeInstanceOf(HTMLElement);

          return {
            basePath: `${TEST_HOST}/docs/index.html#/`,
            el: app,
          };
        });

        await docsifyInit({
          config,
          testURL: `${TEST_HOST}/docs/index.html#/`,
        });

        expect(config).toHaveBeenCalled();

        expect(document.querySelector('#main').textContent).toContain(
          'A magical documentation site generator.'
        );
      });
    });
  });

  test('provides the hooks and vm API to plugins', async () => {
    const testConfig = jest.fn(vm => {
      const vm1 = vm;

      return {
        plugins: [
          function(hook, vm2) {
            expect(vm1).toEqual(vm2);

            expect(hook.init).toBeInstanceOf(Function);
            expect(hook.beforeEach).toBeInstanceOf(Function);
            expect(hook.afterEach).toBeInstanceOf(Function);
            expect(hook.doneEach).toBeInstanceOf(Function);
            expect(hook.mounted).toBeInstanceOf(Function);
            expect(hook.ready).toBeInstanceOf(Function);
          },
        ],
      };
    });

    await docsifyInit({
      config: testConfig,
    });

    expect(typeof Docsify).toEqual('object');
    expect(testConfig).toHaveBeenCalled();
  });
});
