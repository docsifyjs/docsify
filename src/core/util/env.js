const computedStyle = getComputedStyle(document.documentElement, null);

export const inBrowser = true; // True for now, may change when we add SSR.

export const mobileBreakpoint = computedStyle.getPropertyValue(
  '--_mobile-breakpoint',
);

export function isMobile() {
  return window.matchMedia(`(max-width: ${mobileBreakpoint})`).matches;
}
