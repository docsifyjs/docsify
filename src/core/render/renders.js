// render.js
export function Render(Base) {
  return class Render extends Base {
    initRender() {
      this.renderContent();
      this.setupHashScroll();
    }

    renderContent() {
      const contentContainer = document.querySelector(this.vm.config.el);
      contentContainer.innerHTML = this.vm.compiler.compile(this.vm.route.file);
    }

    setupHashScroll() {
      window.addEventListener("hashchange", () => {
        this.scrollToHash();
      });
    }

    scrollToHash() {
      const hash = window.location.hash.slice(1); // Remove "#"
      if (!hash) return;

      // Support H1–H6 (any heading)
      const targetEl = document.querySelector(`#${CSS.escape(hash)}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };
}
