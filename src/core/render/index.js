import tinydate from 'tinydate';
import * as dom from '../util/dom.js';
import { getPath, isAbsolutePath } from '../router/util.js';
import { isMobile } from '../util/env.js';
import { isPrimitive } from '../util/core.js';
import { Compiler } from './compiler.js';
import * as tpl from './tpl.js';
import { prerenderEmbed } from './embed.js';

/** @typedef {import('../Docsify.js').Constructor} Constructor */

/**
 * @template {!Constructor} T
 * @param {T} Base - The class to extend
 */
export function Render(Base) {
  return class Render extends Base {
    #vueGlobalData;

    #addTextAsTitleAttribute(cssSelector) {
      dom.findAll(cssSelector).forEach(elm => {
        if (!elm.title && elm.innerText) {
          elm.title = elm.innerText;
        }
      });
    }

    #executeScript() {
      const script = dom
        .findAll('.markdown-section>script')
        .filter(s => !/template/.test(s.type))[0];
      if (!script) {
        return false;
      }

      const code = script.innerText.trim();
      if (!code) {
        return false;
      }

      new Function(code)();
    }

    #formatUpdated(html, updated, fn) {
      updated =
        typeof fn === 'function'
          ? fn(updated)
          : typeof fn === 'string'
            ? tinydate(fn)(new Date(updated))
            : updated;

      return html.replace(/{docsify-updated}/g, updated);
    }

    #renderMain(html) {
      const docsifyConfig = this.config;
      const markdownElm = dom.find('.markdown-section');
      const vueVersion =
        'Vue' in window &&
        window.Vue.version &&
        Number(window.Vue.version.charAt(0));

      const isMountedVue = elm => {
        const isVue2 = Boolean(elm.__vue__ && elm.__vue__._isVue);
        const isVue3 = Boolean(elm._vnode && elm._vnode.__v_skip);

        return isVue2 || isVue3;
      };

      if ('Vue' in window) {
        const mountedElms = dom
          .findAll('.markdown-section > *')
          .filter(elm => isMountedVue(elm));

        // Destroy/unmount existing Vue instances
        for (const mountedElm of mountedElms) {
          if (vueVersion === 2) {
            mountedElm.__vue__.$destroy();
          } else if (vueVersion === 3) {
            mountedElm.__vue_app__.unmount();
          }
        }
      }

      dom.setHTML(markdownElm, html);

      // Execute markdown <script>
      if (
        docsifyConfig.executeScript ||
        ('Vue' in window && docsifyConfig.executeScript !== false)
      ) {
        this.#executeScript();
      }

      // Handle Vue content not mounted by markdown <script>
      if ('Vue' in window) {
        const vueGlobalOptions = docsifyConfig.vueGlobalOptions || {};
        const vueMountData = [];
        const vueComponentNames = Object.keys(
          docsifyConfig.vueComponents || {},
        );

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
          !this.#vueGlobalData &&
          vueGlobalOptions.data &&
          typeof vueGlobalOptions.data === 'function'
        ) {
          this.#vueGlobalData = vueGlobalOptions.data();
        }

        // vueMounts
        vueMountData.push(
          ...Object.keys(docsifyConfig.vueMounts || {})
            .map(cssSelector => [
              dom.find(markdownElm, cssSelector),
              docsifyConfig.vueMounts[cssSelector],
            ])
            .filter(([elm, vueConfig]) => elm),
        );

        // Template syntax, vueComponents, vueGlobalOptions ...
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
            .findAll('.markdown-section > *')
            // Remove duplicates
            .filter(elm => !vueMountData.some(([e, c]) => e === elm))
            // Detect Vue content
            .filter(elm => {
              const isVueMount =
                // is a component
                elm.tagName.toLowerCase() in
                  (docsifyConfig.vueComponents || {}) ||
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
              const vueConfig = {
                ...vueGlobalOptions,
              };
              // Replace vueGlobalOptions data() return value with shared data object.
              // This provides a global store for all Vue instances that receive
              // vueGlobalOptions as their configuration.
              if (this.#vueGlobalData) {
                vueConfig.data = () => this.#vueGlobalData;
              }

              return [elm, vueConfig];
            }),
        );

        // Not found mounts but import Vue resource
        if (vueMountData.length === 0) {
          return;
        }

        // Mount
        for (const [mountElm, vueConfig] of vueMountData) {
          const isVueAttr = 'data-isvue';
          const isSkipElm =
            // Is an invalid tag
            mountElm.matches('pre, :not([v-template]):has(pre), script') ||
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
    }

    #renderNameLink(vm) {
      const el = dom.getNode('.app-name-link');
      const nameLink = vm.config.nameLink;
      const path = vm.route.path;

      if (!el) {
        return;
      }

      if (isPrimitive(vm.config.nameLink)) {
        el.setAttribute('href', nameLink);
      } else if (typeof nameLink === 'object') {
        const match = Object.keys(nameLink).filter(
          key => path.indexOf(key) > -1,
        )[0];

        el.setAttribute('href', nameLink[match]);
      }
    }

    #renderSkipLink(vm) {
      const { skipLink } = vm.config;

      if (skipLink !== false) {
        const el = dom.getNode('#skip-to-content');

        let skipLinkText =
          typeof skipLink === 'string' ? skipLink : 'Skip to main content';

        if (skipLink?.constructor === Object) {
          const matchingPath = Object.keys(skipLink).find(path =>
            vm.route.path.startsWith(path.startsWith('/') ? path : `/${path}`),
          );
          const matchingText = matchingPath && skipLink[matchingPath];

          skipLinkText = matchingText || skipLinkText;
        }

        if (el) {
          el.innerHTML = skipLinkText;
        } else {
          const html = `<button type="button" id="skip-to-content" class="primary">${skipLinkText}</button>`;
          dom.body.insertAdjacentHTML('afterbegin', html);
        }
      }
    }

    _renderSidebar(text) {
      const { maxLevel, subMaxLevel, loadSidebar, hideSidebar } = this.config;
      const sidebarEl = dom.getNode('aside.sidebar');
      const sidebarNavEl = dom.getNode('.sidebar-nav');
      const sidebarToggleEl = dom.getNode('button.sidebar-toggle');

      if (hideSidebar) {
        sidebarEl?.remove(sidebarEl);
        sidebarToggleEl?.remove(sidebarToggleEl);

        return null;
      }

      dom.setHTML('.sidebar-nav', this.compiler.sidebar(text, maxLevel));

      sidebarToggleEl.setAttribute('aria-expanded', !isMobile());

      const activeElmHref = this.router.toURL(this.route.path);
      const activeEl = dom.find(`.sidebar-nav a[href="${activeElmHref}"]`);

      this.#addTextAsTitleAttribute('.sidebar-nav a');

      if (loadSidebar && activeEl) {
        activeEl.parentNode.innerHTML +=
          this.compiler.subSidebar(subMaxLevel) || '';
      } else {
        this.compiler.resetToc();
      }

      // Bind event
      this._bindEventOnRendered(activeEl);

      // Mark page links and groups
      const pageLinks = dom.findAll(
        sidebarNavEl,
        'a:is(li > a, li > p > a):not(.section-link, [target="_blank"])',
      );
      const pageLinkGroups = dom
        // NOTE: Using filter() method as a replacement for :has() selector. It
        // would be preferable to use only 'li:not(:has(> a, > p > a))' selector
        // but the :has() selector is not supported by our Jest test environment
        // See: https://github.com/jsdom/jsdom/issues/3506#issuecomment-1769782333
        .findAll(sidebarEl, 'li')
        .filter(
          elm =>
            elm.querySelector(':scope > ul') &&
            !elm.querySelectorAll(':scope > a, :scope > p > a').length,
        );

      pageLinks.forEach(elm => {
        elm.classList.add('page-link');
      });

      pageLinkGroups.forEach(elm => {
        elm.classList.add('group');
        elm
          .querySelector(':scope > p:not(:has(> *))')
          ?.classList.add('group-title');
      });
    }

    _bindEventOnRendered(activeEl) {
      const { autoHeader } = this.config;

      this.onRender();

      if (autoHeader && activeEl) {
        const main = dom.getNode('#main');
        const firstNode = main.children[0];
        if (firstNode && firstNode.tagName !== 'H1') {
          const h1 = this.compiler.header(activeEl.innerText, 1);
          const wrapper = dom.create('div', h1);
          dom.before(main, wrapper.children[0]);
        }
      }
    }

    _renderNav(text) {
      if (!text) {
        return;
      }

      const html = this.compiler.compile(text);

      ['.app-nav', '.app-nav-merged'].forEach(selector => {
        dom.setHTML(selector, html);
        this.#addTextAsTitleAttribute(`${selector} a`);
      });
    }

    _renderMain(text, opt = {}, next) {
      const { response } = this.route;

      // Note: It is possible for the response to be undefined in environments
      // where XMLHttpRequest has been modified or mocked
      if (response && !response.ok && (!text || response.status !== 404)) {
        text = `# ${response.status} - ${response.statusText}`;
      }

      this.callHook('beforeEach', text, result => {
        let html;
        const callback = () => {
          if (opt.updatedAt) {
            html = this.#formatUpdated(
              html,
              opt.updatedAt,
              this.config.formatUpdated,
            );
          }

          this.callHook('afterEach', html, hookData => {
            this.#renderMain(hookData);
            next();
          });
        };

        if (this.isHTML) {
          html = this.result = text;
          callback();
        } else {
          prerenderEmbed(
            {
              compiler: this.compiler,
              raw: result,
            },
            tokens => {
              html = this.compiler.compile(tokens);
              callback();
            },
          );
        }
      });
    }

    _renderCover(text, coverOnly) {
      const el = dom.getNode('.cover');
      const rootElm = document.documentElement;
      const coverBg = getComputedStyle(rootElm).getPropertyValue('--cover-bg');

      dom.toggleClass(
        dom.getNode('main'),
        coverOnly ? 'add' : 'remove',
        'hidden',
      );

      if (!text) {
        dom.toggleClass(el, 'remove', 'show');
        return;
      }

      dom.toggleClass(el, 'add', 'show');

      let html = this.coverIsHTML ? text : this.compiler.cover(text);

      if (!coverBg) {
        const mdBgMatch = html
          .trim()
          .match(
            '<p><img.*?data-origin="(.*?)".*?alt="(.*?)"[^>]*?>([^<]*?)</p>$',
          );

        let mdCoverBg;

        if (mdBgMatch) {
          const [bgMatch, bgValue, bgType] = mdBgMatch;

          // Color
          if (bgType === 'color') {
            mdCoverBg = bgValue;
          }
          // Image
          else {
            const path = !isAbsolutePath(bgValue)
              ? getPath(this.router.getBasePath(), bgValue)
              : bgValue;

            mdCoverBg = `center center / cover url(${path})`;
          }

          html = html.replace(bgMatch, '');
        }
        // Gradient background
        else {
          const degrees = Math.round((Math.random() * 120) / 2);

          let hue1 = Math.round(Math.random() * 360);
          let hue2 = Math.round(Math.random() * 360);

          // Ensure hue1 and hue2 are at least 50 degrees apart
          if (Math.abs(hue1 - hue2) < 50) {
            const hueShift = Math.round(Math.random() * 25) + 25;

            hue1 = Math.max(hue1, hue2) + hueShift;
            hue2 = Math.min(hue1, hue2) - hueShift;
          }

          // OKLCH color
          if (window?.CSS?.supports('color', 'oklch(0 0 0 / 1%)')) {
            const l = 90; // Lightness
            const c = 20; // Chroma

            // prettier-ignore
            mdCoverBg = `linear-gradient(
              ${degrees}deg,
              oklch(${l}% ${c}% ${hue1}) 0%,
              oklch(${l}% ${c}% ${hue2}) 100%
            )`.replace(/\s+/g, ' ');
          }
          // HSL color (Legacy)
          else {
            const s = 100; // Saturation
            const l = 85; // Lightness
            const o = 100; // Opacity

            // prettier-ignore
            mdCoverBg = `linear-gradient(
              ${degrees}deg,
              hsl(${hue1} ${s}% ${l}% / ${o}%) 0%,
              hsl(${hue2} ${s}% ${l}% / ${o}%) 100%
            )`.replace(/\s+/g, ' ');
          }
        }

        rootElm.style.setProperty('--cover-bg', mdCoverBg);
      }

      dom.setHTML('.cover-main', html);

      // Button styles
      dom
        .findAll('.cover-main > p:last-of-type > a:not([class])')
        .forEach(elm => {
          const buttonType = elm.matches(':first-child')
            ? 'primary'
            : 'secondary';

          elm.classList.add('button', buttonType);
        });
    }

    _updateRender() {
      // Render name link
      this.#renderNameLink(this);

      // Render skip link
      this.#renderSkipLink(this);
    }

    initRender() {
      const config = this.config;

      // Init markdown compiler
      this.compiler = new Compiler(config, this.router);
      window.__current_docsify_compiler__ = this.compiler;

      const id = config.el || '#app';
      const el = dom.find(id);

      if (el) {
        let html = '';

        if (config.repo) {
          html += tpl.corner(config.repo, config.cornerExternalLinkTarget);
        }

        if (config.coverpage) {
          html += tpl.cover();
        }

        if (config.logo) {
          const isBase64 = /^data:image/.test(config.logo);
          const isExternal = /(?:http[s]?:)?\/\//.test(config.logo);
          const isRelative = /^\./.test(config.logo);

          if (!isBase64 && !isExternal && !isRelative) {
            config.logo = getPath(this.router.getBasePath(), config.logo);
          }
        }

        html += tpl.main(config);

        // Render main app
        dom.setHTML(el, html, true);
      } else {
        this.rendered = true;
      }

      // Add nav
      if (config.loadNavbar) {
        const navEl = dom.find('nav') || dom.create('nav');
        const isMergedSidebar = config.mergeNavbar;

        navEl.classList.add('app-nav');
        navEl.setAttribute('aria-label', 'secondary');
        dom.body.prepend(navEl);

        if (isMergedSidebar) {
          const mergedNavEl = dom.create('div');
          const sidebarEl = dom.find('.sidebar');
          const sidebarNavEl = dom.find('.sidebar-nav');

          mergedNavEl?.classList.add('app-nav-merged');
          sidebarEl?.insertBefore(mergedNavEl, sidebarNavEl);
        }
      }

      if (config.themeColor) {
        dom.$.head.appendChild(
          dom.create('div', tpl.theme(config.themeColor)).firstElementChild,
        );
      }

      this._updateRender();
      dom.toggleClass(dom.body, 'ready');
    }
  };
}
