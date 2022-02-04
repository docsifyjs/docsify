export const inBrowser = !process.env.SSR;

export const isMobile = inBrowser && document.body.clientWidth <= 600;

/**
 * @see https://github.com/MoOx/pjax/blob/master/lib/is-supported.js
 */
export const supportsPushState =
  inBrowser &&
  (function () {
    // Borrowed wholesale from https://github.com/defunkt/jquery-pjax
    return (
      window.history &&
      window.history.pushState &&
      window.history.replaceState &&
      // PushState isn’t reliable on iOS until 5.
      !navigator.userAgent.match(
        /((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/
      )
    );
  })();
