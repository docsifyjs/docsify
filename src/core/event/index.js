import { isMobile } from '../util/env';
import { body, on } from '../util/dom';
import * as sidebar from './sidebar';
import { scrollIntoView, scroll2Top } from './scroll';

/** @typedef {import('../Docsify').Constructor} Constructor */

/**
 * @template {!Constructor} T
 * @param {T} Base - The class to extend
 */
export function Events(Base) {
  return class Events extends Base {
    $resetEvents(source) {
      const { auto2top } = this.config;

      (() => {
        // Rely on the browser's scroll auto-restoration when going back or forward
        if (source === 'history') {
          return;
        }
        // Scroll to ID if specified
        if (this.route.query.id) {
          scrollIntoView(this.route.path, this.route.query.id);
          // Continuously observe for height changes in .markdown-section
          // caused by loading images
          const resizeObserver = new ResizeObserver(_ => {
            scrollIntoView(this.route.path, this.route.query.id);
          });
          let markdownDiv = document.querySelector('.markdown-section');
          resizeObserver.observe(markdownDiv);
          // Stop observing when user manually scrolls
          const userEvents = ['wheel', 'keydown', 'keyup', 'keypress'];
          for (const event of userEvents) {
            document.addEventListener(
              event,
              () => {
                resizeObserver.unobserve(markdownDiv);
              },
              { once: true }
            );
          }
        }
        // Scroll to top if a link was clicked and auto2top is enabled
        if (source === 'navigate') {
          auto2top && scroll2Top(auto2top);
        }
      })();

      if (this.config.loadNavbar) {
        sidebar.getAndActive(this.router, 'nav');
      }
    }

    initEvent() {
      // Bind toggle button
      sidebar.btn('button.sidebar-toggle', this.router);
      sidebar.collapse('.sidebar', this.router);
      // Bind sticky effect
      if (this.config.coverpage) {
        !isMobile && on('scroll', sidebar.sticky);
      } else {
        body.classList.add('sticky');
      }
    }
  };
}
