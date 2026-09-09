// router.js
import { getCurrentPath, resolvePath } from "../util/path.js";

export class Router {
  constructor(vm) {
    this.vm = vm;
    this.history = window.history;
    this.listenLinkClicks();
  }

  listenLinkClicks() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a");

      if (!link || link.getAttribute("target") === "_blank") {
        return;
      }

      const href = link.getAttribute("href");
      const current = this.getCurrentURL();

      // Prevent default link behavior
      event.preventDefault();

      // If same URL, do nothing to avoid history clutter
      if (current === href) {
        this.scrollToHash(href);
        return;
      }

      // Otherwise push new state
      this.push(href);
    });
  }

  getCurrentURL() {
    return window.location.pathname + window.location.hash;
  }

  push(href) {
    try {
      this.history.pushState({ path: href }, "", href);
    } catch (err) {
      // Fallback if pushState fails
      this.history.replaceState({ path: href }, "", href);
    }

    this.handleNavigation(href);
  }

  handleNavigation(href) {
    // Handles updating the view
    this.vm.router.load(href);
  }

  scrollToHash(href) {
    // Scroll into view if a hash is provided
    const hash = href.split("#")[1];
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }
}
