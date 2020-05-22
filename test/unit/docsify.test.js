/* eslint-disable no-global-assign */
require = require('esm')(module /* , options */);

const path = require('path');
const { expect } = require('chai');
const { initJSDOM } = require('../_helper');

const docsifySite = path.join(__dirname, '..', '..', 'docs');

const markup = /* html */ `<!DOCTYPE html>
  <html>
    <head></head>
    <body>
      <div id="app"></div>
    </body>
  </html>
`;

describe('Docsify public API', () => {
  it('is available', async () => {
    const DOM = initJSDOM(markup);
    DOM.reconfigure({ url: 'file:///' + docsifySite });

    const { documentReady } = require('../../src/core/index');
    await new Promise(resolve => documentReady(resolve));

    expect(typeof window.Docsify).to.equal('object');
    expect(typeof window.Docsify.util).to.equal('object');
    expect(typeof window.Docsify.dom).to.equal('object');
    expect(typeof window.Docsify.get).to.equal('function');
    expect(typeof window.Docsify.slugify).to.equal('function');
    expect(typeof window.Docsify.version).to.equal('string');

    expect(window.DocsifyCompiler).to.be.an.instanceof(Function);
    expect(window.marked).to.be.an.instanceof(Function);
    expect(typeof window.Prism).to.equal('object');
  });
});

describe('Docsify config function', function() {
  it('allows $docsify to be a function', async function() {
    const DOM = initJSDOM(markup);
    DOM.reconfigure({ url: 'file:///' + docsifySite });

    window.configFunctionCalled = false;

    window.$docsify = function(vm) {
      // Check public API (that which is available at this point)
      expect(vm).to.be.an.instanceof(Object);
      expect(vm.constructor.name).to.equal('Docsify');
      expect(vm.$fetch).to.be.an.instanceof(Function);
      expect(vm.$resetEvents).to.be.an.instanceof(Function);
      expect(vm.route).to.be.an.instanceof(Object);

      window.configFunctionCalled = true;

      return {};
    };

    const { documentReady, Docsify } = require('../../src/core/index');
    await new Promise(resolve => documentReady(resolve));

    new Docsify(); // eslint-disable-line

    expect(window.configFunctionCalled).to.equal(true);
  });

  it('provides the hooks and vm API to plugins', async function() {
    const DOM = initJSDOM(markup);
    DOM.reconfigure({ url: 'file:///' + docsifySite });

    window.pluginFunctionCalled = false;

    window.$docsify = function(vm) {
      const vm1 = vm;
      return {
        plugins: [
          function(hook, vm2) {
            expect(vm1).to.equal(vm2);

            expect(hook.init).to.be.an.instanceof(Function);
            expect(hook.beforeEach).to.be.an.instanceof(Function);
            expect(hook.afterEach).to.be.an.instanceof(Function);
            expect(hook.doneEach).to.be.an.instanceof(Function);
            expect(hook.mounted).to.be.an.instanceof(Function);
            expect(hook.ready).to.be.an.instanceof(Function);

            window.pluginFunctionCalled = true;
          },
        ],
      };
    };

    const { documentReady, Docsify } = require('../../src/core/index');
    await new Promise(resolve => documentReady(resolve));

    new Docsify(); // eslint-disable-line

    expect(window.pluginFunctionCalled).to.equal(true);
  });
});
