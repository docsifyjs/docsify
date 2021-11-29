import * as dom from '../util/dom';
import { merge } from '../util/core';

let vueGlobalData;

export function getVueVersion() {
  return (
    'Vue' in window &&
    window.Vue.version &&
    Number(window.Vue.version.charAt(0))
  );
}

/**
 * Get if element is mounted with vue
 * @example
 * @param  {Element} elm The Element that check if mounted with vue
 * @return {Boolean} Is mounted with vue
 */
export function isMountedVue(elm) {
  const isVue2 = Boolean(elm.__vue__ && elm.__vue__._isVue);
  const isVue3 = Boolean(elm._vnode && elm._vnode.__v_skip);

  return isVue2 || isVue3;
}

/**
 * Unmount existing vue instances
 * @param {String|Element} el The root element where to perform the search from
 * @param {Element} node The query
 * @example
 * unmountVueInst('a') => dom.findAll(el, node)
 * unmountVueInst(nav, 'a') => dom.findAll(node)
 */
export function unmountVueInst(el, node) {
  const vueVersion = getVueVersion();

  if ('Vue' in window) {
    const mountedElms = (node
      ? dom.findAll(el, node)
      : dom.findAll(el)
    ).filter(elm => isMountedVue(elm));

    // Destroy/unmount existing Vue instances
    for (const mountedElm of mountedElms) {
      if (vueVersion === 2) {
        mountedElm.__vue__.$destroy();
      } else if (vueVersion === 3) {
        mountedElm.__vue_app__.unmount();
      }
    }
  }
}

/**
 * Mount vue instance
 */
export function mountVueInst(docsifyConfig, el, node) {
  const vueVersion = getVueVersion();
  const vueMountData = [];
  const vueComponentNames = Object.keys(docsifyConfig.vueComponents || {});

  // Register global vueComponents
  if (vueVersion === 2 && vueComponentNames.length) {
    vueComponentNames.forEach(name => {
      const isNotRegistered = !window.Vue.options.components[name];

      if (isNotRegistered) {
        window.Vue.component(name, docsifyConfig.vueComponents[name]);
      }
    });
  }

  // Store global data() return value as shared data object
  if (
    !vueGlobalData &&
    docsifyConfig.vueGlobalOptions &&
    typeof docsifyConfig.vueGlobalOptions.data === 'function'
  ) {
    vueGlobalData = docsifyConfig.vueGlobalOptions.data();
  }

  // vueMounts
  vueMountData.push(
    ...Object.keys(docsifyConfig.vueMounts || {})
      .map(cssSelector => [
        dom.find(el, cssSelector),
        docsifyConfig.vueMounts[cssSelector],
      ])
      .filter(([elm]) => elm)
  );

  // Template syntax, vueComponents, vueGlobalOptions
  const reHasBraces = /{{2}[^{}]*}{2}/;
  // Matches Vue full and shorthand syntax as attributes in HTML tags.
  //
  // Full syntax examples:
  // v-foo, v-foo[bar], v-foo-bar, v-foo:bar-baz.prop
  //
  // Shorthand syntax examples:
  // @foo, @foo.bar, @foo.bar.baz, @[foo], :foo, :[foo]
  //
  // Markup examples:
  // <div v-html>{{ html }}</div>
  // <div v-text="msg"></div>
  // <div v-bind:text-content.prop="text">
  // <button v-on:click="doThis"></button>
  // <button v-on:click.once="doThis"></button>
  // <button v-on:[event]="doThis"></button>
  // <button @click.stop.prevent="doThis">
  // <a :href="url">
  // <a :[key]="url">
  const reHasDirective = /<[^>/]+\s([@:]|v-)[\w-:.[\]]+[=>\s]/;

  vueMountData.push(
    ...dom
      .findAll(el, node)
      // Remove duplicates
      .filter(elm => !vueMountData.some(([e]) => e === elm))
      // Detect Vue content
      .filter(elm => {
        const isVueMount =
          // is a component
          elm.tagName.toLowerCase() in (docsifyConfig.vueComponents || {}) ||
          // has a component(s)
          elm.querySelector(vueComponentNames.join(',') || null) ||
          // has curly braces
          reHasBraces.test(elm.outerHTML) ||
          // has content directive
          reHasDirective.test(elm.outerHTML);

        return isVueMount;
      })
      .map(elm => {
        // Clone global configuration
        const vueConfig = merge({}, docsifyConfig.vueGlobalOptions || {});

        // Replace vueGlobalOptions data() return value with shared data object.
        // This provides a global store for all Vue instances that receive
        // vueGlobalOptions as their configuration.
        if (vueGlobalData) {
          vueConfig.data = function() {
            return vueGlobalData;
          };
        }

        return [elm, vueConfig];
      })
  );

  // Mount
  for (const [mountElm, vueConfig] of vueMountData) {
    const isVueAttr = 'data-isvue';
    const isSkipElm =
      // Is an invalid tag
      mountElm.matches('pre, script') ||
      // Is a mounted instance
      isMountedVue(mountElm) ||
      // Has mounted instance(s)
      mountElm.querySelector(`[${isVueAttr}]`);

    if (!isSkipElm) {
      mountElm.setAttribute(isVueAttr, '');

      if (vueVersion === 2) {
        vueConfig.el = undefined;
        new window.Vue(vueConfig).$mount(mountElm);
      } else if (vueVersion === 3) {
        const app = window.Vue.createApp(vueConfig);
        // Register global vueComponents
        vueComponentNames.forEach(name => {
          const config = docsifyConfig.vueComponents[name];

          app.component(name, config);
        });

        app.mount(mountElm);
      }
    }
  }
}
