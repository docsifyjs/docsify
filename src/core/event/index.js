import config from '../config.js';
import { removeParams } from '../router/util.js';
import * as dom from '../util/dom.js';
import { body, on } from '../util/dom.js';
import { isMobile } from '../util/env.js';

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
        // Scroll to top if a link was clicked and auto2top is enabled
        if (source === 'navigate') {
          auto2top && this.#scroll2Top(auto2top);
        }
        // Scroll to ID if specified
        if (this.route.query.id) {
          this.#scrollIntoView(this.route.path, this.route.query.id);
        }
      }

      if (this.config.loadNavbar) {
        this.__getAndActive(this.router, 'nav');
      }
    }

    initEvent() {
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
    #enableScrollEvent = true;
    #coverHeight = 0;

    #scrollTo(el) {
      this.#enableScrollEvent = false;
      el.scrollIntoView({ behavior: 'smooth' });

      // Determine when scrolling has stopped
      let prevTop;
      const intervalId = setInterval(() => {
        const top = el.getBoundingClientRect().top;
        if (top === prevTop) {
          clearInterval(intervalId);
          this.#enableScrollEvent = true;
        }
        prevTop = top;
      }, 500);
    }

    #interval;
    async #highlight(path) {
      let delayed = false;
      if (!this.#enableScrollEvent) {
        delayed = true;
        clearInterval(this.#interval);
        await new Promise(resolve => {
          this.#interval = setInterval(() => {
            if (this.#enableScrollEvent) {
              clearInterval(this.#interval);
              resolve();
            }
          }, 100);
        });
      }

      const sidebar = dom.getNode('.sidebar');
      const anchors = dom.findAll('.anchor');
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

      if (!li || (li === active && !delayed)) {
        return;
      }

      active && active.classList.remove('active');
      li.classList.add('active');
      active = li;

      // Scroll into view
      if (!this.#hoverOver && dom.body.classList.contains('sticky')) {
        active.scrollIntoView();
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
