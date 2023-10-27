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
      const { auto2top } = this.config;

      // If 'history', rely on the browser's scroll auto-restoration when going back or forward
      if (source !== 'history') {
        let focusEl;

        // Scroll to ID if specified
        if (this.route.query.id) {
          focusEl = dom.find(`#${this.route.query.id}`);
          this.#scrollIntoView(this.route.path, this.route.query.id, true);
        }
        // Scroll to top if a link was clicked and auto2top is enabled
        else if (source === 'navigate') {
          focusEl = dom.find('#main');
          auto2top && this.#scroll2Top(auto2top);
        }

        focusEl && focusEl.focus();
      }

      if (this.config.loadNavbar) {
        this.__getAndActive(this.router, 'nav');
      }
    }

    initEvent() {
      // Bind skip link
      this.#skipLink('#skip-to-content');

      // Bind toggle button
      this.#btn('button.sidebar-toggle', this.router);
      this.#collapse('.sidebar', this.router);

      // Bind sticky effect
      if (this.config.coverpage) {
        !isMobile && on('scroll', this.__sticky);
      } else {
        body.classList.add('sticky');
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
      const section = dom.find("[id='" + id + "']");
      section && this.#scrollTo(section, topMargin);

      const li = this.#nav[this.#getNavKey(path, id)];
      const sidebar = dom.getNode('.sidebar');
      const active = dom.find(sidebar, 'li.active');
      active && active.classList.remove('active');
      li && li.classList.add('active');
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
      const toggle = _ => dom.body.classList.toggle('close');

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
          } else {
            dom.toggleClass(node, 'remove', 'active');
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
