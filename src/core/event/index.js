import Tweezer from 'tweezer.js';
import { isMobile } from '../util/env.js';
import { body, on } from '../util/dom.js';
import * as dom from '../util/dom.js';
import { removeParams } from '../router/util.js';
import config from '../config.js';

/** @typedef {import('../Docsify.js').Constructor} Constructor */

/**
 * @template {!Constructor} T
 * @param {T} Base - The class to extend
 */
export function Events(Base) {
  return class Events extends Base {
    $resetEvents(source) {
      const { auto2top, loadNavbar } = this.config;
      const { path, query } = this.route;

      // Note: Scroll position set by browser on forward/back (i.e. "history")
      if (source !== 'history') {
        // Scroll to ID if specified
        if (query.id) {
          this.#scrollIntoView(path, query.id, true);
        }
        // Scroll to top if a link was clicked and auto2top is enabled
        else if (source === 'navigate') {
          auto2top && this.#scroll2Top(auto2top);
        }
      }

      // Move focus to content
      if (query.id || source === 'navigate') {
        this.focusContent();
      }

      if (loadNavbar) {
        this.__getAndActive(this.router, 'nav');
      }
    }

    initEvent() {
      const { coverpage, keyBindings } = this.config;
      const modifierKeys = ['alt', 'ctrl', 'meta', 'shift'];

      // Bind skip link
      this.#skipLink('#skip-to-content');

      // Bind toggle button
      this.#btn('button.sidebar-toggle', this.router);
      this.#collapse('.sidebar', this.router);

      // Bind sticky effect
      if (coverpage) {
        !isMobile && on('scroll', this.__sticky);
      } else {
        body.classList.add('sticky');
      }
      // Bind keyboard shortcuts
      if (keyBindings && keyBindings.constructor === Object) {
        // Prepare key binding configurations
        Object.values(keyBindings || []).forEach(bindingConfig => {
          const { bindings } = bindingConfig;

          if (!bindings) {
            return;
          }

          // Convert bindings to arrays
          // Ex: 'alt+t' => ['alt+t']
          bindingConfig.bindings = Array.isArray(bindings)
            ? bindings
            : [bindings];

          // Convert key sequences to sorted arrays (modifiers first)
          // Ex: ['alt+t', 't+ctrl'] => [['alt', 't'], ['ctrl', 't']]
          bindingConfig.bindings = bindingConfig.bindings.map(keys => {
            const sortedKeys = [[], []]; // Modifier keys, non-modifier keys

            if (typeof keys === 'string') {
              keys = keys.split('+');
            }

            keys.forEach(key => {
              const isModifierKey = modifierKeys.includes(key);
              const targetArray = sortedKeys[isModifierKey ? 0 : 1];
              const newKeyValue = key.trim().toLowerCase();

              targetArray.push(newKeyValue);
            });

            sortedKeys.forEach(arr => arr.sort());

            return sortedKeys.flat();
          });
        });

        // Handle keyboard events
        on('keydown', e => {
          const isTextEntry = document.activeElement.matches(
            'input, select, textarea'
          );

          if (isTextEntry) {
            return;
          }

          const bindingConfigs = Object.values(keyBindings || []);
          const matchingConfigs = bindingConfigs.filter(
            ({ bindings }) =>
              bindings &&
              // bindings: [['alt', 't'], ['ctrl', 't']]
              bindings.some(keys =>
                // keys: ['alt', 't']
                keys.every(
                  // k: 'alt'
                  k =>
                    (modifierKeys.includes(k) && e[k + 'Key']) ||
                    e.key === k || // Ex: " ", "a"
                    e.code.toLowerCase() === k || // "space"
                    e.code.toLowerCase() === `key${k}` // "keya"
                )
              )
          );

          matchingConfigs.forEach(({ callback }) => {
            e.preventDefault();
            callback(e);
          });
        });
      }
    }

    /** @readonly */
    #nav = {};

    #hoverOver = false;
    #scroller = null;
    #enableScrollEvent = true;
    #coverHeight = 0;

    #skipLink(el) {
      el = dom.getNode(el);

      if (el === null || el === undefined) {
        return;
      }

      dom.on(el, 'click', evt => {
        const target = dom.getNode('#main');

        evt.preventDefault();
        target && target.focus();
        this.#scrollTo(target);
      });
    }

    #scrollTo(el, offset = 0) {
      if (this.#scroller) {
        this.#scroller.stop();
      }

      this.#enableScrollEvent = false;
      this.#scroller = new Tweezer({
        start: window.pageYOffset,
        end:
          Math.round(el.getBoundingClientRect().top) +
          window.pageYOffset -
          offset,
        duration: 500,
      })
        .on('tick', v => window.scrollTo(0, v))
        .on('done', () => {
          this.#enableScrollEvent = true;
          this.#scroller = null;
        })
        .begin();
    }

    focusContent() {
      const { query } = this.route;
      const focusEl = query.id
        ? // Heading ID
          dom.find(`#${query.id}`)
        : // First heading
          dom.find('#main :where(h1, h2, h3, h4, h5, h6)') ||
          // Content container
          dom.find('#main');

      // Move focus to content area
      focusEl && focusEl.focus();
    }

    #highlight(path) {
      if (!this.#enableScrollEvent) {
        return;
      }

      const sidebar = dom.getNode('.sidebar');
      const anchors = dom.findAll('.anchor');
      const wrap = dom.find(sidebar, '.sidebar-nav');
      let active = dom.find(sidebar, 'li.active');
      const doc = document.documentElement;
      const top =
        ((doc && doc.scrollTop) || document.body.scrollTop) - this.#coverHeight;
      let last;

      for (const node of anchors) {
        if (node.offsetTop > top) {
          if (!last) {
            last = node;
          }

          break;
        } else {
          last = node;
        }
      }

      if (!last) {
        return;
      }

      const li = this.#nav[this.#getNavKey(path, last.getAttribute('data-id'))];

      if (!li || li === active) {
        return;
      }

      active && active.classList.remove('active');
      li.classList.add('active');
      active = li;

      // Scroll into view
      // https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js#L282-L297
      if (!this.#hoverOver && dom.body.classList.contains('sticky')) {
        const height = sidebar.clientHeight;
        const curOffset = 0;
        const cur = active.offsetTop + active.clientHeight + 40;
        const isInView =
          active.offsetTop >= wrap.scrollTop && cur <= wrap.scrollTop + height;
        const notThan = cur - curOffset < height;

        sidebar.scrollTop = isInView
          ? wrap.scrollTop
          : notThan
          ? curOffset
          : cur - height;
      }
    }

    #getNavKey(path, id) {
      return `${decodeURIComponent(path)}?id=${decodeURIComponent(id)}`;
    }

    __scrollActiveSidebar(router) {
      const cover = dom.find('.cover.show');
      this.#coverHeight = cover ? cover.offsetHeight : 0;

      const sidebar = dom.getNode('.sidebar');
      let lis = [];
      if (sidebar !== null && sidebar !== undefined) {
        lis = dom.findAll(sidebar, 'li');
      }

      for (const li of lis) {
        const a = li.querySelector('a');
        if (!a) {
          continue;
        }

        let href = a.getAttribute('href');

        if (href !== '/') {
          const {
            query: { id },
            path,
          } = router.parse(href);
          if (id) {
            href = this.#getNavKey(path, id);
          }
        }

        if (href) {
          this.#nav[decodeURIComponent(href)] = li;
        }
      }

      if (isMobile) {
        return;
      }

      const path = removeParams(router.getCurrentPath());
      dom.off('scroll', () => this.#highlight(path));
      dom.on('scroll', () => this.#highlight(path));
      dom.on(sidebar, 'mouseover', () => {
        this.#hoverOver = true;
      });
      dom.on(sidebar, 'mouseleave', () => {
        this.#hoverOver = false;
      });
    }

    #scrollIntoView(path, id) {
      if (!id) {
        return;
      }
      const topMargin = config().topMargin;
      // Use [id='1234'] instead of #id to handle special cases such as reserved characters and pure number id
      // https://stackoverflow.com/questions/37270787/uncaught-syntaxerror-failed-to-execute-queryselector-on-document
      const section = dom.find(`[id="${id}"]`);
      section && this.#scrollTo(section, topMargin);

      const sidebar = dom.getNode('.sidebar');
      const oldActive = dom.find(sidebar, 'li.active');
      const oldPage = dom.find(sidebar, `[aria-current]`);
      const newActive = this.#nav[this.#getNavKey(path, id)];
      const newPage = dom.find(sidebar, `[href$="${path}"]`)?.parentNode;
      oldActive?.classList.remove('active');
      oldPage?.removeAttribute('aria-current');
      newActive?.classList.add('active');
      newPage?.setAttribute('aria-current', 'page');
    }

    #scrollEl = dom.$.scrollingElement || dom.$.documentElement;

    #scroll2Top(offset = 0) {
      this.#scrollEl.scrollTop = offset === true ? 0 : Number(offset);
    }

    /** @readonly */
    #title = dom.$.title;

    /**
     * Toggle button
     * @param {Element} el Button to be toggled
     * @void
     */
    #btn(el) {
      const toggle = _ => {
        dom.body.classList.toggle('close');

        const isClosed = isMobile
          ? dom.body.classList.contains('close')
          : !dom.body.classList.contains('close');

        el.setAttribute('aria-expanded', isClosed);
      };

      el = dom.getNode(el);
      if (el === null || el === undefined) {
        return;
      }

      dom.on(el, 'click', e => {
        e.stopPropagation();
        toggle();
      });

      isMobile &&
        dom.on(
          dom.body,
          'click',
          _ => dom.body.classList.contains('close') && toggle()
        );
    }

    #collapse(el) {
      el = dom.getNode(el);
      if (el === null || el === undefined) {
        return;
      }

      dom.on(el, 'click', ({ target }) => {
        if (
          target.nodeName === 'A' &&
          target.nextSibling &&
          target.nextSibling.classList &&
          target.nextSibling.classList.contains('app-sub-sidebar')
        ) {
          dom.toggleClass(target.parentNode, 'collapse');
        }
      });
    }

    __sticky = () => {
      const cover = dom.getNode('section.cover');
      if (!cover) {
        return;
      }

      const coverHeight = cover.getBoundingClientRect().height;

      if (
        window.pageYOffset >= coverHeight ||
        cover.classList.contains('hidden')
      ) {
        dom.toggleClass(dom.body, 'add', 'sticky');
      } else {
        dom.toggleClass(dom.body, 'remove', 'sticky');
      }
    };

    /**
     * Get and active link
     * @param  {Object} router Router
     * @param  {String|Element} el Target element
     * @param  {Boolean} isParent Active parent
     * @param  {Boolean} autoTitle Automatically set title
     * @return {Element} Active element
     */
    __getAndActive(router, el, isParent, autoTitle) {
      el = dom.getNode(el);
      let links = [];
      if (el !== null && el !== undefined) {
        links = dom.findAll(el, 'a');
      }

      const hash = decodeURI(router.toURL(router.getCurrentPath()));
      let target;

      links
        .sort((a, b) => b.href.length - a.href.length)
        .forEach(a => {
          const href = decodeURI(a.getAttribute('href'));
          const node = isParent ? a.parentNode : a;

          a.title = a.title || a.innerText;

          if (hash.indexOf(href) === 0 && !target) {
            target = a;
            dom.toggleClass(node, 'add', 'active');
            node.setAttribute('aria-current', 'page');
          } else {
            dom.toggleClass(node, 'remove', 'active');
            node.removeAttribute('aria-current');
          }
        });

      if (autoTitle) {
        dom.$.title = target
          ? target.title || `${target.innerText} - ${this.#title}`
          : this.#title;
      }

      return target;
    }
  };
}
