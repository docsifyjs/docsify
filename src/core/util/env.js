export const inBrowser = true; // True for now, may change when we add SSR.

export const isMobile = inBrowser && document.body.clientWidth <= 600;
