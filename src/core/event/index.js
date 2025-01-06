import { isMobile, mobileBreakpoint } from '../util/env.js';
import * as dom from '../util/dom.js';

/** @typedef {import('../Docsify.js').Constructor} Constructor */

/**
 * @template {!Constructor} T
 * @param {T} Base - The class to extend
 */
export function Events(Base) {
  return class Events extends Base {
    #intersectionObserver;
    #isScrolling;
    #title = dom.$.title;

    // Initialization
    // =========================================================================
    /**
     * Initialize Docsify events
     * One-time setup of listeners, observers, and tasks.
     * @void
     */
    initEvent() {
      const { topMargin } = this.config;

      // Apply topMargin to scrolled content
      if (topMargin) {
        const value =
          typeof topMargin === 'number' ? `${topMargin}px` : topMargin;

        document.documentElement.style.setProperty(
          '--scroll-padding-top',
          value,
        );
      }

      this.#initCover();
      this.#initSkipToContent();
      this.#initSidebar();
      this.#initSidebarToggle();
      this.#initKeyBindings();
    }

    // Sub-Initializations
    // =========================================================================
    /**
     * Initialize cover observer
     * Toggles sticky behavior when cover is not in view
     * @void
     */
    #initCover() {
      const coverElm = dom.find('section.cover');

      if (!coverElm) {
        dom.toggleClass(dom.body, 'add', 'sticky');
        return;
      }

      const observer = new IntersectionObserver(entries => {
        const isIntersecting = entries[0].isIntersecting;
        const op = isIntersecting ? 'remove' : 'add';

        dom.toggleClass(dom.body, op, 'sticky');
      });

      observer.observe(coverElm);
    }

    /**
     * Initialize heading observer
     * Toggles sidebar active item based on top viewport edge intersection
     * @void
     */
    #initHeadings() {
      const headingElms = dom.findAll('#main :where(h1, h2, h3, h4, h5)');
      const headingsInView = new Set();
      let isInitialLoad = true;

      // Mark sidebar active item on heading intersection
      this.#intersectionObserver?.disconnect();
      this.#intersectionObserver = new IntersectionObserver(
        entries => {
          if (isInitialLoad) {
            isInitialLoad = false;
            return;
          }

          if (this.#isScrolling) {
            return;
          }

          for (const entry of entries) {
            const op = entry.isIntersecting ? 'add' : 'delete';

            headingsInView[op](entry.target);
          }

          let activeHeading;
          if (headingsInView.size === 1) {
            // Get first and only item in set.
            // May be undefined if no headings are in view.
            activeHeading = headingsInView.values().next().value;
          } else if (headingsInView.size > 1) {
            // Find the closest heading to the top of the viewport
            // Reduce over the Set of headings currently in view (headingsInView) to determine the closest heading.
            activeHeading = Array.from(headingsInView).reduce(
              (closest, current) => {
                return !closest ||
                  closest.compareDocumentPosition(current) &
                    Node.DOCUMENT_POSITION_FOLLOWING
                  ? current
                  : closest;
              },
              null,
            );
          }

          if (activeHeading) {
            const id = activeHeading.getAttribute('id');
            const href = this.router.toURL(this.router.getCurrentPath(), {
              id,
            });
            const newSidebarActiveElm = this.#markSidebarActiveElm(href);

            newSidebarActiveElm?.scrollIntoView({
              behavior: 'instant',
              block: 'nearest',
              inline: 'nearest',
            });
          }
        },
        {
          rootMargin: '0% 0% -50% 0%', // Top half of viewport
        },
      );

      headingElms.forEach(elm => {
        this.#intersectionObserver.observe(elm);
      });
    }

    /**
     * Initialize keyboard bindings
     * @void
     */
    #initKeyBindings() {
      const { keyBindings } = this.config;
      const modifierKeys = ['alt', 'ctrl', 'meta', 'shift'];

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
        dom.on('keydown', e => {
          const isTextEntry = document.activeElement.matches(
            'input, select, textarea',
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
                    e.code.toLowerCase() === `key${k}`, // "keya"
                ),
              ),
          );

          matchingConfigs.forEach(({ callback }) => {
            e.preventDefault();
            callback(e);
          });
        });
      }
    }

    /**
     * Initialize sidebar event listeners
     *
     * @void
     */
    #initSidebar() {
      const sidebarElm = document.querySelector('.sidebar');

      if (!sidebarElm) {
        return;
      }

      // Auto-toggle on resolution change
      window
        ?.matchMedia?.(`(max-width: ${mobileBreakpoint})`)
        .addEventListener('change', evt => {
          this.#toggleSidebar(!evt.matches);
        });

      // Collapse toggle
      dom.on(sidebarElm, 'click', ({ target }) => {
        const linkElm = target.closest('a');
        const linkParent = linkElm?.closest('li');
        const subSidebar = linkParent?.querySelector('.app-sub-sidebar');

        if (subSidebar) {
          dom.toggleClass(linkParent, 'collapse');
        }
      });
    }

    /**
     * Initialize sidebar show/hide toggle behavior
     *
     * @void
     */
    #initSidebarToggle() {
      const contentElm = dom.find('main > .content');
      const toggleElm = dom.find('button.sidebar-toggle');

      if (!toggleElm) {
        return;
      }

      let lastContentFocusElm;

      // Store last focused content element (restored via #toggleSidebar)
      dom.on(contentElm, 'focusin', e => {
        const focusAttr = 'data-restore-focus';

        lastContentFocusElm?.removeAttribute(focusAttr);
        lastContentFocusElm = e.target;
        lastContentFocusElm.setAttribute(focusAttr, '');
      });

      // Toggle sidebar
      dom.on(toggleElm, 'click', e => {
        e.stopPropagation();
        this.#toggleSidebar();
      });
    }

    /**
     * Initialize skip to content behavior
     *
     * @void
     */
    #initSkipToContent() {
      const skipElm = document.querySelector('#skip-to-content');

      if (!skipElm) {
        return;
      }

      skipElm.addEventListener('click', evt => {
        const focusElm = this.#focusContent();

        evt.preventDefault();
        focusElm?.scrollIntoView({
          behavior: 'smooth',
        });
      });
    }

    // Callbacks
    // =========================================================================
    /**
     * Handle rendering UI element updates and new content
     * @void
     */
    onRender() {
      const { name } = this.config;
      const currentPath = this.router.toURL(this.router.getCurrentPath());
      const currentSection = dom
        .find(`.sidebar a[href='${currentPath}']`)
        ?.getAttribute('title');

      const currentTitle = name
        ? currentSection
          ? `${currentSection} - ${name}`
          : name
        : currentSection;

      // Update page title
      dom.$.title = currentTitle || this.#title;

      this.#markAppNavActiveElm();
      this.#markSidebarCurrentPage();
      this.#initHeadings();
    }

    /**
     * Handle navigation events
     *
     * @param {undefined|"history"|"navigate"} source Type of navigation where
     * undefined is initial load, "history" is forward/back, and "navigate" is
     * user click/tap
     * @void
     */
    onNavigate(source) {
      const { auto2top, topMargin } = this.config;
      const { path, query } = this.route;

      this.#markSidebarActiveElm();

      // Note: Scroll position set by browser on forward/back (i.e. "history")
      if (source !== 'history') {
        // Anchor link
        if (query.id) {
          const headingElm = dom.find(
            `.markdown-section :where(h1, h2, h3, h4, h5)[id="${query.id}"]`,
          );

          if (headingElm) {
            this.#watchNextScroll();
            headingElm.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
        // User click/tap
        else if (source === 'navigate') {
          // Scroll to top
          if (auto2top) {
            document.scrollingElement.scrollTop = topMargin ?? 0;
          }
        }
      }

      // Clicked anchor link
      if (path === '/' || (query.id && source === 'navigate')) {
        isMobile() && this.#toggleSidebar(false);
      }

      // Clicked anchor link or page load with anchor ID
      if (query.id || source === 'navigate') {
        this.#focusContent();
      }
    }

    // Functions
    // =========================================================================
    /**
     * Set focus on the main content area: current route ID, first heading, or
     * the main content container
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
     * @param {Object} options HTMLElement focus() method options
     * @returns HTMLElement|undefined
     * @void
     */
    #focusContent(options = {}) {
      const settings = {
        preventScroll: true,
        ...options,
      };
      const { query } = this.route;
      const focusEl = query.id
        ? // Heading ID
          dom.find(`#${query.id}`)
        : // First heading
          dom.find('#main :where(h1, h2, h3, h4, h5, h6)') ||
          // Content container
          dom.find('#main');

      // Move focus to content area
      focusEl?.focus(settings);

      return focusEl;
    }

    /**
     * Marks the active app nav item
     *
     * @param {string} [href] Matching element HREF value. If unspecified,
     * defaults to the current path (without query params)
     * @void
     */
    #markAppNavActiveElm() {
      const href = decodeURIComponent(this.router.toURL(this.route.path));

      ['.app-nav', '.app-nav-merged'].forEach(selector => {
        const navElm = dom.find(selector);

        if (!navElm) {
          return;
        }

        const newActive = dom
          .findAll(navElm, 'a')
          .sort((a, b) => b.href.length - a.href.length)
          .find(
            a =>
              href.includes(a.getAttribute('href')) ||
              href.includes(decodeURI(a.getAttribute('href'))),
          )
          ?.closest('li');
        const oldActive = dom.find(navElm, 'li.active');

        if (newActive && newActive !== oldActive) {
          oldActive?.classList.remove('active');
          newActive.classList.add('active');
        }
      });
    }

    /**
     * Marks the active sidebar item
     *
     * @param {string} [href] Matching element HREF value. If unspecified,
     * defaults to the current path (with query params)
     * @returns Element|undefined
     */
    #markSidebarActiveElm(href) {
      href ??= this.router.toURL(this.router.getCurrentPath());

      const sidebar = dom.find('.sidebar');

      if (!sidebar) {
        return;
      }

      const oldActive = dom.find(sidebar, 'li.active');
      const newActive = dom
        .find(
          sidebar,
          `a[href="${href}"], a[href="${decodeURIComponent(href)}"]`,
        )
        ?.closest('li');

      if (newActive && newActive !== oldActive) {
        oldActive?.classList.remove('active');
        newActive.classList.add('active');
      }

      return newActive;
    }

    /**
     * Marks the current page in the sidebar
     *
     * @param {string} [href] Matching sidebar element HREF value. If
     * unspecified, defaults to the current path (without query params)
     * @returns Element|undefined
     */
    #markSidebarCurrentPage(href) {
      href ??= this.router.toURL(this.route.path);

      const sidebar = dom.find('.sidebar');

      if (!sidebar) {
        return;
      }

      const path = href?.split('?')[0];
      const oldPage = dom.find(sidebar, 'li[aria-current]');
      const newPage = dom
        .find(
          sidebar,
          `a[href="${path}"], a[href="${decodeURIComponent(path)}"]`,
        )
        ?.closest('li');

      if (newPage && newPage !== oldPage) {
        oldPage?.removeAttribute('aria-current');
        newPage.setAttribute('aria-current', 'page');
      }

      return newPage;
    }

    #toggleSidebar(force) {
      const sidebarElm = dom.find('.sidebar');

      if (!sidebarElm) {
        return;
      }

      const ariaElms = dom.findAll('[aria-controls="__sidebar"]');
      const inertElms = dom.findAll(
        'body > *:not(main, script), main > .content',
      );
      const isShow = sidebarElm.classList.toggle('show', force);

      // Set aria-expanded attribute
      ariaElms.forEach(toggleElm => {
        toggleElm.setAttribute(
          'aria-expanded',
          force ?? sidebarElm.classList.contains('show'),
        );
      });

      // Add inert attributes (focus trap)
      if (isShow && isMobile()) {
        inertElms.forEach(elm => elm.setAttribute('inert', ''));
      }
      // Remove inert attributes
      else {
        inertElms.forEach(elm => elm.removeAttribute('inert'));
      }

      if (isShow) {
        sidebarElm.focus();
      }
      // Restore focus
      else {
        const restoreElm = document.querySelector(
          'main > .content [data-restore-focus]',
        );

        if (restoreElm) {
          restoreElm.focus({
            preventScroll: true,
          });
        }
      }
    }

    /**
     * Monitor next scroll start/end and set #isScrolling to true/false
     * accordingly. Listeners are removed after the start/end events are fired.
     * @void
     */
    #watchNextScroll() {
      // Scroll start
      document.addEventListener(
        'scroll',
        () => {
          this.#isScrolling = true;

          // Scroll end
          if ('onscrollend' in window) {
            document.addEventListener(
              'scrollend',
              () => (this.#isScrolling = false),
              { once: true },
            );
          }
          // Browsers w/o native scrollend event support (Safari)
          else {
            const callback = () => {
              clearTimeout(scrollTimer);

              scrollTimer = setTimeout(() => {
                document.removeEventListener('scroll', callback);
                this.#isScrolling = false;
              }, 100);
            };

            let scrollTimer;

            document.addEventListener('scroll', callback, false);
          }
        },
        { once: true },
      );
    }
  };
}
